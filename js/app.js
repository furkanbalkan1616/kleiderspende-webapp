// Elemente holen
const radioGeschaeft = document.getElementById("geschaeftsstelle");
const radioAbholung = document.getElementById("abholung");

const adresseBereich = document.getElementById("adresseBereich");

const form = document.getElementById("spendenForm");


// Anzeige der Adresse steuern
function aktualisiereAnzeige() {

if (radioAbholung && radioAbholung.checked) {
adresseBereich.style.display = "block";
} else {
adresseBereich.style.display = "none";
}

}


// Event Listener für Radio Buttons
if (radioGeschaeft) {
radioGeschaeft.addEventListener("change", aktualisiereAnzeige);
}

if (radioAbholung) {
radioAbholung.addEventListener("change", aktualisiereAnzeige);
}


// Formular absenden
if (form) {

form.addEventListener("submit", function(e) {

e.preventDefault();

const kleidung = document.getElementById("kleidung").value;
const krisengebiet = document.getElementById("krisengebiet").value;

const uebergabeart = radioAbholung.checked ? "Abholung" : "Geschaeftsstelle";

let ortText = "Geschäftsstelle";


if (uebergabeart === "Abholung") {

const strasse = document.getElementById("strasse").value;
const plz = document.getElementById("plz").value;
const ort = document.getElementById("ort").value;


// PLZ Prüfung
if (!plz.startsWith("12")) {

alert("Abholung ist nur im Einzugsgebiet möglich.");

return;

}

ortText = strasse + ", " + plz + " " + ort;

}


// Datum und Uhrzeit
const datum = new Date().toLocaleDateString();
const uhrzeit = new Date().toLocaleTimeString();


// URL Parameter erstellen
const params = new URLSearchParams({

kleidung: kleidung,
krisengebiet: krisengebiet,
uebergabe: uebergabeart,
ort: ortText,
datum: datum,
uhrzeit: uhrzeit

});


// Weiterleitung
window.location.href = "bestaetigung.html?" + params.toString();

});

}