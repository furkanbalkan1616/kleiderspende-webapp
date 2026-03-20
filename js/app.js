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

  function updateAdresseSichtbarkeit() {
    if (abholungRadio.checked) {
      adresseBereich.style.display = "block";
      adresseBereich.classList.add("is-visible");
      adresseBereich.setAttribute("aria-hidden", "false");
    } else {
      adresseBereich.classList.remove("is-visible");
      adresseBereich.style.display = "none";
      adresseBereich.setAttribute("aria-hidden", "true");

      strasseInput.value = "";
      plzInput.value = "";
      ortInput.value = "";

      strasseInput.classList.remove("is-invalid", "is-valid");
      plzInput.classList.remove("is-invalid", "is-valid");
      ortInput.classList.remove("is-invalid", "is-valid");
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

    fehlermeldung.classList.add("d-none");
    fehlermeldung.innerHTML = "";

    if (abholungRadio.checked) {
      if (!strasseInput.value.trim()) {
        errors.push("Bitte Straße und Hausnummer angeben.");
        setInvalid(strasseInput);
      } else {
        setValid(strasseInput);
      }

      const plz = plzInput.value.trim();
      if (!plz) {
        errors.push("Bitte eine Postleitzahl angeben.");
        setInvalid(plzInput);
      } else {
        setValid(plzInput);
      }

      if (!ortInput.value.trim()) {
        errors.push("Bitte einen Ort angeben.");
        setInvalid(ortInput);
      } else {
        setValid(ortInput);
      }
    } else {
      clearValidation(strasseInput);
      clearValidation(plzInput);
      clearValidation(ortInput);
    }

    if (!kleidungSelect.value) {
      errors.push("Bitte eine Art der Kleidung auswählen.");
      setInvalid(kleidungSelect);
    } else {
      setValid(kleidungSelect);
    }

    if (!krisengebietSelect.value) {
      errors.push("Bitte ein Krisengebiet auswählen.");
      setInvalid(krisengebietSelect);
    } else {
      setValid(krisengebietSelect);
    }

    if (errors.length > 0) {
      fehlermeldung.innerHTML = errors.join("<br>");
      fehlermeldung.classList.remove("d-none");
      return false;
    }

    return true;
  }

  abholungRadio.addEventListener("change", updateAdresseSichtbarkeit);
  geschaeftsstelleRadio.addEventListener("change", updateAdresseSichtbarkeit);

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (validateForm()) {
      const daten = {
        uebergabe: abholungRadio.checked ? "Abholung (Sammelfahrzeug)" : "Übergabe an der Geschäftsstelle",
        strasse: strasseInput.value.trim(),
        plz: plzInput.value.trim(),
        ort: ortInput.value.trim(),
        kleidung: kleidungSelect.value,
        krisengebiet: krisengebietSelect.value
      };

      localStorage.setItem("spendenDaten", JSON.stringify(daten));
      window.location.href = "bestaetigung.html";
    }
  });

  updateAdresseSichtbarkeit();
});