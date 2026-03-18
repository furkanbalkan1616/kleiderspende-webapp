const GESCHAEFTSSTELLEN_PLZ_PREFIX = "76";

// Elemente holen
const radioGeschaeftsstelle = document.getElementById("geschaeftsstelle");
const radioAbholung = document.getElementById("abholung");
const adresseBereich = document.getElementById("adresseBereich");
const form = document.getElementById("spendenForm");

const kleidungInput = document.getElementById("kleidung");
const krisengebietInput = document.getElementById("krisengebiet");
const strasseInput = document.getElementById("strasse");
const plzInput = document.getElementById("plz");
const ortInput = document.getElementById("ort");

// Script nur ausführen, wenn Formular auf der Seite vorhanden ist
if (
  form &&
  radioGeschaeftsstelle &&
  radioAbholung &&
  adresseBereich &&
  kleidungInput &&
  krisengebietInput &&
  strasseInput &&
  plzInput &&
  ortInput
) {
  function setAbholungFieldsRequired(isRequired) {
    strasseInput.required = isRequired;
    plzInput.required = isRequired;
    ortInput.required = isRequired;
  }

  function clearAddressFields() {
    strasseInput.value = "";
    plzInput.value = "";
    ortInput.value = "";
  }

  function clearValidationState() {
    [kleidungInput, krisengebietInput, strasseInput, plzInput, ortInput].forEach((field) => {
      field.classList.remove("is-invalid");
      field.classList.remove("is-valid");
    });
  }

  function setFieldError(field) {
    field.classList.add("is-invalid");
    field.classList.remove("is-valid");
  }

  function setFieldValid(field) {
    field.classList.add("is-valid");
    field.classList.remove("is-invalid");
  }

  function showError(text) {
    const fehlermeldung = document.getElementById("fehlermeldung");
    fehlermeldung.innerText = text;
    fehlermeldung.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function clearTopError() {
    const fehlermeldung = document.getElementById("fehlermeldung");
    fehlermeldung.style.display = "none";
    fehlermeldung.innerText = "";
  }

  // Startzustand
  setAbholungFieldsRequired(false);

  // Adresse anzeigen, wenn Abholung gewählt wird
  radioAbholung.addEventListener("change", function () {
    adresseBereich.style.display = "block";
    setAbholungFieldsRequired(true);
    strasseInput.focus();
  });

  // Adresse verstecken, wenn Geschäftsstelle gewählt wird
  radioGeschaeftsstelle.addEventListener("change", function () {
    adresseBereich.style.display = "none";
    setAbholungFieldsRequired(false);
    clearAddressFields();
    clearValidationState();
    clearTopError();
  });

  // Formular prüfen
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    clearTopError();
    clearValidationState();

    const kleidung = kleidungInput.value.trim();
    const krisengebiet = krisengebietInput.value.trim();
    const plz = plzInput.value.trim();
    const ortEingabe = ortInput.value.trim();
    const strasse = strasseInput.value.trim();

    const uebergabe = document.querySelector('input[name="uebergabe"]:checked').value;

    let hasError = false;

    if (kleidung === "") {
      setFieldError(kleidungInput);
      hasError = true;
    } else {
      setFieldValid(kleidungInput);
    }

    if (krisengebiet === "") {
      setFieldError(krisengebietInput);
      hasError = true;
    } else {
      setFieldValid(krisengebietInput);
    }

    let ort = "Geschäftsstelle Karlsruhe";

    if (uebergabe === "Abholung") {
      if (strasse === "") {
        setFieldError(strasseInput);
        hasError = true;
      } else {
        setFieldValid(strasseInput);
      }

      if (ortEingabe === "") {
        setFieldError(ortInput);
        hasError = true;
      } else {
        setFieldValid(ortInput);
      }

      if (plz === "") {
        setFieldError(plzInput);
        hasError = true;
      } else if (!/^[0-9]{5}$/.test(plz)) {
        setFieldError(plzInput);
        showError("Bitte eine gültige fünfstellige Postleitzahl eingeben.");
        return;
      } else if (plz.substring(0, 2) !== GESCHAEFTSSTELLEN_PLZ_PREFIX) {
        setFieldError(plzInput);
        showError("Die Adresse liegt nicht im Einzugsgebiet der Geschäftsstelle Karlsruhe.");
        return;
      } else {
        setFieldValid(plzInput);
      }

      ort = ortEingabe;
    }

    if (hasError) {
      showError("Bitte prüfen Sie die markierten Felder.");
      return;
    }

    const jetzt = new Date();
    const datum = jetzt.toLocaleDateString("de-DE");
    const uhrzeit = jetzt.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit"
    });

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