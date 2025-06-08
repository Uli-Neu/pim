/**
 * PIM System - Last Record Documentation
 * 
 * Dieses Dokument erklärt die Funktion des "Last Record" Buttons im PIM-System.
 */

# "Last Record" Button - Funktionsbeschreibung

## Übersicht
Der "Last Record" Button im PIM-System ermöglicht es dem Benutzer, schnell zum letzten gespeicherten Datensatz zu navigieren, unabhängig davon, welcher Datensatz aktuell angezeigt wird.

## Funktionsweise
Wenn der "Last Record" Button geklickt wird:
1. Lädt das System den zuletzt gespeicherten Datensatz (den Datensatz mit dem höchsten Index)
2. Zeigt alle Informationen dieses Datensatzes im Formular an
3. Aktualisiert die Anzeige der Datensatznavigation (z.B. "Record 18 of 18")
4. Zeigt eine Benachrichtigung an, dass der letzte Datensatz geladen wurde

## Anwendungsfälle
Der "Last Record" Button ist besonders nützlich in folgenden Situationen:
- Wenn Sie einen neuen Datensatz erstellt haben und schnell zu einem vorhandenen Datensatz zurückkehren möchten
- Wenn Sie während der Navigation zwischen Datensätzen schnell zum letzten Datensatz springen möchten
- Wenn Sie nach dem Start der Anwendung sofort den zuletzt bearbeiteten Datensatz sehen möchten

## Unterschied zu anderen Navigationsfunktionen
- **Nächster/Vorheriger Datensatz**: Navigiert schrittweise durch die Datensätze
- **Last Record**: Springt direkt zum letzten Datensatz, unabhängig von der aktuellen Position
- **New**: Erstellt einen neuen, leeren Datensatz
- **Clear**: Leert das Formular, ohne die Datensatznavigation zu ändern

## Hinweis
Wenn keine Datensätze vorhanden sind, wird eine entsprechende Meldung angezeigt und das Formular wird geleert.
