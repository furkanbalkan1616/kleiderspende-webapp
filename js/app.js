document.addEventListener("DOMContentLoaded", () => {

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

  /* ==========================
     🔐 SANITIZE
  ========================== */
  function sanitize(input) {
    return String(input).replace(/[<>]/g, "");
  }

  /* ==========================
     🏢 GESCHÄFTSSTELLE
  ========================== */
  const geschaeftsstelle = {
    ort: "Karlsruhe",
    plz: "76133"
  };

  /* ==========================
     🔄 ADRESSE TOGGLE
  ========================== */
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

  /* ==========================
     🎨 VALIDATION UI
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
     🔍 VALIDATE FORM
  ========================== */
  function validateForm() {
    let errors = [];
    let firstErrorField = null;

    fehlermeldung.classList.add("d-none");
    fehlermeldung.innerHTML = "";
    fehlermeldung.setAttribute("aria-live", "assertive");

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
      else if (plz.length < 2) {
        errors.push("PLZ ist zu kurz.");
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

    } else {
      clearValidation(strasseInput);
      clearValidation(plzInput);
      clearValidation(ortInput);
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

      window.scrollTo({ top: 0, behavior: "smooth" });
      firstErrorField?.focus();

      return false;
    }

    return true;
  }

  /* ==========================
     📩 SUBMIT
  ========================== */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const button = form.querySelector("button");

    button.disabled = true;
    button.textContent = "Wird verarbeitet...";

    try {
      const daten = {
        uebergabe: abholungRadio.checked
          ? "Abholung"
          : "Geschaeftsstelle",

        strasse: sanitize(strasseInput.value.trim()),
        plz: sanitize(plzInput.value.trim()),
        ort: sanitize(ortInput.value.trim()),
        kleidung: sanitize(kleidungSelect.value),
        krisengebiet: sanitize(krisengebietSelect.value),
        datum: new Date().toISOString()
      };

      localStorage.setItem("spendenDaten", JSON.stringify(daten));

      setTimeout(() => {
        window.location.href = "bestaetigung.html";
      }, 500);

    } catch (error) {
      console.error(error);

      button.disabled = false;
      button.textContent = "Registrierung abschließen";
    }
  });

  abholungRadio.addEventListener("change", updateAdresseSichtbarkeit);
  geschaeftsstelleRadio.addEventListener("change", updateAdresseSichtbarkeit);

  updateAdresseSichtbarkeit();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  });

  document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

});