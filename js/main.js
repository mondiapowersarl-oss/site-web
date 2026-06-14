/* ============================================================
   MondiaPower — main.js
   Navigation mobile · révélation au défilement · formulaire (mailto)
   ============================================================ */
(function () {
  "use strict";

  /* ---- Menu mobile ---- */
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // Referme le menu après un clic sur un lien (mobile)
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Année du footer ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---- Révélation au défilement ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---- Formulaire de contact (sans backend → mailto) ---- */
  var form = document.getElementById("contact-form");
  if (form) {
    var EMAIL_TO = "mondiapower.sarl@gmail.com";

    function setInvalid(field, invalid) {
      field.classList.toggle("invalid", invalid);
    }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var ok = true;

      var fields = form.querySelectorAll(".field[data-required]");
      fields.forEach(function (field) {
        var input = field.querySelector("input, textarea");
        var val = (input.value || "").trim();
        var valid = val.length > 0;
        if (input.type === "email") {
          valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        }
        setInvalid(field, !valid);
        if (!valid) ok = false;
      });

      if (!ok) return;

      var name = form.querySelector("#nom").value.trim();
      var email = form.querySelector("#email").value.trim();
      var phone = (form.querySelector("#tel") || {}).value || "";
      var subject = (form.querySelector("#sujet") || {}).value || "Demande via le site web";
      var message = form.querySelector("#message").value.trim();

      var body =
        "Nom : " + name + "\n" +
        "E-mail : " + email + "\n" +
        "Téléphone : " + phone.trim() + "\n\n" +
        message;

      var mailto = "mailto:" + EMAIL_TO +
        "?subject=" + encodeURIComponent("[Site web] " + subject) +
        "&body=" + encodeURIComponent(body);

      var success = form.querySelector(".form-success");
      if (success) success.style.display = "block";
      window.location.href = mailto;
      form.reset();
    });

    // retire l'état d'erreur dès que l'utilisateur corrige
    form.querySelectorAll("input, textarea").forEach(function (input) {
      input.addEventListener("input", function () {
        var f = input.closest(".field");
        if (f) f.classList.remove("invalid");
      });
    });
  }
})();
