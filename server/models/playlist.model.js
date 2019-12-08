const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlaylistSchema = Schema({
    name: {
        type: String,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    currency: {
        type: Boolean,
        required: true
    },
    ticker: {
        type: Object
    },
    branch_id: { type: Schema.Types.ObjectId, ref: 'Branch' },
}, {
        timestamps: true
    });

module.exports = mongoose.model("Playlist", PlaylistSchema);
