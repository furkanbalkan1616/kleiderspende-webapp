document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("spendenForm");
  const fehlermeldung = document.getElementById("fehlermeldung");

  const geschaeftsstelleRadio = document.getElementById("geschaeftsstelle");
  const abholungRadio = document.getElementById("abholung");
  const adresseBereich = document.getElementById("adresseBereich");

  const strasseInput = document.getElementById("strasse");
  const plzInput = document.getElementById("plz");
  const ortInput = document.getElementById("ort");
  const kleidungSelect = document.getElementById("kleidung");
  const krisengebietSelect = document.getElementById("krisengebiet");


  // 🔐 Sicherheit
  function sanitize(input) {
    return input.replace(/</g, "").replace(/>/g, "");
  }


  // 🔄 Adresse anzeigen/verstecken
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


  // 🎨 Validation UI
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


  // 🔍 Formular validieren
  function validateForm() {
    let errors = [];
    let firstErrorField = null;

    fehlermeldung.classList.add("d-none");
    fehlermeldung.innerHTML = "";

    if (abholungRadio.checked) {

      // Straße
      if (!strasseInput.value.trim()) {
        errors.push("Bitte Straße und Hausnummer angeben.");
        setInvalid(strasseInput);
        if (!firstErrorField) firstErrorField = strasseInput;
      } else {
        setValid(strasseInput);
      }

      // PLZ
      const plz = plzInput.value.trim();

      if (!plz) {
        errors.push("Bitte eine Postleitzahl angeben.");
        setInvalid(plzInput);
        if (!firstErrorField) firstErrorField = plzInput;
      } 
      else if (!/^\d+$/.test(plz)) {
        errors.push("PLZ darf nur Zahlen enthalten.");
        setInvalid(plzInput);
        if (!firstErrorField) firstErrorField = plzInput;
      }
      else if (plz.substring(0, 2) !== "70") {
        errors.push("Adresse liegt nicht im Einzugsgebiet (PLZ muss mit 70 beginnen).");
        setInvalid(plzInput);
        if (!firstErrorField) firstErrorField = plzInput;
      } 
      else {
        setValid(plzInput);
      }

      // Ort
      if (!ortInput.value.trim()) {
        errors.push("Bitte einen Ort angeben.");
        setInvalid(ortInput);
        if (!firstErrorField) firstErrorField = ortInput;
      } else {
        setValid(ortInput);
      }

    } else {
      clearValidation(strasseInput);
      clearValidation(plzInput);
      clearValidation(ortInput);
    }

    // Kleidung
    if (!kleidungSelect.value) {
      errors.push("Bitte eine Art der Kleidung auswählen.");
      setInvalid(kleidungSelect);
      if (!firstErrorField) firstErrorField = kleidungSelect;
    } else {
      setValid(kleidungSelect);
    }

    // Krisengebiet
    if (!krisengebietSelect.value) {
      errors.push("Bitte ein Krisengebiet auswählen.");
      setInvalid(krisengebietSelect);
      if (!firstErrorField) firstErrorField = krisengebietSelect;
    } else {
      setValid(krisengebietSelect);
    }

    if (errors.length > 0) {
      fehlermeldung.innerHTML = errors.join("<br>");
      fehlermeldung.classList.remove("d-none");

      // 🔥 UX: nach oben scrollen
      window.scrollTo({ top: 0, behavior: "smooth" });

      // 🔥 Fokus auf erstes Feld
      if (firstErrorField) {
        firstErrorField.focus();
      }

      return false;
    }

    return true;
  }


  // 📩 Formular absenden (WOW Version)
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (validateForm()) {

      const button = form.querySelector("button");

      // 🔥 UX WOW
      button.disabled = true;
      button.innerText = "Wird verarbeitet...";

      const daten = {
        uebergabe: abholungRadio.checked
          ? "Abholung (Sammelfahrzeug)"
          : "Übergabe an der Geschäftsstelle",

        strasse: sanitize(strasseInput.value.trim()),
        plz: sanitize(plzInput.value.trim()),
        ort: sanitize(ortInput.value.trim()),
        kleidung: sanitize(kleidungSelect.value),
        krisengebiet: sanitize(krisengebietSelect.value),
        datum: new Date().toLocaleString()
      };

      localStorage.setItem("spendenDaten", JSON.stringify(daten));

      // 🔥 kleine Verzögerung (realistisch)
      setTimeout(() => {
        window.location.href = "bestaetigung.html";
      }, 600);
    }
  });


  // 🔁 Events
  abholungRadio.addEventListener("change", updateAdresseSichtbarkeit);
  geschaeftsstelleRadio.addEventListener("change", updateAdresseSichtbarkeit);

  updateAdresseSichtbarkeit();


  /* ==========================
     SCROLL ANIMATION (WOW)
  ========================== */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  });

  document.querySelectorAll(".fade-in").forEach(el => {
    observer.observe(el);
  });

});