const Branch = require('../models/branch.model.js');
const Playlist = require('../models/playlist.model.js');

// Create and Save a new Branch
exports.create = (req, res) => {
    if(!req.body.name) {
        return res.status(400).send({
            message: "Branch name can not be empty"
        });
    }
    // const playlist = new
    // Create a Branch
    const branch = new Branch({
        name: req.body.name,
        screens: req.body.screens,
        playlists: req.body.playlists
    });

    // Save Branch in the database
    branch.save()
        .then(data => {
            res.send({data, message: "You successfully create new branch!"});
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Branch."
        });
    });
};

// Retrieve and return all branches from the database.
exports.findAll = (req, res) => {
    Branch.find()
        .then(branches => {
            res.send(branches);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving branches."
        });
    });
};

function asd(id){
    Branch.find({_id: id})
        .then(branches => {
            if(!branches) {
                return res.status(400).send({
                    message: "Branch name can not be empty"
                });
            }
            res.send(branches);
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving branches."
        });
    });
}

async function findBranchById(id){
    let data = [];
    const branch = await Branch.findById(id);
    const playlists = await Playlist.find({branch_id: branch._id});
    data = {branch, playlists};
    return data;
}

// Find a single branch with a branchId
exports.findOne =  (req, res) => {
    findBranchById(req.params.branchId)
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Branch not found with id " + req.params.branchId
                });
            }
            return res.status(500).send({
                message: "Error updating branch with id " + req.params.branchId
            });
        })
};

// Update a branch identified by the branchId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.name) {
        return res.status(400).send({
            message: "Branch name can not be empty"
        });
    }

    // Find branch and update it with the request body
    Branch.findByIdAndUpdate(req.params.branchId, {
        name: req.body.name,
        screens: req.body.screens
    }, {new: true})
        .then(branch => {
            if(!branch) {
                return res.status(404).send({
                    message: "Branch not found with id " + req.params.branchId
                });
            }
            res.send({message: "You successfully update branch!"});
        }).catch(err => {
            console.log(err)
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Branch not found with id " + req.params.branchId
            });
        }
        return res.status(500).send({
            message: "Error updating branch with id " + req.params.branchId
        });
    });
};

// Delete a branch with the specified branchId in the request
exports.delete = (req, res) => {
    Branch.findByIdAndRemove(req.params.branchId)
        .then(branch => {
            if(!branch) {
                return res.status(404).send({
                    message: "Branch not found with id " + req.params.branchId
                });
            }
            res.send({message: "Branch deleted successfully!"});
        }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Branch not found with id " + req.params.branchId
            });
        }
        return res.status(500).send({
            message: "Could not delete branch with id " + req.params.branchId
        });
    });
};
