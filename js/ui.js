/* Petits utilitaires partagés par les pages. */
(function () {
  "use strict";

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $$(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function icon(name) {
    return '<svg aria-hidden="true"><use href="#i-' + escapeHtml(name) + '"></use></svg>';
  }

  function statusLabel(value) {
    var labels = {
      "a-apprendre": "À apprendre",
      "en-cours": "En cours",
      "acquise": "Acquise"
    };
    return labels[value] || value || "À apprendre";
  }

  function difficultyLabel(value) {
    var labels = {
      facile: "Facile",
      moyen: "Moyen",
      difficile: "Difficile"
    };
    return labels[value] || value || "Non classé";
  }

  function formatDate(value) {
    if (!value) {
      return "Jamais";
    }
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      date = new Date(value + "T00:00:00");
    }
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(date);
  }

  function formatShortDate(value) {
    if (!value) {
      return "";
    }
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short"
    }).format(new Date(value + "T00:00:00"));
  }

  function formatDuration(seconds) {
    var total = Math.max(0, Math.round(seconds || 0));
    var hours = Math.floor(total / 3600);
    var minutes = Math.round((total % 3600) / 60);
    if (hours <= 0) {
      return minutes + " min";
    }
    return hours + " h " + String(minutes).padStart(2, "0");
  }

  function percent(value, total) {
    if (!total) {
      return 0;
    }
    return Math.round((value / total) * 100);
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function shuffle(items) {
    var copy = items.slice();
    for (var index = copy.length - 1; index > 0; index -= 1) {
      var randomIndex = Math.floor(Math.random() * (index + 1));
      var temp = copy[index];
      copy[index] = copy[randomIndex];
      copy[randomIndex] = temp;
    }
    return copy;
  }

  function sample(items) {
    if (!items.length) {
      return null;
    }
    return items[Math.floor(Math.random() * items.length)];
  }

  function unique(items) {
    return Array.from(new Set(items.filter(Boolean)));
  }

  function uid(prefix) {
    return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  }

  function toast(message) {
    var node = $("#toast");
    if (!node) {
      return;
    }
    node.textContent = message;
    node.classList.add("is-visible");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () {
      node.classList.remove("is-visible");
    }, 2800);
  }

  function downloadJson(filename, payload) {
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function readFile(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function () {
        reject(reader.error);
      };
      reader.readAsText(file);
    });
  }

  function wordCountFromBlocks(blocks) {
    return (blocks || []).reduce(function (total, block) {
      if (block.text) {
        total += String(block.text).split(/\s+/).filter(Boolean).length;
      }
      if (block.title) {
        total += String(block.title).split(/\s+/).filter(Boolean).length;
      }
      if (Array.isArray(block.items)) {
        total += block.items.join(" ").split(/\s+/).filter(Boolean).length;
      }
      if (Array.isArray(block.steps)) {
        total += block.steps.join(" ").split(/\s+/).filter(Boolean).length;
      }
      if (Array.isArray(block.rows)) {
        total += block.rows.flat().join(" ").split(/\s+/).filter(Boolean).length;
      }
      return total;
    }, 0);
  }

  function estimatedMinutes(blocks) {
    return Math.max(1, Math.ceil(wordCountFromBlocks(blocks) / 190));
  }

  window.TractionUI = {
    $: $,
    $$: $$,
    escapeHtml: escapeHtml,
    normalize: normalize,
    icon: icon,
    statusLabel: statusLabel,
    difficultyLabel: difficultyLabel,
    formatDate: formatDate,
    formatShortDate: formatShortDate,
    formatDuration: formatDuration,
    percent: percent,
    clamp: clamp,
    shuffle: shuffle,
    sample: sample,
    unique: unique,
    uid: uid,
    toast: toast,
    downloadJson: downloadJson,
    readFile: readFile,
    estimatedMinutes: estimatedMinutes
  };
})();
