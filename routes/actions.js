const express = require('express');
const router = express.Router();
const { authKey } = require('../middleware/authKey');
const { findGistByFilename, deleteGist } = require('../services/gistService');

router.get('/:gistId', async function(req, res) {
  try {
    const { gistId } = req.params;
    const { filename } = req.query;

    if (!filename) {
      return res.status(400).render('404');
    }

    res.render('action', {
      title: 'Actions',
      gistId: gistId,
      filename: filename
    });
  } catch (error) {
    console.error('Error loading action page:', error.message);
    res.status(500).render('404');
  }
});

router.get('/delete/:gistId', async function(req, res) {
  try {
    const { gistId } = req.params;
    const { filename } = req.query;

    if (!filename) {
      return res.status(400).render('404');
    }

    res.render('confirm', {
      title: 'Confirm Delete',
      gistId: gistId,
      filename: filename
    });
  } catch (error) {
    console.error('Error loading confirm page:', error.message);
    res.status(500).render('404');
  }
});

router.post('/delete/:gistId', authKey, async function(req, res) {
  try {
    const { gistId } = req.params;

    await deleteGist(gistId);

    res.redirect('/');
  } catch (error) {
    console.error('Error deleting snippet:', error.message);
    res.status(500).render('confirm', {
      title: 'Error',
      gistId: req.params.gistId,
      filename: req.query.filename,
      error: error.message
    });
  }
});

module.exports = router;
