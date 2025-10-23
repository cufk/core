const PANEL_LEN = 2400; // mm
const PANEL_COVER = 106; // mm
const REGEL_CC = 600; // mm

function calcMaterials(W_mm, H_mm, orientation, waste = 0.1, regelStdLenMm) {
  const run = orientation === "horizontal" ? W_mm : H_mm;
  const spanPerp = orientation === "horizontal" ? H_mm : W_mm;

  const rowsOrCols = Math.ceil(spanPerp / PANEL_COVER);

  const piecesPerRun = Math.ceil(run / PANEL_LEN);
  const panelCount = rowsOrCols * piecesPerRun;
  const panelCountWithWaste = Math.ceil(panelCount * (1 + waste));

  const S = orientation === "horizontal" ? W_mm : H_mm;
  const D = orientation === "horizontal" ? H_mm : W_mm;
  const regelCount = 1 + Math.ceil(S / REGEL_CC);
  const regelMeters = (regelCount * D) / 1000;
  const regelMetersWithWaste = regelMeters * (1 + waste);

  const regelPieces =
    regelStdLenMm && regelStdLenMm > 0
      ? Math.ceil((regelMetersWithWaste * 1000) / regelStdLenMm)
      : undefined;

  return {
    panelCount: panelCountWithWaste,
    regelCount,
    regelMeters: Number(regelMetersWithWaste.toFixed(2)),
    regelPieces,
    meta: { run, rowsOrCols, piecesPerRun }
  };
}

const form = document.getElementById("calculator-form");
const results = document.getElementById("results");
const fieldOutputs = {
  panelCount: results.querySelector('[data-field="panelCount"]'),
  regelCount: results.querySelector('[data-field="regelCount"]'),
  regelMeters: results.querySelector('[data-field="regelMeters"]'),
  regelPieces: results.querySelector('[data-field="regelPieces"]'),
  rowsOrCols: results.querySelector('[data-field="rowsOrCols"]'),
  piecesPerRun: results.querySelector('[data-field="piecesPerRun"]')
};

const formatNumber = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2
});

function updateResults(output) {
  fieldOutputs.panelCount.textContent = formatNumber.format(output.panelCount);
  fieldOutputs.regelCount.textContent = formatNumber.format(output.regelCount);
  fieldOutputs.regelMeters.textContent = `${formatNumber.format(output.regelMeters)} m`;
  fieldOutputs.regelPieces.textContent = output.regelPieces
    ? formatNumber.format(output.regelPieces)
    : "—";
  fieldOutputs.rowsOrCols.textContent = formatNumber.format(output.meta.rowsOrCols);
  fieldOutputs.piecesPerRun.textContent = formatNumber.format(output.meta.piecesPerRun);
}

function handleSubmit(event) {
  if (event && typeof event.preventDefault === "function") {
    event.preventDefault();
  }

  const data = new FormData(form);
  const width = Number(data.get("width"));
  const height = Number(data.get("height"));
  const orientation = data.get("orientation") === "vertical" ? "vertical" : "horizontal";
  const wasteInput = Number(data.get("waste"));
  const waste = Number.isFinite(wasteInput) ? wasteInput / 100 : 0;
  const regelLengthInput = data.get("regel-length");
  const regelStdLenMm = regelLengthInput ? Number(regelLengthInput) : undefined;

  if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0) {
    alert("Width and height must be positive numbers.");
    return;
  }

  if (regelStdLenMm !== undefined && (!Number.isFinite(regelStdLenMm) || regelStdLenMm <= 0)) {
    alert("Standard stud length must be a positive number if provided.");
    return;
  }

  const result = calcMaterials(width, height, orientation, waste, regelStdLenMm);
  updateResults(result);
}

function initDefaults() {
  const widthInput = document.getElementById("width");
  const heightInput = document.getElementById("height");

  if (widthInput && !widthInput.value) {
    widthInput.value = "4800";
  }
  if (heightInput && !heightInput.value) {
    heightInput.value = "2400";
  }

  handleSubmit();
}

form.addEventListener("submit", handleSubmit);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDefaults);
} else {
  initDefaults();
}
