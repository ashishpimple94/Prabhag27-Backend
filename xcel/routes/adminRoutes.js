import express from 'express';
import multer from 'multer';
import upload from '../middleware/upload.js';
import { uploadExcelFile } from '../controllers/voterController.js';

const router = express.Router();

const renderPage = (content) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Excel Admin Upload</title>
  <style>
    :root {
      color-scheme: light dark;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    body {
      margin: 0;
      padding: 2rem;
      background: #0f172a;
      color: #e2e8f0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      width: 100%;
      max-width: 720px;
      background: #1e293b;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 20px 60px rgba(15, 23, 42, 0.5);
      border: 1px solid rgba(226, 232, 240, 0.08);
    }
    h1 {
      margin: 0 0 1rem;
      font-size: 1.75rem;
      color: #f1f5f9;
    }
    p {
      margin: 0 0 1.5rem;
      color: #cbd5f5;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    input[type="file"] {
      padding: 0.9rem;
      border-radius: 0.75rem;
      border: 1px dashed rgba(226, 232, 240, 0.3);
      background: rgba(15, 23, 42, 0.4);
      color: inherit;
    }
    button {
      background: #6366f1;
      color: white;
      padding: 0.85rem 1.5rem;
      border: none;
      border-radius: 0.75rem;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s ease;
    }
    button:hover {
      background: #4f46e5;
    }
    .status {
      margin-top: 1.5rem;
      padding: 1rem;
      border-radius: 0.75rem;
      background: rgba(15, 23, 42, 0.5);
      border: 1px solid rgba(226, 232, 240, 0.08);
    }
    .status.success {
      border-color: rgba(34, 197, 94, 0.5);
      color: #4ade80;
    }
    .status.error {
      border-color: rgba(248, 113, 113, 0.5);
      color: #f87171;
    }
    pre {
      overflow-x: auto;
      padding: 1rem;
      background: rgba(15, 23, 42, 0.6);
      border-radius: 0.75rem;
    }
  </style>
</head>
<body>
  <main class="card">
    ${content}
  </main>
</body>
</html>`;

router.get('/upload', (req, res) => {
  const html = renderPage(`
    <h1>Excel Upload (Admin)</h1>
    <p>Upload XLSX/XLS file directly from server. This form hits the same backend pipeline used by Postman.</p>
    <form action="/admin/upload" method="POST" enctype="multipart/form-data">
      <input type="hidden" name="responseType" value="html" />
      <label>
        <strong>Select Excel file</strong>
        <input type="file" name="file" accept=".xlsx,.xls" required />
      </label>
      <button type="submit">Upload &amp; Process</button>
    </form>
  `);
  res.send(html);
});

router.post('/upload', (req, res, next) => {
  req.query.responseType = 'html';
  upload.single('file')(req, res, (err) => {
    if (!err) return next();

    const isMulterErr = err instanceof multer.MulterError;
    const maxMb = process.env.VERCEL ? '4MB (Vercel)' : `${process.env.MAX_FILE_SIZE_MB || 25}MB`;
    const message = isMulterErr
      ? err.code === 'LIMIT_FILE_SIZE'
        ? `File too large. Maximum ${maxMb} allowed.`
        : err.message
      : err.message || 'File upload failed';

    const html = renderPage(`
      <h1>Excel Upload (Admin)</h1>
      <div class="status error">
        <strong>Upload failed</strong><br />
        ${message}
      </div>
      <form action="/admin/upload" method="POST" enctype="multipart/form-data" style="margin-top:1.5rem;">
        <input type="hidden" name="responseType" value="html" />
        <label>
          <strong>Select Excel file</strong>
          <input type="file" name="file" accept=".xlsx,.xls" required />
        </label>
        <button type="submit">Try Again</button>
      </form>
    `);

    res.status(400).send(html);
  });
}, uploadExcelFile);

export default router;
