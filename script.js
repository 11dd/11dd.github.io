const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navAnchors = Array.from(document.querySelectorAll(".nav-links a"));
const sections = navAnchors
  .map((anchor) => {
    const href = anchor.getAttribute("href") || "";
    if (!href.startsWith("#")) return null;
    return document.querySelector(href);
  })
  .filter(Boolean);

navToggle?.addEventListener("click", () => {
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!expanded));
  navLinks?.classList.toggle("open");
});

navAnchors.forEach((anchor) => {
  anchor.addEventListener("click", () => {
    navLinks?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach((anchor) => {
        anchor.classList.toggle("active", anchor.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0,
  }
);

sections.forEach((section) => observer.observe(section));

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll(".filter-button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    document.querySelectorAll(".defect-card").forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const panel = trigger.nextElementSibling;
    const isOpen = trigger.classList.contains("active");

    document.querySelectorAll(".accordion-trigger").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".accordion-panel").forEach((item) => item.classList.remove("open"));

    if (!isOpen) {
      trigger.classList.add("active");
      panel?.classList.add("open");
    }
  });
});

document.querySelectorAll(".param-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".param-tab").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".param-panel").forEach((item) => item.classList.remove("active"));

    tab.classList.add("active");
    document.querySelector(`[data-panel="${tab.dataset.param}"]`)?.classList.add("active");
  });
});

(function () {
  const storageKey = "vi-theme";
  const root = document.documentElement;
  const btn = document.getElementById("theme-toggle");
  const label = btn?.querySelector(".theme-toggle-label");

  function applyTheme(theme) {
    if (theme === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
    try {
      localStorage.setItem(storageKey, theme === "light" ? "light" : "dark");
    } catch (_) {}

    if (btn && label) {
      if (theme === "light") {
        btn.setAttribute("aria-label", "切换为黑夜模式");
        label.textContent = "黑夜";
      } else {
        btn.setAttribute("aria-label", "切换为白天模式");
        label.textContent = "白天";
      }
    }
  }

  applyTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark");

  btn?.addEventListener("click", () => {
    applyTheme(root.getAttribute("data-theme") === "light" ? "dark" : "light");
  });
})();

/** 窄屏与顶栏「菜单」同布局时强制收起主题按钮（避免 z-index 盖住菜单） */
(function () {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  const mq = window.matchMedia("(max-width: 1180px)");
  function syncCompactNavChrome() {
    if (mq.matches) {
      btn.style.setProperty("display", "none", "important");
      btn.style.setProperty("visibility", "hidden", "important");
      btn.style.setProperty("pointer-events", "none", "important");
      btn.setAttribute("aria-hidden", "true");
      btn.setAttribute("tabindex", "-1");
    } else {
      btn.style.removeProperty("display");
      btn.style.removeProperty("visibility");
      btn.style.removeProperty("pointer-events");
      btn.removeAttribute("aria-hidden");
      btn.removeAttribute("tabindex");
    }
  }
  mq.addEventListener("change", syncCompactNavChrome);
  syncCompactNavChrome();
})();
