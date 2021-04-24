const mongoose = require('mongoose');

const Accounts = mongoose.model('Accounts', {
    clientId: {
        type: String,
        required: true,
    },
    cash: {
        type: Number,
        default: 0,
    },
    credit: {
        type: Number,
        default: 0,
        min: 0
    },
    transaction: {

    }
})

module.exports = Accounts;