const Playlist = require('../models/playlist.model');
const Branch = require('../models/branch.model');
const File = require('../models/file.model');

// Create and Save a new Playlist
exports.create = (req, res) => {
    Branch.findById(req.params.branchId)
        .then(branch => {
            if (!branch) {
                return res.status(404).send({
                    message: "Branch not found with id " + req.params.branchId
                });
            }
            if (!req.body.name) {
                return res.status(400).send({
                    message: "Playlist name can not be empty"
                });
            } if (!req.body.startDate) {
                return res.status(400).send({
                    message: "Playlist start date can not be empty"
                });
            } if (!req.body.endDate) {
                return res.status(400).send({
                    message: "Playlist end date can not be empty"
                });
            }

            const objToSave = {
                name: req.body.name,
                endDate: req.body.endDate,
                startDate: req.body.startDate,
                currency: req.body.currency,
                branch_id: req.params.branchId,
            };

            if(req.body.ticker) {
                objToSave["ticker"] = req.body.ticker
            }

            const playlist = new Playlist(objToSave);
            playlist.save()
                .then(data => {
                    console.log(data)
                    JSON.parse(req.body.files).forEach((item) => {
                        const file = new File({
                            url: item.url,
                            name: item.name,
                            type: item.type,
                            showTime: item.showTime,
                            screen: item.screen,
                            order: item.order,
                            playlistId: data._id
                        });

                        file.save()
                            .then()
                            .catch(err => console.log(err))
                    });


                    res.send({ data, message: "You successfully create new playlist!" });
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the playlist."
                    });
                });

        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Branch not found with id " + req.params.branchId
                });
            }
            return res.status(500).send({
                message: "Error retrieving branch with id " + req.params.branchId
            });
        });
};

async function findBranchById(id, withFiles) {
    let data = [];
    let branch = await Branch.findById(id);
    let playlists = await Playlist.find({ branch_id: id });
    if (withFiles) {
        for (let i = 0; i < playlists.length; i++) {
            let files = await File.find({ playlistId: playlists[i]._id });
            await data.push({ screens: branch.screens, playlist: playlists[i], files });
        }
    }
    data = withFiles ? data : playlists;
    return data;
}

// Retrieve and return all playlists by branchId from the database.
exports.findBranchePlaylists = async function (req, res) {
    findBranchById(req.params.branchId, req.params.withFiles)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Branch not found with id " + req.params.branchId
                });
            }
            return res.status(500).send({
                message: "Error updating branch with id " + req.params.branchId
            });
        })
};


// Find a single playlist with a playlistId
exports.findOne = async function (req, res) {
    let branch = await Branch.findById(req.params.branchId);
    if (!branch) {
        return res.status(404).send({
            message: "Branch not found with id " + req.params.branchId
        });
    }
    let playlist = await Playlist.findById(req.params.playlistId);
    if (!playlist) {
        return res.status(404).send({
            message: "Playlist not found with id " + req.params.playlistId
        });
    }
    let files = await File.find({ playlistId: playlist._id });
    res.send({ playlist, files });
};

// Update a playlist identified by the playlistId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body.name) {
        return res.status(400).send({
            message: "Playlist name can not be empty"
        });
    }
    const objToUpdate = {
        name: req.body.name,
        endDate: req.body.endDate,
        startDate: req.body.startDate,
        currency: req.body.currency,
    };

    if(req.body.ticker) {
        objToUpdate["ticker"] = req.body.ticker
    } else{
        objToUpdate["ticker"] = null;
    }

    // Find playlist and update it with the request body
    Playlist.findByIdAndUpdate(req.params.playlistId, objToUpdate)
        .then(playlist => {
            if (!playlist) {
                return res.status(404).send({
                    message: "Playlist not found with id " + req.params.playlistId
                });
            }
            File.deleteMany({ playlistId: req.params.playlistId }).then(files => {
                JSON.parse(req.body.files).forEach((item) => {
                    const file = new File({
                        url: item.url,
                        showTime: item.showTime,
                        screen: item.screen,
                        name: item.name,
                        type: item.type,
                        order: item.order,
                        playlistId: playlist._id
                    });

                    file.save()
                        .then()
                        .catch(err => console.log(err))
                });
                res.send({ message: "You successfully update playlist!" });
            })
                .catch(err => {
                    if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                        return res.status(404).send({
                            message: "Playlist's files not found"
                        });
                    }
                    return res.status(500).send({
                        message: "Could not delete playlist's files"
                    });
                });

        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Playlist not found with id " + req.params.playlistId
                });
            }
            return res.status(500).send({
                message: "Error updating playlist with id " + req.params.playlistId
            });
        });
};

// Delete a playlist with the specified playlistId in the request
exports.delete = (req, res) => {
    Playlist.findByIdAndRemove(req.params.playlistId)
        .then(playlist => {
            if (!playlist) {
                return res.status(404).send({
                    message: "Playlist not found with id " + req.params.playlistId
                });
            }
            File.deleteMany({ playlistId: playlist._id }).then(files => {
                res.send({ message: "Playlist deleted successfully!" });
            })
                .catch(err => {
                    if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                        return res.status(404).send({
                            message: "Playlist's files not found"
                        });
                    }
                    return res.status(500).send({
                        message: "Could not delete playlist's files"
                    });
                })
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Playlist not found with id " + req.params.playlistId
                });
            }
            return res.status(500).send({
                message: "Could not delete playlist with id " + req.params.playlistId
            });
        });
};
