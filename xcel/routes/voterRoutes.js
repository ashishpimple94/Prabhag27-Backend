import express from 'express';
import multer from 'multer';
import upload from '../middleware/upload.js';
import {
  uploadExcelFile,
  getAllVoters,
  getVoterById,
  deleteAllVoters,
  searchVoters,
} from '../controllers/voterController.js';

const router = express.Router();

// Async error wrapper to catch unhandled promise rejections
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Upload route with better error handling
router.post('/upload', (req, res, next) => {
  // Check Content-Length header before processing (Vercel limitation)
  const contentLength = parseInt(req.headers['content-length'] || '0');
  const isVercelEnv = process.env.VERCEL === '1' || process.env.VERCEL_ENV;
  const vercelMaxSize = 4.5 * 1024 * 1024; // 4.5MB Vercel limit
  
  if (isVercelEnv && contentLength > vercelMaxSize) {
    return res.status(413).json({
      success: false,
      message: 'File too large for Vercel. Maximum 4MB allowed.',
      message_mr: 'फाइल बहुत बड़ी है। Vercel पर अधिकतम 4MB अनुमति है।',
      error: 'FUNCTION_PAYLOAD_TOO_LARGE',
      fileSize: `${(contentLength / (1024 * 1024)).toFixed(2)}MB`,
      maxSize: '4MB',
      platform: 'Vercel',
      suggestion: 'For larger files, please use Render deployment or split your Excel file into smaller files.',
      suggestion_mr: 'बड़ी फाइलों के लिए, कृपया Render deployment का उपयोग करें या अपनी Excel फाइल को छोटी फाइलों में विभाजित करें।'
    });
  }

  // Wrap multer middleware to catch errors
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          const maxMb = isVercelEnv ? 4 : (process.env.MAX_FILE_SIZE_MB || 25);
          return res.status(413).json({
            success: false,
            message: `File too large. Maximum ${maxMb}MB allowed${isVercelEnv ? ' on Vercel' : ''}.`,
            message_mr: `फाइल बहुत बड़ी है। अधिकतम ${maxMb}MB अनुमति है${isVercelEnv ? ' Vercel पर' : ''}।`,
            error: err.message,
            errorCode: 'LIMIT_FILE_SIZE',
            maxSize: `${maxMb}MB`,
            platform: isVercelEnv ? 'Vercel' : 'Server',
            suggestion: isVercelEnv 
              ? 'Vercel has a 4.5MB request limit. Use Render for larger files or split your Excel file.'
              : 'Please reduce file size or increase MAX_FILE_SIZE_MB environment variable.',
            suggestion_mr: isVercelEnv
              ? 'Vercel की 4.5MB request limit है। बड़ी फाइलों के लिए Render का उपयोग करें या अपनी Excel फाइल को विभाजित करें।'
              : 'कृपया फाइल का आकार कम करें या MAX_FILE_SIZE_MB environment variable बढ़ाएं।'
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            success: false,
            message: 'Unexpected file field. Use field name "file".',
            message_mr: 'अनपेक्षित फाइल फील्ड। फील्ड नाम "file" का उपयोग करें।',
            error: err.message
          });
        }
        return res.status(400).json({
          success: false,
          message: 'File upload error',
          message_mr: 'फ़ाइल अपलोड त्रुटि',
          error: err.message,
          errorCode: err.code
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed',
        message_mr: 'फ़ाइल अपलोड विफल',
        error: err.message
      });
    }
    // If no error, proceed to upload handler
    next();
  });
}, asyncHandler(uploadExcelFile));
router.get('/search', asyncHandler(searchVoters)); // Search route (must be before /:id)
router.get('/', asyncHandler(getAllVoters));
router.get('/:id', asyncHandler(getVoterById));
router.delete('/', asyncHandler(deleteAllVoters));

export default router;

