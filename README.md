# Kleiderspenden Webanwendung
## Projektbeschreibung

Die entwickelte Webanwendung dient der strukturierten Erfassung von Kleiderspenden für Menschen in Krisengebieten.
Nutzer haben die Möglichkeit, ihre Spende über ein benutzerfreundliches Formular zu registrieren und eine geeignete Übergabeart auszuwählen.

Die Anwendung unterstützt sowohl die Abgabe in einer Geschäftsstelle als auch die Abholung durch ein Sammelfahrzeug.
Nach erfolgreicher Eingabe wird eine Bestätigungsseite generiert, die alle relevanten Daten übersichtlich darstellt.

## Funktionen

- Erfassung von Kleiderspenden über ein Formular

- Auswahl verschiedener Kleidungsarten (z. B. Jacken, Schuhe, Kinderkleidung)

- Auswahl eines Ziel-Krisengebiets

- Auswahl der Übergabeart:

    - Geschäftsstelle Karlsruhe

    - Abholung durch Sammelfahrzeug

- Dynamisches Ein- und Ausblenden der Adressfelder bei Auswahl „Abholung“

- Validierung der Eingaben (z. B. Pflichtfelder, Postleitzahl-Format)

- Einschränkung des Abholgebiets anhand der Postleitzahl (PLZ beginnt mit „76“)

- Anzeige einer Bestätigungsseite mit allen übergebenen Daten (inkl. Datum und Uhrzeit)

- Responsives Design für Desktop, Tablet und Smartphone

## Technische Umsetzung

Die Anwendung wurde als clientseitige Webanwendung umgesetzt und basiert auf folgenden Technologien:

- HTML5 zur Strukturierung der Inhalte

- CSS3 zur Gestaltung und Layout-Anpassung

- Bootstrap 5 für ein responsives und modernes UI

- JavaScript zur Umsetzung der Formularlogik und Validierung

- URL-Parameter zur Übergabe der Formulardaten an die Bestätigungsseite

- Git zur Versionsverwaltung

- GitHub Pages zur Veröffentlichung der Anwendung

Zusätzlich wurden Aspekte der Benutzerfreundlichkeit (UX) sowie Barrierefreiheit berücksichtigt, wie z. B. klare Navigation, visuelles Feedback und semantische HTML-Strukturen.

## Nutzung der Anwendung

1. Aufrufen der Startseite

2. Wechsel zur Registrierungsseite

3. Auswahl von Kleidung und Krisengebiet

4. Auswahl der Übergabeart

5. (Optional) Eingabe der Adresse bei Abholung

6. Absenden des Formulars

7. Anzeige der Bestätigungsseite mit allen Angaben

## Online-Version

Die Anwendung ist unter folgendem Link erreichbar:

https://furkanbalkan1616.github.io/kleiderspende-webapp/

## Entwicklung & Testing

Die Anwendung wurde lokal über einen HTTP-Server getestet (z. B. mit npx serve), um eine realistische Browserumgebung sicherzustellen.
Der Code wurde mithilfe von Git versioniert und schrittweise weiterentwickelt.

## Autor

Furkan Balkan