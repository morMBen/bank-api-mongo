const mongoose = require('mongoose');

const Transactions = mongoose.model('Transactions', {
    created_at: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        require: true,
    },
    current: {
        type: Number,
    },
    from: {
        type: String,
    },
    to: {
        type: String
    }
})

module.exports = Transactions;