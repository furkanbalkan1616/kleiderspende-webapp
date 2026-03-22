document.addEventListener("DOMContentLoaded", () => {

  initForm();
  initBestaetigung();
  initAnimation();

});


/* ==========================
   🔐 SANITIZE
========================== */
function sanitize(input) {
  return String(input).replace(/[<>]/g, "");
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

  const geschaeftsstelle = {
    ort: "Karlsruhe",
    plz: "76133"
  };

  function updateAdresseSichtbarkeit() {
    if (abholungRadio.checked) {
      adresseBereich.classList.remove("d-none");
    } else {
      adresseBereich.classList.add("d-none");

      strasseInput.value = "";
      plzInput.value = "";
      ortInput.value = "";

      clearValidation(strasseInput);
      clearValidation(plzInput);
      clearValidation(ortInput);
    }
  }

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

  function validateForm() {
    let errors = [];
    let firstErrorField = null;

    fehlermeldung.classList.add("d-none");
    fehlermeldung.innerHTML = "";

    if (abholungRadio.checked) {

      if (!strasseInput.value.trim()) {
        errors.push("Bitte Straße und Hausnummer angeben.");
        setInvalid(strasseInput);
        firstErrorField ??= strasseInput;
      } else setValid(strasseInput);

      const plz = plzInput.value.trim();

      if (!plz) {
        errors.push("Bitte eine Postleitzahl angeben.");
        setInvalid(plzInput);
        firstErrorField ??= plzInput;
      }
      else if (!/^\d+$/.test(plz)) {
        errors.push("PLZ darf nur Zahlen enthalten.");
        setInvalid(plzInput);
        firstErrorField ??= plzInput;
      }
      else if (plz.substring(0,2) !== geschaeftsstelle.plz.substring(0,2)) {
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

    if (!kleidungSelect.value) {
      errors.push("Bitte eine Art der Kleidung auswählen.");
      setInvalid(kleidungSelect);
      firstErrorField ??= kleidungSelect;
    } else setValid(kleidungSelect);

    if (!krisengebietSelect.value) {
      errors.push("Bitte ein Krisengebiet auswählen.");
      setInvalid(krisengebietSelect);
      firstErrorField ??= krisengebietSelect;
    } else setValid(krisengebietSelect);

    if (errors.length > 0) {
      fehlermeldung.innerHTML = errors.join("<br>");
      fehlermeldung.classList.remove("d-none");
      firstErrorField?.focus();
      return false;
    }

    return true;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const daten = {
      uebergabe: abholungRadio.checked ? "Abholung" : "Geschaeftsstelle",
      strasse: sanitize(strasseInput.value),
      plz: sanitize(plzInput.value),
      ort: sanitize(ortInput.value),
      kleidung: sanitize(kleidungSelect.value),
      krisengebiet: sanitize(krisengebietSelect.value),
      datum: new Date().toISOString()
    };

    localStorage.setItem("spendenDaten", JSON.stringify(daten));

    window.location.href = "bestaetigung.html";
  });

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
    hinweis.textContent = "";
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

  if (daten.uebergabe === "Abholung") {
    hinweis.textContent = "Ihre Abholanfrage wurde registriert.";
  } else {
    hinweis.textContent = "Bitte bringen Sie Ihre Spende zur Geschäftsstelle.";
  }
}


/* ==========================
   ✨ ANIMATION
========================== */
function initAnimation() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  });

  document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
}