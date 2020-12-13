const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", UserSchema);
