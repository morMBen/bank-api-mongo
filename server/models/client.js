const mongoose = require('mongoose');
const validator = require('validator');

const Client = mongoose.model('Client', {
    name: {
        type: String,
        required: true,
        trim: true
    }
})

module.exports = Client;