import crypto from 'crypto'
import { parse } from "csv-parse/sync";

let hashTRVFixe = "";
let hashTRVVariable = "";

export const trvFetch = async (isFixe) => {
  const url = isFixe
    ? "https://www.data.gouv.fr/fr/datasets/r/c13d05e5-9e55-4d03-bf7e-042a2ade7e49"
    : "https://www.data.gouv.fr/fr/datasets/r/f7303b3a-93c7-4242-813d-84919034c416";

  const cast = isFixe
    ? (value, { column }) => {
        if (column === "DATE_DEBUT" || column === "DATE_FIN") {
          const [day, month, year] = value.split("/");
          return new Date(+year, month - 1, +day);
        } else if (column === "P_SOUSCRITE") {
          return parseFloat(value);
        } else if (
          column === "PART_FIXE_HT" ||
          column === "PART_FIXE_TTC" ||
          column === "PART_VARIABLE_HT" ||
          column === "PART_VARIABLE_TTC"
        ) {
          return parseFloat(value.replace(",", "."));
        } else {
          return value;
        }
      }
    : (value, { column }) => {
        if (column === "DATE_DEBUT" || column === "DATE_FIN") {
          const [day, month, year] = value.split("/");
          return new Date(+year, month - 1, +day);
        } else if (column === "P_SOUSCRITE") {
          return +value;
        } else if (
          column === "PART_FIXE_HT" ||
          column === "PART_FIXE_TTC" ||
          column === "PART_VARIABLE_HT" ||
          column === "PART_VARIABLE_TTC"
        ) {
          return parseFloat(value.replace(",", "."));
        } else {
          return value;
        }
      };

  const request = await fetch(url);
  if (request.ok) {
    const data = await request.text();

    const hash = crypto.createHash("md5").update(data).digest("hex");
    const toCompareHash = isFixe ? hashTRVFixe : hashTRVVariable;
    if (hash === toCompareHash) {
      return null;
    } else {
      const csv = parse(data, {
        delimiter: ";",
        columns: true,
        skip_empty_lines: true,
        skip_records_with_empty_values: true,
        cast: cast,
      });
      return csv;
    }
  }
};
