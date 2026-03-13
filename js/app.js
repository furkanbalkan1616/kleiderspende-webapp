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
form.addEventListener("submit", function(event){

// Formular stoppen damit JavaScript prüfen kann
event.preventDefault();

const kleidung = document.getElementById("kleidung").value;
const krisengebiet = document.getElementById("krisengebiet").value;
const plz = document.getElementById("plz").value;
const ort = document.getElementById("ort").value;
const strasse = document.getElementById("strasse").value;

const uebergabe = document.querySelector('input[name="uebergabe"]:checked').value;


// Kleidung prüfen
if(kleidung === ""){
alert("Bitte Kleidung auswählen.");
return;
}


// Krisengebiet prüfen
if(krisengebiet === ""){
alert("Bitte Krisengebiet auswählen.");
return;
}


// Wenn Abholung gewählt wurde
if(uebergabe === "Abholung"){

// Adresse prüfen
if(strasse === "" || ort === "" || plz === ""){
alert("Bitte vollständige Abholadresse eingeben.");
return;
}

// PLZ Format prüfen
if(!/^[0-9]{5}$/.test(plz)){
alert("Bitte eine gültige Postleitzahl eingeben.");
return;
}

// PLZ Einzugsgebiet prüfen
if(plz.substring(0,2) !== "76"){
alert("Adresse liegt nicht im Einzugsgebiet der Geschäftsstelle.");
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


// Weiterleitung
window.location.href = url;

});