/* 25th Hour Clinic — small progressive-enhancement layer.
   No dependencies; everything degrades gracefully without JS. */
(function () {
  "use strict";

  /* Mobile navigation ------------------------------------------------ */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    // Close the menu after tapping a link.
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      }
    });
  }

  /* Header shadow once scrolled -------------------------------------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Reveal cards on scroll ------------------------------------------- */
  var revealables = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealables.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.1 });

    revealables.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      io.observe(el);
    });
  } else {
    revealables.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* WhatsApp booking form --------------------------------------------- */
  var CLINIC_WA = "918281447235";   // country code + number, digits only
  var form = document.getElementById("booking-form");

  if (form) {
    var preview = document.getElementById("message-preview");
    var errorBox = document.getElementById("form-error");
    var homeFields = form.querySelectorAll(".home-only");

    // Read a field, collapsing internal line breaks so every bullet in the
    // WhatsApp message stays on a single line.
    var val = function (name) {
      var el = form.elements[name];
      if (!el) return "";
      return el.value
        .trim()
        // Join the lines with a comma, unless the previous line already ended
        // in punctuation — "for 2 weeks., Diabetic" reads badly.
        .replace(/\s*\n+\s*/g, function (match, offset, whole) {
          return /[.,;:!?—-]$/.test(whole.slice(0, offset).trim()) ? " " : ", ";
        })
        .replace(/[ \t]{2,}/g, " ");
    };

    var isHomeVisit = function () {
      return form.elements.type.value === "home";
    };

    // Show/hide the fields that only matter for a home visit.
    var syncMode = function () {
      var home = isHomeVisit();
      Array.prototype.forEach.call(homeFields, function (el) { el.hidden = !home; });
      form.elements.location.required = home;
      if (!home) form.elements.location.setCustomValidity("");
    };

    // Format a date as "Tue, 18 Aug 2026" — friendlier than 2026-08-18, and
    // built by hand so the output is identical in every browser locale.
    var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var prettyDate = function (iso) {
      var parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
      if (!parts) return iso || "";
      var d = new Date(+parts[1], +parts[2] - 1, +parts[3]);
      if (isNaN(d.getTime())) return iso;
      return DAYS[d.getDay()] + ", " + d.getDate() + " " +
             MONTHS[d.getMonth()] + " " + d.getFullYear();
    };

    /* Build the message. WhatsApp renders *text* as bold, so section
       labels are bolded and each field sits on its own line. */
    var buildMessage = function () {
      var home = isHomeVisit();
      var lines = [];

      lines.push(home ? "*HOME VISIT REQUEST*" : "*CLINIC APPOINTMENT REQUEST*");
      lines.push("_Sent from the 25th Hour Clinic website_");
      lines.push("");

      lines.push("*Patient Details*");
      lines.push("• Name: " + (val("name") || "—"));

      var age = val("age");
      var sex = val("sex");
      lines.push("• Age / Sex: " + (age || "—") + (sex ? " / " + sex : ""));
      lines.push("• Illness / Reason: " + (val("illness") || "—"));
      lines.push("");

      lines.push("*Preferred Consultation Time*");
      var day = prettyDate(val("day"));
      lines.push("• Day: " + (day || "Any day"));
      lines.push("• Time: " + (val("time") || "—"));
      lines.push("");

      lines.push("*Contact*");
      lines.push("• Phone: " + (val("phone") || "—"));

      if (home) {
        lines.push("");
        lines.push("*Home Visit Location*");
        lines.push("• Address: " + (val("location") || "—"));
        var map = val("maplink");
        if (map) lines.push("• Map link: " + map);
      }

      var notes = val("notes");
      if (notes) {
        lines.push("");
        lines.push("*Additional Notes*");
        lines.push(notes);
      }

      return lines.join("\n");
    };

    var refreshPreview = function () {
      preview.textContent = buildMessage();
    };

    form.addEventListener("input", refreshPreview);
    form.addEventListener("change", function (e) {
      if (e.target.name === "type") syncMode();
      refreshPreview();
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Native validation, with the message surfaced in one place.
      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        var firstInvalid = form.querySelector("input:invalid, select:invalid, textarea:invalid");
        errorBox.textContent = "Please complete the highlighted fields before sending.";
        errorBox.hidden = false;
        if (firstInvalid) {
          firstInvalid.focus({ preventScroll: false });
        }
        return;
      }
      errorBox.hidden = true;

      var url = "https://wa.me/" + CLINIC_WA + "?text=" + encodeURIComponent(buildMessage());
      window.open(url, "_blank", "noopener");
    });

    syncMode();
    refreshPreview();
  }

  /* Footer year ------------------------------------------------------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
