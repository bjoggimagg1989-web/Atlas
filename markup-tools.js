(function () {
  const ns = "atlasinn.v3.admin.";
  const storageKey = ns + "markup.shapes";
  const panelKey = ns + "markup.panelOpen";
  const layoutKey = ns + "markup.layout";

  document.addEventListener("DOMContentLoaded", initMarkup);

  function initMarkup() {
    const layer = document.querySelector("[data-markup-layer]");
    const toggle = document.querySelector("[data-markup-tool]");
    const panel = document.querySelector("[data-markup-panel]");
    const exportPanel = document.querySelector("[data-markup-export-panel]");
    if (!layer || !toggle || !panel) return;

    let selected = null;
    let drag = null;
    let layoutMode = localStorage.getItem(layoutKey) || "current";

    renderShapes(readShapes());
    setMarkupOpen(localStorage.getItem(panelKey) === "true", false);
    setLayoutMode(layoutMode, false);

    toggle.addEventListener("click", function () {
      setMarkupOpen(!panel.classList.contains("open"), true);
    });

    panel.querySelector("[data-markup-close]").addEventListener("click", function () {
      setMarkupOpen(false, true);
    });

    panel.querySelectorAll("[data-markup-add]").forEach(function (button) {
      button.addEventListener("click", function () {
        addShape(button.dataset.markupAdd || "box");
      });
    });

    panel.querySelectorAll("[data-markup-layout]").forEach(function (button) {
      button.addEventListener("click", function () {
        setLayoutMode(button.dataset.markupLayout || "current", true);
      });
    });

    panel.querySelector("[data-markup-clear]").addEventListener("click", function () {
      layer.innerHTML = "";
      selected = null;
      saveShapes();
      setStatus("Cleared markup.");
    });

    panel.querySelector("[data-markup-copy]").addEventListener("click", async function () {
      const payload = JSON.stringify(markupPayload(), null, 2);
      try {
        await navigator.clipboard.writeText(payload);
        setStatus("Markup JSON copied.");
      } catch (error) {
        openExport(payload);
      }
    });

    panel.querySelector("[data-markup-export]").addEventListener("click", function () {
      openExport(JSON.stringify(markupPayload(), null, 2));
    });

    if (exportPanel) {
      exportPanel.querySelector("[data-markup-export-close]").addEventListener("click", function () {
        exportPanel.classList.remove("open");
      });
      exportPanel.querySelector("[data-markup-select-export]").addEventListener("click", function () {
        const textarea = exportPanel.querySelector("[data-markup-export-text]");
        textarea.focus();
        textarea.select();
      });
    }

    function addShape(type) {
      const shape = {
        id: "shape-" + Date.now(),
        type: type,
        x: 72,
        y: 190,
        w: type === "text" ? 148 : 92,
        h: type === "arrow" ? 0 : type === "text" ? 46 : 92,
        text: type === "text" ? "NOTE" : ""
      };
      const shapes = readShapes();
      shapes.push(shape);
      saveShapeList(shapes);
      renderShapes(shapes);
      setStatus("Added " + type + ".");
    }

    function renderShapes(shapes) {
      layer.innerHTML = "";
      shapes.forEach(function (shape) {
        const node = document.createElement("div");
        node.className = "markup-shape " + shape.type;
        node.dataset.markupId = shape.id;
        node.style.left = shape.x + "px";
        node.style.top = shape.y + "px";
        node.style.width = shape.w + "px";
        if (shape.h) node.style.height = shape.h + "px";
        if (shape.type === "text") {
          node.contentEditable = "true";
          node.textContent = shape.text || "NOTE";
          node.addEventListener("input", saveShapes);
        }
        node.addEventListener("pointerdown", startDrag);
        layer.appendChild(node);
      });
    }

    function startDrag(event) {
      selected = event.currentTarget;
      layer.querySelectorAll(".markup-shape").forEach(function (node) {
        node.classList.toggle("selected", node === selected);
      });
      drag = {
        id: selected.dataset.markupId,
        startX: event.clientX,
        startY: event.clientY,
        left: parseFloat(selected.style.left) || 0,
        top: parseFloat(selected.style.top) || 0
      };
      selected.setPointerCapture(event.pointerId);
      selected.addEventListener("pointermove", moveShape);
      selected.addEventListener("pointerup", endDrag, { once: true });
    }

    function moveShape(event) {
      if (!drag || !selected) return;
      selected.style.left = Math.round(drag.left + event.clientX - drag.startX) + "px";
      selected.style.top = Math.round(drag.top + event.clientY - drag.startY) + "px";
    }

    function endDrag() {
      if (!selected) return;
      selected.removeEventListener("pointermove", moveShape);
      drag = null;
      saveShapes();
    }

    function saveShapes() {
      const shapes = Array.from(layer.querySelectorAll(".markup-shape")).map(function (node) {
        return {
          id: node.dataset.markupId,
          type: shapeType(node),
          x: Math.round(parseFloat(node.style.left) || 0),
          y: Math.round(parseFloat(node.style.top) || 0),
          w: Math.round(node.offsetWidth),
          h: Math.round(node.offsetHeight),
          text: node.classList.contains("text") ? node.textContent : ""
        };
      });
      saveShapeList(shapes);
    }

    function shapeType(node) {
      if (node.classList.contains("circle")) return "circle";
      if (node.classList.contains("arrow")) return "arrow";
      if (node.classList.contains("text")) return "text";
      return "box";
    }

    function readShapes() {
      try {
        return JSON.parse(localStorage.getItem(storageKey) || "[]");
      } catch (error) {
        return [];
      }
    }

    function saveShapeList(shapes) {
      localStorage.setItem(storageKey, JSON.stringify(shapes));
    }

    function setMarkupOpen(isOpen, shouldSave) {
      document.body.classList.toggle("markup-active", isOpen);
      panel.classList.toggle("open", isOpen);
      toggle.classList.toggle("active", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      if (shouldSave) localStorage.setItem(panelKey, String(isOpen));
    }

    function setLayoutMode(nextMode, shouldSave) {
      layoutMode = nextMode;
      document.body.classList.toggle("markup-blank-layout", layoutMode === "blank");
      panel.querySelectorAll("[data-markup-layout]").forEach(function (button) {
        button.classList.toggle("active", button.dataset.markupLayout === layoutMode);
      });
      if (shouldSave) localStorage.setItem(layoutKey, layoutMode);
    }

    function markupPayload() {
      return {
        page: window.location.pathname.split("/").pop() || "index.html",
        url: window.location.href,
        layoutMode: layoutMode,
        shapes: readShapes()
      };
    }

    function openExport(value) {
      if (!exportPanel) return;
      const textarea = exportPanel.querySelector("[data-markup-export-text]");
      textarea.value = value;
      exportPanel.classList.add("open");
      textarea.focus();
      textarea.select();
    }

    function setStatus(message) {
      const status = panel.querySelector("[data-markup-status]");
      if (status) status.textContent = message;
    }
  }
})();
