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

const elements = {
  radioGeschaeftsstelle: document.getElementById("geschaeftsstelle"),
  radioAbholung: document.getElementById("abholung"),
  adresseBereich: document.getElementById("adresseBereich"),

  kleidung: document.getElementById("kleidung"),
  krisengebiet: document.getElementById("krisengebiet"),
  strasse: document.getElementById("strasse"),
  plz: document.getElementById("plz"),
  ort: document.getElementById("ort"),

  submitButton: form.querySelector("button[type='submit']")
};

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
  if (!box) return;

  box.style.display = "none";
  box.innerText = "";
}

// ==========================
// ADRESSE TOGGLE
// ==========================
function toggleAdresse(show) {
  const { adresseBereich, strasse, plz, ort } = elements;
  if (!adresseBereich) return;

  adresseBereich.style.display = show ? "block" : "none";
  adresseBereich.classList.toggle("is-visible", show);

  strasse.required = show;
  plz.required = show;
  ort.required = show;

  if (!show) {
    strasse.value = "";
    plz.value = "";
    ort.value = "";
  }
}

// ==========================
// INITIAL STATE
// ==========================
const selected = document.querySelector('input[name="uebergabe"]:checked');
toggleAdresse(selected?.value === UE_ABHOLUNG);

// ==========================
// EVENTS
// ==========================
elements.radioAbholung?.addEventListener("change", () => toggleAdresse(true));
elements.radioGeschaeftsstelle?.addEventListener("change", () => toggleAdresse(false));

// ==========================
// SUBMIT
// ==========================
form.addEventListener("submit", (e) => {
  e.preventDefault();
  clearError();

  const {
    kleidung,
    krisengebiet,
    strasse,
    plz,
    ort,
    submitButton
  } = elements;

  const selectedRadio = document.querySelector('input[name="uebergabe"]:checked');
  if (!selectedRadio) return showError("Bitte wählen Sie eine Übergabeart.");

  const uebergabe = selectedRadio.value;

  const data = {
    kleidung: kleidung.value.trim(),
    krisengebiet: krisengebiet.value.trim(),
    strasse: strasse.value.trim(),
    plz: plz.value.trim(),
    ort: ort.value.trim()
  };

  // ==========================
  // VALIDIERUNG
  // ==========================
  if (!data.kleidung || !data.krisengebiet) {
    return showError("Bitte Kleidung und Krisengebiet auswählen.");
  }

  let ortValue = "Geschäftsstelle Karlsruhe";

  if (uebergabe === UE_ABHOLUNG) {

    if (!data.strasse || !data.ort) {
      return showError("Bitte vollständige Adresse eingeben.");
    }

    if (!/^[0-9]{5}$/.test(data.plz)) {
      return showError("Bitte eine gültige 5-stellige PLZ eingeben.");
    }

    if (!data.plz.startsWith(GESCHAEFTSSTELLEN_PLZ_PREFIX)) {
      return showError("Adresse liegt nicht im Einzugsgebiet (PLZ muss mit 76 beginnen).");
    }

    ortValue = data.ort;
  }

  // ==========================
  // LOADING UX
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
    new URLSearchParams({
      kleidung: data.kleidung,
      krisengebiet: data.krisengebiet,
      uebergabe,
      ort: ortValue,
      datum,
      uhrzeit
    });

  setTimeout(() => {
    window.location.href = url;
  }, 400);
});