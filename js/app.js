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

const radioGeschaeftsstelle = document.getElementById("geschaeftsstelle");
const radioAbholung = document.getElementById("abholung");
const adresseBereich = document.getElementById("adresseBereich");

const kleidungInput = document.getElementById("kleidung");
const krisengebietInput = document.getElementById("krisengebiet");
const strasseInput = document.getElementById("strasse");
const plzInput = document.getElementById("plz");
const ortInput = document.getElementById("ort");

const submitButton = form.querySelector("button[type='submit']");

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
  if (box) {
    box.style.display = "none";
    box.innerText = "";
  }
}

// ==========================
// ADRESSE TOGGLE
// ==========================
function toggleAdresse(show) {
  if (!adresseBereich) return;

  if (show) {
    adresseBereich.style.display = "block";
    adresseBereich.classList.add("is-visible");

    strasseInput.required = true;
    plzInput.required = true;
    ortInput.required = true;
  } else {
    adresseBereich.style.display = "none";
    adresseBereich.classList.remove("is-visible");

    strasseInput.required = false;
    plzInput.required = false;
    ortInput.required = false;

    strasseInput.value = "";
    plzInput.value = "";
    ortInput.value = "";
  }
}

// ==========================
// INITIAL STATE (WICHTIG!)
// ==========================
const selected = document.querySelector('input[name="uebergabe"]:checked');
toggleAdresse(selected?.value === UE_ABHOLUNG);

// ==========================
// EVENTS
// ==========================
radioAbholung?.addEventListener("change", () => toggleAdresse(true));
radioGeschaeftsstelle?.addEventListener("change", () => toggleAdresse(false));

// ==========================
// SUBMIT
// ==========================
form.addEventListener("submit", function (e) {
  e.preventDefault();

  clearError();

  const kleidung = kleidungInput.value.trim();
  const krisengebiet = krisengebietInput.value.trim();
  const plz = plzInput.value.trim();
  const ortInputValue = ortInput.value.trim();
  const strasse = strasseInput.value.trim();

  const selectedRadio = document.querySelector('input[name="uebergabe"]:checked');

  if (!selectedRadio) {
    showError("Bitte wählen Sie eine Übergabeart.");
    return;
  }

  const uebergabe = selectedRadio.value;

  // ==========================
  // VALIDIERUNG
  // ==========================
  if (!kleidung || !krisengebiet) {
    showError("Bitte Kleidung und Krisengebiet auswählen.");
    return;
  }

  let ort = "Geschäftsstelle Karlsruhe";

  if (uebergabe === UE_ABHOLUNG) {

    if (!strasse || !ortInputValue) {
      showError("Bitte vollständige Adresse eingeben.");
      return;
    }

    if (!/^[0-9]{5}$/.test(plz)) {
      showError("Bitte eine gültige 5-stellige PLZ eingeben.");
      return;
    }

    if (!plz.startsWith(GESCHAEFTSSTELLEN_PLZ_PREFIX)) {
      showError("Adresse liegt nicht im Einzugsgebiet (PLZ muss mit 76 beginnen).");
      return;
    }

    ort = ortInputValue;
  }

  // ==========================
  // LOADING UX (WOW-Effekt)
  // ==========================
  if (submitButton) {
    submitButton.innerText = "Wird verarbeitet...";
    submitButton.disabled = true;
  }

  // ==========================
  // DATUM
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
    "kleidung=" + encodeURIComponent(kleidung) +
    "&krisengebiet=" + encodeURIComponent(krisengebiet) +
    "&uebergabe=" + encodeURIComponent(uebergabe) +
    "&ort=" + encodeURIComponent(ort) +
    "&datum=" + encodeURIComponent(datum) +
    "&uhrzeit=" + encodeURIComponent(uhrzeit);

  setTimeout(() => {
    window.location.href = url;
  }, 400);
});