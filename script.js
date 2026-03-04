/* ============================================================
   GAUTAM KUMAR — PORTFOLIO JAVASCRIPT v2
   Features:
     1. Cursor glow effect (desktop)
     2. Navbar — scroll shadow + active link
     3. Mobile hamburger menu
     4. Smooth scroll for all anchor links
     5. Scroll-reveal animations (IntersectionObserver)
     6. Skill bar animation on scroll
     7. Typed / cycling hero role text
     8. Contact form validation + simulated submit
     9. Back-to-top button
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ----------------------------------------------------------
     1. CURSOR GLOW — follows mouse on desktop only
  ---------------------------------------------------------- */
  const cursorGlow = document.getElementById("cursorGlow");
  if (window.innerWidth > 900 && cursorGlow) {
    document.addEventListener("mousemove", (e) => {
      cursorGlow.style.left = e.clientX + "px";
      cursorGlow.style.top = e.clientY + "px";
    });
  }

  /* ----------------------------------------------------------
     2. NAVBAR — scroll class + active section highlight
  ---------------------------------------------------------- */
  const navbar = document.getElementById("navbar");
  const sections = Array.from(document.querySelectorAll("section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".nav-links a"));

  function updateNavbar() {
    // Shadow when scrolled
    navbar.classList.toggle("scrolled", window.scrollY > 50);

    // Active link — find section whose top is nearest above midpoint
    const mid = window.scrollY + window.innerHeight * 0.45;
    let activeId = "";
    sections.forEach((sec) => {
      if (sec.offsetTop <= mid) activeId = sec.id;
    });
    navLinks.forEach((link) => {
      const id = link.getAttribute("href").replace("#", "");
      link.classList.toggle("active", id === activeId);
    });
  }

  window.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar();

  /* ----------------------------------------------------------
     3. HAMBURGER MOBILE MENU
  ---------------------------------------------------------- */
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");

  hamburger.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("open");
    hamburger.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  });

  // Close on mobile link click
  document.querySelectorAll(".mnav-link").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      hamburger.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

  /* ----------------------------------------------------------
     4. SMOOTH SCROLL — all anchor links offset by navbar height
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 20;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ----------------------------------------------------------
     5. SCROLL REVEAL — fade + slide-up on scroll
        Any element with class "reveal" will animate in once.
  ---------------------------------------------------------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target); // only once
        }
      });
    },
    { threshold: 0.1 },
  );

  // Add staggered delay to sibling reveals inside a grid/list
  function registerReveals(selector, staggerDelay = 0.08) {
    const groups = {};
    document.querySelectorAll(selector).forEach((el) => {
      const parent = el.parentElement;
      if (!groups[parent]) groups[parent] = [];
      groups[parent].push(el);
    });
    Object.values(groups).forEach((siblings) => {
      siblings.forEach((el, i) => {
        el.style.transitionDelay = i * staggerDelay + "s";
        revealObserver.observe(el);
      });
    });
  }

  // Register elements
  registerReveals(".reveal", 0.07);
  registerReveals(".tech-card", 0.04);
  registerReveals(".proj-card", 0.08);
  registerReveals(".edu-card", 0.08);
  registerReveals(".tl-item", 0.08);
  registerReveals(".cert-item", 0.08);
  registerReveals(".cic", 0.06);

  /* ----------------------------------------------------------
     6. SKILL BARS — animate width when visible
  ---------------------------------------------------------- */
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target.querySelector(".sr-fill");
          const pct = entry.target.dataset.pct || "0";
          setTimeout(() => {
            fill.style.width = pct + "%";
          }, 200);
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );

  document
    .querySelectorAll(".skill-row")
    .forEach((row) => skillObserver.observe(row));

  /* ----------------------------------------------------------
     7. TYPED HERO ROLE — cycles through roles with type/erase
  ---------------------------------------------------------- */
  const roleEl = document.getElementById("heroRole");
  if (roleEl) {
    const roles = [
      "Full-Stack Developer",
      "C++ Enthusiast",
      "Competitive Programmer",
      "Problem Solver & Builder",
    ];
    let ri = 0,
      ci = 0,
      erasing = false,
      pausing = false;

    function type() {
      if (pausing) {
        pausing = false;
        setTimeout(type, 1800);
        return;
      }
      const word = roles[ri];
      if (!erasing) {
        roleEl.textContent = word.slice(0, ci + 1);
        ci++;
        if (ci === word.length) {
          erasing = true;
          pausing = true;
        }
        setTimeout(type, 70);
      } else {
        roleEl.textContent = word.slice(0, ci - 1);
        ci--;
        if (ci === 0) {
          erasing = false;
          ri = (ri + 1) % roles.length;
        }
        setTimeout(type, 38);
      }
    }

    // Start after hero CSS animation
    setTimeout(type, 1200);
  }

  /* ----------------------------------------------------------
     8. CONTACT FORM — validation + simulated send
  ---------------------------------------------------------- */
  const form = document.getElementById("contactForm");
  const cfNote = document.getElementById("cfNote");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("cname");
      const email = document.getElementById("cemail");
      const message = document.getElementById("cmessage");

      // Clear errors
      [name, email, message].forEach((f) => f.classList.remove("error"));
      cfNote.textContent = "";
      cfNote.className = "cf-note";

      let valid = true;
      if (!name.value.trim()) {
        name.classList.add("error");
        valid = false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.classList.add("error");
        valid = false;
      }
      if (!message.value.trim()) {
        message.classList.add("error");
        valid = false;
      }

      if (!valid) {
        cfNote.textContent = "Please fill in all required fields correctly.";
        cfNote.classList.add("err");
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

      // Actually send to Formspree
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          form.reset();
          cfNote.textContent = "✓ Message sent! I'll get back to you soon.";
          cfNote.classList.add("success");
          setTimeout(() => { cfNote.textContent = ""; cfNote.className = "cf-note"; }, 5000);
        } else {
          cfNote.textContent = "✗ Something went wrong. Please email me directly.";
          cfNote.classList.add("err");
        }
      } catch (error) {
        cfNote.textContent = "✗ Network error. Please email me directly.";
        cfNote.classList.add("err");
      }

      btn.disabled = false;
      btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
    });
  }

  /* ----------------------------------------------------------
     9. BACK-TO-TOP BUTTON
  ---------------------------------------------------------- */
  const backTop = document.getElementById("backTop");
  if (backTop) {
    window.addEventListener(
      "scroll",
      () => {
        backTop.classList.toggle("visible", window.scrollY > 500);
      },
      { passive: true },
    );

    backTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}); // end DOMContentLoaded
