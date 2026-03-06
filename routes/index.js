const express = require('express');
const router = express.Router();
const { getAllGists } = require('../services/gistService');

router.get('/', async function(req, res) {
  try {
    const gists = await getAllGists();

    const snippets = gists.map(function(gist) {
      const filenames = Object.keys(gist.files);
      const firstFile = Object.values(gist.files)[0];

      return {
        id: gist.id,
        filename: filenames[0],
        description: gist.description || 'No description',
        language: firstFile ? (firstFile.language || 'Plain Text') : 'Plain Text',
        updatedAt: new Date(gist.updated_at).toLocaleDateString()
      };
    });

    res.render('index', {
      title: 'Fik Snipset',
      snippets: snippets
    });
  } catch (error) {
    console.error('Error loading snippets:', error.message);
    res.render('index', {
      title: 'Fik Snipset',
      snippets: [],
      error: 'Failed to load snippets'
    });
  }
});

module.exports = router;
