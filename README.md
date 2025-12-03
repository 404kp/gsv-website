# webit-testprojekt

## Team

Project manager: Karl Pommer

Design: Karl Pommer

Frontend: Karl Pommer

## Installed Components



## Understanding the Configurations

At the different files like ```config.mjs``` you can configure different paths to the development or build directory, external modules or adjust the build processes and many more. We recommend to don't change the different default values. But feel free to do some experiments! All of the following options are required! The program won't crush instantly but we want to ensure a correct running project.

### Client configuration (config-client.mjs)

Don't push this configuration! It contains sensitive data about passwords and logins.

| Option                          | Function                            | Type    |
|---------------------------------|-------------------------------------|---------|
| passphrase                   git reset --soft HEAD   | An alternative to the SSH login.    | !string |
| privateKeyFileWithinHomeDirRoot | The path to the local SSH key file. | !string |
| localDevelopmentUrl             | The address to your local development system. Used to validate the generated html | !string |

### Host configuration (config-host.mjs)

| Option              | Function                                                                                                                                                                            | Type    |
|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|
| Stage configuration | The key represents the name of the stage to deploy to. The value is another object which retrieves three options to log into the remote server: username, hostname and deploy path. | !Object |

### General configuration (config.mjs)

Please take a look at [the configuration file](./kickstart-scripts/config.mjs). There are too many options to handle them at two points. If a configuration paramater gets changed we will update the comments so you won't miss something.

### Scripts

There are multiple npm scripts available to run from either an IDE or via a command line tool. Please take a look at the [package.json](./package.json) for more information.

## Wöchentliche Aktualisierung (Fußball-Daten)

Die Fußball-Daten (letztes Spiel, nächstes Spiel, Tabellenplatz) im Teaser auf der Startseite werden automatisch von **Fupa.net** und **Fussball.de** abgerufen.

### Automatische Aktualisierung
Der Abruf der Daten ist in den Build-Prozess integriert. Jedes Mal, wenn das Projekt neu gebaut wird, werden die Daten aktualisiert.

```bash
# Für Entwicklung (lokal)
npm run build:dev

# Für Produktion (Deployment)
npm run build:prod
```

### Manuelle Aktualisierung
Falls nur die Fußball-Daten aktualisiert werden sollen, ohne das gesamte Projekt neu zu bauen, kann folgender Befehl genutzt werden:

```bash
npm run fetch-football
```

### Workflow für die wöchentliche Pflege
1. **Daten abrufen**: Führe `npm run fetch-football` (oder einen Build-Befehl) aus.
2. **Prüfen**: Kontrolliere die Datei `components/app/teaser/teaser.html` oder starte den lokalen Server (`npm run dev`), um zu sehen, ob die Daten korrekt sind (Ergebnisse, Gegner, Wappen).
3. **Veröffentlichen**:
   - Wenn alles korrekt ist, müssen die Änderungen committed und gepusht werden.
   - Führe anschließend das Deployment aus (z.B. `npm run deploy:demo` oder den entsprechenden Workflow).

**Hinweis**: Das Skript erkennt automatisch die aktuelle Saison (z.B. 2025-26) basierend auf dem aktuellen Datum.
