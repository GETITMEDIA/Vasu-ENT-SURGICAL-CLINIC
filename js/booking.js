/**
 * VASU ENT SURGICAL CLINIC — booking.js
 * Appointment form submission -> validation -> WhatsApp message handoff.
 */
(function () {
  "use strict";

  const form = document.getElementById("booking-form");
  if (!form || !window.ENTValidation) return;

  const V = window.ENTValidation;
  const CLINIC_Phone_NUMBER = "917373611133"; // +91 73736111333 (digits only, country code first)

  const fields = {
    name: form.querySelector("#patient-name"),
    mobile: form.querySelector("#mobile-number"),
    email: form.querySelector("#email-address"),
    date: form.querySelector("#preferred-date"),
    time: form.querySelector("#preferred-time"),
    clinic: form.querySelector("#clinic-selection"),
    message: form.querySelector("#patient-message"),
  };

  const submitBtn = form.querySelector('button[type="submit"]');
  const successPanel = document.querySelector(".form-success");
  const formBody = document.querySelector(".form-body");

  /* Prevent selecting past dates / Sundays in the date picker itself */
  if (fields.date) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    fields.date.setAttribute("min", `${yyyy}-${mm}-${dd}`);
  }

  /* Live-validate on blur */
  fields.name && fields.name.addEventListener("blur", () => V.validateName(fields.name));
  fields.mobile && fields.mobile.addEventListener("blur", () => V.validatePhone(fields.mobile));
  fields.email && fields.email.addEventListener("blur", () => V.validateEmail(fields.email, false));
  fields.date && fields.date.addEventListener("blur", () => V.validateDate(fields.date));
  fields.time && fields.time.addEventListener("blur", () => V.validateSelect(fields.time, "a preferred time"));
  fields.clinic && fields.clinic.addEventListener("blur", () => V.validateSelect(fields.clinic, "a clinic"));

  /* Clear error state as the user types/selects */
  Object.values(fields).forEach((field) => {
    if (!field) return;
    field.addEventListener("input", () => V.clearError(field));
    field.addEventListener("change", () => V.clearError(field));
  });

  if (fields.mobile) {
    fields.mobile.addEventListener("input", function() {
      this.value = this.value.replace(/[^0-9]/g, '');
    });
  }

  function runAllValidation() {
    const results = [
      V.validateName(fields.name),
      V.validatePhone(fields.mobile),
      V.validateEmail(fields.email, false),
      V.validateDate(fields.date),
      V.validateSelect(fields.time, "a preferred time"),
      V.validateSelect(fields.clinic, "a clinic"),
    ];
    return results.every(Boolean);
  }

  function formatDate(isoDate) {
    if (!isoDate) return "";
    const d = new Date(isoDate + "T00:00:00");
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  }

  function buildPhoneMessage() {
    const clinicLabel = fields.clinic.options[fields.clinic.selectedIndex].text;
    const lines = [
      "----------------------------------",
      "*VASU ENT SURGICAL CLINIC*",
      "New Appointment Request",
      "----------------------------------",
      "",
      `*Name:* ${fields.name.value.trim()}`,
      `*Mobile:* +91 ${fields.mobile.value.trim()}`,
      `*Email:* ${fields.email.value.trim() || "Not provided"}`,
      `*Clinic:* ${clinicLabel}`,
      `*Preferred Date:* ${formatDate(fields.date.value)}`,
      `*Preferred Time:* ${fields.time.value}`,
      `*Message:* ${fields.message.value.trim() || "None"}`,
      "",
      "----------------------------------",
    ];
    return lines.join("\n");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!runAllValidation()) {
      const firstInvalid = form.querySelector(".is-invalid");
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
        firstInvalid.focus();
      }
      return;
    }

    submitBtn && (submitBtn.disabled = true);
    submitBtn && submitBtn.classList.add("is-loading");

    const message = buildPhoneMessage();
    const waUrl = `https://wa.me/${CLINIC_Phone_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(waUrl, "_blank", "noopener");

    if (formBody && successPanel) {
      formBody.style.display = "none";
      successPanel.classList.add("is-visible");
      successPanel.setAttribute("tabindex", "-1");
      successPanel.focus();
    }

    setTimeout(() => {
      form.reset();
      submitBtn && (submitBtn.disabled = false);
      submitBtn && submitBtn.classList.remove("is-loading");
    }, 400);
  });

  const resetLink = document.querySelector("[data-booking-reset]");
  if (resetLink) {
    resetLink.addEventListener("click", (e) => {
      e.preventDefault();
      form.reset();
      Object.values(fields).forEach((f) => f && V.clearError(f));
      successPanel && successPanel.classList.remove("is-visible");
      formBody && (formBody.style.display = "");
    });
  }
})();

