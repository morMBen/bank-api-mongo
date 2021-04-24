const mongoose = require('mongoose');

const Client = mongoose.model('Client', {
    _id: {
        type: String,
        required: true,
        tirm: true,
        validete(value) {
            if (value.length !== 9) {
                throw new Error('Id number must be 9 digits!')
            }
        }
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    accounts: {
        type: Array
    },
    transaction: {
        type: Array,
    }
}
)

module.exports = Client;