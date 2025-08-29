# PowerShell Script zum Hinzufuegen von Favicon-Links zu allen HTML-Dateien

# Favicon-Links, die hinzugefuegt werden sollen
$faviconLinks = @"

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/assets/img/GoyatzerSV-Logo.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/img/gsv-logo-removed.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/img/gsv-logo-removed.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/img/gsv-logo-removed.png">
  
"@

# Alle HTML-Dateien im aktuellen Verzeichnis durchgehen
$htmlFiles = Get-ChildItem -Path "." -Filter "*.html"

foreach ($file in $htmlFiles) {
    Write-Host "Bearbeite: $($file.Name)"
    
    # Datei-Inhalt lesen
    $content = Get-Content -Path $file.FullName -Raw
    
    # Pruefen, ob bereits Favicon-Links vorhanden sind
    if ($content -notmatch 'rel="icon"') {
        # Favicon-Links vor dem title Tag einfuegen
        if ($content -match '(\s*)<title>') {
            $content = $content -replace '(\s*)<title>', "$faviconLinks`$1<title>"
            
            # Aktualisierte Datei speichern
            Set-Content -Path $file.FullName -Value $content -NoNewline
            Write-Host "  Favicon-Links hinzugefuegt"
        } else {
            Write-Host "  Kein title Tag gefunden"
        }
    } else {
        Write-Host "  Favicon-Links bereits vorhanden"
    }
}

Write-Host ""
Write-Host "Fertig! Alle HTML-Dateien wurden bearbeitet."
