const SPREADSHEET_ID = "1SmZQSxspSbrhnBGJMYr4mBHF6nYoEChd1y1gGS7Bh50";
const SHEET_NAME = "Invitados";
const HEADERS = ["ID", "Nombre", "FechaAceptacion"];

function doGet() {
  return HtmlService.createHtmlOutputFromFile("Index")
    .setTitle("Confirmar asistencia")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function submitRsvp(rawName) {
  const name = String(rawName || "").trim();

  if (!name || name.length > 100) {
    throw new Error("Escribe tu nombre (máximo 100 caracteres).");
  }

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    throw new Error('No se encontró la pestaña "' + SHEET_NAME + '" en la hoja de cálculo.');
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  } else {
    const currentHeaders = sheet.getRange(1, 1, 1, HEADERS.length).getDisplayValues()[0];
    if (HEADERS.some((header, index) => currentHeaders[index] !== header)) {
      throw new Error("La primera fila debe tener los encabezados: ID, Nombre, FechaAceptacion.");
    }
  }

  const row = sheet.getLastRow() + 1;
  sheet.getRange(row, 1, 1, HEADERS.length).setValues([[
    Utilities.getUuid(),
    name,
    new Date()
  ]]);

  return { success: true };
}
