document.addEventListener("DOMContentLoaded", () => {

  initForm();
  initBestaetigung();

});


/* ==========================
   🔐 SANITIZE (SICHER)
========================== */
function sanitize(input) {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
}


/* ==========================
   🟢 FORMULAR LOGIK
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

  const GESCHAEFTS_PLZ_PREFIX = "76"; // Karlsruhe Beispiel


  /* 🔄 Adresse ein-/ausblenden */
  function updateAdresseSichtbarkeit() {
    const isAbholung = abholungRadio.checked;

    adresseBereich.classList.toggle("d-none", !isAbholung);

    // required dynamisch setzen
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


  /* 🎨 Validierungsstatus */
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


  /* ✅ VALIDIERUNG */
  function validateForm() {

    let errors = [];
    let firstErrorField = null;

    fehlermeldung.classList.add("d-none");
    fehlermeldung.textContent = "";

    // Kleidung
    if (!kleidungSelect.value) {
      errors.push("Bitte eine Art der Kleidung auswählen.");
      setInvalid(kleidungSelect);
      firstErrorField ??= kleidungSelect;
    } else setValid(kleidungSelect);

    // Krisengebiet
    if (!krisengebietSelect.value) {
      errors.push("Bitte ein Krisengebiet auswählen.");
      setInvalid(krisengebietSelect);
      firstErrorField ??= krisengebietSelect;
    } else setValid(krisengebietSelect);


    /* 🚚 Abholung prüfen */
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
      else if (plz.substring(0,2) !== GESCHAEFTS_PLZ_PREFIX) {
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


    /* ❌ Fehler anzeigen */
    if (errors.length > 0) {
      fehlermeldung.textContent = errors.join(" | ");
      fehlermeldung.classList.remove("d-none");
      firstErrorField?.focus();
      return false;
    }

    return true;
  }


  /* 🚀 SUBMIT */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // UX: Button deaktivieren
    const btn = form.querySelector("button");
    btn.disabled = true;
    btn.textContent = "Wird verarbeitet...";

    const daten = {
      uebergabe: abholungRadio.checked ? "Abholung" : "Geschäftsstelle",
      strasse: sanitize(strasseInput.value),
      plz: sanitize(plzInput.value),
      ort: sanitize(ortInput.value),
      kleidung: sanitize(kleidungSelect.value),
      krisengebiet: sanitize(krisengebietSelect.value),
      datum: new Date().toLocaleString("de-DE")
    };

    localStorage.setItem("spendenDaten", JSON.stringify(daten));

    window.location.href = "bestaetigung.html";
  });


  /* 🔁 Events */
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

  const daten = JSON.parse(localStorage.getItem("spendenDaten"));

  if (!daten) {
    datenBox.innerHTML = `
      <p class="text-center">
        Keine Daten vorhanden.<br>
        Bitte registrieren Sie zuerst eine Spende.
      </p>
    `;
    if (hinweis) hinweis.textContent = "";
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
        ? "Ihre Abholanfrage wurde registriert."
        : "Bitte bringen Sie Ihre Spende zur Geschäftsstelle.";
  }
}