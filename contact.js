// contact.js
// Client-side validation + async submit to Formspree.
// Inline errors are linked via aria-describedby, and status updates use aria-live.

const form = document.querySelector("#contact-form");
const statusEl = document.querySelector("#form-status");

const nameEl = document.querySelector("#name");
const emailEl = document.querySelector("#email");
const messageEl = document.querySelector("#message");

const errName = document.querySelector("#error-name");
const errEmail = document.querySelector("#error-email");
const errMessage = document.querySelector("#error-message");

// Updates the status message (announced via aria-live in the markup)
function setStatus(message, type = "info") {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.dataset.type = type;
}

// Sets/clears a field error and keeps aria-invalid in sync
function setFieldError(inputEl, errorEl, message) {
  if (!inputEl || !errorEl) return;
  errorEl.textContent = message || "";
  inputEl.setAttribute("aria-invalid", message ? "true" : "false");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validate() {
  let ok = true;

  const name = (nameEl?.value || "").trim();
  if (!name) {
    setFieldError(nameEl, errName, "Please enter your name.");
    ok = false;
  } else {
    setFieldError(nameEl, errName, "");
  }

  const email = (emailEl?.value || "").trim();
  if (!email) {
    setFieldError(emailEl, errEmail, "Please enter your email address.");
    ok = false;
  } else if (!isValidEmail(email)) {
    setFieldError(emailEl, errEmail, "Please enter a valid email address (e.g., name@example.com).");
    ok = false;
  } else {
    setFieldError(emailEl, errEmail, "");
  }

  const msg = (messageEl?.value || "").trim();
  if (!msg) {
    setFieldError(messageEl, errMessage, "Please enter a message.");
    ok = false;
  } else if (msg.length < 10) {
    setFieldError(messageEl, errMessage, "Please write a little more detail (at least 10 characters).");
    ok = false;
  } else {
    setFieldError(messageEl, errMessage, "");
  }

  setStatus(ok ? "" : "Please fix the highlighted fields and try again.", ok ? "info" : "error");
  return ok;
}

// Light live validation to reduce failed submits (runs only when inputs exist)
[nameEl, emailEl, messageEl].forEach((el) => el?.addEventListener("input", validate));

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validate()) {
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    setStatus("Sending…", "info");

    try {
      const res = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        form.reset();
        setFieldError(nameEl, errName, "");
        setFieldError(emailEl, errEmail, "");
        setFieldError(messageEl, errMessage, "");
        setStatus("Thanks! Your message has been sent. I’ll get back to you soon.", "success");
      } else {
        setStatus("Something went wrong sending your message. Please try again.", "error");
      }
    } catch {
      setStatus("Network error. Please check your connection and try again.", "error");
    }
  });
}
