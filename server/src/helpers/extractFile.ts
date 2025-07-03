import fs from "fs/promises";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import XLSX from "xlsx";

async function extractFile(
  filePath: string,
  mimetype: string
): Promise<string> {
  try {
    switch (mimetype) {
      case "text/plain": {
        const txt = await fs.readFile(filePath, "utf8");
        return txt;
      }

      case "application/pdf": {
        const buffer = await fs.readFile(filePath);
        const { text } = await pdfParse(buffer);
        return text;
      }

      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
        const buffer = await fs.readFile(filePath);
        const { value } = await mammoth.extractRawText({ buffer });
        return value;
      }

      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
        const buffer = await fs.readFile(filePath);
        const workbook = XLSX.read(buffer, { type: "buffer" });
        let csvText = "";

        for (const sheetName of workbook.SheetNames) {
          const worksheet = workbook.Sheets[sheetName];
          csvText += XLSX.utils.sheet_to_csv(worksheet) + "\n";
        }

        return csvText;
      }

      default:
        try {
          return await fs.readFile(filePath, "utf8");
        } catch {
          throw new Error(`Unsupported file type: ${mimetype}`);
        }
    }
  } catch (error) {
    console.error("Error extracting file:", error);
    throw error;
  }
}

export default extractFile;
