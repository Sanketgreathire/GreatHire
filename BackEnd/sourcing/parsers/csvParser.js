import fs from "fs";
import { parse } from "csv-parse/sync";
import { mapCsvHeaders, validateCsvRow } from "../validators/ingestionValidators.js";

/**
 * Parse a CSV file into an array of raw candidate objects.
 * @param {string} filePath  - Absolute path to the uploaded CSV
 * @returns {{ rows: Object[], parseErrors: string[] }}
 */
export function parseCsvFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  let rawRows;
  try {
    rawRows = parse(content, {
      columns:          true,
      skip_empty_lines: true,
      trim:             true,
      bom:              true,
      relax_column_count: true,
    });
  } catch (err) {
    throw new Error(`CSV parse error: ${err.message}`);
  }

  const rows        = [];
  const parseErrors = [];

  for (let i = 0; i < rawRows.length; i++) {
    const mapped = mapCsvHeaders(rawRows[i]);
    const errors = validateCsvRow(mapped, i + 2); // +2 because row 1 is header

    if (errors.length) {
      parseErrors.push(...errors);
      continue;
    }
    rows.push(mapped);
  }

  return { rows, parseErrors };
}
