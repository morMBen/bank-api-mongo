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
        validete(value) {
            if (value < 0) {
                throw new Error('The credit must be a positive number')
            }
        },
    },
    transaction: {

    }
})

module.exports = Accounts;