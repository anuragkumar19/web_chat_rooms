const { model, Schema } = require('mongoose');

const roomSchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    desc: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = model('Room', roomSchema);
