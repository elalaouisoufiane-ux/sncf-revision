/* Gestion unique de la sauvegarde locale et de la répétition espacée. */
(function () {
  "use strict";

  var STORAGE_KEY = "sncf-traction-academy-state-v1";
  var EXPORT_VERSION = 1;

  function nowIso() {
    return new Date().toISOString();
  }

  function todayIsoDate() {
    return new Date().toISOString().slice(0, 10);
  }

  function addDays(date, days) {
    var copy = new Date(date.getTime());
    copy.setDate(copy.getDate() + days);
    return copy;
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function mergeRecordsById(initial, saved) {
    var byId = {};
    clone(initial || []).forEach(function (item) {
      byId[item.id] = item;
    });
    (saved || []).forEach(function (item) {
      if (item && item.id) {
        byId[item.id] = item;
      }
    });
    return Object.keys(byId).map(function (id) {
      return byId[id];
    });
  }

  function data() {
    return window.TRACTION_DATA || {};
  }

  function allCourses() {
    var chapters = data().chapters || [];
    return chapters.reduce(function (list, chapter) {
      return list.concat(chapter.subchapters || []);
    }, []);
  }

  function allDefinitions() {
    return []
      .concat(data().definitions || [])
      .concat(data().abbreviations || [])
      .concat(data().vocabulary || []);
  }

  function defaultSrs() {
    return {
      interval: 0,
      ease: 2.5,
      repetitions: 0,
      lapses: 0,
      lastReviewed: null,
      nextReview: todayIsoDate(),
      correct: 0,
      wrong: 0
    };
  }

  function defaultDefinitionProgress() {
    return {
      state: "a-apprendre",
      favorite: false,
      learnDate: "",
      lastReviewDate: "",
      reviewStage: 0,
      mustReview: false,
      notes: "",
      srs: defaultSrs()
    };
  }

  function defaultCourseProgress() {
    return {
      readPercent: 0,
      completed: false,
      lastReadAt: null,
      timeSpentSeconds: 0
    };
  }

  function defaultFlashcardProgress() {
    return {
      favorite: false,
      srs: defaultSrs()
    };
  }

  function createDefaultState() {
    var definitions = {};
    var courses = {};
    var flashcards = {};

    allDefinitions().forEach(function (item) {
      definitions[item.id] = defaultDefinitionProgress();
    });

    allCourses().forEach(function (course) {
      courses[course.id] = defaultCourseProgress();
    });

    (data().flashcards || []).forEach(function (card) {
      flashcards[card.id] = defaultFlashcardProgress();
    });

    return {
      version: EXPORT_VERSION,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      settings: {
        theme: "system",
        fontScale: 1,
        autosave: true
      },
      dailyGoal: "Choisir une révision active et noter ce qui doit être revu demain.",
      definitions: definitions,
      courses: courses,
      flashcards: flashcards,
      journal: clone(data().initialJournal || []),
      planning: clone(data().initialPlanning || []),
      completedDays: {},
      sessions: [],
      examHistory: [],
      stats: {
        studySeconds: 0,
        revisions: 0,
        answered: 0,
        correct: 0
      }
    };
  }

  function mergeSrs(saved) {
    return Object.assign(defaultSrs(), saved || {});
  }

  function mergeState(saved) {
    var base = createDefaultState();
    var state = Object.assign(base, saved || {});

    state.settings = Object.assign(base.settings, (saved && saved.settings) || {});
    state.stats = Object.assign(base.stats, (saved && saved.stats) || {});
    state.completedDays = Object.assign(base.completedDays, (saved && saved.completedDays) || {});
    state.definitions = Object.assign({}, base.definitions, (saved && saved.definitions) || {});
    state.courses = Object.assign({}, base.courses, (saved && saved.courses) || {});
    state.flashcards = Object.assign({}, base.flashcards, (saved && saved.flashcards) || {});
    state.journal = mergeRecordsById(data().initialJournal || [], Array.isArray(state.journal) ? state.journal : []);
    state.planning = Array.isArray(state.planning) ? state.planning : [];
    state.sessions = Array.isArray(state.sessions) ? state.sessions : [];
    state.examHistory = Array.isArray(state.examHistory) ? state.examHistory : [];

    Object.keys(base.definitions).forEach(function (id) {
      state.definitions[id] = Object.assign(defaultDefinitionProgress(), state.definitions[id] || {});
      state.definitions[id].srs = mergeSrs(state.definitions[id].srs);
    });

    Object.keys(base.courses).forEach(function (id) {
      state.courses[id] = Object.assign(defaultCourseProgress(), state.courses[id] || {});
    });

    Object.keys(base.flashcards).forEach(function (id) {
      state.flashcards[id] = Object.assign(defaultFlashcardProgress(), state.flashcards[id] || {});
      state.flashcards[id].srs = mergeSrs(state.flashcards[id].srs);
    });

    return state;
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return createDefaultState();
      }
      return mergeState(JSON.parse(raw));
    } catch (error) {
      console.warn("Impossible de charger la sauvegarde locale.", error);
      return createDefaultState();
    }
  }

  function save(state) {
    state.updatedAt = nowIso();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return state;
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    return createDefaultState();
  }

  function isDue(srs) {
    if (!srs || !srs.nextReview) {
      return true;
    }
    return new Date(srs.nextReview + "T00:00:00") <= new Date(todayIsoDate() + "T23:59:59");
  }

  function gradeSrs(progress, grade) {
    var srs = mergeSrs(progress.srs);
    var quality = grade === "known" ? 3 : grade === "almost" ? 2 : 1;
    var today = new Date(todayIsoDate() + "T00:00:00");

    srs.lastReviewed = nowIso();

    if (quality === 1) {
      srs.lapses += 1;
      srs.repetitions = 0;
      srs.interval = 0;
      srs.ease = Math.max(1.3, srs.ease - 0.2);
      srs.nextReview = todayIsoDate();
      srs.wrong += 1;
    } else {
      srs.correct += 1;
      srs.repetitions += 1;
      srs.ease += quality === 3 ? 0.08 : -0.05;
      srs.ease = Math.max(1.3, Math.min(3.0, srs.ease));

      if (grade === "almost") {
        srs.interval = Math.max(1, Math.round((srs.interval || 1) * 1.35));
      } else if (srs.repetitions === 1) {
        srs.interval = 2;
      } else if (srs.repetitions === 2) {
        srs.interval = 5;
      } else {
        srs.interval = Math.max(7, Math.round((srs.interval || 5) * srs.ease));
      }

      srs.nextReview = addDays(today, srs.interval).toISOString().slice(0, 10);
    }

    progress.srs = srs;
    return progress;
  }

  function recordAnswer(state, isCorrect) {
    state.stats.answered += 1;
    if (isCorrect) {
      state.stats.correct += 1;
    }
    return state;
  }

  function recordStudyTime(state, seconds) {
    state.stats.studySeconds += Math.max(0, Math.round(seconds || 0));
    return state;
  }

  function exportPayload(state) {
    return {
      app: "SNCF Traction Academy",
      version: EXPORT_VERSION,
      exportedAt: nowIso(),
      state: state
    };
  }

  function importPayload(payload) {
    if (!payload || !payload.state) {
      throw new Error("Fichier de sauvegarde invalide.");
    }
    return mergeState(payload.state);
  }

  window.TractionStorage = {
    key: STORAGE_KEY,
    load: load,
    save: save,
    reset: reset,
    createDefaultState: createDefaultState,
    isDue: isDue,
    gradeSrs: gradeSrs,
    recordAnswer: recordAnswer,
    recordStudyTime: recordStudyTime,
    exportPayload: exportPayload,
    importPayload: importPayload,
    todayIsoDate: todayIsoDate
  };
})();
