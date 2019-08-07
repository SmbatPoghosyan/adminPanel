const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const BranchSchema = Schema({
    name: {
        type: String,
        required: true
    },
    screens: {
        type: Number,
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('branch', BranchSchema);
