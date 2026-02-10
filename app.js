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
      brand: "Platform777",
      nav_home: "Home",
      nav_ads: "Deals",
      nav_lang: "Language",
      nav_login: "Login",

      hero_title: "Technology That Protects Life",
      hero_subtitle: "Send a single image to your child to help protect them from school bullying. 24/7 real-time location tracking, synchronized messages, audio and video. In emergencies, you can remotely activate the phone camera and voice transmission with one tap.",
      hero_primary: "Login",
      hero_secondary: "View",
      hero_hint: "Platform777",

      ads_title: "Invisible Protection",
      ads_desc: "You can place promotional information here (or link to a specific scene).",
      ads_cta: "Enter Scene →",

      overlay_title: "Remote Invisible Protection – Contactless Access to All Phone Apps, Camera, Voice & Location",
      overlay_sub: "Scroll to Explore",
      overlay_cta: "Contact",

      slide_kicker: "Platform777",
      s1_title: "Real-Time Location",
      s1_text: "Remotely activate the camera and enable real-time voice calls.",
      s2_title: "Sense of Presence",
      s2_text: ".",
      s3_title: ".",
      s3_text: ".",
      s4_title: "Details Define Success",
      s4_text: "..",
      s5_title: ".",
      s5_text: "Order now to enjoy referral discounts.",

      login_title: "7×24 All-Day Service",
      login_desc: ". Trusted by over 100 detective agencies worldwide.",
      login_btn: "Open Login",

      footer_brand: "Platform777",
      footer_desc: "7×24 all-day service. A professional technical team to solve your worries.",
      footer_about: "About",
      footer_home: "Home",
      footer_ads: "Deals",
      footer_login: "Login",
      footer_legal: "Legal",
      footer_privacy: "Privacy",
      footer_terms: "Terms",
      footer_contact: "Contact",
      footer_note: "The button on the right redirects to Telegram.",
      footer_copyright: "All rights reserved."
    },
    zh: {
      brand: "Platform777",
      nav_home: "主页",
      nav_ads: "折扣",
      nav_lang: "语言",
      nav_login: "登录",

      hero_title: "科技保障生活",
      hero_subtitle: "给孩子发送一张图片，保障Ta不会被同学霸凌。24小时实时定位，同步信息影音，紧急情况可以一键打开手机摄像头和语音传输功能.",
      hero_primary: "登录",
      hero_secondary: "查看",
      hero_hint: "Platform777",

      ads_title: "隐秘守护",
      ads_desc: "真正的关心是在背后默默支持。",
      ads_cta: "7*24小时一对一客服→",

      overlay_title: "远程隐蔽守护-无接触式打开手机所有APP-摄像头-语音-定位",
      overlay_sub: "滚动探索",
      overlay_cta: "联系",

      slide_kicker: "Platform777",
      s1_title: "实时定位",
      s1_text: "远程开启摄像头，实时语音通话。",
      s2_title: "呼吸感",
      s2_text: "。",
      s3_title: "。",
      s3_text: "。",
      s4_title: "细节决定成败",
      s4_text: "。。",
      s5_title: "。",
      s5_text: "现在下单享受老带新优惠。",

      login_title: "7*24 一对一客服 全天候服务",
      login_desc: "。国内外一百多家侦探社的选择。",
      login_btn: "打开登录",

      footer_brand: "Platform777",
      footer_desc: "7*24 全天候服务。专业技术团队解决你后顾之忧。",
      footer_about: "关于",
      footer_home: "主页",
      footer_ads: "折扣",
      footer_login: "登录",
      footer_legal: "法律",
      footer_privacy: "隐私",
      footer_terms: "条款",
      footer_contact: "联系",
      footer_note: "右侧按钮跳转到 Telegram。",
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
