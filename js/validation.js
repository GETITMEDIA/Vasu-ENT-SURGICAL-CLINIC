/**
 * VASU ENT SURGICAL CLINIC — validation.js
 * Reusable form validation helpers used by booking.js
 */
(function (window) {
  "use strict";

  const PHONE_REGEX = /^(\+91[\-\s]?)?[6-9]\d{9}$/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function getField(fieldEl) {
    const group = fieldEl.closest(".form-group");
    const errorEl = group ? group.querySelector(".form-error") : null;
    return { group, errorEl };
  }

  function showError(fieldEl, message) {
    const { errorEl } = getField(fieldEl);
    fieldEl.classList.add("is-invalid");
    fieldEl.setAttribute("aria-invalid", "true");
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add("is-visible");
    }
  }

  function clearError(fieldEl) {
    const { errorEl } = getField(fieldEl);
    fieldEl.classList.remove("is-invalid");
    fieldEl.removeAttribute("aria-invalid");
    if (errorEl) {
      errorEl.textContent = "";
      errorEl.classList.remove("is-visible");
    }
  }

  function validateRequired(fieldEl, label) {
    const value = (fieldEl.value || "").trim();
    if (!value) {
      showError(fieldEl, `${label} is required.`);
      return false;
    }
    clearError(fieldEl);
    return true;
  }

  function validateName(fieldEl) {
    const value = (fieldEl.value || "").trim();
    if (!value) {
      showError(fieldEl, "Please enter the patient's full name.");
      return false;
    }
    if (value.length < 3) {
      showError(fieldEl, "Name must be at least 3 characters.");
      return false;
    }
    if (!/^[a-zA-Z\s.'-]+$/.test(value)) {
      showError(fieldEl, "Name can only contain letters and spaces.");
      return false;
    }
    clearError(fieldEl);
    return true;
  }

  function validatePhone(fieldEl) {
    const value = (fieldEl.value || "").trim();
    if (!value) {
      showError(fieldEl, "Mobile number is required.");
      return false;
    }
    if (!PHONE_REGEX.test(value.replace(/\s/g, ""))) {
      showError(fieldEl, "Enter a valid 10-digit Indian mobile number.");
      return false;
    }
    clearError(fieldEl);
    return true;
  }

  function validateEmail(fieldEl, required) {
    const value = (fieldEl.value || "").trim();
    if (!value) {
      if (required) {
        showError(fieldEl, "Email address is required.");
        return false;
      }
      clearError(fieldEl);
      return true;
    }
    if (!EMAIL_REGEX.test(value)) {
      showError(fieldEl, "Enter a valid email address.");
      return false;
    }
    clearError(fieldEl);
    return true;
  }

  function validateDate(fieldEl) {
    const value = fieldEl.value;
    if (!value) {
      showError(fieldEl, "Please select a preferred date.");
      return false;
    }
    const selected = new Date(value + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) {
      showError(fieldEl, "Preferred date cannot be in the past.");
      return false;
    }
    if (selected.getDay() === 0) {
      showError(fieldEl, "The clinic is closed on Sundays. Please choose another day.");
      return false;
    }
    clearError(fieldEl);
    return true;
  }

  function validateSelect(fieldEl, label) {
    const value = (fieldEl.value || "").trim();
    if (!value) {
      showError(fieldEl, `Please select ${label}.`);
      return false;
    }
    clearError(fieldEl);
    return true;
  }

  window.ENTValidation = {
    showError,
    clearError,
    validateRequired,
    validateName,
    validatePhone,
    validateEmail,
    validateDate,
    validateSelect,
    PHONE_REGEX,
    EMAIL_REGEX,
  };
})(window);
