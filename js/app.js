const GESCHAEFTSSTELLEN_PLZ_PREFIX = "76";

// Elemente holen
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

  // 🔒 Sanitizing (XSS Schutz)
  function sanitize(input) {
    return input.replace(/[<>]/g, "");
  }

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

  function showError(text) {
    const box = document.getElementById("fehlermeldung");
    box.innerText = text;
    box.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    [kleidungInput, krisengebietInput, strasseInput, plzInput, ortInput].forEach(f => {
      f.classList.remove("is-invalid", "is-valid");
    });
  }

  // Radio Events
  radioAbholung.addEventListener("change", () => toggleAdresse(true));
  radioGeschaeftsstelle.addEventListener("change", () => toggleAdresse(false));

  // Initial
  toggleAdresse(false);

  // Submit
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    clearError();
    resetValidation();

    const kleidung = sanitize(kleidungInput.value.trim());
    const krisengebiet = sanitize(krisengebietInput.value.trim());
    const strasse = sanitize(strasseInput.value.trim());
    const plz = sanitize(plzInput.value.trim());
    const ortInputValue = sanitize(ortInput.value.trim());

    const uebergabe = document.querySelector('input[name="uebergabe"]:checked').value;

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

    if (uebergabe === "Abholung") {

      check(strasseInput, strasse !== "");
      check(ortInput, ortInputValue !== "");

      if (!/^[0-9]{5}$/.test(plz)) {
        markInvalid(plzInput);
        showError("Bitte eine gültige fünfstellige Postleitzahl eingeben.");
        plzInput.focus();
        return;
      }

      if (!plz.startsWith(GESCHAEFTSSTELLEN_PLZ_PREFIX)) {
        markInvalid(plzInput);
        showError("Die Adresse liegt nicht im Einzugsgebiet der Geschäftsstelle Karlsruhe.");
        plzInput.focus();
        return;
      }

      markValid(plzInput);
      ort = ortInputValue;
    }

    if (hasError) {
      showError("Bitte prüfen Sie die markierten Felder.");
      return;
    }

    // Datum & Uhrzeit
    const now = new Date();
    const datum = now.toLocaleDateString("de-DE");
    const uhrzeit = now.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit"
    });

    // Weiterleitung
    const url =
      "bestaetigung.html?" +
      "kleidung=" + encodeURIComponent(kleidung) +
      "&krisengebiet=" + encodeURIComponent(krisengebiet) +
      "&uebergabe=" + encodeURIComponent(uebergabe) +
      "&ort=" + encodeURIComponent(ort) +
      "&datum=" + encodeURIComponent(datum) +
      "&uhrzeit=" + encodeURIComponent(uhrzeit);

    window.location.href = url;
  });

}