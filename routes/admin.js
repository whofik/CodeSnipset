const express = require('express');
const router = express.Router();
const { getAllGists, findGistByFilename } = require('../services/gistService');

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

    let editSnippet = null;
    const editFilename = req.query.edit;

    if (editFilename) {
      const result = await findGistByFilename(editFilename);
      if (result) {
        editSnippet = {
          gistId: result.gist.id,
          filename: result.fileKey,
          description: result.gist.description || '',
          code: result.file.content
        };
      }
    }

    res.render('admin', {
      title: 'Admin Dashboard',
      snippets: snippets,
      error: null,
      success: null,
      editSnippet: editSnippet
    });
  } catch (error) {
    console.error('Error loading dashboard:', error.message);
    res.render('admin', {
      title: 'Admin Dashboard',
      snippets: [],
      error: 'Failed to load snippets',
      success: null,
      editSnippet: null
    });
  }
});

module.exports = router;
