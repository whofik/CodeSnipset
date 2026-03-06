const express = require('express');
const router = express.Router();
const { findGistByFilename } = require('../services/gistService');
const { parseCode, getLanguageFromFilename } = require('../utils/parser');

router.get('/:filename', async function(req, res) {
  try {
    const { filename } = req.params;
    const result = await findGistByFilename(filename);

    if (!result) {
      return res.status(404).render('file', {
        title: 'Not Found',
        description: 'Snippet tidak ditemukan',
        code: null,
        filename: null,
        gistId: null,
        lines: null,
        language: null,
        error: 'Snippet tidak ditemukan'
      });
    }

    const { gist, file } = result;
    const code = file.content;
    const lines = code.split('\n');
    const language = getLanguageFromFilename(filename);

    res.render('file', {
      title: filename,
      description: gist.description || 'No description',
      code: code,
      lines: lines,
      filename: filename,
      gistId: gist.id,
      language: language,
      error: null
    });
  } catch (error) {
    console.error('Error loading snippet:', error.message);
    res.render('file', {
      title: 'Error',
      description: 'Terjadi kesalahan',
      code: null,
      filename: null,
      gistId: null,
      lines: null,
      language: null,
      error: error.message
    });
  }
});

module.exports = router;
