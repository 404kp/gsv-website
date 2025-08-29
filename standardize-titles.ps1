# PowerShell Script zum Standardisieren aller HTML-Titel

# Hash-Tabelle mit allen Dateien und ihren neuen Titeln
$titleUpdates = @{
    "aktuelles.html" = "Aktuelles | Goyatzer SV"
    "football.html" = "Fußball | Goyatzer SV"
    "tischtennis.html" = "Tischtennis | Goyatzer SV"
    "contact.html" = "Kontakt | Goyatzer SV"
    "kontaktKarl.html" = "Kontakt | Goyatzer SV"
    "member.html" = "Mitglied werden | Goyatzer SV"
    "mitgliedKarl.html" = "Mitglied werden | Goyatzer SV"
    "landingpage.html" = "Über uns | Goyatzer SV"
    "impressionen-inspo.html" = "Impressionen | Goyatzer SV"
    "kuendigung.html" = "Mitgliedschaft kündigen | Goyatzer SV"
    "news-inspo.html" = "News & Termine | Goyatzer SV"
    "tisch-Tennis-Karl.html" = "Tennis & Tischtennis | Goyatzer SV"
    
    # Fußball-Mannschaften
    "maenner.html" = "Männer | Goyatzer SV"
    "senioren.html" = "Senioren | Goyatzer SV"
    "altherren.html" = "Altherren | Goyatzer SV"
    "a-jugend.html" = "A-Jugend | Goyatzer SV"
    "b-jugend.html" = "B-Jugend | Goyatzer SV"
    "c-jugend.html" = "C-Jugend | Goyatzer SV"
    "d-jugend.html" = "D-Jugend | Goyatzer SV"
    "e-jugend.html" = "E-Jugend | Goyatzer SV"
    "f-jugend.html" = "F-Jugend | Goyatzer SV"
    
    # Sandbox bleibt wie es ist
    "sandbox.html" = "Sandbox | Goyatzer SV"
}

foreach ($file in $titleUpdates.Keys) {
    $filePath = "./$file"
    
    if (Test-Path $filePath) {
        Write-Host "Bearbeite: $file"
        
        # Datei-Inhalt lesen
        $content = Get-Content -Path $filePath -Raw
        
        # Titel ersetzen (alle möglichen title-Pattern abfangen)
        $newTitle = $titleUpdates[$file]
        
        if ($content -match '<title>.*?</title>') {
            $content = $content -replace '<title>.*?</title>', "<title>$newTitle</title>"
            
            # Aktualisierte Datei speichern
            Set-Content -Path $filePath -Value $content -NoNewline
            Write-Host "  Titel geändert zu: $newTitle"
        } else {
            Write-Host "  Kein title Tag gefunden"
        }
    } else {
        Write-Host "Datei nicht gefunden: $file"
    }
}

Write-Host ""
Write-Host "Fertig! Alle Titel wurden standardisiert."
Write-Host "Format: [Seitenname] | Goyatzer SV"
