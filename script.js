(() => {
  const menuButton = document.querySelector(".mobile-menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const setMenuOpen = (open) => {
    if (!menuButton || !mainNav) return;
    mainNav.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    const label = menuButton.querySelector(".menu-toggle-label");
    if (label) label.textContent = open ? "Close" : "Menu";
  };
  menuButton?.addEventListener("click", () => setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true"));
  mainNav?.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener("click", () => setMenuOpen(false)));
  document.addEventListener("keydown", event => { if (event.key === "Escape") { setMenuOpen(false); menuButton?.focus(); } });
  document.addEventListener("pointerdown", event => { if (mainNav?.classList.contains("is-open") && !mainNav.contains(event.target) && !menuButton?.contains(event.target)) setMenuOpen(false); });
  window.matchMedia("(min-width: 761px)").addEventListener("change", event => { if (event.matches) setMenuOpen(false); });
  const themeButton = document.querySelector(".theme-toggle");
  const themeLabel = themeButton?.querySelector(".theme-label");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  let storedTheme = null;
  try { storedTheme = localStorage.getItem("ankit-portfolio-theme"); } catch {}
  const preferredTheme = storedTheme === "dark" || storedTheme === "light"
    ? storedTheme : (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  const setTheme = (theme) => {
    const light = theme === "light";
    document.documentElement.dataset.theme = theme;
    themeButton?.setAttribute("aria-pressed", String(light));
    themeButton?.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
    if (themeLabel) themeLabel.textContent = light ? "Dark mode" : "Light mode";
    themeMeta?.setAttribute("content", light ? "#FFFFFF" : "#0A0A0B");
  };
  setTheme(preferredTheme);
  themeButton?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    setTheme(next);
    try { localStorage.setItem("ankit-portfolio-theme", next); } catch {}
  });
  document.querySelectorAll(".review-lane").forEach((lane) => {
    lane.addEventListener("pointerdown", () => lane.classList.add("is-paused"));
    lane.addEventListener("pointerup", () => lane.classList.remove("is-paused"));
    lane.addEventListener("pointercancel", () => lane.classList.remove("is-paused"));
    lane.addEventListener("pointerleave", () => lane.classList.remove("is-paused"));
  });
  const revealItems = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          activeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Animate metrics once they become visible; preserve final values for reduced motion.
  const counters = [...document.querySelectorAll(".counter[data-target]")];
  const animateCounter = (el) => {
    if (el.dataset.counted === "true") return;
    el.dataset.counted = "true";
    const target = Number(el.dataset.target);
    const decimals = Number(el.dataset.decimals || 0);
    if (reduceMotion) { el.textContent = target.toFixed(decimals); return; }
    const duration = 1500;
    let start = null;
    const tick = (timestamp) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    counters.forEach(el => counterObserver.observe(el));
  } else counters.forEach(animateCounter);

  const workFigures = document.querySelectorAll(".work-grid .video-figure");
  workFigures.forEach((figure) => {
    const video = figure.querySelector("video");
    const button = figure.querySelector(".video-toggle");
    const frame = figure.querySelector(".video-frame");
    if (!video || !button) return;

    const setState = (playing) => {
      frame.classList.toggle("is-playing", playing);
      button.setAttribute("aria-pressed", String(playing));
      button.setAttribute("aria-label", playing ? "Pause sample reel" : "Play sample reel");
    };

    const togglePlayback = async () => {
      if (video.paused) {
        try {
          await video.play();
          setState(true);
        } catch {
          setState(false);
        }
      } else {
        video.pause();
        setState(false);
      }
    };

    button.addEventListener("click", togglePlayback);
    video.addEventListener("play", () => setState(true));
    video.addEventListener("pause", () => setState(false));
    video.addEventListener("ended", () => setState(false));

    // Desktop hover playback is an enhancement. The visible button remains available.
    figure.addEventListener("pointerenter", () => {
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && video.paused) {
        video.play().then(() => setState(true)).catch(() => {});
      }
    });
    figure.addEventListener("pointerleave", () => {
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !video.paused) {
        video.pause();
        setState(false);
      }
    });
  });
})();

// Muted, single-at-a-time hover previews for all three Cloudinary reels.
(() => {
 const frames = [...document.querySelectorAll('.has-cloudinary-preview')];
 const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
 const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
 const stop = frame => {
  const video = frame.querySelector('.cloudinary-hover-video');
  if (!video) return;
  video.pause();
  try { video.currentTime = 0; } catch (_) {}
  frame.classList.remove('preview-active');
 };
 frames.forEach(frame => {
  const video = frame.querySelector('.cloudinary-hover-video');
  if (!video) return;
  frame.addEventListener('pointerenter', async () => {
   if (!hover.matches || reducedMotion.matches) return;
   frames.filter(other => other !== frame).forEach(stop);
   video.muted = true;
   try {
    await video.play();
    if (frame.matches(':hover') && !document.hidden) frame.classList.add('preview-active');
    else stop(frame);
   } catch (_) { stop(frame); }
  });
  frame.addEventListener('pointerleave', () => stop(frame));
  frame.addEventListener('focusout', event => { if (!frame.contains(event.relatedTarget)) stop(frame); });
  frame.querySelector('.reel-play')?.addEventListener('click', () => stop(frame));
 });
 document.addEventListener('visibilitychange', () => { if (document.hidden) frames.forEach(stop); });
 if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
   if (!entry.isIntersecting) stop(entry.target);
  }), {threshold: 0.1});
  frames.forEach(frame => observer.observe(frame));
 }
})();

// Load a YouTube Shorts player only after a visitor asks to watch.
(() => {
 const modal=document.getElementById('reel-modal');
 if(!modal)return;
 const viewport=document.getElementById('reel-modal-video');
 const link=document.getElementById('reel-modal-link');
 let opener=null;
 const close=()=>{modal.hidden=true;viewport.replaceChildren();document.body.classList.remove('reel-modal-open');opener?.focus();};
 document.querySelectorAll('.reel-play').forEach(button=>button.addEventListener('click',()=>{
  const cloudinaryUrl=button.dataset.cloudinary;
  if (cloudinaryUrl) {
   opener=button;
   const video=document.createElement('video');
   video.src=cloudinaryUrl;
   video.controls=true;
   video.autoplay=true;
   video.playsInline=true;
   video.setAttribute('aria-label','Selected work reel video');
   viewport.replaceChildren(video);
   link.href=`https://www.youtube.com/shorts/${button.dataset.reel}`;
   modal.hidden=false;
   document.body.classList.add('reel-modal-open');
   video.play().catch(()=>{});
   modal.querySelector('.reel-modal-close').focus();
   return;
  }
  const code=button.dataset.reel;
  if(!/^[A-Za-z0-9_-]+$/.test(code))return;
  opener=button;
  const url=`https://www.youtube.com/shorts/${code}`;
  // Local file:// pages cannot reliably provide YouTube's required origin.
  // Open the video directly rather than displaying a broken embedded player.
  if(window.location.protocol==='file:'){window.open(url,'_blank','noopener,noreferrer');return;}
  const iframe=document.createElement('iframe');
  iframe.src=`https://www.youtube.com/embed/${code}?autoplay=1&rel=0&playsinline=1`;
  iframe.title='YouTube Short by @ankitcode99';
  iframe.allow='autoplay; encrypted-media; picture-in-picture';
  iframe.referrerPolicy='strict-origin-when-cross-origin';
  viewport.replaceChildren(iframe);
  link.href=url;
  modal.hidden=false;
  document.body.classList.add('reel-modal-open');
  modal.querySelector('.reel-modal-close').focus();
 }));
 modal.querySelectorAll('[data-close-reel]').forEach(button=>button.addEventListener('click',close));
 document.addEventListener('keydown',event=>{if(!modal.hidden&&event.key==='Escape')close();});
})();
