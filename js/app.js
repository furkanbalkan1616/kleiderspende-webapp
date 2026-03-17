// Elemente holen
const radioGeschaeftsstelle = document.getElementById("geschaeftsstelle");
const radioAbholung = document.getElementById("abholung");
const adresseBereich = document.getElementById("adresseBereich");
const form = document.getElementById("spendenForm");

const strasseInput = document.getElementById("strasse");
const plzInput = document.getElementById("plz");
const ortInput = document.getElementById("ort");

// Script nur ausführen, wenn Formular auf der Seite vorhanden ist
if (
  form &&
  radioGeschaeftsstelle &&
  radioAbholung &&
  adresseBereich &&
  strasseInput &&
  plzInput &&
  ortInput
) {
  function setAbholungFieldsRequired(isRequired) {
    strasseInput.required = isRequired;
    plzInput.required = isRequired;
    ortInput.required = isRequired;
  }

  // Startzustand
  setAbholungFieldsRequired(false);

  // Adresse anzeigen, wenn Abholung gewählt wird
  radioAbholung.addEventListener("change", function () {
    adresseBereich.style.display = "block";
    setAbholungFieldsRequired(true);
  });

  // Adresse verstecken, wenn Geschäftsstelle gewählt wird
  radioGeschaeftsstelle.addEventListener("change", function () {
    adresseBereich.style.display = "none";
    setAbholungFieldsRequired(false);
  });

  // Formular prüfen
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const fehlermeldung = document.getElementById("fehlermeldung");
    fehlermeldung.style.display = "none";

    const kleidung = document.getElementById("kleidung").value.trim();
    const krisengebiet = document.getElementById("krisengebiet").value.trim();
    const plz = plzInput.value.trim();
    const ortEingabe = ortInput.value.trim();
    const strasse = strasseInput.value.trim();

    const uebergabe = document.querySelector('input[name="uebergabe"]:checked').value;

    function showError(text) {
      fehlermeldung.innerText = text;
      fehlermeldung.style.display = "block";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (kleidung === "") {
      showError("Bitte Kleidung auswählen.");
      return;
    }

    if (krisengebiet === "") {
      showError("Bitte Krisengebiet auswählen.");
      return;
    }

    let ort = "Geschäftsstelle";

    if (uebergabe === "Abholung") {
      if (strasse === "" || ortEingabe === "" || plz === "") {
        showError("Bitte vollständige Abholadresse eingeben.");
        return;
      }

      if (!/^[0-9]{5}$/.test(plz)) {
        showError("Bitte eine gültige Postleitzahl eingeben.");
        return;
      }

      if (plz.substring(0, 2) !== "76") {
        showError("Adresse liegt nicht im Einzugsgebiet der Geschäftsstelle.");
        return;
      }

      ort = ortEingabe;
    }

    const jetzt = new Date();
    const datum = jetzt.toLocaleDateString("de-DE");
    const uhrzeit = jetzt.toLocaleTimeString("de-DE");

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