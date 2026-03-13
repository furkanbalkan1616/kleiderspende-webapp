// Elemente holen
const radioGeschaeftsstelle = document.getElementById("geschaeftsstelle");
const radioAbholung = document.getElementById("abholung");
const adresseBereich = document.getElementById("adresseBereich");
const form = document.getElementById("spendenForm");

// Adresse anzeigen wenn Abholung gewählt wird
radioAbholung.addEventListener("change", function () {
    adresseBereich.style.display = "block";
});

// Adresse verstecken wenn Geschäftsstelle gewählt wird
radioGeschaeftsstelle.addEventListener("change", function () {
    adresseBereich.style.display = "none";
});

// Formular prüfen
form.addEventListener("submit", function (event) {

    const kleidung = document.getElementById("kleidung").value;
    const krisengebiet = document.getElementById("krisengebiet").value;
    const plz = document.getElementById("plz").value;
    const ort = document.getElementById("ort").value;
    const strasse = document.getElementById("strasse").value;

    const uebergabe = document.querySelector('input[name="uebergabe"]:checked').value;

    // Kleidung prüfen
    if (kleidung === "") {
        alert("Bitte Kleidung auswählen.");
        event.preventDefault();
        return;
    }

    // Krisengebiet prüfen
    if (krisengebiet === "") {
        alert("Bitte Krisengebiet auswählen.");
        event.preventDefault();
        return;
    }

    // Wenn Abholung gewählt wurde
    if (uebergabe === "Abholung") {

        // Adresse prüfen
        if (strasse === "" || ort === "" || plz === "") {
            alert("Bitte vollständige Abholadresse eingeben.");
            event.preventDefault();
            return;
        }

        // Prüfen ob PLZ 5 Zahlen hat
        if (!/^[0-9]{5}$/.test(plz)) {
            alert("Bitte eine gültige Postleitzahl eingeben.");
            event.preventDefault();
            return;
        }

        // Prüfen ob erste zwei Ziffern passen (z.B. 76)
        if (plz.substring(0, 2) !== "76") {
            alert("Adresse liegt nicht im Einzugsgebiet der Geschäftsstelle.");
            event.preventDefault();
            return;
        }
    }

    // Datum und Uhrzeit erzeugen
    const jetzt = new Date();
    const datum = jetzt.toLocaleDateString();
    const uhrzeit = jetzt.toLocaleTimeString();

    // Weiterleitung zur Bestätigungsseite
    const url = "bestaetigung.html?" +
        "kleidung=" + encodeURIComponent(kleidung) +
        "&krisengebiet=" + encodeURIComponent(krisengebiet) +
        "&uebergabe=" + encodeURIComponent(uebergabe) +
        "&ort=" + encodeURIComponent(ort) +
        "&datum=" + encodeURIComponent(datum) +
        "&uhrzeit=" + encodeURIComponent(uhrzeit);

    event.preventDefault();
    window.location.href = url;

});