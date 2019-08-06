const express = require('express');
const router = express.Router();
const playlists = require('../controllers/playlist.controller');

// Create a new Playlist
router.post('/:branchId', playlists.create);

// // Retrieve Branch's playlists with files
router.get('/:branchId&:withFiles', playlists.findBranchePlaylists);
//

// // Retrieve Branch's playlists without files
router.get('/:branchId', playlists.findBranchePlaylists);

// Retrieve a single Playlist with playlistId
router.get('/:branchId/:playlistId', playlists.findOne);

// Delete a Playlist with playlistId
router.delete('/:playlistId', playlists.delete);

// Update a Playlist with playlistId
router.put('/:playlistId', playlists.update);


module.exports = router;