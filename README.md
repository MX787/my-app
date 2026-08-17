# Kalender-App

Android-App zur Verwaltung der auf dem Gerät gespeicherten Kalendertermine. Die App wurde mit Ionic, Vue.js, TypeScript und Capacitor entwickelt und greift auf den Standardkalender des Geräts zu.

## Funktionen

- Kalenderberechtigungen werden beim ersten Start angefordert
- Termine des Standardkalenders werden nach Startdatum sortiert angezeigt
- Freitextsuche nach Termintitel
- Detailansicht mit Titel, Ort, Start, Ende und Ganztägig-Status
- Ort in Google Maps öffnen oder in die Zwischenablage kopieren
- Termine nach Bestätigung löschen
- neue Termine erstellen und Zielkalender auswählen
- alle Ansichten sind Vue.js-Komponenten

## Technologien und native Funktionen

- Vue.js, Ionic und TypeScript
- Capacitor für Android
- nativer Kalenderzugriff
- native Zwischenablage

## Repository-Struktur

- `my-app/` – vollständiger Quellcode und Android-Projekt
- `Kalender-App.apk` – installierbare Android-Debug-APK
- `Kalender-App_Praesentation.pptx` – Präsentation, sofern für die Abgabe benötigt

## Voraussetzungen

- Node.js und npm
- Android Studio mit Android SDK für einen neuen nativen Build
- Android-Gerät oder Emulator mit eingerichtetem Kalender

## Projekt starten

```powershell
cd my-app
npm install
npm run dev
```

Der Zugriff auf den Gerätekalender funktioniert nur in der nativen Android-App, nicht in der Browser-Vorschau.

## Android-App bauen

```powershell
cd my-app
npm run build
npx cap sync android
cd android
.\gradlew.bat assembleDebug
```

Die erzeugte APK befindet sich anschließend unter:

```text
my-app/android/app/build/outputs/apk/debug/app-debug.apk
```

## Qualitätssicherung

```powershell
cd my-app
npm run lint
npm run test:unit -- --run
```

Die App wurde erfolgreich auf zwei Android-Geräten mit unterschiedlichen Standardkalendern getestet.

## Entwickler

- Maximilian Ekgardt
- Szymon Moleda
- Tim Seifried
