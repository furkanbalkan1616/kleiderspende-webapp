// ==========================
// KONSTANTEN
// ==========================
const GESCHAEFTSSTELLEN_PLZ_PREFIX = "76";
const UE_ABHOLUNG = "Abholung";

// ==========================
// INIT
// ==========================
const form = document.getElementById("spendenForm");

if (form) {

  const radioGeschaeftsstelle = document.getElementById("geschaeftsstelle");
  const radioAbholung = document.getElementById("abholung");
  const adresseBereich = document.getElementById("adresseBereich");

  const kleidungInput = document.getElementById("kleidung");
  const krisengebietInput = document.getElementById("krisengebiet");
  const strasseInput = document.getElementById("strasse");
  const plzInput = document.getElementById("plz");
  const ortInput = document.getElementById("ort");

  const submitButton = form.querySelector("button[type='submit']");

  // 🔒 Safety Check (Best Practice)
  if (!kleidungInput || !krisengebietInput || !plzInput) return;

  // ==========================
  // SECURITY
  // ==========================
  function sanitize(input) {
    return input
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .trim();
  }

  // ==========================
  // UI HELPERS
  // ==========================
  function showError(text) {
    const box = document.getElementById("fehlermeldung");
    box.innerText = text;
    box.style.display = "block";
    box.scrollIntoView({ behavior: "smooth" });
  }

  function clearError() {
    const box = document.getElementById("fehlermeldung");
    box.style.display = "none";
    box.innerText = "";
  }

  function markInvalid(field) {
    field.classList.add("is-invalid");
  }

  function markValid(field) {
    field.classList.remove("is-invalid");
    field.classList.add("is-valid");
  }

  function resetValidation() {
    [kleidungInput, krisengebietInput, strasseInput, plzInput, ortInput]
      .forEach(f => f.classList.remove("is-invalid", "is-valid"));
  }

  function focusFirstError() {
    const firstError = form.querySelector(".is-invalid");
    if (firstError) {
      firstError.focus();
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  // ==========================
  // FORM LOGIC
  // ==========================
  function setRequired(isRequired) {
    strasseInput.required = isRequired;
    plzInput.required = isRequired;
    ortInput.required = isRequired;
  }

  function toggleAdresse(show) {
    if (show) {
      adresseBereich.style.display = "block";
      setRequired(true);
      strasseInput.focus();
    } else {
      adresseBereich.style.display = "none";
      setRequired(false);
      strasseInput.value = "";
      plzInput.value = "";
      ortInput.value = "";
    }
  }

  // ==========================
  // LIVE VALIDATION
  // ==========================
  if (plzInput) {
    plzInput.addEventListener("input", () => {
      if (/^[0-9]{5}$/.test(plzInput.value)) {
        markValid(plzInput);
      } else {
        plzInput.classList.remove("is-valid");
      }
    });
  }

  // ==========================
  // RADIO EVENTS
  // ==========================
  radioAbholung.addEventListener("change", () => toggleAdresse(true));
  radioGeschaeftsstelle.addEventListener("change", () => toggleAdresse(false));

  toggleAdresse(false);

  // ==========================
  // ENTER SUBMIT (UX BONUS)
  // ==========================
  form.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      form.requestSubmit();
    }
  });

  // ==========================
  // SUBMIT
  // ==========================
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    clearError();
    resetValidation();

    const selected = document.querySelector('input[name="uebergabe"]:checked');

    if (!selected) {
      showError("Bitte wählen Sie eine Übergabeart.");
      return;
    }

    const uebergabe = selected.value;

    const kleidung = sanitize(kleidungInput.value);
    const krisengebiet = sanitize(krisengebietInput.value);
    const strasse = sanitize(strasseInput.value);
    const plz = sanitize(plzInput.value);
    const ortInputValue = sanitize(ortInput.value);

    let hasError = false;

    function check(field, condition) {
      if (!condition) {
        markInvalid(field);
        hasError = true;
      } else {
        markValid(field);
      }
    }

    check(kleidungInput, kleidung !== "");
    check(krisengebietInput, krisengebiet !== "");

    let ort = "Geschäftsstelle Karlsruhe";

    if (uebergabe === UE_ABHOLUNG) {

      check(strasseInput, strasse !== "");
      check(ortInput, ortInputValue !== "");

      if (!/^[0-9]{5}$/.test(plz)) {
        markInvalid(plzInput);
        showError("Bitte eine gültige fünfstellige Postleitzahl eingeben.");
        focusFirstError();
        return;
      }

      if (!plz.startsWith(GESCHAEFTSSTELLEN_PLZ_PREFIX)) {
        markInvalid(plzInput);
        showError("Die Adresse liegt nicht im Einzugsgebiet der Geschäftsstelle Karlsruhe.");
        focusFirstError();
        return;
      }

      markValid(plzInput);
      ort = ortInputValue;
    }

    if (hasError) {
      showError("Bitte prüfen Sie die markierten Felder.");
      focusFirstError();
      return;
    }

    // ==========================
    // LOADING STATE
    // ==========================
    submitButton.innerText = "Wird verarbeitet...";
    submitButton.disabled = true;

    // ==========================
    // DATUM & UHRZEIT
    // ==========================
    const now = new Date();
    const datum = now.toLocaleDateString("de-DE");
    const uhrzeit = now.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit"
    });

    // ==========================
    // REDIRECT
    // ==========================
    const url =
      "bestaetigung.html?" +
      "kleidung=" + encodeURIComponent(kleidung) +
      "&krisengebiet=" + encodeURIComponent(krisengebiet) +
      "&uebergabe=" + encodeURIComponent(uebergabe) +
      "&ort=" + encodeURIComponent(ort) +
      "&datum=" + encodeURIComponent(datum) +
      "&uhrzeit=" + encodeURIComponent(uhrzeit);

    setTimeout(() => {
      window.location.href = url;
    }, 500);
  });

}