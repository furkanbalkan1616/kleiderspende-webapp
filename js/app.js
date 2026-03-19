// ==========================
// KONSTANTEN
// ==========================
const GESCHAEFTSSTELLEN_PLZ_PREFIX = "76";
const UE_ABHOLUNG = "Abholung";

// ==========================
// INIT
// ==========================
const form = document.getElementById("spendenForm");
if (!form) return;

// Alle Elemente zentral sammeln (Best Practice)
const elements = {
  radioGeschaeftsstelle: document.getElementById("geschaeftsstelle"),
  radioAbholung: document.getElementById("abholung"),
  adresseBereich: document.getElementById("adresseBereich"),

  kleidung: document.getElementById("kleidung"),
  krisengebiet: document.getElementById("krisengebiet"),
  strasse: document.getElementById("strasse"),
  plz: document.getElementById("plz"),
  ort: document.getElementById("ort"),

  submitButton: form.querySelector("button[type='submit']")
};

// ==========================
// HELPER
// ==========================
function showError(msg) {
  let box = document.getElementById("fehlermeldung");

  if (!box) {
    box = document.createElement("div");
    box.id = "fehlermeldung";
    box.className = "alert alert-danger";
    form.prepend(box);
  }

  box.innerText = msg;
  box.style.display = "block";
  box.scrollIntoView({ behavior: "smooth" });
}

function clearError() {
  const box = document.getElementById("fehlermeldung");
  if (!box) return;

  box.style.display = "none";
  box.innerText = "";
}

// Validierung visuell
function markInvalid(field) {
  field?.classList.add("is-invalid");
}

function markValid(field) {
  field?.classList.remove("is-invalid");
  field?.classList.add("is-valid");
}

function resetValidation() {
  [elements.kleidung, elements.krisengebiet, elements.strasse, elements.plz, elements.ort]
    .forEach(el => el?.classList.remove("is-invalid", "is-valid"));
}

function focusFirstError() {
  const firstError = form.querySelector(".is-invalid");
  if (firstError) {
    firstError.focus();
    firstError.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

// ==========================
// ADRESSE TOGGLE
// ==========================
function toggleAdresse(show) {
  const { adresseBereich, strasse, plz, ort } = elements;

  if (!adresseBereich) return;

  adresseBereich.style.display = show ? "block" : "none";
  adresseBereich.classList.toggle("is-visible", show);

  strasse.required = show;
  plz.required = show;
  ort.required = show;

  if (!show) {
    strasse.value = "";
    plz.value = "";
    ort.value = "";
  }
}

// ==========================
// INITIAL STATE
// ==========================
const selected = document.querySelector('input[name="uebergabe"]:checked');
toggleAdresse(selected?.value === UE_ABHOLUNG);

// ==========================
// EVENTS
// ==========================
elements.radioAbholung?.addEventListener("change", () => toggleAdresse(true));
elements.radioGeschaeftsstelle?.addEventListener("change", () => toggleAdresse(false));

// Live PLZ Feedback
elements.plz?.addEventListener("input", () => {
  if (/^[0-9]{5}$/.test(elements.plz.value)) {
    markValid(elements.plz);
  } else {
    elements.plz.classList.remove("is-valid");
  }
});

// ==========================
// SUBMIT
// ==========================
form.addEventListener("submit", (e) => {
  e.preventDefault();

  clearError();
  resetValidation();

  const { kleidung, krisengebiet, strasse, plz, ort, submitButton } = elements;

  const selectedRadio = document.querySelector('input[name="uebergabe"]:checked');
  if (!selectedRadio) {
    showError("Bitte wählen Sie eine Übergabeart.");
    return;
  }

  const uebergabe = selectedRadio.value;

  const data = {
    kleidung: kleidung.value.trim(),
    krisengebiet: krisengebiet.value.trim(),
    strasse: strasse.value.trim(),
    plz: plz.value.trim(),
    ort: ort.value.trim()
  };

  let hasError = false;

  function check(field, condition) {
    if (!condition) {
      markInvalid(field);
      hasError = true;
    } else {
      markValid(field);
    }
  }

  // Pflichtfelder
  check(kleidung, data.kleidung !== "");
  check(krisengebiet, data.krisengebiet !== "");

  let ortValue = "Geschäftsstelle Karlsruhe";

  if (uebergabe === UE_ABHOLUNG) {

    check(strasse, data.strasse !== "");
    check(ort, data.ort !== "");

    if (!/^[0-9]{5}$/.test(data.plz)) {
      markInvalid(plz);
      showError("Bitte eine gültige fünfstellige Postleitzahl eingeben.");
      focusFirstError();
      return;
    }

    if (!data.plz.startsWith(GESCHAEFTSSTELLEN_PLZ_PREFIX)) {
      markInvalid(plz);
      showError("Die Adresse liegt nicht im Einzugsgebiet (PLZ muss mit 76 beginnen).");
      focusFirstError();
      return;
    }

    markValid(plz);
    ortValue = data.ort;
  }

  if (hasError) {
    showError("Bitte prüfen Sie die markierten Felder.");
    focusFirstError();
    return;
  }

  // ==========================
  // LOADING UX
  // ==========================
  if (submitButton) {
    submitButton.innerText = "Wird verarbeitet...";
    submitButton.disabled = true;
  }

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
    new URLSearchParams({
      kleidung: data.kleidung,
      krisengebiet: data.krisengebiet,
      uebergabe,
      ort: ortValue,
      strasse: data.strasse,
      plz: data.plz,
      datum,
      uhrzeit
    });

  setTimeout(() => {
    window.location.href = url;
  }, 400);
});