const axios = require('axios');

const GITHUB_TOKEN = process.env.token;
const API_BASE = 'https://api.github.com';

const cache = {
  data: null,
  timestamp: 0,
  TTL: 60 * 1000
};

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Authorization': 'token ' + GITHUB_TOKEN,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'fik-snipset/1.0.0'
  },
  timeout: 10000
});

async function getAllGists() {
  const now = Date.now();

  if (cache.data && (now - cache.timestamp) < cache.TTL) {
    return cache.data;
  }

  try {
    const response = await axiosInstance.get('/gists');
    cache.data = response.data;
    cache.timestamp = now;
    return response.data;
  } catch (error) {
    console.error('Error fetching gists:', error.message);
    throw new Error('Failed to fetch gists');
  }
}

async function findGistByFilename(filename) {
  try {
    const gists = await getAllGists();

    for (let i = 0; i < gists.length; i++) {
      const gist = gists[i];
      const fileKeys = Object.keys(gist.files);

      for (let j = 0; j < fileKeys.length; j++) {
        const fileKey = fileKeys[j];
        if (fileKey === filename) {
          const fullGist = await getGistById(gist.id);
          const fullFile = fullGist.files[filename];
          if (fullFile) {
            return {
              gist: fullGist,
              fileKey: fileKey,
              file: fullFile
            };
          }
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error finding gist:', error.message);
    throw error;
  }
}

async function getGistById(gistId) {
  try {
    const response = await axiosInstance.get('/gists/' + gistId);
    return response.data;
  } catch (error) {
    console.error('Error fetching gist:', error.message);
    throw new Error('Failed to fetch gist');
  }
}

async function createGist(filename, description, code) {
  try {
    const files = {};
    files[filename] = { content: code };

    const response = await axiosInstance.post('/gists', {
      description: description,
      public: true,
      files: files
    });

    cache.data = null;
    cache.timestamp = 0;

    return response.data;
  } catch (error) {
    console.error('Error creating gist:', error.message);
    throw new Error('Failed to create gist');
  }
}

async function updateGist(gistId, filename, description, code) {
  try {
    const files = {};
    files[filename] = { content: code };

    const response = await axiosInstance.patch('/gists/' + gistId, {
      description: description,
      files: files
    });

    cache.data = null;
    cache.timestamp = 0;

    return response.data;
  } catch (error) {
    console.error('Error updating gist:', error.message);
    throw new Error('Failed to update gist');
  }
}

async function deleteGist(gistId) {
  try {
    await axiosInstance.delete('/gists/' + gistId);

    cache.data = null;
    cache.timestamp = 0;

    return true;
  } catch (error) {
    console.error('Error deleting gist:', error.message);
    throw new Error('Failed to delete gist');
  }
}

module.exports = {
  getAllGists: getAllGists,
  findGistByFilename: findGistByFilename,
  getGistById: getGistById,
  createGist: createGist,
  updateGist: updateGist,
  deleteGist: deleteGist
};
