/* Application SPA sans framework. Toutes les pages sont générées depuis les fichiers data/*.js. */
(function () {
  "use strict";

  var Data = window.TRACTION_DATA || {};
  var Store = window.TractionStorage;
  var UI = window.TractionUI;

  var state = Store.load();
  var root = document.getElementById("app");
  var appShell = document.getElementById("app-shell");
  var pageTitle = document.getElementById("page-title");
  var pageKicker = document.getElementById("page-kicker");
  var menuToggle = document.getElementById("menu-toggle");
  var revisionTimer = null;
  var examTimer = null;
  var speedTimer = null;
  var scrollSaveTimer = null;

  var routeMeta = {
    accueil: ["Accueil", "Tableau de bord"],
    definitions: ["Définitions", "Recherche, apprentissage et interrogation"],
    abreviations: ["Abréviations", "Abréviations importées depuis Abréviation2"],
    cours: ["Cours", "Lecteur de chapitres"],
    resumes: ["Résumés", "Synthèses par cours"],
    revisions: ["Révisions", "Répétition espacée et active recall"],
    journal: ["Journal de formation", "Carnet quotidien"],
    parametres: ["Paramètres", "Sauvegarde et affichage"]
  };

  var view = {
    definitions: {
      search: "",
      category: "all",
      difficulty: "all",
      state: "all",
      sort: "title",
      favorites: false,
      mode: "learning",
      currentId: null,
      answerVisible: false
    },
    courseId: null,
    summaryId: null,
    revision: emptyRevision(),
    flashcards: {
      index: 0,
      flipped: false
    },
    quiz: emptyQuiz(),
    exam: emptyExam(),
    knowledgeSort: {
      abbreviations: "learn-date-desc",
      vocabulary: "learn-date-desc"
    },
    planningMonth: new Date(),
    game: {
      type: null,
      data: null
    }
  };

  function emptyRevision() {
    return {
      active: false,
      mode: null,
      deck: [],
      index: 0,
      startedAt: null,
      deadline: null,
      answerVisible: false,
      currentAnswer: null,
      feedback: null,
      category: "all"
    };
  }

  function emptyQuiz() {
    return {
      active: false,
      questions: [],
      index: 0,
      answers: [],
      currentAnswer: null,
      feedback: null
    };
  }

  function emptyExam() {
    return {
      active: false,
      finished: false,
      questions: [],
      index: 0,
      answers: {},
      startedAt: null,
      deadline: null,
      score: 0
    };
  }

  function init() {
    applyTheme();
    bindEvents();
    render();
    registerServiceWorker();
  }

  function bindEvents() {
    window.addEventListener("hashchange", render);
    window.addEventListener("scroll", updateReadingProgress, { passive: true });
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);

    menuToggle.addEventListener("click", function () {
      appShell.classList.toggle("menu-open");
    });

    document.addEventListener("click", handleClick);
    document.addEventListener("input", handleInput);
    document.addEventListener("change", handleChange);
    document.addEventListener("submit", handleSubmit);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("drop", handleDrop);
  }

  function registerServiceWorker() {
    if ("serviceWorker" in navigator && location.protocol !== "file:") {
      navigator.serviceWorker.register("sw.js").catch(function () {
        /* La navigation locale reste fonctionnelle même sans service worker. */
      });
    }
  }

  function route() {
    var name = (location.hash || "#accueil").replace("#", "");
    return routeMeta[name] ? name : "accueil";
  }

  function setMeta(name) {
    var meta = routeMeta[name] || routeMeta.accueil;
    pageTitle.textContent = meta[0];
    pageKicker.textContent = meta[1];
    UI.$$("#main-nav a").forEach(function (link) {
      link.classList.toggle("is-active", link.dataset.route === name);
    });
  }

  function render() {
    clearRunningTimers();
    var current = route();
    setMeta(current);
    appShell.classList.remove("menu-open");

    var html = "";
    if (current === "accueil") html = renderHome();
    if (current === "definitions") html = renderDefinitions();
    if (current === "abreviations") html = renderKnowledgeCollection("abbreviations");
    if (current === "cours") html = renderCourses();
    if (current === "resumes") html = renderSummaries();
    if (current === "revisions") html = renderRevisions();
    if (current === "journal") html = renderJournal();
    if (current === "parametres") html = renderSettings();

    root.innerHTML = html;
    root.focus({ preventScroll: true });

    if (current === "revisions" && view.revision.active && view.revision.deadline) startRevisionTimer();
  }

  function clearRunningTimers() {
    clearInterval(revisionTimer);
    clearInterval(examTimer);
    clearInterval(speedTimer);
  }

  function persist(message) {
    Store.save(state);
    if (message) {
      UI.toast(message);
    }
  }

  function applyTheme() {
    var setting = state.settings.theme || "system";
    var resolved = setting === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : setting;
    document.body.dataset.theme = resolved;
    document.documentElement.style.setProperty("--font-scale", state.settings.fontScale || 1);
  }

  function allDefinitions() {
    return []
      .concat(Data.definitions || [])
      .concat(Data.abbreviations || [])
      .concat(Data.vocabulary || []);
  }

  function baseDefinitions() {
    return Data.definitions || [];
  }

  function allAbbreviations() {
    return Data.abbreviations || [];
  }

  function allVocabulary() {
    return Data.vocabulary || [];
  }

  function allChapters() {
    return Data.chapters || [];
  }

  function allCourses() {
    return allChapters().reduce(function (list, chapter) {
      return list.concat(chapter.subchapters || []);
    }, []);
  }

  function allSummaries() {
    return Data.summaries || [];
  }

  function allFlashcards() {
    return Data.flashcards || [];
  }

  function allQuestions() {
    return Data.questions || [];
  }

  function findDefinition(id) {
    return allDefinitions().find(function (item) { return item.id === id; });
  }

  function findCourse(id) {
    return allCourses().find(function (item) { return item.id === id; });
  }

  function findSummaryByCourse(courseId) {
    return allSummaries().find(function (item) { return item.courseId === courseId; });
  }

  function findFlashcard(id) {
    return allFlashcards().find(function (item) { return item.id === id; });
  }

  function currentCourse() {
    var courses = allCourses();
    if (!view.courseId && courses.length) {
      view.courseId = courses[0].id;
    }
    return findCourse(view.courseId) || courses[0] || null;
  }

  function currentSummaryCourse() {
    var courses = allCourses().filter(function (course) {
      return Boolean(findSummaryByCourse(course.id));
    });
    if (!view.summaryId && courses.length) {
      view.summaryId = courses[0].id;
    }
    return findCourse(view.summaryId) || courses[0] || null;
  }

  function safeProgress(collection, id, fallback) {
    if (!collection[id]) {
      collection[id] = fallback();
    }
    return collection[id];
  }

  function dashboardStats() {
    var definitions = allDefinitions();
    var courses = allCourses();
    var chaptersWithCourses = allChapters().filter(function (chapter) {
      return (chapter.subchapters || []).length > 0;
    });

    var masteredDefinitions = definitions.filter(function (definition) {
      return state.definitions[definition.id] && state.definitions[definition.id].state === "acquise";
    }).length;

    var completedCourses = courses.filter(function (course) {
      return state.courses[course.id] && state.courses[course.id].completed;
    }).length;

    var learnedChapters = chaptersWithCourses.filter(function (chapter) {
      return (chapter.subchapters || []).every(function (course) {
        return state.courses[course.id] && state.courses[course.id].completed;
      });
    }).length;

    var success = UI.percent(state.stats.correct, state.stats.answered);
    var globalProgress = Math.round(
      UI.percent(masteredDefinitions, definitions.length) * 0.4 +
      UI.percent(completedCourses, courses.length) * 0.4 +
      success * 0.2
    );

    var dueDefinitions = definitions.filter(isDefinitionDue).length;
    var dueFlashcards = allFlashcards().filter(function (card) {
      return Store.isDue(state.flashcards[card.id].srs);
    }).length;

    var lastSession = state.sessions.slice().sort(function (a, b) {
      return new Date(b.endedAt || b.startedAt) - new Date(a.endedAt || a.startedAt);
    })[0];

    return {
      masteredDefinitions: masteredDefinitions,
      totalDefinitions: definitions.length,
      completedCourses: completedCourses,
      totalCourses: courses.length,
      learnedChapters: learnedChapters,
      totalChapters: chaptersWithCourses.length,
      success: success,
      globalProgress: globalProgress,
      dueCount: dueDefinitions + dueFlashcards,
      lastSession: lastSession
    };
  }

  function renderHome() {
    var stats = dashboardStats();
    var quote = UI.sample(Data.quotes || []) || "Une séance régulière vaut mieux qu'une longue séance repoussée.";
    var lastSessionLabel = stats.lastSession ? UI.formatDate(stats.lastSession.endedAt || stats.lastSession.startedAt) : "Aucune séance";

    return [
      '<section class="page">',
      '  <div class="panel">',
      '    <div class="panel-header">',
      '      <div>',
      '        <h2>Progression générale</h2>',
      '        <p>Vue rapide de ton apprentissage local.</p>',
      '      </div>',
      '      <button class="primary-button" data-action="continue-training" type="button">' + UI.icon("play") + 'Continuer ma formation</button>',
      '    </div>',
      '    <div class="progress-track" aria-label="Progression générale"><span class="progress-fill" style="--value:' + stats.globalProgress + '%"></span></div>',
      '    <p class="muted">' + stats.globalProgress + '% de progression estimée à partir des cours, définitions et réponses.</p>',
      '  </div>',
      '  <div class="grid four">',
      metricHtml("Chapitres appris", stats.learnedChapters + " / " + Math.max(stats.totalChapters, 0), "Cours terminés dans les chapitres"),
      metricHtml("Définitions maîtrisées", stats.masteredDefinitions + " / " + stats.totalDefinitions, "État marqué comme acquis"),
      metricHtml("Temps de révision", UI.formatDuration(state.stats.studySeconds), "Cumul journal et sessions"),
      metricHtml("Dernière séance", lastSessionLabel, stats.dueCount + " éléments à revoir"),
      '  </div>',
      '  <div class="grid two">',
      '    <section class="panel">',
      '      <div class="panel-header"><div><h2>Objectif du jour</h2><p>Modifiable à tout moment.</p></div></div>',
      '      <form id="daily-goal-form" class="grid">',
      '        <textarea name="dailyGoal">' + UI.escapeHtml(state.dailyGoal || "") + '</textarea>',
      '        <button class="secondary-button" type="submit">' + UI.icon("check") + 'Enregistrer l’objectif</button>',
      '      </form>',
      '    </section>',
      '    <section class="panel">',
      '      <div class="panel-header"><div><h2>Citation motivation</h2><p>Pour garder le rythme.</p></div></div>',
      '      <p class="question-card"><strong>' + UI.escapeHtml(quote) + '</strong></p>',
      '    </section>',
      '  </div>',
      '  <section class="panel">',
      '    <div class="panel-header"><div><h2>À faire maintenant</h2><p>La révision active reste prioritaire.</p></div></div>',
      '    <div class="button-row">',
      '      <a class="secondary-button" href="#revisions">' + UI.icon("play") + 'Lancer une révision</a>',
      '      <a class="secondary-button" href="#definitions">' + UI.icon("search") + 'Chercher une définition</a>',
      '      <a class="secondary-button" href="#journal">' + UI.icon("book") + 'Noter ma séance</a>',
      '    </div>',
      '  </section>',
      '</section>'
    ].join("");
  }

  function metricHtml(label, value, detail) {
    return '<article class="metric"><span>' + UI.escapeHtml(label) + '</span><strong>' + UI.escapeHtml(value) + '</strong><small>' + UI.escapeHtml(detail) + '</small></article>';
  }

  function renderDefinitions() {
    return [
      '<section class="page">',
      '  <section class="panel">',
      '    <div class="panel-header">',
      '      <div><h2>Bibliothèque de définitions</h2><p>Recherche, tri, favoris et états de maîtrise.</p></div>',
      '      <button class="ghost-button" data-action="toggle-definition-favorites" type="button">' + UI.icon("star") + (view.definitions.favorites ? "Tous les éléments" : "Favoris") + '</button>',
      '    </div>',
      definitionFiltersHtml(),
      '  </section>',
      '  <section class="panel">',
      '    <div class="panel-header"><div><h2>Modes d’apprentissage</h2><p>Alterner entre lecture, interrogation et récitation.</p></div></div>',
      definitionModeTabsHtml(),
      '    <div id="definition-mode-panel" class="mode-stage">' + definitionModeHtml() + '</div>',
      '  </section>',
      '  <section class="panel">',
      '    <div class="panel-header"><div><h2>Résultats</h2><p id="definition-count"></p></div></div>',
      '    <div id="definitions-list" class="definition-list">' + definitionListHtml() + '</div>',
      '  </section>',
      '</section>'
    ].join("");
  }

  function renderKnowledgeCollection(kind) {
    var isAbbreviations = kind === "abbreviations";
    var items = sortDefinitions((isAbbreviations ? allAbbreviations() : allVocabulary()).slice(), view.knowledgeSort[kind]);
    var title = isAbbreviations ? "Abréviations" : "Vocabulaire";
    var source = isAbbreviations ? "Abreviation2.html" : "preview.html";
    var mastered = items.filter(function (item) {
      return state.definitions[item.id] && state.definitions[item.id].state === "acquise";
    }).length;
    var favorites = items.filter(function (item) {
      return state.definitions[item.id] && state.definitions[item.id].favorite;
    }).length;
    var due = items.filter(isDefinitionDue).length;

    return [
      '<section class="page">',
      '  <section class="panel">',
      '    <div class="panel-header">',
      '      <div><h2>' + title + '</h2><p>Données intégrées depuis ' + source + ' et disponibles dans les révisions.</p></div>',
      '      <a class="secondary-button" href="#revisions">' + UI.icon("play") + 'Réviser</a>',
      '    </div>',
      '    <div class="grid four">',
      metricHtml("Total", String(items.length), "Cartes importées"),
      metricHtml("Acquises", mastered + " / " + items.length, "État maîtrisé"),
      metricHtml("À revoir", String(due), "Répétition espacée"),
      metricHtml("Favoris", String(favorites), "Marqués à suivre"),
      '    </div>',
      '  </section>',
      '  <section class="panel">',
      '    <div class="panel-header"><div><h2>Liste</h2><p>Ces cartes utilisent les mêmes favoris et états que les définitions.</p></div>' + knowledgeSortButtonsHtml(kind) + '</div>',
      '    <div class="definition-list">',
      items.length ? items.map(definitionCardHtml).join("") : '<div class="empty-state">Aucune donnée trouvée.</div>',
      '    </div>',
      '  </section>',
      '</section>'
    ].join("");
  }

  function knowledgeSortButtonsHtml(kind) {
    var currentSort = view.knowledgeSort[kind] || "learn-date-desc";
    return [
      '<div class="button-row">',
      '  <button class="secondary-button' + (currentSort === "learn-date-desc" ? " is-active" : "") + '" data-action="knowledge-sort" data-kind="' + kind + '" data-sort="learn-date-desc" type="button">Date apprentissage ↓</button>',
      '  <button class="secondary-button' + (currentSort === "learn-date-asc" ? " is-active" : "") + '" data-action="knowledge-sort" data-kind="' + kind + '" data-sort="learn-date-asc" type="button">Date apprentissage ↑</button>',
      '</div>'
    ].join("");
  }

  function definitionFiltersHtml() {
    var categories = UI.unique(allDefinitions().map(function (item) { return item.category; }));
    return [
      '<div class="filters">',
      '  <label class="search-field"><span class="sr-only">Recherche</span>' + UI.icon("search") + '<input id="def-search" type="text" value="' + UI.escapeHtml(view.definitions.search) + '" placeholder="Rechercher une définition"></label>',
      selectHtml("def-category", "Catégorie", [["all", "Toutes"]].concat(categories.map(function (item) { return [item, item]; })), view.definitions.category),
      selectHtml("def-difficulty", "Difficulté", [["all", "Toutes"], ["facile", "Facile"], ["moyen", "Moyen"], ["difficile", "Difficile"]], view.definitions.difficulty),
      selectHtml("def-state", "État", [["all", "Tous"], ["a-apprendre", "À apprendre"], ["en-cours", "En cours"], ["acquise", "Acquise"]], view.definitions.state),
      selectHtml("def-sort", "Tri", [["title", "Titre"], ["learn-date-desc", "Date apprentissage récente"], ["learn-date-asc", "Date apprentissage ancienne"], ["category", "Catégorie"], ["difficulty", "Difficulté"], ["state", "État"], ["due", "À revoir"]], view.definitions.sort),
      '</div>'
    ].join("");
  }

  function selectHtml(id, label, options, value) {
    return [
      '<label class="field">',
      '  <span>' + UI.escapeHtml(label) + '</span>',
      '  <select id="' + UI.escapeHtml(id) + '">',
      options.map(function (option) {
        return '<option value="' + UI.escapeHtml(option[0]) + '"' + (String(option[0]) === String(value) ? " selected" : "") + '>' + UI.escapeHtml(option[1]) + '</option>';
      }).join(""),
      '  </select>',
      '</label>'
    ].join("");
  }

  function definitionModeTabsHtml() {
    var modes = [
      ["learning", "Apprentissage"],
      ["question", "Interrogation"],
      ["cloze", "Texte à trous"],
      ["recitation", "Récitation"],
      ["random", "Aléatoire"]
    ];
    return '<div class="segmented">' + modes.map(function (mode) {
      return '<button class="tab-button' + (view.definitions.mode === mode[0] ? " is-active" : "") + '" data-action="definition-mode" data-mode="' + mode[0] + '" type="button">' + UI.escapeHtml(mode[1]) + '</button>';
    }).join("") + '</div>';
  }

  function filteredDefinitions() {
    var query = UI.normalize(view.definitions.search);
    var difficultyOrder = { facile: 1, moyen: 2, difficile: 3 };
    var items = allDefinitions().filter(function (definition) {
      var progress = state.definitions[definition.id] || {};
      var haystack = UI.normalize([definition.title, definition.text, definition.category, (definition.tags || []).join(" ")].join(" "));
      if (query && haystack.indexOf(query) === -1) return false;
      if (view.definitions.category !== "all" && definition.category !== view.definitions.category) return false;
      if (view.definitions.difficulty !== "all" && definition.difficulty !== view.definitions.difficulty) return false;
      if (view.definitions.state !== "all" && progress.state !== view.definitions.state) return false;
      if (view.definitions.favorites && !progress.favorite) return false;
      return true;
    });

    sortDefinitions(items, view.definitions.sort);

    return items;
  }

  function sortDefinitions(items, sortMode) {
    var difficultyOrder = { facile: 1, moyen: 2, difficile: 3 };
    items.sort(function (a, b) {
      if (sortMode === "learn-date-desc" || sortMode === "learn-date-asc") {
        var aDate = state.definitions[a.id] && state.definitions[a.id].learnDate;
        var bDate = state.definitions[b.id] && state.definitions[b.id].learnDate;
        if (!aDate && !bDate) return String(a.title).localeCompare(String(b.title), "fr");
        if (!aDate) return 1;
        if (!bDate) return -1;
        return sortMode === "learn-date-desc" ? String(bDate).localeCompare(String(aDate)) : String(aDate).localeCompare(String(bDate));
      }
      if (sortMode === "category") return String(a.category).localeCompare(String(b.category), "fr");
      if (sortMode === "difficulty") return (difficultyOrder[a.difficulty] || 9) - (difficultyOrder[b.difficulty] || 9);
      if (sortMode === "state") return String(state.definitions[a.id].state).localeCompare(String(state.definitions[b.id].state), "fr");
      if (sortMode === "due") return String(definitionSchedule(state.definitions[a.id]).nextDate || "9999-12-31").localeCompare(String(definitionSchedule(state.definitions[b.id]).nextDate || "9999-12-31"));
      return String(a.title).localeCompare(String(b.title), "fr");
    });
    return items;
  }

  function definitionListHtml() {
    var items = filteredDefinitions();
    var visible = items.slice(0, 120);
    setTimeout(function () {
      var count = document.getElementById("definition-count");
      if (count) {
        count.textContent = visible.length + " affichées sur " + items.length + " résultat(s). Le rendu est limité par lots pour rester rapide.";
      }
    }, 0);

    if (!items.length) {
      return '<div class="empty-state">Aucune définition ne correspond aux filtres.</div>';
    }

    return visible.map(definitionCardHtml).join("") + (items.length > visible.length ? '<p class="muted">Affinage conseillé: ' + (items.length - visible.length) + ' définition(s) non affichée(s) dans ce lot.</p>' : "");
  }

  function definitionCardHtml(definition) {
    var progress = state.definitions[definition.id];
    var schedule = definitionSchedule(progress);
    return [
      '<article class="card definition-card">',
      '  <div class="card-header">',
      '    <div>',
      '      <h3>' + UI.escapeHtml(definition.title) + '</h3>',
      '      <div class="reader-meta"><span class="tag">' + UI.escapeHtml(definition.category || "Sans catégorie") + '</span><span class="status-pill">' + UI.difficultyLabel(definition.difficulty) + '</span><span class="status-pill ' + progress.state + '">' + UI.statusLabel(progress.state) + '</span><span class="status-pill ' + (schedule.due ? "a-apprendre" : "acquise") + '">' + UI.escapeHtml(schedule.label) + '</span></div>',
      '    </div>',
      '    <button class="icon-button favorite-button' + (progress.favorite ? " is-active" : "") + '" data-action="definition-favorite" data-id="' + definition.id + '" type="button" aria-label="Favori">' + UI.icon("star") + '</button>',
      '  </div>',
      '  <p>' + UI.escapeHtml(definition.text) + '</p>',
      '  <div class="card-actions">',
      '    <label class="field"><span>Date d’apprentissage</span><input data-action="definition-learn-date" data-id="' + definition.id + '" type="date" value="' + UI.escapeHtml(progress.learnDate || "") + '"></label>',
      '    <label class="field"><span>Dernière révision</span><input data-action="definition-last-review-date" data-id="' + definition.id + '" type="date" value="' + UI.escapeHtml(progress.lastReviewDate || "") + '"></label>',
      '    <label class="field"><span>État</span><select data-action="definition-state" data-id="' + definition.id + '">' + definitionStateOptions(progress.state) + '</select></label>',
      '    <button class="secondary-button" data-action="definition-practice" data-id="' + definition.id + '" type="button">Réviser</button>',
      '  </div>',
      '</article>'
    ].join("");
  }

  function definitionStateOptions(value) {
    return [["a-apprendre", "À apprendre"], ["en-cours", "En cours"], ["acquise", "Acquise"]].map(function (option) {
      return '<option value="' + option[0] + '"' + (value === option[0] ? " selected" : "") + '>' + option[1] + '</option>';
    }).join("");
  }

  function addDaysIso(dateValue, days) {
    if (!dateValue) return "";
    var date = new Date(dateValue + "T00:00:00");
    if (Number.isNaN(date.getTime())) return "";
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  }

  function daysUntil(dateValue) {
    if (!dateValue) return null;
    var target = new Date(dateValue + "T00:00:00");
    var today = new Date(Store.todayIsoDate() + "T00:00:00");
    return Math.ceil((target - today) / 86400000);
  }

  function definitionSchedule(progress) {
    var milestones = [7, 14, 21, 30];
    var stage = UI.clamp(Number(progress.reviewStage || 0), 0, milestones.length);
    if (progress.mustReview) {
      return { due: true, nextDate: Store.todayIsoDate(), label: "À réciter" };
    }
    if (!progress.learnDate) {
      return { due: false, nextDate: "", label: "À dater" };
    }
    if (stage >= milestones.length) {
      return { due: false, nextDate: "", label: "Cycle 30 j terminé" };
    }
    var nextDate = addDaysIso(progress.learnDate, milestones[stage]);
    var delta = daysUntil(nextDate);
    if (delta == null) {
      return { due: false, nextDate: "", label: "À dater" };
    }
    if (delta <= 0) {
      return { due: true, nextDate: nextDate, label: "Récitation J+" + milestones[stage] };
    }
    return { due: false, nextDate: nextDate, label: "J+" + milestones[stage] + " dans " + delta + " j" };
  }

  function isDefinitionDue(definition) {
    var progress = state.definitions[definition.id];
    if (!progress) return false;
    return definitionSchedule(progress).due;
  }

  function definitionModeHtml() {
    var items = filteredDefinitions();
    if (!items.length) {
      return '<div class="empty-state">Ajoute ou affiche au moins une définition pour utiliser ce mode.</div>';
    }

    var current = findDefinition(view.definitions.currentId) || UI.sample(items) || items[0];
    if (!view.definitions.currentId) {
      view.definitions.currentId = current.id;
    }

    if (view.definitions.mode === "learning") {
      return '<div class="question-card"><strong>Mode apprentissage</strong><p>Lis les définitions filtrées, marque leur état, puis bascule en interrogation ou récitation.</p></div>';
    }

    if (view.definitions.mode === "question") {
      return [
        '<div class="question-card">',
        '  <span class="tag">' + UI.escapeHtml(current.category) + '</span>',
        '  <h3>Explique: ' + UI.escapeHtml(current.title) + '</h3>',
        view.definitions.answerVisible ? '<div class="answer-box">' + UI.escapeHtml(current.text) + '</div>' : '<p class="muted">Réponds sans regarder, puis affiche la correction.</p>',
        '  <div class="button-row">',
        '    <button class="primary-button" data-action="definition-reveal" type="button">Afficher la réponse</button>',
        '    <button class="secondary-button" data-action="definition-next" type="button">Nouvelle question</button>',
        '  </div>',
        '</div>'
      ].join("");
    }

    if (view.definitions.mode === "cloze") {
      return [
        '<div class="question-card">',
        '  <span class="tag">' + UI.escapeHtml(current.title) + '</span>',
        '  <p>' + clozeText(current.text) + '</p>',
        view.definitions.answerVisible ? '<div class="answer-box">' + UI.escapeHtml(current.text) + '</div>' : "",
        '  <div class="button-row">',
        '    <button class="primary-button" data-action="definition-reveal" type="button">Voir le texte complet</button>',
        '    <button class="secondary-button" data-action="definition-next" type="button">Autre texte</button>',
        '  </div>',
        '</div>'
      ].join("");
    }

    if (view.definitions.mode === "recitation") {
      return [
        '<div class="question-card">',
        '  <h3>Récite: ' + UI.escapeHtml(current.title) + '</h3>',
        '  <textarea placeholder="Écris ta récitation ici avant d’afficher la correction."></textarea>',
        view.definitions.answerVisible ? '<div class="answer-box">' + UI.escapeHtml(current.text) + '</div>' : "",
        '  <div class="button-row">',
        '    <button class="primary-button" data-action="definition-reveal" type="button">Comparer</button>',
        view.definitions.answerVisible ? gradeButtonsHtml("definition-recitation-grade") : "",
        '    <button class="secondary-button" data-action="definition-next" type="button">Autre définition</button>',
        '  </div>',
        '</div>'
      ].join("");
    }

    return [
      '<div class="question-card">',
      '  <h3>' + UI.escapeHtml(current.title) + '</h3>',
      '  <p>' + UI.escapeHtml(current.text) + '</p>',
      '  <div class="button-row"><button class="secondary-button" data-action="definition-next" type="button">Définition aléatoire</button></div>',
      '</div>'
    ].join("");
  }

  function clozeText(text) {
    var count = 0;
    return UI.escapeHtml(text).split(/\s+/).map(function (word) {
      var clean = word.replace(/[^\p{L}]/gu, "");
      if (clean.length >= 5) {
        count += 1;
        if (count % 3 === 0) {
          return '<strong>____</strong>';
        }
      }
      return word;
    }).join(" ");
  }

  function refreshDefinitions() {
    var list = document.getElementById("definitions-list");
    var panel = document.getElementById("definition-mode-panel");
    if (list) list.innerHTML = definitionListHtml();
    if (panel) panel.innerHTML = definitionModeHtml();
  }

  function renderCourses() {
    var course = currentCourse();
    return [
      '<section class="page">',
      '  <div class="grid sidebar-layout">',
      '    <aside class="panel course-tree">',
      '      <div class="panel-header"><div><h2>Chapitres</h2><p>Ajout automatique depuis data/courses.js.</p></div></div>',
      courseTreeHtml(),
      '    </aside>',
      '    <section>',
      course ? courseReaderHtml(course) : '<div class="empty-state">Ajoute un sous-chapitre dans data/courses.js pour afficher un cours.</div>',
      '    </section>',
      '  </div>',
      '</section>'
    ].join("");
  }

  function courseTreeHtml() {
    return allChapters().map(function (chapter) {
      var subchapters = chapter.subchapters || [];
      return [
        '<div class="chapter-group">',
        '  <div class="chapter-title"><span>' + UI.escapeHtml(chapter.title) + '</span><span>' + subchapters.length + '</span></div>',
        subchapters.length ? subchapters.map(function (course) {
          var progress = state.courses[course.id] || { readPercent: 0 };
          return '<button class="secondary-button course-link' + (view.courseId === course.id ? " is-active" : "") + '" data-action="select-course" data-id="' + course.id + '" type="button">' + UI.escapeHtml(course.title) + ' <span class="muted">' + Math.round(progress.readPercent || 0) + '%</span></button>';
        }).join("") : '<p class="muted">Aucun sous-chapitre.</p>',
        '</div>'
      ].join("");
    }).join("");
  }

  function courseReaderHtml(course) {
    var progress = state.courses[course.id];
    var courses = allCourses();
    var index = courses.findIndex(function (item) { return item.id === course.id; });
    var previous = courses[index - 1];
    var next = courses[index + 1];

    progress.lastReadAt = new Date().toISOString();
    persist();

    return [
      '<article class="reader" data-reader data-course-id="' + course.id + '">',
      '  <div class="reader-title">',
      '    <div class="reader-meta"><span class="tag">' + UI.escapeHtml(course.chapterId || "Chapitre") + '</span><span class="status-pill">' + UI.estimatedMinutes(course.content) + ' min estimées</span><span class="status-pill">' + Math.round(progress.readPercent || 0) + '% lus</span></div>',
      '    <h2>' + UI.escapeHtml(course.title) + '</h2>',
      '    <p class="muted">' + UI.escapeHtml(course.description || "") + '</p>',
      '    <div class="progress-track"><span id="reading-progress" class="progress-fill blue" style="--value:' + Math.round(progress.readPercent || 0) + '%"></span></div>',
      '  </div>',
      '  <div class="reader-content">',
      (course.content || []).map(renderCourseBlock).join(""),
      '  </div>',
      '  <div class="button-row">',
      previous ? '<button class="secondary-button" data-action="select-course" data-id="' + previous.id + '" type="button">Précédent</button>' : "",
      '    <button class="primary-button" data-action="complete-course" data-id="' + course.id + '" type="button">' + UI.icon("check") + 'Marquer comme lu</button>',
      next ? '<button class="secondary-button" data-action="select-course" data-id="' + next.id + '" type="button">Suivant</button>' : "",
      '  </div>',
      '</article>'
    ].join("");
  }

  function renderCourseBlock(block) {
    if (block.type === "heading") {
      var level = Math.min(3, Math.max(2, block.level || 2));
      return '<h' + level + '>' + UI.escapeHtml(block.text) + '</h' + level + '>';
    }
    if (block.type === "paragraph") {
      return '<p>' + UI.escapeHtml(block.text) + '</p>';
    }
    if (block.type === "list") {
      return '<ul>' + (block.items || []).map(function (item) { return '<li>' + UI.escapeHtml(item) + '</li>'; }).join("") + '</ul>';
    }
    if (block.type === "callout") {
      return '<div class="callout ' + UI.escapeHtml(block.kind || "") + '"><strong>' + UI.escapeHtml(block.title || "Note") + '</strong><p>' + UI.escapeHtml(block.text) + '</p></div>';
    }
    if (block.type === "note") {
      return '<div class="callout note"><strong>Note</strong><p>' + UI.escapeHtml(block.text) + '</p></div>';
    }
    if (block.type === "table") {
      return tableHtml(block.headers || [], block.rows || []);
    }
    if (block.type === "diagram") {
      return '<div><h3>' + UI.escapeHtml(block.title || "Schéma") + '</h3><div class="diagram">' + (block.steps || []).map(function (step, index) {
        return '<span class="diagram-step">' + UI.escapeHtml(step) + '</span>' + (index < block.steps.length - 1 ? '<span class="diagram-arrow">→</span>' : "");
      }).join("") + '</div></div>';
    }
    if (block.type === "image") {
      return '<figure><img src="' + UI.escapeHtml(block.src) + '" alt="' + UI.escapeHtml(block.alt || "") + '"><figcaption class="muted">' + UI.escapeHtml(block.caption || "") + '</figcaption></figure>';
    }
    return "";
  }

  function tableHtml(headers, rows) {
    return [
      '<table class="data-table">',
      '  <thead><tr>' + headers.map(function (header) { return '<th>' + UI.escapeHtml(header) + '</th>'; }).join("") + '</tr></thead>',
      '  <tbody>' + rows.map(function (row) {
        return '<tr>' + row.map(function (cell) { return '<td>' + UI.escapeHtml(cell) + '</td>'; }).join("") + '</tr>';
      }).join("") + '</tbody>',
      '</table>'
    ].join("");
  }

  function updateReadingProgress() {
    if (route() !== "cours") return;
    var reader = document.querySelector("[data-reader]");
    if (!reader) return;
    var courseId = reader.dataset.courseId;
    var rect = reader.getBoundingClientRect();
    var total = rect.height + window.innerHeight;
    var progress = UI.clamp(((window.innerHeight - rect.top) / total) * 100, 0, 100);
    var progressNode = document.getElementById("reading-progress");
    if (progressNode) {
      progressNode.style.setProperty("--value", Math.round(progress) + "%");
    }
    if (state.courses[courseId] && progress > (state.courses[courseId].readPercent || 0)) {
      state.courses[courseId].readPercent = Math.round(progress);
      clearTimeout(scrollSaveTimer);
      scrollSaveTimer = setTimeout(function () { persist(); }, 900);
    }
  }

  function renderSummaries() {
    var course = currentSummaryCourse();
    var summary = course ? findSummaryByCourse(course.id) : null;
    return [
      '<section class="page">',
      '  <div class="grid sidebar-layout">',
      '    <aside class="panel course-tree">',
      '      <div class="panel-header"><div><h2>Cours résumés</h2><p>Chaque résumé est lié à un courseId.</p></div></div>',
      allCourses().map(function (item) {
        var hasSummary = Boolean(findSummaryByCourse(item.id));
        return '<button class="secondary-button course-link' + (view.summaryId === item.id ? " is-active" : "") + '" data-action="select-summary" data-id="' + item.id + '" type="button"' + (hasSummary ? "" : " disabled") + '>' + UI.escapeHtml(item.title) + '</button>';
      }).join("") || '<p class="muted">Aucun cours disponible.</p>',
      '    </aside>',
      '    <section>',
      summary ? summaryHtml(summary) : '<div class="empty-state">Ajoute un résumé dans data/summaries.js pour l’afficher ici.</div>',
      '    </section>',
      '  </div>',
      '</section>'
    ].join("");
  }

  function summaryHtml(summary) {
    return [
      '<article class="reader">',
      '  <div class="reader-title"><span class="tag">Résumé</span><h2>' + UI.escapeHtml(summary.title) + '</h2></div>',
      '  <section><h3>Points clés</h3><ul class="summary-list">' + (summary.keyPoints || []).map(li).join("") + '</ul></section>',
      '  <section><h3>Liste</h3><ul class="summary-list">' + (summary.list || []).map(li).join("") + '</ul></section>',
      '  <section><h3>Arbre logique</h3>' + treeHtml(summary.tree || []) + '</section>',
      '  <section><h3>Tableau</h3>' + tableHtml((summary.table && summary.table.headers) || [], (summary.table && summary.table.rows) || []) + '</section>',
      '  <section class="callout tip"><strong>Mémo</strong><p>' + UI.escapeHtml(summary.memo || "") + '</p></section>',
      '  <section class="callout note"><strong>Erreurs fréquentes</strong><ul>' + (summary.frequentErrors || []).map(li).join("") + '</ul></section>',
      '  <section class="callout important"><strong>À retenir absolument</strong><ul>' + (summary.mustRemember || []).map(li).join("") + '</ul></section>',
      '</article>'
    ].join("");
  }

  function li(value) {
    return '<li>' + UI.escapeHtml(value) + '</li>';
  }

  function treeHtml(nodes) {
    if (!nodes.length) return '<p class="muted">Arbre à compléter.</p>';
    return '<ul class="summary-tree">' + nodes.map(function (node) {
      return '<li>' + UI.escapeHtml(node.label) + (node.children ? treeHtml(node.children) : "") + '</li>';
    }).join("") + '</ul>';
  }

  function renderJournal() {
    var today = Store.todayIsoDate();
    var entries = state.journal.slice().sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    return [
      '<section class="page">',
      '  <div class="grid two">',
      '    <section class="panel">',
      '      <div class="panel-header"><div><h2>Carnet quotidien</h2><p>Garde une trace précise de chaque journée.</p></div></div>',
      '      <form id="journal-form" class="grid">',
      '        <div class="field-row"><label class="field"><span>Date</span><input name="date" type="date" value="' + today + '" required></label><label class="field"><span>Temps travaillé (minutes)</span><input name="minutes" type="number" min="0" value="30"></label></div>',
      '        <label class="field"><span>Cours vus</span><textarea name="coursesSeen" placeholder="Cours, chapitres, supports..."></textarea></label>',
      '        <label class="field"><span>Définitions vues</span><textarea name="definitionsSeen" placeholder="Définitions travaillées..."></textarea></label>',
      '        <label class="field"><span>Difficultés</span><textarea name="difficulties"></textarea></label>',
      '        <label class="field"><span>Ce que je dois revoir</span><textarea name="toReview"></textarea></label>',
      '        <label class="field"><span>Notes personnelles</span><textarea name="notes"></textarea></label>',
      '        <label class="field"><span>Objectifs demain</span><textarea name="tomorrowGoals"></textarea></label>',
      '        <button class="primary-button" type="submit">' + UI.icon("check") + 'Enregistrer la journée</button>',
      '      </form>',
      '    </section>',
      '    <section class="panel">',
      '      <div class="panel-header"><div><h2>Historique complet</h2><p>' + entries.length + ' entrée(s).</p></div></div>',
      '      <div class="history-list">',
      entries.length ? entries.map(journalEntryHtml).join("") : '<div class="empty-state">Aucune entrée pour le moment.</div>',
      '      </div>',
      '    </section>',
      '  </div>',
      '</section>'
    ].join("");
  }

  function journalEntryHtml(entry) {
    function line(label, value) {
      if (!value) return "";
      return '<p><strong>' + label + ':</strong> ' + UI.escapeHtml(value).replace(/\n/g, "<br>") + '</p>';
    }

    return [
      '<article class="card">',
      '  <div class="card-header"><div><h3>' + UI.formatDate(entry.date) + '</h3><p>' + UI.formatDuration(entry.minutes * 60) + ' travaillées</p></div><button class="icon-button" data-action="delete-journal" data-id="' + entry.id + '" type="button" aria-label="Supprimer">' + UI.icon("x") + '</button></div>',
      line("Cours", entry.coursesSeen || "Non renseigné"),
      line("Définitions", entry.definitionsSeen || "Non renseigné"),
      line("Difficultés", entry.difficulties),
      line("À revoir", entry.toReview || "Non renseigné"),
      line("Notes", entry.notes),
      line("Objectifs demain", entry.tomorrowGoals),
      '</article>'
    ].join("");
  }

  function renderPlanning() {
    var month = new Date(view.planningMonth.getFullYear(), view.planningMonth.getMonth(), 1);
    var monthLabel = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(month);
    return [
      '<section class="page">',
      '  <div class="grid sidebar-layout">',
      '    <section class="panel">',
      '      <div class="panel-header"><div><h2>Planifier</h2><p>Révisions, cours, examens, contrôles et objectifs.</p></div></div>',
      '      <form id="planning-form" class="grid">',
      '        <label class="field"><span>Date</span><input name="date" type="date" value="' + Store.todayIsoDate() + '" required></label>',
      selectHtml("planning-type", "Type", [["revision", "Révision"], ["cours", "Cours"], ["examen", "Examen"], ["controle", "Contrôle"], ["objectif", "Objectif"]], "revision").replace('id="planning-type"', 'id="planning-type" name="type"'),
      '        <label class="field"><span>Titre</span><input name="title" type="text" required placeholder="Ex: revoir chapitre A1"></label>',
      '        <label class="field"><span>Notes</span><textarea name="notes"></textarea></label>',
      '        <button class="primary-button" type="submit">' + UI.icon("check") + 'Ajouter au calendrier</button>',
      '      </form>',
      '    </section>',
      '    <section class="panel">',
      '      <div class="panel-header"><div><h2>' + UI.escapeHtml(monthLabel) + '</h2><p>Les jours terminés sont marqués en vert.</p></div><div class="button-row"><button class="icon-button" data-action="planning-prev" type="button" aria-label="Mois précédent">‹</button><button class="icon-button" data-action="planning-next" type="button" aria-label="Mois suivant">›</button></div></div>',
      calendarHtml(month),
      '    </section>',
      '  </div>',
      '</section>'
    ].join("");
  }

  function calendarHtml(month) {
    var labels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    var first = new Date(month.getFullYear(), month.getMonth(), 1);
    var startOffset = (first.getDay() + 6) % 7;
    var start = new Date(first);
    start.setDate(1 - startOffset);
    var today = Store.todayIsoDate();
    var days = [];
    for (var index = 0; index < 42; index += 1) {
      var day = new Date(start);
      day.setDate(start.getDate() + index);
      days.push(day);
    }
    return [
      '<div class="calendar-header">' + labels.map(function (label) { return '<span>' + label + '</span>'; }).join("") + '</div>',
      '<div class="calendar-grid">',
      days.map(function (day) {
        var iso = day.toISOString().slice(0, 10);
        var events = state.planning.filter(function (event) { return event.date === iso; });
        var classes = ["calendar-day"];
        if (day.getMonth() !== month.getMonth()) classes.push("is-muted");
        if (iso === today) classes.push("is-today");
        if (state.completedDays[iso]) classes.push("is-complete");
        return [
          '<div class="' + classes.join(" ") + '">',
          '  <div class="day-number"><span>' + day.getDate() + '</span><button class="chip" data-action="toggle-day-complete" data-date="' + iso + '" type="button">' + (state.completedDays[iso] ? "Fait" : "OK") + '</button></div>',
          events.map(function (event) {
            return '<span class="event-chip" title="' + UI.escapeHtml(event.title) + '">' + UI.escapeHtml(event.type) + ': ' + UI.escapeHtml(event.title) + '</span>';
          }).join(""),
          '</div>'
        ].join("");
      }).join(""),
      '</div>'
    ].join("");
  }

  function renderRevisions() {
    if (view.revision.active) {
      return renderRevisionSession();
    }

    var categories = UI.unique(allDefinitions().map(function (item) { return item.category; }));
    var methods = [
      ["spaced", "Répétition espacée", "Récitation obligatoire à J+7, J+14, J+21 et J+30."],
      ["active", "Active Recall", "Répondre sans relire avant correction."],
      ["flashcard", "Flashcards", "Question puis réponse retournée."],
      ["cloze", "Texte à trous", "Compléter les éléments masqués."],
      ["association", "Association", "Relier notions et réponses."],
      ["order", "Remise dans l’ordre", "Reconstruire une séquence."],
      ["truefalse", "Vrai/Faux", "Décision rapide avec correction."],
      ["mcq", "Choix multiples", "QCM aléatoires."],
      ["written", "Réponse écrite", "Rédaction courte puis comparaison."],
      ["timed", "Révision chronométrée", "Session limitée à dix minutes."],
      ["random", "Révision aléatoire", "Mélange de cartes et questions."],
      ["targeted", "Révision ciblée", "Filtrer par catégorie."],
      ["errors", "Révision des erreurs", "Revoir les cartes ratées."]
    ];

    return [
      '<section class="page">',
      '  <div class="revision-layout">',
      '    <aside class="panel">',
      '      <div class="panel-header"><div><h2>Méthodes</h2><p>Choisis le format de la séance.</p></div></div>',
      '      <div class="method-list">',
      methods.map(function (method) {
        return '<button class="secondary-button method-button" data-action="start-revision" data-mode="' + method[0] + '" type="button"><span><strong>' + UI.escapeHtml(method[1]) + '</strong><br><small class="muted">' + UI.escapeHtml(method[2]) + '</small></span></button>';
      }).join(""),
      '      </div>',
      '    </aside>',
      '    <section class="panel">',
      '      <div class="panel-header"><div><h2>Révision ciblée</h2><p>Prépare une séance par catégorie si nécessaire.</p></div></div>',
      selectHtml("revision-category", "Catégorie", [["all", "Toutes"]].concat(categories.map(function (item) { return [item, item]; })), view.revision.category),
      '      <div class="question-card">',
      '        <strong>Règle de travail</strong>',
      '        <p>Chaque définition datée revient à J+7, J+14, J+21 et J+30. Si tu ne peux pas la réciter, elle repasse à revoir. Seul “Je connais” la marque acquise.</p>',
      '      </div>',
      '    </section>',
      '  </div>',
      '</section>'
    ].join("");
  }

  function buildRevisionDeck(mode) {
    var definitions = allDefinitions();
    var flashcards = allFlashcards();
    if (mode === "targeted" && view.revision.category !== "all") {
      definitions = definitions.filter(function (item) { return item.category === view.revision.category; });
      flashcards = flashcards.filter(function (item) { return item.category === view.revision.category; });
    }

    if (mode === "spaced") {
      var dueDefinitions = definitions.filter(isDefinitionDue).map(definitionToWritten);
      var dueFlashcards = flashcards.filter(function (item) { return Store.isDue(state.flashcards[item.id].srs); }).map(flashcardToItem);
      return UI.shuffle(dueDefinitions).concat(UI.shuffle(dueFlashcards)).slice(0, 30);
    }

    if (mode === "errors") {
      var failedDefinitions = definitions.filter(function (item) {
        var srs = state.definitions[item.id].srs;
        return srs.wrong > 0 || srs.lapses > 0;
      }).map(definitionToFlashcard);
      var failedFlashcards = flashcards.filter(function (item) {
        var srs = state.flashcards[item.id].srs;
        return srs.wrong > 0 || srs.lapses > 0;
      }).map(flashcardToItem);
      return UI.shuffle(failedDefinitions.concat(failedFlashcards)).slice(0, 30);
    }

    if (mode === "active" || mode === "written") {
      return UI.shuffle(definitions.map(function (item) { return definitionToWritten(item); })).slice(0, 25);
    }

    if (mode === "flashcard") {
      return UI.shuffle(flashcards.map(flashcardToItem).concat(definitions.map(definitionToFlashcard))).slice(0, 25);
    }

    if (mode === "cloze") {
      return UI.shuffle(definitions.map(definitionToCloze)).slice(0, 25);
    }

    if (mode === "association") {
      return [associationItem(definitions)];
    }

    if (mode === "order") {
      return UI.shuffle(allQuestions().filter(function (question) { return question.type === "order"; }).map(questionToItem));
    }

    if (mode === "truefalse" || mode === "mcq") {
      return UI.shuffle(allQuestions().filter(function (question) { return question.type === mode; }).map(questionToItem));
    }

    if (mode === "timed" || mode === "random" || mode === "targeted") {
      return UI.shuffle(
        definitions.map(definitionToFlashcard)
          .concat(flashcards.map(flashcardToItem))
          .concat(allQuestions().map(questionToItem))
      ).slice(0, 35);
    }

    return UI.shuffle(definitions.map(definitionToFlashcard)).slice(0, 25);
  }

  function definitionToFlashcard(definition) {
    return {
      uid: "definition-" + definition.id,
      kind: "definition",
      refId: definition.id,
      type: "flashcard",
      question: "Explique: " + definition.title,
      answer: definition.text,
      category: definition.category,
      difficulty: definition.difficulty
    };
  }

  function definitionToWritten(definition) {
    var item = definitionToFlashcard(definition);
    item.type = "written";
    return item;
  }

  function definitionToCloze(definition) {
    var item = definitionToFlashcard(definition);
    item.type = "cloze";
    item.prompt = clozeText(definition.text);
    return item;
  }

  function flashcardToItem(card) {
    return {
      uid: "flashcard-" + card.id,
      kind: "flashcard",
      refId: card.id,
      type: "flashcard",
      question: card.front,
      answer: card.back,
      category: card.category,
      difficulty: card.difficulty
    };
  }

  function questionToItem(question) {
    return Object.assign({ uid: "question-" + question.id, kind: "question", refId: question.id }, question);
  }

  function associationItem(definitions) {
    var pairs = definitions.slice(0, 6).map(function (definition) {
      return { left: definition.title, right: definition.text };
    });
    return {
      uid: "association-generated",
      kind: "generated",
      type: "association",
      question: "Associe chaque titre à sa définition.",
      pairs: pairs
    };
  }

  function renderRevisionSession() {
    var session = view.revision;
    var item = session.deck[session.index];
    if (!item) {
      finishRevision("Séance terminée.");
      return renderRevisions();
    }

    var progress = UI.percent(session.index, session.deck.length);
    return [
      '<section class="page">',
      '  <section class="panel session-progress">',
      '    <div class="panel-header"><div><h2>' + revisionModeLabel(session.mode) + '</h2><p>' + (session.index + 1) + ' / ' + session.deck.length + '</p></div><div class="button-row"><span id="revision-timer" class="status-pill"></span><button class="ghost-button" data-action="revision-finish" type="button">Terminer</button></div></div>',
      '    <div class="progress-track"><span class="progress-fill" style="--value:' + progress + '%"></span></div>',
      '  </section>',
      '  <section class="panel">',
      revisionQuestionHtml(item, "revision"),
      '  </section>',
      '</section>'
    ].join("");
  }

  function revisionModeLabel(mode) {
    var labels = {
      spaced: "Répétition espacée",
      active: "Active Recall",
      flashcard: "Flashcards",
      cloze: "Texte à trous",
      association: "Association",
      order: "Remise dans l’ordre",
      truefalse: "Vrai/Faux",
      mcq: "Choix multiples",
      written: "Réponse écrite",
      timed: "Révision chronométrée",
      random: "Révision aléatoire",
      targeted: "Révision ciblée",
      errors: "Révision des erreurs"
    };
    return labels[mode] || "Révision";
  }

  function revisionQuestionHtml(item, context) {
    if (item.type === "flashcard") {
      return [
        '<div class="question-card">',
        '  <span class="tag">' + UI.escapeHtml(item.category || "Révision") + '</span>',
        '  <h3>' + UI.escapeHtml(item.question) + '</h3>',
        view.revision.answerVisible ? '<div class="answer-box">' + UI.escapeHtml(item.answer) + '</div>' : '<p class="muted">Réponds mentalement avant de retourner la carte.</p>',
        '  <div class="button-row">',
        view.revision.answerVisible ? gradeButtonsHtml("revision-grade") : '<button class="primary-button" data-action="revision-reveal" type="button">Afficher la réponse</button>',
        '  </div>',
        '</div>'
      ].join("");
    }

    if (item.type === "written" || item.type === "cloze") {
      return [
        '<div class="question-card">',
        '  <h3>' + UI.escapeHtml(item.question || "Complète le texte") + '</h3>',
        item.type === "cloze" ? '<p>' + (item.prompt || UI.escapeHtml(item.text || "")) + '</p>' : "",
        '  <textarea id="' + context + '-written-answer" placeholder="Ta réponse"></textarea>',
        view.revision.answerVisible ? '<div class="answer-box"><strong>Correction</strong><p>' + UI.escapeHtml(item.answer) + '</p></div>' : "",
        '  <div class="button-row">',
        '    <button class="primary-button" data-action="revision-check" type="button">Comparer</button>',
        view.revision.answerVisible ? gradeButtonsHtml("revision-grade") : "",
        '  </div>',
        '</div>'
      ].join("");
    }

    if (item.type === "mcq" || item.type === "truefalse") {
      var options = item.type === "truefalse" ? [["true", "Vrai"], ["false", "Faux"]] : (item.options || []).map(function (option) { return [option, option]; });
      return [
        '<div class="question-card">',
        '  <h3>' + UI.escapeHtml(item.question) + '</h3>',
        '  <div class="choice-grid">',
        options.map(function (option) {
          var value = option[0];
          var selected = String(view.revision.currentAnswer) === String(value);
          var className = "secondary-button choice-button";
          if (view.revision.feedback && selected) className += view.revision.feedback.correct ? " is-correct" : " is-wrong";
          return '<button class="' + className + '" data-action="revision-answer" data-value="' + UI.escapeHtml(value) + '" type="button">' + UI.escapeHtml(option[1]) + '</button>';
        }).join(""),
        '  </div>',
        feedbackHtml(view.revision.feedback, item.explanation),
        view.revision.feedback ? '<div class="button-row"><button class="primary-button" data-action="revision-next" type="button">Question suivante</button></div>' : "",
        '</div>'
      ].join("");
    }

    if (item.type === "association") {
      var rights = UI.shuffle((item.pairs || []).map(function (pair) { return pair.right; }));
      return [
        '<div class="question-card">',
        '  <h3>' + UI.escapeHtml(item.question) + '</h3>',
        '  <div class="association-grid">',
        (item.pairs || []).map(function (pair, index) {
          return '<div class="association-row"><strong>' + UI.escapeHtml(pair.left) + '</strong><select data-association-index="' + index + '"><option value="">Choisir</option>' + rights.map(function (right) { return '<option value="' + UI.escapeHtml(right) + '">' + UI.escapeHtml(right) + '</option>'; }).join("") + '</select></div>';
        }).join(""),
        '  </div>',
        feedbackHtml(view.revision.feedback, item.explanation),
        '  <div class="button-row"><button class="primary-button" data-action="revision-check-association" type="button">Vérifier</button><button class="secondary-button" data-action="revision-next" type="button">Suivant</button></div>',
        '</div>'
      ].join("");
    }

    if (item.type === "order") {
      if (!view.revision.currentAnswer) {
        view.revision.currentAnswer = UI.shuffle(item.items || []);
      }
      return [
        '<div class="question-card">',
        '  <h3>' + UI.escapeHtml(item.question) + '</h3>',
        sortableHtml(view.revision.currentAnswer, "revision-order-move"),
        feedbackHtml(view.revision.feedback, item.explanation),
        '  <div class="button-row"><button class="primary-button" data-action="revision-check-order" type="button">Vérifier</button><button class="secondary-button" data-action="revision-next" type="button">Suivant</button></div>',
        '</div>'
      ].join("");
    }

    return '<div class="empty-state">Type de question non reconnu.</div>';
  }

  function gradeButtonsHtml(action) {
    return [
      '<button class="primary-button" data-action="' + action + '" data-grade="known" type="button">Je connais</button>',
      '<button class="secondary-button" data-action="' + action + '" data-grade="almost" type="button">Je connais presque</button>',
      '<button class="danger-button" data-action="' + action + '" data-grade="again" type="button">Je ne connais pas</button>'
    ].join("");
  }

  function feedbackHtml(feedback, explanation) {
    if (!feedback) return "";
    return '<div class="answer-box"><strong>' + (feedback.correct ? "Correct" : "À revoir") + '</strong><p>' + UI.escapeHtml(explanation || feedback.message || "") + '</p></div>';
  }

  function sortableHtml(items, action) {
    return '<div class="sortable-list">' + items.map(function (item, index) {
      return [
        '<div class="sortable-item">',
        '  <span>' + UI.escapeHtml(item) + '</span>',
        '  <span class="button-row"><button class="icon-button" data-action="' + action + '" data-index="' + index + '" data-dir="-1" type="button" aria-label="Monter">↑</button><button class="icon-button" data-action="' + action + '" data-index="' + index + '" data-dir="1" type="button" aria-label="Descendre">↓</button></span>',
        '</div>'
      ].join("");
    }).join("") + '</div>';
  }

  function startRevisionTimer() {
    function tick() {
      var node = document.getElementById("revision-timer");
      if (!node || !view.revision.deadline) return;
      var remaining = Math.max(0, Math.round((view.revision.deadline - Date.now()) / 1000));
      node.textContent = UI.formatDuration(remaining);
      if (remaining <= 0) {
        finishRevision("Temps terminé.");
        render();
      }
    }
    tick();
    revisionTimer = setInterval(tick, 1000);
  }

  function applySrs(item, grade) {
    var correct = grade === "known" || grade === "almost";
    if (item.kind === "definition" && state.definitions[item.refId]) {
      applyDefinitionReview(state.definitions[item.refId], grade);
      correct = grade === "known";
    }
    if (item.kind === "flashcard" && state.flashcards[item.refId]) {
      Store.gradeSrs(state.flashcards[item.refId], grade);
    }
    state.stats.revisions += 1;
    Store.recordAnswer(state, correct);
  }

  function applyDefinitionReview(progress, grade) {
    if (!progress.learnDate) {
      progress.learnDate = Store.todayIsoDate();
    }
    progress.lastReviewDate = Store.todayIsoDate();
    if (grade === "known") {
      progress.state = "acquise";
      progress.mustReview = false;
      progress.reviewStage = UI.clamp(Number(progress.reviewStage || 0) + 1, 0, 4);
    } else if (grade === "almost") {
      progress.state = "en-cours";
      progress.mustReview = true;
    } else {
      progress.state = "a-apprendre";
      progress.mustReview = true;
    }
    Store.gradeSrs(progress, grade);
    var schedule = definitionSchedule(progress);
    progress.srs.nextReview = schedule.nextDate || Store.todayIsoDate();
  }

  function nextRevisionItem() {
    view.revision.index += 1;
    view.revision.answerVisible = false;
    view.revision.currentAnswer = null;
    view.revision.feedback = null;
    if (view.revision.index >= view.revision.deck.length) {
      finishRevision("Séance terminée.");
    }
    persist();
    render();
  }

  function finishRevision(message) {
    if (!view.revision.active) return;
    var seconds = Math.round((Date.now() - view.revision.startedAt) / 1000);
    Store.recordStudyTime(state, seconds);
    state.sessions.push({
      id: UI.uid("session"),
      type: "revision",
      mode: view.revision.mode,
      startedAt: new Date(view.revision.startedAt).toISOString(),
      endedAt: new Date().toISOString(),
      cards: Math.min(view.revision.index + 1, view.revision.deck.length),
      durationSeconds: seconds
    });
    view.revision = emptyRevision();
    persist(message);
  }

  function renderFlashcards() {
    var deck = flashcardDeck();
    if (!deck.length) {
      return '<section class="page"><div class="empty-state">Ajoute des flashcards dans data/quiz.js ou des définitions dans data/definitions.js.</div></section>';
    }
    view.flashcards.index = UI.clamp(view.flashcards.index, 0, deck.length - 1);
    var card = deck[view.flashcards.index];
    return [
      '<section class="page">',
      '  <section class="panel">',
      '    <div class="panel-header"><div><h2>Flashcards</h2><p>' + (view.flashcards.index + 1) + ' / ' + deck.length + '</p></div><div class="button-row"><button class="secondary-button" data-action="flashcard-prev" type="button">Précédente</button><button class="secondary-button" data-action="flashcard-next" type="button">Suivante</button></div></div>',
      '    <div class="flashcard-shell">',
      '      <button class="flashcard' + (view.flashcards.flipped ? " is-flipped" : "") + '" data-action="flashcard-flip" type="button">',
      '        <span class="flashcard-face front"><strong>' + UI.escapeHtml(card.question) + '</strong></span>',
      '        <span class="flashcard-face back"><strong>' + UI.escapeHtml(card.answer) + '</strong></span>',
      '      </button>',
      '    </div>',
      '    <div class="button-row">' + gradeButtonsHtml("flashcard-grade") + '</div>',
      '  </section>',
      '</section>'
    ].join("");
  }

  function flashcardDeck() {
    var cards = allFlashcards().map(flashcardToItem).concat(allDefinitions().map(definitionToFlashcard));
    cards.sort(function (a, b) {
      var aDate = a.kind === "flashcard" ? state.flashcards[a.refId].srs.nextReview : definitionSchedule(state.definitions[a.refId]).nextDate;
      var bDate = b.kind === "flashcard" ? state.flashcards[b.refId].srs.nextReview : definitionSchedule(state.definitions[b.refId]).nextDate;
      return String(aDate || "9999-12-31").localeCompare(String(bDate || "9999-12-31"));
    });
    return cards;
  }

  function renderQuiz() {
    if (view.exam.active || view.exam.finished) {
      return renderExam();
    }
    if (view.quiz.active) {
      return renderQuizPractice();
    }
    var questions = allQuestions();
    return [
      '<section class="page">',
      '  <div class="grid two">',
      '    <section class="panel">',
      '      <div class="panel-header"><div><h2>Quiz</h2><p>Entraînement libre avec correction immédiate.</p></div></div>',
      '      <div class="grid three">',
      metricHtml("Questions", String(questions.length), "Banque locale"),
      metricHtml("Réponses justes", String(state.stats.correct), "Depuis le début"),
      metricHtml("Taux de réussite", UI.percent(state.stats.correct, state.stats.answered) + "%", "Tous exercices"),
      '      </div>',
      '      <div class="button-row"><button class="primary-button" data-action="quiz-start" type="button">' + UI.icon("play") + 'Lancer le quiz</button></div>',
      '    </section>',
      '    <section class="panel">',
      '      <div class="panel-header"><div><h2>Mode examen</h2><p>Questions aléatoires, temps limité, score et historique.</p></div></div>',
      '      <label class="field"><span>Durée en minutes</span><input id="exam-duration" type="number" min="1" max="180" value="20"></label>',
      '      <div class="button-row"><button class="primary-button" data-action="exam-start" type="button">' + UI.icon("play") + 'Démarrer l’examen</button></div>',
      examHistoryHtml(),
      '    </section>',
      '  </div>',
      '</section>'
    ].join("");
  }

  function renderQuizPractice() {
    var question = view.quiz.questions[view.quiz.index];
    if (!question) {
      view.quiz = emptyQuiz();
      return renderQuiz();
    }
    return [
      '<section class="page">',
      '  <section class="panel">',
      '    <div class="panel-header"><div><h2>Quiz</h2><p>' + (view.quiz.index + 1) + ' / ' + view.quiz.questions.length + '</p></div><button class="ghost-button" data-action="quiz-stop" type="button">Quitter</button></div>',
      quizQuestionHtml(question),
      '  </section>',
      '</section>'
    ].join("");
  }

  function quizQuestionHtml(question) {
    if (question.type === "mcq" || question.type === "truefalse") {
      var options = question.type === "truefalse" ? [["true", "Vrai"], ["false", "Faux"]] : question.options.map(function (option) { return [option, option]; });
      return [
        '<div class="question-card">',
        '  <h3>' + UI.escapeHtml(question.question) + '</h3>',
        '  <div class="choice-grid">',
        options.map(function (option) {
          var selected = String(view.quiz.currentAnswer) === String(option[0]);
          var className = "secondary-button choice-button";
          if (view.quiz.feedback && selected) className += view.quiz.feedback.correct ? " is-correct" : " is-wrong";
          return '<button class="' + className + '" data-action="quiz-answer" data-value="' + UI.escapeHtml(option[0]) + '" type="button">' + UI.escapeHtml(option[1]) + '</button>';
        }).join(""),
        '  </div>',
        feedbackHtml(view.quiz.feedback, question.explanation),
        view.quiz.feedback ? '<button class="primary-button" data-action="quiz-next" type="button">Question suivante</button>' : "",
        '</div>'
      ].join("");
    }
    if (question.type === "written" || question.type === "cloze") {
      return [
        '<div class="question-card">',
        '  <h3>' + UI.escapeHtml(question.question || question.text) + '</h3>',
        question.type === "cloze" ? '<p>' + UI.escapeHtml(question.text) + '</p>' : "",
        '  <textarea id="quiz-written-answer" placeholder="Ta réponse"></textarea>',
        feedbackHtml(view.quiz.feedback, question.explanation || ("Réponse attendue: " + question.answer)),
        '  <div class="button-row"><button class="primary-button" data-action="quiz-check-written" type="button">Vérifier</button>' + (view.quiz.feedback ? '<button class="secondary-button" data-action="quiz-next" type="button">Question suivante</button>' : "") + '</div>',
        '</div>'
      ].join("");
    }
    if (question.type === "association") {
      var rights = UI.shuffle(question.pairs.map(function (pair) { return pair.right; }));
      return [
        '<div class="question-card">',
        '  <h3>' + UI.escapeHtml(question.question) + '</h3>',
        question.pairs.map(function (pair, index) {
          return '<div class="association-row"><strong>' + UI.escapeHtml(pair.left) + '</strong><select data-association-index="' + index + '"><option value="">Choisir</option>' + rights.map(function (right) { return '<option value="' + UI.escapeHtml(right) + '">' + UI.escapeHtml(right) + '</option>'; }).join("") + '</select></div>';
        }).join(""),
        feedbackHtml(view.quiz.feedback, question.explanation),
        '  <div class="button-row"><button class="primary-button" data-action="quiz-check-association" type="button">Vérifier</button>' + (view.quiz.feedback ? '<button class="secondary-button" data-action="quiz-next" type="button">Question suivante</button>' : "") + '</div>',
        '</div>'
      ].join("");
    }
    if (question.type === "order") {
      if (!view.quiz.currentAnswer) {
        view.quiz.currentAnswer = UI.shuffle(question.items);
      }
      return [
        '<div class="question-card">',
        '  <h3>' + UI.escapeHtml(question.question) + '</h3>',
        sortableHtml(view.quiz.currentAnswer, "quiz-order-move"),
        feedbackHtml(view.quiz.feedback, question.explanation),
        '  <div class="button-row"><button class="primary-button" data-action="quiz-check-order" type="button">Vérifier</button>' + (view.quiz.feedback ? '<button class="secondary-button" data-action="quiz-next" type="button">Question suivante</button>' : "") + '</div>',
        '</div>'
      ].join("");
    }
    return '<div class="empty-state">Question non reconnue.</div>';
  }

  function renderExam() {
    if (view.exam.finished) {
      return [
        '<section class="page">',
        '  <section class="panel">',
        '    <div class="panel-header"><div><h2>Résultat examen</h2><p>Score, correction et historique.</p></div></div>',
        '    <div class="grid three">',
        metricHtml("Score", view.exam.score + " / " + view.exam.questions.length, "Barème un point par question"),
        metricHtml("Taux", UI.percent(view.exam.score, view.exam.questions.length) + "%", "Résultat"),
        metricHtml("Temps", UI.formatDuration(Math.round((Date.now() - view.exam.startedAt) / 1000)), "Durée utilisée"),
        '    </div>',
        '    <div class="button-row"><button class="primary-button" data-action="exam-reset" type="button">Nouvel examen</button></div>',
        correctionHtml(view.exam.questions, view.exam.answers),
        '  </section>',
        '</section>'
      ].join("");
    }

    var question = view.exam.questions[view.exam.index];
    return [
      '<section class="page">',
      '  <section class="panel">',
      '    <div class="panel-header"><div><h2>Mode examen</h2><p>' + (view.exam.index + 1) + ' / ' + view.exam.questions.length + '</p></div><span id="exam-timer" class="status-pill"></span></div>',
      examQuestionHtml(question),
      '  </section>',
      '</section>'
    ].join("");
  }

  function examQuestionHtml(question) {
    var saved = view.exam.answers[question.id];
    if (question.type === "mcq" || question.type === "truefalse") {
      var options = question.type === "truefalse" ? [["true", "Vrai"], ["false", "Faux"]] : question.options.map(function (option) { return [option, option]; });
      return [
        '<div class="question-card">',
        '  <h3>' + UI.escapeHtml(question.question) + '</h3>',
        '  <div class="choice-grid">',
        options.map(function (option) {
          return '<button class="secondary-button choice-button' + (String(saved) === String(option[0]) ? " is-correct" : "") + '" data-action="exam-answer" data-value="' + UI.escapeHtml(option[0]) + '" type="button">' + UI.escapeHtml(option[1]) + '</button>';
        }).join(""),
        '  </div>',
        examNavHtml(),
        '</div>'
      ].join("");
    }
    return [
      '<div class="question-card">',
      '  <h3>' + UI.escapeHtml(question.question || question.text) + '</h3>',
      question.type === "cloze" ? '<p>' + UI.escapeHtml(question.text) + '</p>' : "",
      '  <textarea id="exam-written-answer" placeholder="Ta réponse">' + UI.escapeHtml(saved || "") + '</textarea>',
      examNavHtml(),
      '</div>'
    ].join("");
  }

  function examNavHtml() {
    return [
      '<div class="button-row">',
      '  <button class="secondary-button" data-action="exam-prev" type="button">Précédente</button>',
      '  <button class="secondary-button" data-action="exam-next" type="button">Suivante</button>',
      '  <button class="primary-button" data-action="exam-finish" type="button">Terminer l’examen</button>',
      '</div>'
    ].join("");
  }

  function examHistoryHtml() {
    if (!state.examHistory.length) {
      return '<p class="muted">Aucun examen enregistré.</p>';
    }
    return '<div class="history-list">' + state.examHistory.slice(-5).reverse().map(function (exam) {
      return '<article class="card"><strong>' + UI.formatDate(exam.date) + '</strong><p>Score: ' + exam.score + ' / ' + exam.total + ' - ' + UI.percent(exam.score, exam.total) + '%</p></article>';
    }).join("") + '</div>';
  }

  function correctionHtml(questions, answers) {
    return '<div class="history-list">' + questions.map(function (question) {
      var answer = answers[question.id];
      var correct = isQuestionCorrect(question, answer);
      return '<article class="card"><span class="status-pill ' + (correct ? "acquise" : "a-apprendre") + '">' + (correct ? "Correct" : "À revoir") + '</span><h3>' + UI.escapeHtml(question.question || question.text) + '</h3><p><strong>Réponse donnée:</strong> ' + UI.escapeHtml(answer || "Aucune") + '</p><p><strong>Réponse attendue:</strong> ' + UI.escapeHtml(expectedAnswer(question)) + '</p></article>';
    }).join("") + '</div>';
  }

  function startExamTimer() {
    function tick() {
      var node = document.getElementById("exam-timer");
      if (!node) return;
      var remaining = Math.max(0, Math.round((view.exam.deadline - Date.now()) / 1000));
      node.textContent = UI.formatDuration(remaining);
      if (remaining <= 0) {
        finishExam();
      }
    }
    tick();
    examTimer = setInterval(tick, 1000);
  }

  function renderGames() {
    if (view.game.type) {
      return renderActiveGame();
    }
    var games = [
      ["memory", "Mémoire", "Retrouver les paires."],
      ["drag", "Glisser-déposer", "Classer les définitions par catégorie."],
      ["association", "Association", "Relier les notions."],
      ["puzzle", "Puzzle", "Remettre une séquence dans l’ordre."],
      ["speed", "Défi de rapidité", "Répondre vite avec chronomètre."],
      ["survival", "Mode survie", "Continuer jusqu’à la première erreur."],
      ["exam", "Mode examen", "Basculer vers l’examen complet."]
    ];
    return [
      '<section class="page">',
      '  <section class="panel">',
      '    <div class="panel-header"><div><h2>Jeux pédagogiques</h2><p>Des modes courts pour varier les révisions.</p></div></div>',
      '    <div class="grid three">',
      games.map(function (game) {
        return '<article class="card"><h3>' + UI.escapeHtml(game[1]) + '</h3><p class="muted">' + UI.escapeHtml(game[2]) + '</p><button class="secondary-button" data-action="start-game" data-game="' + game[0] + '" type="button">' + UI.icon("play") + 'Jouer</button></article>';
      }).join(""),
      '    </div>',
      '  </section>',
      '</section>'
    ].join("");
  }

  function startGame(type) {
    if (type === "exam") {
      location.hash = "#quiz";
      startExam(20);
      return;
    }
    var definitions = allDefinitions().slice(0, 8);
    if (type === "memory") {
      var pairs = definitions.slice(0, 4);
      view.game = {
        type: type,
        data: {
          cards: UI.shuffle(pairs.flatMap(function (definition) {
            return [
              { id: UI.uid("m"), pairId: definition.id, label: definition.title },
              { id: UI.uid("m"), pairId: definition.id, label: definition.text }
            ];
          })),
          selected: [],
          matched: []
        }
      };
    } else if (type === "drag") {
      view.game = {
        type: type,
        data: {
          items: definitions,
          assignments: {},
          result: null
        }
      };
    } else if (type === "association") {
      view.game = {
        type: type,
        data: {
          pairs: definitions.slice(0, 6).map(function (definition) { return { left: definition.title, right: definition.text }; }),
          result: null
        }
      };
    } else if (type === "puzzle") {
      var orderQuestion = allQuestions().find(function (question) { return question.type === "order"; });
      view.game = {
        type: type,
        data: {
          question: orderQuestion,
          answer: orderQuestion ? UI.shuffle(orderQuestion.items) : [],
          result: null
        }
      };
    } else if (type === "speed" || type === "survival") {
      view.game = {
        type: type,
        data: {
          questions: UI.shuffle(allQuestions().filter(function (question) { return question.type === "mcq" || question.type === "truefalse"; })),
          index: 0,
          score: 0,
          startedAt: Date.now(),
          deadline: type === "speed" ? Date.now() + 60000 : null,
          ended: false
        }
      };
    }
    render();
  }

  function renderActiveGame() {
    var type = view.game.type;
    var data = view.game.data;
    if (type === "memory") return renderMemoryGame(data);
    if (type === "drag") return renderDragGame(data);
    if (type === "association") return renderAssociationGame(data);
    if (type === "puzzle") return renderPuzzleGame(data);
    if (type === "speed" || type === "survival") return renderSpeedGame(data, type);
    return '<section class="page"><div class="empty-state">Jeu indisponible.</div></section>';
  }

  function gameHeader(title) {
    return '<div class="panel-header"><div><h2>' + UI.escapeHtml(title) + '</h2><p>Mode pédagogique</p></div><button class="ghost-button" data-action="stop-game" type="button">Retour aux jeux</button></div>';
  }

  function renderMemoryGame(data) {
    return [
      '<section class="page"><section class="panel game-board">',
      gameHeader("Mémoire"),
      '<div class="memory-grid">',
      data.cards.map(function (card) {
        var visible = data.selected.indexOf(card.id) !== -1 || data.matched.indexOf(card.pairId) !== -1;
        return '<button class="memory-card' + (visible ? " is-visible" : "") + (data.matched.indexOf(card.pairId) !== -1 ? " is-matched" : "") + '" data-action="memory-card" data-id="' + card.id + '" type="button">' + (visible ? UI.escapeHtml(card.label) : "Carte") + '</button>';
      }).join(""),
      '</div>',
      '<p class="muted">Paires trouvées: ' + data.matched.length + '</p>',
      '</section></section>'
    ].join("");
  }

  function renderDragGame(data) {
    var categories = UI.unique(data.items.map(function (item) { return item.category; }));
    var assignedIds = Object.keys(data.assignments);
    var unassigned = data.items.filter(function (item) { return assignedIds.indexOf(item.id) === -1; });
    return [
      '<section class="page"><section class="panel game-board">',
      gameHeader("Glisser-déposer et classement"),
      '<div class="drop-zone" data-drop-category=""><strong>À classer</strong><div>',
      unassigned.map(draggableDefinitionHtml).join(""),
      '</div></div>',
      '<div class="grid three">',
      categories.map(function (category) {
        var items = data.items.filter(function (item) { return data.assignments[item.id] === category; });
        return '<div class="drop-zone" data-drop-category="' + UI.escapeHtml(category) + '"><strong>' + UI.escapeHtml(category) + '</strong><div>' + items.map(draggableDefinitionHtml).join("") + '</div></div>';
      }).join(""),
      '</div>',
      '<div class="classification-grid">',
      data.items.map(function (item) {
        return '<div class="association-row"><span>' + UI.escapeHtml(item.title) + '</span><select data-action="classification-select" data-id="' + item.id + '"><option value="">Choisir</option>' + categories.map(function (category) { return '<option value="' + UI.escapeHtml(category) + '"' + (data.assignments[item.id] === category ? " selected" : "") + '>' + UI.escapeHtml(category) + '</option>'; }).join("") + '</select></div>';
      }).join(""),
      '</div>',
      data.result ? '<div class="answer-box">' + UI.escapeHtml(data.result) + '</div>' : "",
      '<button class="primary-button" data-action="classification-check" type="button">Vérifier</button>',
      '</section></section>'
    ].join("");
  }

  function draggableDefinitionHtml(item) {
    return '<button class="chip draggable-chip" draggable="true" data-drag-id="' + item.id + '" type="button">' + UI.escapeHtml(item.title) + '</button>';
  }

  function renderAssociationGame(data) {
    var rights = UI.shuffle(data.pairs.map(function (pair) { return pair.right; }));
    return [
      '<section class="page"><section class="panel game-board">',
      gameHeader("Association"),
      data.pairs.map(function (pair, index) {
        return '<div class="association-row"><strong>' + UI.escapeHtml(pair.left) + '</strong><select data-association-index="' + index + '"><option value="">Choisir</option>' + rights.map(function (right) { return '<option value="' + UI.escapeHtml(right) + '">' + UI.escapeHtml(right) + '</option>'; }).join("") + '</select></div>';
      }).join(""),
      data.result ? '<div class="answer-box">' + UI.escapeHtml(data.result) + '</div>' : "",
      '<button class="primary-button" data-action="game-association-check" type="button">Vérifier</button>',
      '</section></section>'
    ].join("");
  }

  function renderPuzzleGame(data) {
    if (!data.question) {
      return '<section class="page"><section class="panel">' + gameHeader("Puzzle") + '<div class="empty-state">Ajoute une question de type order dans data/quiz.js.</div></section></section>';
    }
    return [
      '<section class="page"><section class="panel game-board">',
      gameHeader("Puzzle"),
      '<h3>' + UI.escapeHtml(data.question.question) + '</h3>',
      sortableHtml(data.answer, "game-order-move"),
      data.result ? '<div class="answer-box">' + UI.escapeHtml(data.result) + '</div>' : "",
      '<button class="primary-button" data-action="game-order-check" type="button">Vérifier</button>',
      '</section></section>'
    ].join("");
  }

  function renderSpeedGame(data, type) {
    var question = data.questions[data.index];
    if (data.ended || !question) {
      return [
        '<section class="page"><section class="panel game-board">',
        gameHeader(type === "speed" ? "Défi de rapidité" : "Mode survie"),
        metricHtml("Score", String(data.score), "Bonnes réponses"),
        '<button class="primary-button" data-action="restart-game" data-game="' + type + '" type="button">Recommencer</button>',
        '</section></section>'
      ].join("");
    }
    var options = question.type === "truefalse" ? [["true", "Vrai"], ["false", "Faux"]] : question.options.map(function (option) { return [option, option]; });
    return [
      '<section class="page"><section class="panel game-board">',
      gameHeader(type === "speed" ? "Défi de rapidité" : "Mode survie"),
      '<div class="panel-header"><div><span id="speed-timer" class="status-pill"></span></div><strong>Score: ' + data.score + '</strong></div>',
      '<div class="question-card"><h3>' + UI.escapeHtml(question.question) + '</h3><div class="choice-grid">',
      options.map(function (option) {
        return '<button class="secondary-button choice-button" data-action="speed-answer" data-value="' + UI.escapeHtml(option[0]) + '" type="button">' + UI.escapeHtml(option[1]) + '</button>';
      }).join(""),
      '</div></div>',
      '</section></section>'
    ].join("");
  }

  function startSpeedTimer() {
    function tick() {
      var node = document.getElementById("speed-timer");
      if (!node || !view.game.data || !view.game.data.deadline) return;
      var remaining = Math.max(0, Math.round((view.game.data.deadline - Date.now()) / 1000));
      node.textContent = UI.formatDuration(remaining);
      if (remaining <= 0) {
        view.game.data.ended = true;
        render();
      }
    }
    tick();
    speedTimer = setInterval(tick, 1000);
  }

  function renderStats() {
    var stats = dashboardStats();
    var courseRows = allCourses().map(function (course) {
      var progress = state.courses[course.id] || { readPercent: 0 };
      return [course.title, Math.round(progress.completed ? 100 : progress.readPercent || 0)];
    });

    return [
      '<section class="page">',
      '  <div class="grid four">',
      metricHtml("Heures travaillées", UI.formatDuration(state.stats.studySeconds), "Journal et sessions"),
      metricHtml("Révisions", String(state.stats.revisions), "Cartes évaluées"),
      metricHtml("Réponses justes", String(state.stats.correct), state.stats.answered + " réponse(s)"),
      metricHtml("Taux de réussite", stats.success + "%", "Toutes activités"),
      '  </div>',
      '  <div class="grid two">',
      '    <section class="panel">',
      '      <div class="panel-header"><div><h2>Progression</h2><p>Graphique synthétique.</p></div></div>',
      statBar("Définitions maîtrisées", UI.percent(stats.masteredDefinitions, stats.totalDefinitions)),
      statBar("Cours terminés", UI.percent(stats.completedCourses, stats.totalCourses)),
      statBar("Réussite", stats.success),
      '    </section>',
      '    <section class="panel">',
      '      <div class="panel-header"><div><h2>Chapitres et cours</h2><p>Maîtrise par lecteur.</p></div></div>',
      '      <div class="stat-chart">',
      courseRows.length ? courseRows.map(function (row) { return statBar(row[0], row[1]); }).join("") : '<div class="empty-state">Aucun cours.</div>',
      '      </div>',
      '    </section>',
      '  </div>',
      '  <section class="panel">',
      '    <div class="panel-header"><div><h2>Définitions maîtrisées</h2><p>' + stats.masteredDefinitions + ' / ' + stats.totalDefinitions + '</p></div></div>',
      '    <div class="progress-track"><span class="progress-fill green" style="--value:' + UI.percent(stats.masteredDefinitions, stats.totalDefinitions) + '%"></span></div>',
      '  </section>',
      '</section>'
    ].join("");
  }

  function statBar(label, value) {
    return [
      '<div class="bar-row">',
      '  <span>' + UI.escapeHtml(label) + '</span>',
      '  <div class="progress-track"><span class="progress-fill blue" style="--value:' + value + '%"></span></div>',
      '  <strong>' + value + '%</strong>',
      '</div>'
    ].join("");
  }

  function renderSettings() {
    return [
      '<section class="page">',
      '  <div class="grid two">',
      '    <section class="panel">',
      '      <div class="panel-header"><div><h2>Affichage</h2><p>Mode sombre, clair et confort de lecture.</p></div></div>',
      selectHtml("setting-theme", "Thème", [["system", "Automatique"], ["light", "Mode clair"], ["dark", "Mode sombre"]], state.settings.theme),
      '      <label class="field"><span>Taille de police</span><input id="setting-font" type="range" min="0.9" max="1.25" step="0.05" value="' + UI.escapeHtml(state.settings.fontScale) + '"></label>',
      '      <label class="toolbar"><input id="setting-autosave" type="checkbox"' + (state.settings.autosave ? " checked" : "") + '> Sauvegarde automatique</label>',
      '    </section>',
      '    <section class="panel">',
      '      <div class="panel-header"><div><h2>Données</h2><p>Tout est stocké dans le navigateur avec LocalStorage.</p></div></div>',
      '      <div class="button-row">',
      '        <button class="secondary-button" data-action="settings-export" type="button">' + UI.icon("download") + 'Exporter les données</button>',
      '        <button class="secondary-button" data-action="settings-import-click" type="button">' + UI.icon("upload") + 'Importer les données</button>',
      '        <input id="settings-import" class="hidden" type="file" accept="application/json">',
      '        <button class="danger-button" data-action="settings-reset" type="button">' + UI.icon("x") + 'Réinitialiser</button>',
      '      </div>',
      '      <p class="muted">La réinitialisation efface progression, notes, journal, scores, favoris et planning local.</p>',
      '    </section>',
      '  </div>',
      '</section>'
    ].join("");
  }

  function handleClick(event) {
    var target = event.target.closest("[data-action]");
    if (!target) return;
    var action = target.dataset.action;

    if (action === "toggle-theme") {
      state.settings.theme = document.body.dataset.theme === "dark" ? "light" : "dark";
      applyTheme();
      persist("Thème mis à jour.");
      return;
    }
    if (action === "quick-add-journal") {
      location.hash = "#journal";
      return;
    }
    if (action === "continue-training") {
      location.hash = dashboardStats().dueCount ? "#revisions" : "#cours";
      return;
    }
    if (action === "toggle-definition-favorites") {
      view.definitions.favorites = !view.definitions.favorites;
      render();
      return;
    }
    if (action === "definition-mode") {
      view.definitions.mode = target.dataset.mode;
      view.definitions.currentId = null;
      view.definitions.answerVisible = false;
      render();
      return;
    }
    if (action === "definition-favorite") {
      var definitionProgress = state.definitions[target.dataset.id];
      definitionProgress.favorite = !definitionProgress.favorite;
      persist(definitionProgress.favorite ? "Ajouté aux favoris." : "Retiré des favoris.");
      refreshDefinitions();
      return;
    }
    if (action === "definition-practice") {
      view.definitions.currentId = target.dataset.id;
      view.definitions.mode = "recitation";
      view.definitions.answerVisible = false;
      render();
      return;
    }
    if (action === "definition-reveal") {
      view.definitions.answerVisible = true;
      refreshDefinitions();
      return;
    }
    if (action === "definition-next") {
      view.definitions.currentId = null;
      view.definitions.answerVisible = false;
      refreshDefinitions();
      return;
    }
    if (action === "definition-recitation-grade") {
      var currentDefinition = findDefinition(view.definitions.currentId);
      if (currentDefinition) {
        applyDefinitionReview(state.definitions[currentDefinition.id], target.dataset.grade);
        Store.recordAnswer(state, target.dataset.grade === "known");
        state.stats.revisions += 1;
        persist(target.dataset.grade === "known" ? "Définition acquise." : "Définition à revoir.");
      }
      view.definitions.currentId = null;
      view.definitions.answerVisible = false;
      render();
      return;
    }
    if (action === "knowledge-sort") {
      view.knowledgeSort[target.dataset.kind] = target.dataset.sort;
      render();
      return;
    }
    if (action === "select-course") {
      view.courseId = target.dataset.id;
      window.scrollTo({ top: 0, behavior: "smooth" });
      render();
      return;
    }
    if (action === "complete-course") {
      state.courses[target.dataset.id].completed = true;
      state.courses[target.dataset.id].readPercent = 100;
      persist("Cours marqué comme lu.");
      render();
      return;
    }
    if (action === "select-summary") {
      view.summaryId = target.dataset.id;
      render();
      return;
    }
    if (action === "start-revision") {
      startRevision(target.dataset.mode);
      return;
    }
    if (action === "revision-reveal") {
      view.revision.answerVisible = true;
      render();
      return;
    }
    if (action === "revision-grade") {
      applySrs(view.revision.deck[view.revision.index], target.dataset.grade);
      nextRevisionItem();
      return;
    }
    if (action === "revision-next") {
      nextRevisionItem();
      return;
    }
    if (action === "revision-finish") {
      finishRevision("Séance enregistrée.");
      render();
      return;
    }
    if (action === "revision-answer") {
      answerRevisionQuestion(target.dataset.value);
      return;
    }
    if (action === "revision-check") {
      view.revision.answerVisible = true;
      render();
      return;
    }
    if (action === "revision-check-association") {
      checkRevisionAssociation();
      return;
    }
    if (action === "revision-order-move") {
      moveItem(view.revision.currentAnswer, Number(target.dataset.index), Number(target.dataset.dir));
      render();
      return;
    }
    if (action === "revision-check-order") {
      checkRevisionOrder();
      return;
    }
    if (action === "flashcard-flip") {
      view.flashcards.flipped = !view.flashcards.flipped;
      render();
      return;
    }
    if (action === "flashcard-prev" || action === "flashcard-next") {
      var deck = flashcardDeck();
      view.flashcards.index = UI.clamp(view.flashcards.index + (action === "flashcard-next" ? 1 : -1), 0, Math.max(0, deck.length - 1));
      view.flashcards.flipped = false;
      render();
      return;
    }
    if (action === "flashcard-grade") {
      gradeFlashcard(target.dataset.grade);
      return;
    }
    if (action === "quiz-start") {
      view.quiz = emptyQuiz();
      view.quiz.active = true;
      view.quiz.questions = UI.shuffle(allQuestions());
      render();
      return;
    }
    if (action === "quiz-stop") {
      view.quiz = emptyQuiz();
      render();
      return;
    }
    if (action === "quiz-answer") {
      answerQuiz(target.dataset.value);
      return;
    }
    if (action === "quiz-check-written") {
      checkQuizWritten();
      return;
    }
    if (action === "quiz-check-association") {
      checkQuizAssociation();
      return;
    }
    if (action === "quiz-order-move") {
      moveItem(view.quiz.currentAnswer, Number(target.dataset.index), Number(target.dataset.dir));
      render();
      return;
    }
    if (action === "quiz-check-order") {
      checkQuizOrder();
      return;
    }
    if (action === "quiz-next") {
      view.quiz.index += 1;
      view.quiz.currentAnswer = null;
      view.quiz.feedback = null;
      render();
      return;
    }
    if (action === "exam-start") {
      var durationNode = document.getElementById("exam-duration");
      startExam(Number(durationNode ? durationNode.value : 20));
      return;
    }
    if (action === "exam-answer") {
      var examQuestion = view.exam.questions[view.exam.index];
      view.exam.answers[examQuestion.id] = target.dataset.value;
      render();
      return;
    }
    if (action === "exam-prev" || action === "exam-next") {
      saveCurrentExamText();
      view.exam.index = UI.clamp(view.exam.index + (action === "exam-next" ? 1 : -1), 0, view.exam.questions.length - 1);
      render();
      return;
    }
    if (action === "exam-finish") {
      saveCurrentExamText();
      finishExam();
      return;
    }
    if (action === "exam-reset") {
      view.exam = emptyExam();
      render();
      return;
    }
    if (action === "planning-prev" || action === "planning-next") {
      view.planningMonth.setMonth(view.planningMonth.getMonth() + (action === "planning-next" ? 1 : -1));
      render();
      return;
    }
    if (action === "toggle-day-complete") {
      state.completedDays[target.dataset.date] = !state.completedDays[target.dataset.date];
      persist("Planning mis à jour.");
      render();
      return;
    }
    if (action === "delete-journal") {
      state.journal = state.journal.filter(function (entry) { return entry.id !== target.dataset.id; });
      persist("Entrée supprimée.");
      render();
      return;
    }
    if (action === "start-game") {
      startGame(target.dataset.game);
      return;
    }
    if (action === "stop-game") {
      view.game = { type: null, data: null };
      render();
      return;
    }
    if (action === "restart-game") {
      startGame(target.dataset.game);
      return;
    }
    if (action === "memory-card") {
      flipMemoryCard(target.dataset.id);
      return;
    }
    if (action === "classification-check") {
      checkClassification();
      return;
    }
    if (action === "game-association-check") {
      checkGameAssociation();
      return;
    }
    if (action === "game-order-move") {
      moveItem(view.game.data.answer, Number(target.dataset.index), Number(target.dataset.dir));
      render();
      return;
    }
    if (action === "game-order-check") {
      checkGameOrder();
      return;
    }
    if (action === "speed-answer") {
      answerSpeedGame(target.dataset.value);
      return;
    }
    if (action === "settings-export") {
      UI.downloadJson("sncf-traction-academy-sauvegarde.json", Store.exportPayload(state));
      UI.toast("Export préparé.");
      return;
    }
    if (action === "settings-import-click") {
      document.getElementById("settings-import").click();
      return;
    }
    if (action === "settings-reset") {
      if (confirm("Réinitialiser toutes les données locales ?")) {
        state = Store.reset();
        applyTheme();
        UI.toast("Données réinitialisées.");
        render();
      }
    }
  }

  function handleInput(event) {
    if (event.target.id === "def-search") {
      view.definitions.search = event.target.value;
      view.definitions.currentId = null;
      refreshDefinitions();
    }
  }

  function handleChange(event) {
    var target = event.target;
    if (target.id === "def-category") view.definitions.category = target.value;
    if (target.id === "def-difficulty") view.definitions.difficulty = target.value;
    if (target.id === "def-state") view.definitions.state = target.value;
    if (target.id === "def-sort") view.definitions.sort = target.value;
    if (["def-category", "def-difficulty", "def-state", "def-sort"].indexOf(target.id) !== -1) {
      view.definitions.currentId = null;
      refreshDefinitions();
      return;
    }
    if (target.dataset.action === "definition-state") {
      state.definitions[target.dataset.id].state = target.value;
      if (target.value === "acquise" && !state.definitions[target.dataset.id].learnDate) {
        state.definitions[target.dataset.id].learnDate = Store.todayIsoDate();
      }
      if (target.value === "acquise") {
        state.definitions[target.dataset.id].mustReview = false;
      }
      persist("État mis à jour.");
      refreshDefinitions();
      return;
    }
    if (target.dataset.action === "definition-learn-date") {
      var learnProgress = state.definitions[target.dataset.id];
      learnProgress.learnDate = target.value;
      learnProgress.reviewStage = 0;
      learnProgress.mustReview = false;
      learnProgress.lastReviewDate = "";
      learnProgress.srs.nextReview = target.value ? addDaysIso(target.value, 7) : Store.todayIsoDate();
      if (target.value && learnProgress.state === "a-apprendre") {
        learnProgress.state = "en-cours";
      }
      persist("Date d’apprentissage mise à jour.");
      refreshDefinitions();
      return;
    }
    if (target.dataset.action === "definition-last-review-date") {
      var reviewProgress = state.definitions[target.dataset.id];
      reviewProgress.lastReviewDate = target.value;
      persist("Date de dernière révision mise à jour.");
      refreshDefinitions();
      return;
    }
    if (target.id === "revision-category") {
      view.revision.category = target.value;
      return;
    }
    if (target.id === "setting-theme") {
      state.settings.theme = target.value;
      applyTheme();
      persist("Thème mis à jour.");
      return;
    }
    if (target.id === "setting-font") {
      state.settings.fontScale = Number(target.value);
      applyTheme();
      persist();
      return;
    }
    if (target.id === "setting-autosave") {
      state.settings.autosave = target.checked;
      persist("Préférence enregistrée.");
      return;
    }
    if (target.id === "settings-import" && target.files && target.files[0]) {
      importSettingsFile(target.files[0]);
      return;
    }
    if (target.dataset.action === "classification-select") {
      view.game.data.assignments[target.dataset.id] = target.value;
      render();
    }
  }

  function handleSubmit(event) {
    if (event.target.id === "daily-goal-form") {
      event.preventDefault();
      state.dailyGoal = new FormData(event.target).get("dailyGoal");
      persist("Objectif enregistré.");
      return;
    }
    if (event.target.id === "journal-form") {
      event.preventDefault();
      var form = new FormData(event.target);
      var minutes = Number(form.get("minutes") || 0);
      state.journal.push({
        id: UI.uid("journal"),
        date: form.get("date"),
        minutes: minutes,
        coursesSeen: form.get("coursesSeen"),
        definitionsSeen: form.get("definitionsSeen"),
        difficulties: form.get("difficulties"),
        toReview: form.get("toReview"),
        notes: form.get("notes"),
        tomorrowGoals: form.get("tomorrowGoals"),
        createdAt: new Date().toISOString()
      });
      Store.recordStudyTime(state, minutes * 60);
      persist("Journée enregistrée.");
      render();
      return;
    }
    if (event.target.id === "planning-form") {
      event.preventDefault();
      var data = new FormData(event.target);
      state.planning.push({
        id: UI.uid("planning"),
        date: data.get("date"),
        type: data.get("type"),
        title: data.get("title"),
        notes: data.get("notes"),
        completed: false
      });
      persist("Événement ajouté.");
      render();
    }
  }

  function startRevision(mode) {
    var deck = buildRevisionDeck(mode);
    if (!deck.length) {
      UI.toast("Aucun élément disponible pour ce mode.");
      return;
    }
    view.revision = emptyRevision();
    view.revision.active = true;
    view.revision.mode = mode;
    view.revision.deck = deck;
    view.revision.startedAt = Date.now();
    view.revision.deadline = mode === "timed" ? Date.now() + 10 * 60 * 1000 : null;
    render();
  }

  function answerRevisionQuestion(value) {
    var item = view.revision.deck[view.revision.index];
    view.revision.currentAnswer = value;
    var correct = isQuestionCorrect(item, value);
    view.revision.feedback = { correct: correct, message: correct ? "Bonne réponse." : "Réponse à revoir." };
    Store.recordAnswer(state, correct);
    state.stats.revisions += 1;
    persist();
    render();
  }

  function checkRevisionAssociation() {
    var item = view.revision.deck[view.revision.index];
    var correct = (item.pairs || []).every(function (pair, index) {
      var select = document.querySelector('[data-association-index="' + index + '"]');
      return select && select.value === pair.right;
    });
    view.revision.feedback = { correct: correct, message: correct ? "Associations correctes." : "Certaines associations sont à revoir." };
    Store.recordAnswer(state, correct);
    persist();
    render();
  }

  function checkRevisionOrder() {
    var item = view.revision.deck[view.revision.index];
    var correct = JSON.stringify(view.revision.currentAnswer) === JSON.stringify(item.items);
    view.revision.feedback = { correct: correct, message: correct ? "Ordre correct." : "Ordre à revoir." };
    Store.recordAnswer(state, correct);
    persist();
    render();
  }

  function gradeFlashcard(grade) {
    var deck = flashcardDeck();
    var card = deck[view.flashcards.index];
    applySrs(card, grade);
    view.flashcards.index = (view.flashcards.index + 1) % deck.length;
    view.flashcards.flipped = false;
    persist("Carte évaluée.");
    render();
  }

  function answerQuiz(value) {
    var question = view.quiz.questions[view.quiz.index];
    var correct = isQuestionCorrect(question, value);
    view.quiz.currentAnswer = value;
    view.quiz.feedback = { correct: correct };
    Store.recordAnswer(state, correct);
    persist();
    render();
  }

  function checkQuizWritten() {
    var question = view.quiz.questions[view.quiz.index];
    var answer = document.getElementById("quiz-written-answer").value;
    var correct = isQuestionCorrect(question, answer);
    view.quiz.currentAnswer = answer;
    view.quiz.feedback = { correct: correct };
    Store.recordAnswer(state, correct);
    persist();
    render();
  }

  function checkQuizAssociation() {
    var question = view.quiz.questions[view.quiz.index];
    var correct = question.pairs.every(function (pair, index) {
      var select = document.querySelector('[data-association-index="' + index + '"]');
      return select && select.value === pair.right;
    });
    view.quiz.feedback = { correct: correct };
    Store.recordAnswer(state, correct);
    persist();
    render();
  }

  function checkQuizOrder() {
    var question = view.quiz.questions[view.quiz.index];
    var correct = JSON.stringify(view.quiz.currentAnswer) === JSON.stringify(question.items);
    view.quiz.feedback = { correct: correct };
    Store.recordAnswer(state, correct);
    persist();
    render();
  }

  function isQuestionCorrect(question, value) {
    if (!question) return false;
    if (question.type === "truefalse") {
      return String(value) === String(question.answer);
    }
    if (question.type === "mcq") {
      return String(value) === String(question.answer);
    }
    if (question.type === "cloze" || question.type === "written") {
      return UI.normalize(value) === UI.normalize(question.answer);
    }
    return false;
  }

  function expectedAnswer(question) {
    if (question.type === "truefalse") return question.answer ? "Vrai" : "Faux";
    if (question.type === "order") return (question.items || []).join(" > ");
    if (question.type === "association") return (question.pairs || []).map(function (pair) { return pair.left + " = " + pair.right; }).join(" | ");
    return question.answer || "";
  }

  function moveItem(items, index, direction) {
    if (!items) return;
    var nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return;
    var current = items[index];
    items[index] = items[nextIndex];
    items[nextIndex] = current;
  }

  function startExam(durationMinutes) {
    var questions = UI.shuffle(allQuestions()).slice(0, 20);
    if (!questions.length) {
      UI.toast("Ajoute des questions pour lancer un examen.");
      return;
    }
    view.quiz = emptyQuiz();
    view.exam = emptyExam();
    view.exam.active = true;
    view.exam.questions = questions;
    view.exam.startedAt = Date.now();
    view.exam.deadline = Date.now() + Math.max(1, durationMinutes || 20) * 60 * 1000;
    render();
  }

  function saveCurrentExamText() {
    if (!view.exam.active || view.exam.finished) return;
    var question = view.exam.questions[view.exam.index];
    var textarea = document.getElementById("exam-written-answer");
    if (question && textarea) {
      view.exam.answers[question.id] = textarea.value;
    }
  }

  function finishExam() {
    saveCurrentExamText();
    var score = view.exam.questions.reduce(function (total, question) {
      return total + (isQuestionCorrect(question, view.exam.answers[question.id]) ? 1 : 0);
    }, 0);
    view.exam.score = score;
    view.exam.active = false;
    view.exam.finished = true;
    state.examHistory.push({
      id: UI.uid("exam"),
      date: new Date().toISOString(),
      score: score,
      total: view.exam.questions.length,
      durationSeconds: Math.round((Date.now() - view.exam.startedAt) / 1000)
    });
    Store.recordStudyTime(state, Math.round((Date.now() - view.exam.startedAt) / 1000));
    persist("Examen terminé.");
    render();
  }

  function flipMemoryCard(id) {
    var game = view.game.data;
    if (game.selected.indexOf(id) !== -1) return;
    game.selected.push(id);
    if (game.selected.length === 2) {
      var cards = game.selected.map(function (selectedId) {
        return game.cards.find(function (card) { return card.id === selectedId; });
      });
      if (cards[0] && cards[1] && cards[0].pairId === cards[1].pairId) {
        game.matched.push(cards[0].pairId);
        game.selected = [];
      } else {
        setTimeout(function () {
          game.selected = [];
          render();
        }, 800);
      }
    }
    render();
  }

  function checkClassification() {
    var data = view.game.data;
    var total = data.items.length;
    var correct = data.items.filter(function (item) {
      return data.assignments[item.id] === item.category;
    }).length;
    data.result = correct + " / " + total + " classement(s) correct(s).";
    render();
  }

  function checkGameAssociation() {
    var data = view.game.data;
    var correct = data.pairs.filter(function (pair, index) {
      var select = document.querySelector('[data-association-index="' + index + '"]');
      return select && select.value === pair.right;
    }).length;
    data.result = correct + " / " + data.pairs.length + " association(s) correcte(s).";
    render();
  }

  function checkGameOrder() {
    var data = view.game.data;
    var correct = JSON.stringify(data.answer) === JSON.stringify(data.question.items);
    data.result = correct ? "Ordre correct." : "Ordre à revoir.";
    render();
  }

  function answerSpeedGame(value) {
    var data = view.game.data;
    var question = data.questions[data.index];
    var correct = isQuestionCorrect(question, value);
    if (correct) {
      data.score += 1;
      data.index += 1;
    } else if (view.game.type === "survival") {
      data.ended = true;
    } else {
      data.index += 1;
    }
    if (data.index >= data.questions.length) {
      data.ended = true;
    }
    render();
  }

  function handleDragStart(event) {
    var chip = event.target.closest("[data-drag-id]");
    if (!chip) return;
    event.dataTransfer.setData("text/plain", chip.dataset.dragId);
  }

  function handleDragOver(event) {
    if (event.target.closest("[data-drop-category]")) {
      event.preventDefault();
    }
  }

  function handleDrop(event) {
    var zone = event.target.closest("[data-drop-category]");
    if (!zone || !view.game.data || view.game.type !== "drag") return;
    event.preventDefault();
    var id = event.dataTransfer.getData("text/plain");
    var category = zone.dataset.dropCategory;
    if (category) {
      view.game.data.assignments[id] = category;
    } else {
      delete view.game.data.assignments[id];
    }
    render();
  }

  function importSettingsFile(file) {
    UI.readFile(file).then(function (content) {
      state = Store.importPayload(JSON.parse(content));
      persist("Import terminé.");
      applyTheme();
      render();
    }).catch(function (error) {
      UI.toast(error.message || "Import impossible.");
    });
  }

  init();
})();
