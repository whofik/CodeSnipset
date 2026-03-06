const express = require('express');
const router = express.Router();
const { authKey } = require('../middleware/authKey');
const { createGist, updateGist, deleteGist, findGistByFilename } = require('../services/gistService');

router.post('/add', authKey, async function(req, res) {
  try {
    const { filename, description, code } = req.body;

    if (!filename || !code) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Filename and code are required'
      });
    }

    const gist = await createGist(filename, description || '', code);

    res.json({
      success: true,
      message: 'Snippet created',
      data: {
        id: gist.id,
        filename: filename,
        url: '/files/' + filename
      }
    });
  } catch (error) {
    console.error('Error creating snippet:', error.message);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

router.post('/edit', authKey, async function(req, res) {
  try {
    const { filename, description, code, gistId } = req.body;

    if (!filename || !code || !gistId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Filename, code, and gistId required'
      });
    }

    const gist = await updateGist(gistId, filename, description || '', code);

    res.json({
      success: true,
      message: 'Snippet updated',
      data: {
        id: gist.id,
        filename: filename,
        url: '/files/' + filename
      }
    });
  } catch (error) {
    console.error('Error updating snippet:', error.message);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

router.post('/delete', authKey, async function(req, res) {
  try {
    const { gistId } = req.body;

    if (!gistId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Gist ID required'
      });
    }

    await deleteGist(gistId);

    res.json({
      success: true,
      message: 'Snippet deleted'
    });
  } catch (error) {
    console.error('Error deleting snippet:', error.message);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

router.get('/snippet/:filename', async function(req, res) {
  try {
    const { filename } = req.params;
    const result = await findGistByFilename(filename);

    if (!result) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Snippet not found'
      });
    }

    const { gist, file } = result;

    res.json({
      success: true,
      data: {
        gistId: gist.id,
        filename: filename,
        description: gist.description || '',
        code: file.content
      }
    });
  } catch (error) {
    console.error('Error fetching snippet:', error.message);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

module.exports = router;
