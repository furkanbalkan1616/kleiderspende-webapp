## Kleiderspenden Webanwendung
1. Projektbeschreibung

Im Rahmen dieser Fallstudie wurde eine clientseitige Webanwendung zur strukturierten Erfassung von Kleiderspenden für Menschen in Krisengebieten entwickelt.

Ziel der Anwendung ist es, Spendenprozesse zu digitalisieren und Nutzenden eine einfache Möglichkeit zu bieten, ihre Kleiderspenden zu registrieren und einer konkreten Krisenregion zuzuweisen.

Die Anwendung ermöglicht sowohl die persönliche Übergabe an einer Geschäftsstelle als auch die Abholung durch ein Sammelfahrzeug. Nach erfolgreicher Registrierung wird eine Bestätigungsseite generiert, welche alle eingegebenen Daten übersichtlich darstellt.

2. Funktionen

Die Webanwendung bietet folgende Funktionalitäten:

- Erfassung von Kleiderspenden über ein interaktives Formular
- Auswahl verschiedener Kleidungsarten (z. B. Jacken, Schuhe, Kinderkleidung)
- Auswahl eines Ziel-Krisengebiets
- Auswahl der Übergabeart:
  - Übergabe an der Geschäftsstelle (Karlsruhe)
  - Abholung durch ein Sammelfahrzeug
- Dynamisches Ein- und Ausblenden der Adressfelder bei Auswahl „Abholung“
- Validierung der Benutzereingaben:
  - Pflichtfeldprüfung
  - Formatprüfung der Postleitzahl (5-stellig)
- Einschränkung des Abholgebiets anhand der Postleitzahl (erste zwei Ziffern müssen „76“ entsprechen)
- Anzeige einer Bestätigungsseite mit allen übergebenen Daten inklusive Datum und Uhrzeit
- Responsives Design für Desktop, Tablet und Smartphone

3. Technische Umsetzung

Die Anwendung wurde als clientseitige Webanwendung realisiert und basiert auf folgenden Technologien:

- HTML5 zur semantischen Strukturierung der Inhalte
- CSS3 zur Gestaltung sowie für Layout- und Designanpassungen
- Bootstrap 5 zur Umsetzung eines responsiven und modernen User Interfaces
- JavaScript (Vanilla JS) zur Implementierung der Formularlogik, Validierung und Interaktivität
- LocalStorage zur temporären Speicherung und Übergabe der Formulardaten an die Bestätigungsseite
- Git zur Versionsverwaltung
- GitHub Pages zur Veröffentlichung der Anwendung

Zusätzlich wurden grundlegende Aspekte der Benutzerfreundlichkeit (UX) sowie der Barrierefreiheit (Accessibility) berücksichtigt, darunter:

- Verwendung semantischer HTML-Elemente (z. B. <header>, <main>, <footer>, <fieldset>)
- Einsatz von ARIA-Attributen zur Verbesserung der Zugänglichkeit
- Visuelles Feedback bei fehlerhaften Eingaben
- Klare und intuitive Navigationsstruktur

4. Nutzung der Anwendung

Die Nutzung der Anwendung erfolgt in folgenden Schritten:

1. Aufrufen der Startseite
2. Navigation zur Registrierungsseite
3. Auswahl der Kleidungsart und des Ziel-Krisengebiets
4. Auswahl der Übergabeart
5. (Optional) Eingabe der Abholadresse bei Auswahl „Abholung“
6. Absenden des Formulars
7. Anzeige der Bestätigungsseite mit allen eingegebenen Daten

5. Online-Version

Die Anwendung ist unter folgendem Link erreichbar:

👉 https://furkanbalkan1616.github.io/kleiderspende-webapp/

6. Entwicklung & Testing

Die Anwendung wurde lokal mithilfe eines HTTP-Servers (z. B. npx serve) getestet, um eine realitätsnahe Browserumgebung sicherzustellen.

Während der Entwicklung wurde besonderer Wert gelegt auf:

- schrittweise Implementierung der Funktionalitäten
- kontinuierliche Validierung und Testing der Eingaben
- saubere und nachvollziehbare Code-Struktur

Die Versionsverwaltung erfolgte über Git, wobei Änderungen regelmäßig dokumentiert und versioniert wurden.

7. Autor

Furkan Balkan