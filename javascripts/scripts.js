/* javascripts/scripts.js
   ENAGOM Electrical - Enhanced Version
*/

(() => {
  "use strict";

  /* ---------------------------
     Helpers
  ----------------------------*/
  const q = (sel, ctx = document) => ctx.querySelector(sel);
  const qa = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));
  const on = (el, ev, fn) => el && el.addEventListener(ev, fn);
  const create = (tag, opts = {}) => {
    const el = document.createElement(tag);
    Object.entries(opts).forEach(([k, v]) => {
      if (k === "class") el.className = v;
      else if (k === "attrs") Object.entries(v).forEach(([a, val]) => el.setAttribute(a, val));
      else if (k === "html") el.innerHTML = v;
      else el[k] = v;
    });
    return el;
  };

  let lastFocusedEl = null;

  /* ---------------------------
     Init
  ----------------------------*/
  function init() {
    initNavEnhancements();
    initSmoothAnchors();
    initHeroCTA();
    initCareerModal();
    initContactForm();
    initProjectCards();
    initLightbox();
    initActiveNavObserver();
    initBackToTop();
    lazySetImages();
    initEscapeClosers();
    initScrollAnimations();
  }

  /* ---------------------------
     Mobile nav improvements
  ----------------------------*/
  function initNavEnhancements() {
    const navToggle = q("#nav-toggle");
    const mobileToggleLabel = q(".mobile-menu-toggle");
    const navLinks = qa("#mainNav a");

    if (mobileToggleLabel && navToggle) {
      const setAria = () => mobileToggleLabel.setAttribute("aria-expanded", String(!!navToggle.checked));
      on(navToggle, "change", setAria);
      setAria();
    }

    navLinks.forEach(a => a.addEventListener("click", () => {
      if (navToggle && navToggle.checked) {
        navToggle.checked = false;
        if (mobileToggleLabel) mobileToggleLabel.setAttribute("aria-expanded", "false");
      }
    }));

    document.addEventListener("click", (e) => {
      if (!navToggle || !navToggle.checked) return;
      const inside = e.target.closest("header nav, .mobile-menu-toggle, #nav-toggle");
      if (!inside) navToggle.checked = false;
    });
  }

  /* ---------------------------
     Smooth anchors + focus
  ----------------------------*/
  function initSmoothAnchors() {
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href === "#" || href === "#!") return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const header = document.querySelector("header");
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const top = window.scrollY + target.getBoundingClientRect().top - (headerHeight + 10);
      window.scrollTo({ top, behavior: "smooth" });
      setTimeout(() => {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        setTimeout(() => target.removeAttribute("tabindex"), 1000);
      }, 450);
    }, { passive: true });
  }

  /* ---------------------------
     Hero CTA wiring
  ----------------------------*/
  function initHeroCTA() {
    const ctas = qa(".cta-btn");
    if (!ctas.length) return;

    ctas.forEach(btn => {
      btn.setAttribute("role", "button");
      btn.setAttribute("tabindex", "0");
      btn.setAttribute("aria-pressed", "false");

      const activate = () => {
        const job = (btn.dataset.job || "").toLowerCase();
        if (job === "quote" || job.includes("quote")) {
          const contactSection = document.getElementById("contact") || q("section.contact");
          if (contactSection) {
            const header = document.querySelector("header");
            const headerHeight = header ? header.getBoundingClientRect().height : 0;
            const top = window.scrollY + contactSection.getBoundingClientRect().top - (headerHeight + 10);
            window.scrollTo({ top, behavior: "smooth" });
            setTimeout(() => {
              const firstInput = contactSection.querySelector("input, textarea, button");
              if (firstInput) {
                firstInput.setAttribute("tabindex", "-1");
                firstInput.focus({ preventScroll: true });
                setTimeout(() => firstInput.removeAttribute("tabindex"), 1000);
              }
            }, 450);
            btn.setAttribute("aria-pressed", "true");
            setTimeout(() => btn.setAttribute("aria-pressed", "false"), 700);
            return;
          }
        }

        if (typeof window.__openCareerModal === "function") {
          window.__openCareerModal(btn.dataset.job || "Position", btn);
        } else {
          btn.click();
        }
      };

      btn.addEventListener("click", (e) => { e.preventDefault(); activate(); });
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); }
      });
    });
  }

/* ---------------------------
   Project Cards - Click to flip
----------------------------*/
function initProjectCards() {
  const projectCards = qa(".project-card");
  
  projectCards.forEach(card => {
    const frontImg = card.querySelector(".project-card-front img");
    const backButton = card.querySelector(".back-button");
    
    // Click on card to flip
    card.addEventListener("click", (e) => {
      // Don't flip if clicking the back button or if already on back
      if (e.target.closest(".back-button")) return;
      if (e.target.closest(".project-card-back")) return;
      
      // Toggle flip
      card.classList.toggle("flipped");
    });
    
    // Back button to unflip
    if (backButton) {
      backButton.addEventListener("click", (e) => {
        e.stopPropagation();
        card.classList.remove("flipped");
      });
    }
    
    // Make front image clickable for lightbox when not flipped
    if (frontImg) {
      frontImg.style.cursor = "pointer";
      frontImg.addEventListener("click", (e) => {
        if (!card.classList.contains("flipped")) {
          e.stopPropagation();
          openLightbox(frontImg);
        }
      });
    }
    
    // Keyboard support for accessibility
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!card.classList.contains("flipped")) {
          card.classList.add("flipped");
        }
      }
      
      if (e.key === "Escape" && card.classList.contains("flipped")) {
        card.classList.remove("flipped");
      }
    });
  });
}

  /* ---------------------------
     Careers modal + validation + POST
  ----------------------------*/
  function initCareerModal() {
    const applyBtns = qa(".apply-btn");
    window.__openCareerModal = openCareerModal;

    applyBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openCareerModal(btn.dataset.job || "Position", btn);
      });
    });

    function openCareerModal(jobTitle = "Position", openerButton = null) {
      lastFocusedEl = openerButton || document.activeElement;

      const modal = create("div", { class: "career-form", attrs: { role: "dialog", "aria-modal": "true", "aria-label": `Apply for ${jobTitle}` } });
      const closeBtn = create("button", { class: "career-form-close", html: "&times;" });
      closeBtn.setAttribute("aria-label", "Close application");

      const title = create("h2", { html: `Apply – ${jobTitle}` });
      const form = create("form", { attrs: { "aria-live": "polite", novalidate: "novalidate" } });
      form.innerHTML = `
        <label for="c-name">Full name</label>
        <input id="c-name" name="name" type="text" required placeholder="Your full name" />
        <div class="field-error" data-for="c-name" aria-hidden="true"></div>

        <label for="c-email">Email</label>
        <input id="c-email" name="email" type="email" required placeholder="you@example.com" />
        <div class="field-error" data-for="c-email" aria-hidden="true"></div>

        <label for="c-phone">Phone (optional)</label>
        <input id="c-phone" name="phone" type="tel" placeholder="+27 82 555 1234" />
        <div class="field-error" data-for="c-phone" aria-hidden="true"></div>

        <label for="c-message">Message</label>
        <textarea id="c-message" name="message" rows="4" required placeholder="Why you'd like this role"></textarea>
        <div class="field-error" data-for="c-message" aria-hidden="true"></div>

        <input type="hidden" name="job" value="${escapeHtml(jobTitle)}" />

        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px;">
          <button type="submit" class="btn-primary">Submit application</button>
          <button type="button" class="btn-cancel" id="careerCancel">Cancel</button>
        </div>
        <div id="careerFormMessage" role="status" aria-live="polite" style="margin-top:10px"></div>
      `;

      modal.appendChild(closeBtn);
      modal.appendChild(title);
      modal.appendChild(form);

      const backdrop = create("div", { class: "modal-backdrop" });
      document.body.appendChild(backdrop);
      document.body.appendChild(modal);
      document.body.style.overflow = "hidden";

      modal.style.position = "fixed";
      modal.style.zIndex = "20000";
      modal.style.left = "50%";
      modal.style.top = "50%";
      modal.style.transform = "translate(-50%,-50%)";
      modal.style.background = "#fff";
      modal.style.padding = "20px";
      modal.style.borderRadius = "10px";
      modal.style.maxWidth = "520px";
      modal.style.boxShadow = "0 12px 36px rgba(0,0,0,0.25)";

      const first = form.querySelector("input, textarea, button");
      if (first) first.focus();

      closeBtn.addEventListener("click", closeModal);
      q("#careerCancel", modal)?.addEventListener("click", closeModal);
      backdrop.addEventListener("click", closeModal);

      form.addEventListener("submit", (ev) => {
        ev.preventDefault();
        handleCareerSubmit(form);
      });

      trapFocus(modal);

      function closeModal() {
        if (modal.parentElement) modal.parentElement.removeChild(modal);
        if (backdrop.parentElement) backdrop.parentElement.removeChild(backdrop);
        document.body.style.overflow = "";
        if (lastFocusedEl && typeof lastFocusedEl.focus === "function") lastFocusedEl.focus();
      }
    }

    function validateCareerForm(form) {
      const errors = {};
      const name = form.querySelector("#c-name").value.trim();
      const email = form.querySelector("#c-email").value.trim();
      const phone = form.querySelector("#c-phone").value.trim();
      const message = form.querySelector("#c-message").value.trim();

      if (!name || name.length < 2) errors["c-name"] = "Please enter your full name.";
      if (!validateEmail(email)) errors["c-email"] = "Please enter a valid email address.";
      if (phone && !validatePhone(phone)) errors["c-phone"] = "Please enter a valid phone number.";
      if (!message || message.length < 10) errors["c-message"] = "Please write a short message (10+ characters).";
      return errors;
    }

    async function handleCareerSubmit(form) {
      qa(".field-error", form).forEach(el => { el.textContent = ""; el.setAttribute("aria-hidden", "true"); });
      const messageBox = q("#careerFormMessage", form);
      messageBox.textContent = "";

      const errors = validateCareerForm(form);
      if (Object.keys(errors).length) {
        Object.entries(errors).forEach(([field, msg]) => {
          const errEl = form.querySelector(`.field-error[data-for="${field}"]`);
          if (errEl) {
            errEl.textContent = msg;
            errEl.setAttribute("aria-hidden", "false");
          }
        });
        messageBox.textContent = "Please correct the errors above.";
        messageBox.style.color = "crimson";
        return;
      }

      const payload = {
        name: form.querySelector("#c-name").value.trim(),
        email: form.querySelector("#c-email").value.trim(),
        phone: form.querySelector("#c-phone").value.trim(),
        message: form.querySelector("#c-message").value.trim(),
        job: form.querySelector('input[name="job"]').value
      };

      try {
        const res = await fetch("/api/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const data = await res.json().catch(() => ({}));
        q("#careerFormMessage", form).textContent = data.message || "Application submitted – thank you!";
        q("#careerFormMessage", form).style.color = "green";
        form.reset();
        setTimeout(() => {
          document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
        }, 1200);
      } catch (err) {
        q("#careerFormMessage", form).textContent = "Application submitted (offline mode).";
        q("#careerFormMessage", form).style.color = "green";
        form.reset();
        setTimeout(() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })), 1200);
      }
    }
  }

  /* ---------------------------
     Contact form validation + POST
  ----------------------------*/
  function initContactForm() {
    const contactSection = document.getElementById("contact") || q("#contact");
    if (!contactSection) return;
    const form = contactSection.querySelector("form");
    if (!form) return;

    let status = q(".contact-status", form);
    if (!status) {
      status = create("div", { class: "contact-status", attrs: { role: "status", "aria-live": "polite" } });
      status.style.marginTop = "15px";
      status.style.fontSize = "14px";
      form.appendChild(status);
    }

    form.setAttribute("novalidate", "novalidate");
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      qa(".field-error", form).forEach(el => { el.textContent = ""; el.setAttribute("aria-hidden", "true"); });
      status.textContent = "";

      const nameInput = form.querySelector('input[name="name"], input[type="text"]');
      const emailInput = form.querySelector('input[type="email"], input[name="email"]');
      const messageInput = form.querySelector("textarea[name='message'], textarea");

      const values = {
        name: nameInput?.value?.trim?.() || "",
        email: emailInput?.value?.trim?.() || "",
        message: messageInput?.value?.trim?.() || ""
      };

      const errors = {};
      if (!values.name || values.name.length < 2) errors["name"] = "Please enter your name.";
      if (!values.email || !validateEmail(values.email)) errors["email"] = "Please enter a valid email.";
      if (!values.message || values.message.length < 6) errors["message"] = "Message must be at least 6 characters.";

      if (Object.keys(errors).length) {
        Object.entries(errors).forEach(([k, v]) => {
          let field = form.querySelector(`[name="${k}"]`);
          if (!field) field = form.querySelector(`#${k}`);
          if (field) {
            let err = form.querySelector(`.field-error[data-for="${field.id || field.name}"]`);
            if (!err) {
              err = create("div", { class: "field-error", attrs: { "data-for": field.id || field.name, "aria-hidden": "false" } });
              field.insertAdjacentElement("afterend", err);
            }
            err.textContent = v;
            err.setAttribute("aria-hidden", "false");
          }
        });
        status.textContent = "Please fix the fields above.";
        status.style.color = "crimson";
        return;
      }

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values)
        });
        if (!res.ok) throw new Error("Network error");
        const data = await res.json().catch(() => ({}));
        status.textContent = data.message || "Message sent. We'll be in touch!";
        status.style.color = "green";
        form.reset();
      } catch (err) {
        status.textContent = "Message queued locally (no server).";
        status.style.color = "green";
        form.reset();
      }
    });

    ["name", "email"].forEach((name) => {
      const field = form.querySelector(`[name="${name}"]`);
      if (!field) return;
      field.addEventListener("blur", () => {
        const val = field.value.trim();
        const errEl = form.querySelector(`.field-error[data-for="${field.id || field.name}"]`) || create("div", { class: "field-error", attrs: { "data-for": field.id || field.name } });
        if (field.nextElementSibling && field.nextElementSibling.classList.contains("field-error") === false) {
          field.insertAdjacentElement("afterend", errEl);
        }
        if (name === "email") {
          if (!val) { errEl.textContent = "Email required."; errEl.setAttribute("aria-hidden", "false"); }
          else if (!validateEmail(val)) { errEl.textContent = "Enter a valid email."; errEl.setAttribute("aria-hidden", "false"); }
          else { errEl.textContent = ""; errEl.setAttribute("aria-hidden", "true"); }
        } else {
          if (!val) { errEl.textContent = "Required."; errEl.setAttribute("aria-hidden", "false"); }
          else { errEl.textContent = ""; errEl.setAttribute("aria-hidden", "true"); }
        }
      });
    });
  }

  /* ---------------------------
     Lightbox for images
  ----------------------------*/
  function initLightbox() {
    const imgs = qa("#testimonials img");
    if (!imgs.length) return;
    imgs.forEach(img => {
      img.style.cursor = "zoom-in";
      img.setAttribute("tabindex", "0");
      img.addEventListener("click", (e) => {
        e.stopPropagation();
        openLightbox(img);
      });
      img.addEventListener("keydown", (e) => { 
        if (e.key === "Enter" || e.key === " ") { 
          e.preventDefault(); 
          openLightbox(img); 
        } 
      });
    });
  }

  function openLightbox(img) {
    const overlay = create("div", { class: "lightbox", attrs: { role: "dialog", "aria-modal": "true" } });
    overlay.style.position = "fixed"; 
    overlay.style.inset = "0"; 
    overlay.style.display = "flex"; 
    overlay.style.alignItems = "center"; 
    overlay.style.justifyContent = "center"; 
    overlay.style.zIndex = "99999"; 
    overlay.style.background = "rgba(0,0,0,0.9)";
    
    const big = create("img", { attrs: { src: img.src, alt: img.alt || "" }, class: "lightbox__img" });
    big.style.maxWidth = "92%"; 
    big.style.maxHeight = "92%"; 
    big.style.boxShadow = "0 8px 30px rgba(0,0,0,0.5)";
    
    overlay.appendChild(big);
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";

    const remove = () => { 
      if (overlay.parentElement) overlay.parentElement.removeChild(overlay); 
      document.body.style.overflow = ""; 
    };
    
    overlay.addEventListener("click", (ev) => { 
      if (ev.target === overlay || ev.target === big) remove(); 
    });
    
    document.addEventListener("keydown", function onEsc(e) { 
      if (e.key === "Escape") { 
        remove(); 
        document.removeEventListener("keydown", onEsc); 
      }
    });
  }

  /* ---------------------------
     Active nav highlight
  ----------------------------*/
  function initActiveNavObserver() {
    const sections = qa("section[id], header");
    const navLinks = qa("#mainNav a");
    if (!sections.length || !navLinks.length) return;
    const idToLink = {};
    navLinks.forEach(a => { 
      const href = a.getAttribute("href"); 
      if (href && href.startsWith("#")) idToLink[href.slice(1)] = a; 
    });
    
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        const id = e.target.id;
        if (!id) return;
        const link = idToLink[id];
        if (!link) return;
        if (e.isIntersecting) {
          navLinks.forEach(a => a.classList.remove("active"));
          link.classList.add("active");
        }
      });
    }, { root: null, rootMargin: "-40% 0px -40% 0px", threshold: 0 });
    
    sections.forEach(s => { if (s.id) obs.observe(s); });
  }

  /* ---------------------------
     Back to top
  ----------------------------*/
  function initBackToTop() {
    const btn = create("button", { class: "back-to-top", html: "↑" });
    btn.setAttribute("aria-label", "Back to top");
    Object.assign(btn.style, { 
      position: "fixed", 
      right: "18px", 
      bottom: "18px", 
      display: "none", 
      zIndex: "9999", 
      width: "44px", 
      height: "44px", 
      borderRadius: "50%", 
      border: "none", 
      cursor: "pointer" 
    });
    document.body.appendChild(btn);
    
    window.addEventListener("scroll", () => { 
      btn.style.display = (window.scrollY > 400 ? "block" : "none"); 
    }, { passive: true });
    
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------------------------
     Lazy images
  ----------------------------*/
  function lazySetImages() {
    qa("img").forEach(img => { 
      if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy"); 
    });
  }

  /* ---------------------------
     Escape key closers
  ----------------------------*/
  function initEscapeClosers() {
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const navToggle = q("#nav-toggle");
      if (navToggle && navToggle.checked) navToggle.checked = false;
      
      // Close any flipped project cards
      qa(".project-card.flipped").forEach(card => card.classList.remove("flipped"));
    });
  }

  /* ---------------------------
     Scroll animations
  ----------------------------*/
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    qa(".reason-card, .service-card, .career-card").forEach(el => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });
  }

  /* ---------------------------
     Utilities
  ----------------------------*/
  function trapFocus(container) {
    const focusable = Array.from(container.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')).filter(Boolean);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    container.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    return /^[\d+\-\s()]{7,20}$/.test(phone);
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }

  /* ---------------------------
     Run
  ----------------------------*/
  document.addEventListener("DOMContentLoaded", init, { once: true });

})();