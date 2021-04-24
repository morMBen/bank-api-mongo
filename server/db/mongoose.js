const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/bank-api-mongoose', {
    // mongoose.connect('mongodb+srv://mordi:4kOwL3iSZ2I0xwVE@cluster0.sibae.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});