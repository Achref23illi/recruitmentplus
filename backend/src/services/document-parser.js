const pdfParse = require('pdf-parse');

class DocumentParserService {
  /**
   * Parse PDF file buffer and extract text
   */
  static async parsePdf(buffer) {
    try {
      const data = await pdfParse(buffer);
      return {
        text: data.text,
        numPages: data.numpages,
        info: data.info,
        metadata: data.metadata
      };
    } catch (error) {
      console.error('Error parsing PDF:', error);
      throw new Error('Failed to parse PDF file');
    }
  }

  /**
   * Parse DOCX file buffer and extract text
   * Note: For production, you'd want to use a library like mammoth or docx-parser
   */
  static async parseDocx(buffer) {
    // For now, we'll just return a placeholder
    // In production, implement proper DOCX parsing
    throw new Error('DOCX parsing not yet implemented. Please upload PDF files or paste text directly.');
  }

  /**
   * Parse a file based on its mimetype
   */
  static async parseFile(file) {
    const { buffer, mimetype, originalname } = file;
    
    if (mimetype === 'application/pdf') {
      const result = await this.parsePdf(buffer);
      return {
        ...result,
        filename: originalname,
        mimetype
      };
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await this.parseDocx(buffer);
      return {
        ...result,
        filename: originalname,
        mimetype
      };
    } else if (mimetype === 'text/plain') {
      return {
        text: buffer.toString('utf-8'),
        filename: originalname,
        mimetype
      };
    } else {
      throw new Error(`Unsupported file type: ${mimetype}`);
    }
  }
}

module.exports = DocumentParserService;