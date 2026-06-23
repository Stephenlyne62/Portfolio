// about.js
// About page tabs: syncs ARIA state, toggles panels, and supports keyboard navigation.

const tabs = document.querySelectorAll(".about-tab");
const panels = document.querySelectorAll(".about-panel");

// Activates a tab by its controlled panel id and applies roving tabindex.
function activateTab(targetPanelId) {
  panels.forEach((panel) => {
    panel.hidden = panel.id !== targetPanelId;
  });

  tabs.forEach((tab) => {
    const active = tab.getAttribute("aria-controls") === targetPanelId;
    tab.setAttribute("aria-selected", String(active));
    tab.classList.toggle("is-active", active);
    tab.tabIndex = active ? 0 : -1; // only the active tab is tabbable
  });
}

function focusAndActivate(index) {
  const tab = tabs[index];
  if (!tab) return;
  activateTab(tab.getAttribute("aria-controls"));
  tab.focus();
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => focusAndActivate(index));

  tab.addEventListener("keydown", (e) => {
    const { key } = e;

    if (key === "ArrowRight") {
      e.preventDefault();
      focusAndActivate((index + 1) % tabs.length);
    } else if (key === "ArrowLeft") {
      e.preventDefault();
      focusAndActivate((index - 1 + tabs.length) % tabs.length);
    } else if (key === "Home") {
      e.preventDefault();
      focusAndActivate(0);
    } else if (key === "End") {
      e.preventDefault();
      focusAndActivate(tabs.length - 1);
    } else if (key === "Enter" || key === " ") {
      e.preventDefault(); // prevents page scroll on Space
      activateTab(tab.getAttribute("aria-controls"));
    }
  });
});

// Start from the tab marked selected in the HTML (fallback to the first tab).
const initialTab =
  document.querySelector('.about-tab[aria-selected="true"]') || tabs[0];

if (initialTab) activateTab(initialTab.getAttribute("aria-controls"));
