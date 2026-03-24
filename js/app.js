document.addEventListener("DOMContentLoaded", () => {
  initForm();
  initBestaetigung();
  initAnimation();
});


/* ==========================
   🔐 SANITIZE (SICHERHEIT)
========================== */
function sanitize(input) {
  const div = document.createElement("div");
  div.textContent = input;
  return div.textContent.trim();
}


/* ==========================
   🟢 FORMULAR
========================== */
function initForm() {

  const form = document.getElementById("spendenForm");
  if (!form) return;

  const fehlermeldung = document.getElementById("fehlermeldung");

  const geschaeftsstelleRadio = document.getElementById("geschaeftsstelle");
  const abholungRadio = document.getElementById("abholung");
  const adresseBereich = document.getElementById("adresseBereich");

  const strasseInput = document.getElementById("strasse");
  const plzInput = document.getElementById("plz");
  const ortInput = document.getElementById("ort");
  const kleidungSelect = document.getElementById("kleidung");
  const krisengebietSelect = document.getElementById("krisengebiet");

  const submitBtn = form.querySelector("button[type='submit']");

  const GESCHAEFTS_PLZ_PREFIX = "76";


  /* ==========================
     🔁 ADRESSE TOGGLE
  ========================== */
  function updateAdresseSichtbarkeit() {
    const isAbholung = abholungRadio.checked;

    adresseBereich.classList.toggle("d-none", !isAbholung);

    strasseInput.required = isAbholung;
    plzInput.required = isAbholung;
    ortInput.required = isAbholung;

    if (!isAbholung) {
      strasseInput.value = "";
      plzInput.value = "";
      ortInput.value = "";

      clearValidation(strasseInput);
      clearValidation(plzInput);
      clearValidation(ortInput);
    }
  }


  /* ==========================
     🎨 VALIDIERUNG UI
  ========================== */
  function setInvalid(field) {
    field.classList.add("is-invalid");
    field.classList.remove("is-valid");
  }

  function setValid(field) {
    field.classList.remove("is-invalid");
    field.classList.add("is-valid");
  }

  function clearValidation(field) {
    field.classList.remove("is-invalid", "is-valid");
  }


  /* ==========================
     🔍 VALIDIERUNG
  ========================== */
  function validateForm() {

    let errors = [];
    let firstErrorField = null;

    fehlermeldung.classList.add("d-none");
    fehlermeldung.textContent = "";

    // 🔥 FIX: SELECT VALIDIERUNG
    if (kleidungSelect.selectedIndex === 0) {
      errors.push("Bitte eine Art der Kleidung auswählen.");
      setInvalid(kleidungSelect);
      firstErrorField ??= kleidungSelect;
    } else setValid(kleidungSelect);

    if (krisengebietSelect.selectedIndex === 0) {
      errors.push("Bitte ein Krisengebiet auswählen.");
      setInvalid(krisengebietSelect);
      firstErrorField ??= krisengebietSelect;
    } else setValid(krisengebietSelect);

    // Adresse nur bei Abholung
    if (abholungRadio.checked) {

      if (!strasseInput.value.trim()) {
        errors.push("Bitte Straße und Hausnummer angeben.");
        setInvalid(strasseInput);
        firstErrorField ??= strasseInput;
      } else setValid(strasseInput);

      const plz = plzInput.value.trim();

      if (!/^\d{5}$/.test(plz)) {
        errors.push("Die Postleitzahl muss genau 5 Ziffern enthalten.");
        setInvalid(plzInput);
        firstErrorField ??= plzInput;
      }
      else if (plz.substring(0, 2) !== GESCHAEFTS_PLZ_PREFIX) {
        errors.push("Adresse liegt nicht im Einzugsgebiet der Geschäftsstelle.");
        setInvalid(plzInput);
        firstErrorField ??= plzInput;
      }
      else {
        setValid(plzInput);
      }

      if (!ortInput.value.trim()) {
        errors.push("Bitte einen Ort angeben.");
        setInvalid(ortInput);
        firstErrorField ??= ortInput;
      } else setValid(ortInput);
    }

    if (errors.length > 0) {
      fehlermeldung.textContent = errors.join(" | ");
      fehlermeldung.classList.remove("d-none");
      firstErrorField?.focus();
      return false;
    }

    return true;
  }


  /* ==========================
     📤 SUBMIT (FIXED)
  ========================== */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Wird verarbeitet...`;

    const daten = {
      uebergabe: abholungRadio.checked ? "Abholung" : "Geschäftsstelle",

      strasse: sanitize(strasseInput.value),
      plz: sanitize(plzInput.value),
      ort: sanitize(ortInput.value),

      // 🔥 FIX: TEXT statt VALUE
      kleidung: sanitize(
        kleidungSelect.options[kleidungSelect.selectedIndex].text
      ),
      krisengebiet: sanitize(
        krisengebietSelect.options[krisengebietSelect.selectedIndex].text
      ),

      datum: new Date().toISOString()
    };

    try {
      localStorage.setItem("spendenDaten", JSON.stringify(daten));
      window.location.href = "bestaetigung.html";
    } catch (error) {
      fehlermeldung.textContent = "Fehler beim Speichern der Daten.";
      fehlermeldung.classList.remove("d-none");
      submitBtn.disabled = false;
      submitBtn.textContent = "Registrierung abschließen";
    }
  });


  /* ==========================
     🎯 EVENTS
  ========================== */
  abholungRadio.addEventListener("change", updateAdresseSichtbarkeit);
  geschaeftsstelleRadio.addEventListener("change", updateAdresseSichtbarkeit);

  updateAdresseSichtbarkeit();
}


/* ==========================
   🟢 BESTÄTIGUNG
========================== */
function initBestaetigung() {

  const datenBox = document.getElementById("datenBox");
  if (!datenBox) return;

  const hinweis = document.getElementById("hinweistext");

  const datenRaw = localStorage.getItem("spendenDaten");

  if (!datenRaw) {
    datenBox.innerHTML = `
      <p class="text-center">
        Keine Daten vorhanden.<br>
        Bitte registrieren Sie zuerst eine Spende.
      </p>
    `;
    if (hinweis) hinweis.textContent = "";
    return;
  }

  let daten;

  try {
    daten = JSON.parse(datenRaw);
  } catch {
    datenBox.textContent = "Fehler beim Laden der Daten.";
    return;
  }

  const d = new Date(daten.datum);

  document.getElementById("kleidung").textContent = daten.kleidung;
  document.getElementById("krisengebiet").textContent = daten.krisengebiet;
  document.getElementById("uebergabe").textContent = daten.uebergabe;
  document.getElementById("strasse").textContent = daten.strasse || "-";
  document.getElementById("plz").textContent = daten.plz || "-";
  document.getElementById("ort").textContent = daten.ort || "-";
  document.getElementById("datum").textContent = d.toLocaleDateString("de-DE");
  document.getElementById("uhrzeit").textContent = d.toLocaleTimeString("de-DE");

  if (hinweis) {
    hinweis.textContent =
      daten.uebergabe === "Abholung"
        ? "Ihre Abholanfrage wurde erfolgreich registriert."
        : "Bitte bringen Sie Ihre Spende zur Geschäftsstelle.";
  }
}


/* ==========================
   ✨ ANIMATION
========================== */
function initAnimation() {

  const elements = document.querySelectorAll(".fade-in");
  if (elements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  });

  elements.forEach(el => observer.observe(el));
}