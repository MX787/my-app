# Dokumentation der KI-Nutzung

Für die Entwicklung der Kalender-App wurde ein KI-gestützter Programmierassistent (OpenAI Codex) als Hilfsmittel verwendet.

## Einsatzbereiche

Die KI wurde insbesondere für folgende Aufgaben genutzt:

- Analyse der Aufgabenstellung und Ableitung der benötigten Ansichten und Funktionen
- Unterstützung bei der Strukturierung der Vue.js- und Ionic-Komponenten
- Erstellung und Überarbeitung von TypeScript- und Vue-Code
- Einbindung und Verwendung der Capacitor-Plugins für Kalender und Zwischenablage
- Konfiguration der unter Android benötigten Kalenderberechtigungen
- Fehlersuche bei der nativen Kalenderabfrage auf Android
- Unterstützung beim Erstellen von Unit-Tests und bei der Prüfung durch Build und Linter
- Erstellung dieser Projektdokumentation und Strukturierung des GitHub-Repositories

## Prüfung der Ergebnisse

Die von der KI vorgeschlagenen beziehungsweise erstellten Inhalte wurden nicht ungeprüft übernommen. Die App wurde gebaut, auf zwei realen Android-Geräten getestet und anhand der Aufgabenstellung kontrolliert. Dabei wurden unter anderem folgende Funktionen praktisch geprüft:

- Anfordern der Kalenderberechtigungen
- Laden und Sortieren der Termine des Standardkalenders
- Anzeigen der Termindetails
- Erstellen und Löschen von Terminen
- Bestätigungsdialog vor dem Löschen
- Öffnen eines Ortes in Google Maps
- Kopieren eines Ortes in die Zwischenablage
- Suche nach Termintiteln
- Auswahl eines Kalenders beim Erstellen eines Termins

Zusätzlich wurden der TypeScript-/Produktions-Build, ESLint und der vorhandene Unit-Test erfolgreich ausgeführt.

## Verantwortung

Die KI diente als unterstützendes Werkzeug. Auswahl, Prüfung, Anpassung und Abgabe der Ergebnisse sowie das Verständnis des verwendeten Codes liegen bei den Projektmitgliedern.

## Verwendetes Werkzeug

- OpenAI Codex

## Projektmitglieder

- Maximilian Ekgardt
- Szymon Moleda
- Tim Seifried
