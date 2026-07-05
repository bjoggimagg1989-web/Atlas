(function () {
  const ns = "atlasinn.v3.admin.";
  const activeKey = ns + "assistant.active";
  const sessionKey = ns + "assistant.session";
  const panelOpenKey = ns + "assistant.panelOpen";
  const toolsOpenKey = ns + "tools.open";

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    const pageTitle = document.body.dataset.pageTitle || "HOME";
    const titleNode = document.querySelector("[data-page-title]");
    if (titleNode) titleNode.textContent = pageTitle;

    initMenu();
    initAssistant();
    initAdminTools();
  }

  function initMenu() {
    const button = document.querySelector("[data-menu-toggle]");
    const menu = document.querySelector("[data-menu-dropdown]");
    if (!button || !menu) return;

    button.addEventListener("click", function (event) {
      event.stopPropagation();
      const isOpen = !menu.classList.contains("open");
      menu.classList.toggle("open", isOpen);
      button.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", function (event) {
      if (menu.contains(event.target) || button.contains(event.target)) return;
      menu.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
    });
  }

  function initAssistant() {
    const mainToggle = document.querySelector("[data-ai-toggle]");
    const miniToggle = document.querySelector("[data-ai-mini-toggle]");
    const draftInput = document.querySelector("[data-ai-draft-input]");
    const status = document.querySelector("[data-ai-mode-status]");
    const contextLabel = document.querySelector("[data-ai-context-label]");
    const contextButtons = Array.from(document.querySelectorAll("[data-ai-context-action]"));
    let swipeState = null;
    let didSwipe = false;

    ensureSession();
    restoreSession();
    setPanelOpen(localStorage.getItem(panelOpenKey) === "true", false);
    setAssistantMode(localStorage.getItem(activeKey) === "true", false);

    if (mainToggle) {
      mainToggle.addEventListener("click", function (event) {
        event.preventDefault();
        setAssistantMode(!document.body.classList.contains("ai-assistant-active"), true);
      });
    }

    if (miniToggle) {
      miniToggle.addEventListener("click", function () {
        if (didSwipe) {
          didSwipe = false;
          return;
        }
        setPanelOpen(!document.body.classList.contains("ai-panel-open"), true);
      });

      miniToggle.addEventListener("pointerdown", function (event) {
        swipeState = {
          startX: event.clientX,
          startY: event.clientY
        };
        didSwipe = false;
        miniToggle.setPointerCapture(event.pointerId);
      });

      miniToggle.addEventListener("pointermove", function (event) {
        if (!swipeState) return;
        const dx = event.clientX - swipeState.startX;
        const dy = event.clientY - swipeState.startY;
        if (dx > 28 && Math.abs(dy) < 60) {
          didSwipe = true;
          setPanelOpen(true, true);
        }
      });

      miniToggle.addEventListener("pointerup", function () {
        swipeState = null;
      });
    }

    if (draftInput) {
      draftInput.addEventListener("input", function () {
        writeSessionPatch({
          draftText: draftInput.value,
          updatedAt: new Date().toISOString()
        });
      });
    }

    contextButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const nextContext = button.dataset.aiContextAction || "No assistant context selected";
        if (contextLabel) contextLabel.textContent = nextContext;
        setActiveContextButton(nextContext);
        writeSessionPatch({
          contextLabel: nextContext,
          updatedAt: new Date().toISOString()
        });
      });
    });

    function setAssistantMode(isActive, shouldSave) {
      document.body.classList.toggle("ai-assistant-active", isActive);
      if (mainToggle) {
        mainToggle.setAttribute("aria-pressed", String(isActive));
        mainToggle.setAttribute("aria-label", isActive ? "Turn Eldariel assistant mode off" : "Turn Eldariel assistant mode on");
        const label = mainToggle.querySelector("span");
        if (label) label.textContent = isActive ? "OFF" : "Eldariel";
      }
      if (status) status.textContent = isActive ? "ON" : "OFF";
      if (shouldSave) {
        localStorage.setItem(activeKey, String(isActive));
        writeSessionPatch({
          mode: isActive ? "active" : "inactive",
          updatedAt: new Date().toISOString()
        });
      }
    }

    function setPanelOpen(isOpen, shouldSave) {
      document.body.classList.toggle("ai-panel-open", isOpen);
      if (miniToggle) miniToggle.setAttribute("aria-expanded", String(isOpen));
      if (shouldSave) localStorage.setItem(panelOpenKey, String(isOpen));
    }

    function ensureSession() {
      if (localStorage.getItem(sessionKey)) return;
      localStorage.setItem(sessionKey, JSON.stringify({
        accountKey: "admin",
        mode: "inactive",
        draftText: "",
        contextLabel: "No assistant context selected",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
    }

    function restoreSession() {
      const current = readSession();
      if (draftInput) draftInput.value = current.draftText || "";
      if (contextLabel) contextLabel.textContent = current.contextLabel || "No assistant context selected";
      setActiveContextButton(current.contextLabel || "");
    }

    function setActiveContextButton(contextValue) {
      contextButtons.forEach(function (button) {
        button.classList.toggle("active", button.dataset.aiContextAction === contextValue);
      });
    }

    function readSession() {
      try {
        return JSON.parse(localStorage.getItem(sessionKey) || "{}");
      } catch (error) {
        return {};
      }
    }

    function writeSessionPatch(patch) {
      localStorage.setItem(sessionKey, JSON.stringify(Object.assign({}, readSession(), patch)));
    }
  }

  function initAdminTools() {
    const toggle = document.querySelector("[data-admin-tools-toggle]");
    const panel = document.querySelector("[data-admin-tools-panel]");
    const closeButton = document.querySelector("[data-admin-tools-close]");
    const logoInput = document.querySelector("[data-admin-logo-text]");
    const titleInput = document.querySelector("[data-admin-page-title]");
    const centerInput = document.querySelector("[data-admin-ai-label]");
    const showTitleInput = document.querySelector("[data-admin-show-title]");
    const copyButton = document.querySelector("[data-admin-copy-config]");
    const resetButton = document.querySelector("[data-admin-reset-config]");
    const status = document.querySelector("[data-admin-tools-status]");
    const storageKey = ns + "designControls";
    const pageKey = (document.body.dataset.pageTitle || "home").toLowerCase();
    const pageTitleKey = storageKey + "." + pageKey + ".pageTitle";
    if (!toggle || !panel) return;

    const defaults = {
      logoText: "LOGO HERE",
      pageTitle: document.body.dataset.pageTitle || "HOME",
      aiLabel: "Eldariel",
      showTitle: true
    };

    applyConfig(Object.assign({}, defaults, readConfig(), {
      pageTitle: localStorage.getItem(pageTitleKey) || defaults.pageTitle
    }));
    setToolsOpen(localStorage.getItem(toolsOpenKey) === "true", false);

    toggle.addEventListener("click", function () {
      setToolsOpen(!panel.classList.contains("open"), true);
    });

    if (closeButton) closeButton.addEventListener("click", function () {
      setToolsOpen(false, true);
    });

    [logoInput, titleInput, centerInput, showTitleInput].forEach(function (control) {
      if (!control) return;
      control.addEventListener("input", saveFromControls);
      control.addEventListener("change", saveFromControls);
    });

    if (copyButton) {
      copyButton.addEventListener("click", async function () {
        const payload = JSON.stringify(readConfig(), null, 2);
        try {
          await navigator.clipboard.writeText(payload);
          setStatus("Config copied.");
        } catch (error) {
          setStatus(payload);
        }
      });
    }

    if (resetButton) {
      resetButton.addEventListener("click", function () {
        localStorage.removeItem(storageKey);
        localStorage.removeItem(pageTitleKey);
        applyConfig(defaults);
        setStatus("Reset local design controls.");
      });
    }

    function saveFromControls() {
      const next = {
        logoText: logoInput ? logoInput.value : defaults.logoText,
        aiLabel: centerInput ? centerInput.value : defaults.aiLabel,
        showTitle: showTitleInput ? showTitleInput.checked : true
      };
      localStorage.setItem(storageKey, JSON.stringify(next));
      if (titleInput) localStorage.setItem(pageTitleKey, titleInput.value || defaults.pageTitle);
      applyConfig(Object.assign({}, next, {
        pageTitle: titleInput ? titleInput.value : defaults.pageTitle
      }));
      setStatus("Saved locally.");
    }

    function applyConfig(config) {
      const brand = document.querySelector("[data-logo-text]");
      const title = document.querySelector("[data-page-title]");
      const centerLabel = document.querySelector("[data-ai-toggle] span");
      if (brand) brand.dataset.logoText = config.logoText || defaults.logoText;
      if (title) {
        title.textContent = config.showTitle ? (config.pageTitle || defaults.pageTitle) : "";
        title.style.visibility = config.showTitle ? "visible" : "hidden";
      }
      if (centerLabel && !document.body.classList.contains("ai-assistant-active")) {
        centerLabel.textContent = config.aiLabel || defaults.aiLabel;
      }
      if (logoInput) logoInput.value = config.logoText || defaults.logoText;
      if (titleInput) titleInput.value = config.pageTitle || defaults.pageTitle;
      if (centerInput) centerInput.value = config.aiLabel || defaults.aiLabel;
      if (showTitleInput) showTitleInput.checked = config.showTitle !== false;
    }

    function setToolsOpen(isOpen, shouldSave) {
      panel.classList.toggle("open", isOpen);
      toggle.classList.toggle("active", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      if (shouldSave) localStorage.setItem(toolsOpenKey, String(isOpen));
    }

    function readConfig() {
      try {
        return JSON.parse(localStorage.getItem(storageKey) || "{}");
      } catch (error) {
        return {};
      }
    }

    function setStatus(message) {
      if (status) status.textContent = message;
    }
  }
})();
