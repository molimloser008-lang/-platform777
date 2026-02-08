(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---- 1) Background image binding (from data-bg -> CSS var) ----
  function bindBackgrounds() {
    const nodes = $$(".hero, .slide");
    nodes.forEach(el => {
      const bg = el.getAttribute("data-bg");
      if (bg) el.style.setProperty("--bgimg", `url("${bg}")`);
    });
  }

  // ---- 2) Language i18n ----
  const I18N = {
    en: {
      brand: "BRAND",
      nav_home: "Home",
      nav_ads: "Ads",
      nav_lang: "Language",
      nav_login: "Login",

      hero_title: "A Quiet Luxury Story",
      hero_subtitle: "Immersive slides. Precise typography. More breathing room on the right.",
      hero_primary: "Enter",
      hero_secondary: "View Ads",
      hero_hint: "Scroll",

      ads_title: "Ads",
      ads_desc: "Put your campaign highlights here (or jump to a specific slide).",
      ads_cta: "Go to Slides →",

      overlay_title: "Explore",
      overlay_sub: "Scroll to discover",
      overlay_cta: "Contact",

      slide_kicker: "Collection",
      s1_title: "The First Frame",
      s1_text: "Your image tells the story. Text stays calm.",
      s2_title: "Breathing Space",
      s2_text: "Right-side whitespace makes everything feel expensive.",
      s3_title: "One Scroll, One Scene",
      s3_text: "Scroll-snap gives that immersive “slide” feeling.",
      s4_title: "Details Matter",
      s4_text: "Keep motion subtle: fade + slight lift.",
      s5_title: "Ready for Your Images",
      s5_text: "Duplicate/remove slides to make 3–8 screens.",

      login_title: "Login",
      login_desc: "Placeholder area for your login modal/page.",
      login_btn: "Open Login",

      footer_brand: "BRAND",
      footer_desc: "A clean, immersive slide experience. Replace images and copy.",
      footer_about: "About",
      footer_home: "Home",
      footer_ads: "Ads",
      footer_login: "Login",
      footer_legal: "Legal",
      footer_privacy: "Privacy",
      footer_terms: "Terms",
      footer_contact: "Contact",
      footer_note: "Buttons on the right go to WhatsApp/Telegram.",
      footer_copyright: "All rights reserved."
    },
    zh: {
      brand: "品牌",
      nav_home: "主页",
      nav_ads: "广告",
      nav_lang: "语言",
      nav_login: "登录",

      hero_title: "沉浸式高级感",
      hero_subtitle: "幻灯片式分镜 + 精准排版 + 右侧更多留白。",
      hero_primary: "进入",
      hero_secondary: "查看广告",
      hero_hint: "滚动",

      ads_title: "广告",
      ads_desc: "你可以在这里放活动信息（或跳转到指定分镜）。",
      ads_cta: "进入分镜 →",

      overlay_title: "浏览",
      overlay_sub: "滚动探索",
      overlay_cta: "联系",

      slide_kicker: "系列",
      s1_title: "第一幕",
      s1_text: "图像讲故事，文字保持克制。",
      s2_title: "呼吸感",
      s2_text: "右侧留白会让页面更“贵”。",
      s3_title: "一滚一幕",
      s3_text: "Scroll-snap 带来幻灯片式沉浸感。",
      s4_title: "细节决定质感",
      s4_text: "动效克制：淡入 + 轻微上移。",
      s5_title: "等你换图",
      s5_text: "复制/删除分镜即可变成 3–8 屏。",

      login_title: "登录",
      login_desc: "这里预留给你的登录弹窗/页面。",
      login_btn: "打开登录",

      footer_brand: "品牌",
      footer_desc: "干净的沉浸式分镜体验：换图、改文案即可上线。",
      footer_about: "关于",
      footer_home: "主页",
      footer_ads: "广告",
      footer_login: "登录",
      footer_legal: "法律",
      footer_privacy: "隐私",
      footer_terms: "条款",
      footer_contact: "联系",
      footer_note: "右侧按钮跳转到 WhatsApp / Telegram。",
      footer_copyright: "保留所有权利。"
    }
  };

  function getLang() {
    const saved = localStorage.getItem("lang");
    return (saved === "zh" || saved === "en") ? saved : "en";
  }

  function setLang(lang) {
    if (!I18N[lang]) return;
    localStorage.setItem("lang", lang);

    // update html lang attr
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

    // update all i18n nodes
    $$("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (key && I18N[lang][key] != null) el.textContent = I18N[lang][key];
    });

    // update pill + aria-selected
    const pill = $("#langPill");
    if (pill) pill.textContent = lang.toUpperCase();

    $$(".lang-item").forEach(btn => {
      const isSel = btn.getAttribute("data-lang") === lang;
      btn.setAttribute("aria-selected", isSel ? "true" : "false");
    });

    // update overlaySub from active slide if any
    updateOverlaySubFromActiveSlide();
  }

  // ---- 3) Header menu behaviors ----
  function setupLanguageMenu() {
    const btn = $("#langBtn");
    const menu = $("#langMenu");
    if (!btn || !menu) return;

    const close = () => {
      menu.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    };
    const open = () => {
      menu.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    };

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.contains("open");
      isOpen ? close() : open();
    });

    menu.addEventListener("click", (e) => {
      const target = e.target.closest("[data-lang]");
      if (!target) return;
      const lang = target.getAttribute("data-lang");
      setLang(lang);
      close();
    });

    document.addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  function setupMobileMenu() {
    const ham = $("#hamburger");
    const mm = $("#mobileMenu");
    if (!ham || !mm) return;

    const toggle = () => {
      const open = mm.classList.toggle("open");
      ham.setAttribute("aria-expanded", open ? "true" : "false");
      mm.setAttribute("aria-hidden", open ? "false" : "true");
    };

    ham.addEventListener("click", (e) => {
      e.stopPropagation();
      toggle();
    });

    // mobile lang buttons
    $$(".mobile-lang-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang");
        setLang(lang);
      });
    });

    // close on link click
    $$(".mobile-link", mm).forEach(a => {
      a.addEventListener("click", () => {
        mm.classList.remove("open");
        ham.setAttribute("aria-expanded", "false");
        mm.setAttribute("aria-hidden", "true");
      });
    });

    document.addEventListener("click", () => {
      mm.classList.remove("open");
      ham.setAttribute("aria-expanded", "false");
      mm.setAttribute("aria-hidden", "true");
    });
  }

  // ---- 4) Sticky overlay show/hide rule ----
  // Requirement: “主标题以下就显示 ... 永远在网页中间偏底部”
  // Implementation: when hero title has moved up enough (user starts scrolling), show overlay.
  function setupOverlayVisibility() {
    const overlay = $("#stickyOverlay");
    const hero = $("#hero");
    const heroTitle = $(".hero-title");
    if (!overlay || !hero || !heroTitle) return;

    const io = new IntersectionObserver((entries) => {
      // If hero title still largely visible -> hide overlay; otherwise show
      // threshold 0.55 means: once title area less than ~55% visible, we show overlay
      const entry = entries[0];
      if (!entry) return;
      if (entry.intersectionRatio > 0.55) overlay.classList.remove("show");
      else overlay.classList.add("show");
    }, { threshold: [0, 0.25, 0.55, 0.8, 1] });

    io.observe(heroTitle);

    // CTA button action (you can change to open modal, etc.)
    const cta = $("#ctaBtn");
    if (cta) {
      cta.addEventListener("click", () => {
        // default: jump to login section
        const login = $("#login");
        if (login) login.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  // ---- 5) Slides: active detection + progress + overlay sub text ----
  function pad2(n) {
    const s = String(n);
    return s.length >= 2 ? s : "0" + s;
  }

  function updateOverlaySubFromActiveSlide() {
    const lang = getLang();
    const overlaySub = $("#overlaySub");
    if (!overlaySub) return;

    const active = $(".slide.is-active");
    if (!active) {
      // fallback copy (already i18n via data-i18n)
      return;
    }

    const key = lang === "zh" ? "data-overlay-sub-zh" : "data-overlay-sub-en";
    const txt = active.getAttribute(key);
    if (txt) overlaySub.textContent = txt;
  }

  function setupSlides() {
    const slides = $$(".slide");
    const container = $("#slidesContainer");
    const idxEl = $("#slideIndex");
    const totalEl = $("#slideTotal");
    if (!slides.length || !container || !idxEl || !totalEl) return;

    totalEl.textContent = pad2(slides.length);

    // Mark first active initially
    slides.forEach(s => s.classList.remove("is-active"));
    slides[0].classList.add("is-active");
    idxEl.textContent = pad2(1);
    updateOverlaySubFromActiveSlide();

    // Use IntersectionObserver within slides container to detect active slide
    const io = new IntersectionObserver((entries) => {
      // pick the entry with highest intersection ratio
      let best = null;
      for (const e of entries) {
        if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
      }
      if (!best || best.intersectionRatio < 0.55) return;

      const el = best.target;
      const i = slides.indexOf(el);
      if (i === -1) return;

      slides.forEach(s => s.classList.remove("is-active"));
      el.classList.add("is-active");
      idxEl.textContent = pad2(i + 1);
      updateOverlaySubFromActiveSlide();
    }, {
      root: $(".slides"),
      threshold: [0.25, 0.55, 0.75, 0.9]
    });

    slides.forEach(s => io.observe(s));
  }

  // ---- 6) Set year ----
  function setYear() {
    const y = $("#year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  // ---- 7) Smooth anchor scroll for normal anchors ----
  function setupAnchorSmoothScroll() {
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;

      const href = a.getAttribute("href");
      if (!href || href === "#!") return;

      const target = document.querySelector(href);
      if (!target) return;

      // let browser handle top-level jump if user uses special keys
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // ---- Init ----
  bindBackgrounds();
  setYear();
  setupLanguageMenu();
  setupMobileMenu();
  setupOverlayVisibility();
  setupSlides();
  setupAnchorSmoothScroll();

  // default language EN unless saved
  setLang(getLang());
})();
