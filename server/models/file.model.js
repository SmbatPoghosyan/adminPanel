const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = Schema({
        url: {
            type: String,
            required: true
        },
        showTime: {
            type: Number,
            required: true
        },
        screen: {
            type: Number,
            required: true
        },
        order: {
            type: Number,
            required: true
        },
        playlistId: {
            type: Schema.Types.ObjectId,
            ref: 'Playlist',
        }

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('File', FileSchema);