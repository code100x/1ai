import { Router } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import mammoth from "mammoth";
import { authMiddleware } from "../auth-middleware";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/markdown',
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  },
});

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const PDFParser = await import("pdf2json");
    const pdfParser = new PDFParser.default();
    
    return new Promise((resolve, reject) => {
      let extractedText = "";
      
      pdfParser.on("pdfParser_dataError", (errData: any) => {
        console.error("PDF parsing error:", errData.parserError);
        reject(new Error("Failed to parse PDF"));
      });
      
      pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
        try {
          // Extract text from PDF data
          if (pdfData.Pages && pdfData.Pages.length > 0) {
            extractedText = pdfData.Pages.map((page: any) => {
              if (page.Texts && page.Texts.length > 0) {
                return page.Texts.map((text: any) => {
                  // Decode URI encoded text
                  return decodeURIComponent(text.R[0].T || "");
                }).join(" ");
              }
              return "";
            }).join("\n");
          }
          
          if (extractedText.trim()) {
            resolve(extractedText);
          } else {
            resolve("PDF document uploaded. Content analysis available through vision model.");
          }
        } catch (error) {
          console.error("Error processing PDF data:", error);
          resolve("PDF document uploaded. Content analysis available through vision model.");
        }
      });
      
      // Parse the buffer
      pdfParser.parseBuffer(buffer);
    });
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return "PDF document uploaded. Content analysis available through vision model.";
  }
}

async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error("Error extracting text from DOCX:", error);
    return "";
  }
}

async function extractTextFromTXT(buffer: Buffer): Promise<string> {
  try {
    return buffer.toString("utf-8");
  } catch (error) {
    console.error("Error extracting text from TXT:", error);
    return "";
  }
}

async function extractTextFromExcel(buffer: Buffer): Promise<string> {
  try {
    const XLSX = await import("xlsx");
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    
    let extractedText = "";
    
    // Process each sheet
    workbook.SheetNames.forEach((sheetName, index) => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      extractedText += `\n\nSheet ${index + 1}: ${sheetName}\n`;
      
      // Convert each row to text
      jsonData.forEach((row: any, rowIndex: number) => {
        if (row && row.length > 0) {
          const rowText = row
            .filter((cell: any) => cell !== null && cell !== undefined)
            .map((cell: any) => String(cell))
            .join(" | ");
          
          if (rowText.trim()) {
            extractedText += `Row ${rowIndex + 1}: ${rowText}\n`;
          }
        }
      });
    });
    
    return extractedText.trim() || "Excel file uploaded. Content analysis available.";
  } catch (error) {
    console.error("Error extracting text from Excel:", error);
    return "Excel file uploaded. Content analysis available.";
  }
}

router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const file = req.file;
    console.log("File received:", {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "chat-attachments",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(file.buffer);
    });

    const uploadResult = result as any;
    const fileUrl = uploadResult.secure_url;

    let extractedContent = "";

    // Extract text content for documents
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/markdown',
    ];

    if (documentTypes.includes(file.mimetype)) {
      console.log("Processing document for text extraction...");
      try {
        switch (file.mimetype) {
          case "application/pdf":
            extractedContent = await extractTextFromPDF(file.buffer);
            break;
          case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          case "application/msword":
            extractedContent = await extractTextFromDOCX(file.buffer);
            break;
          case "application/vnd.ms-excel":
          case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            extractedContent = await extractTextFromExcel(file.buffer);
            break;
          case "text/plain":
          case "text/markdown":
            extractedContent = await extractTextFromTXT(file.buffer);
            break;
        }
      } catch (textError) {
        console.error("Text extraction error:", textError);
        extractedContent = "";
      }
    }

    return res.json({
      success: true,
      url: fileUrl,
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      extractedContent: extractedContent || undefined,
    });

  } catch (error) {
    console.error("Upload error:", error);
    
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: "File size must be less than 10MB" });
      }
    }

    return res.status(500).json({ 
      error: "Upload failed",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export default router;
