const express = require('express');
const cors = require('cors')
const path = require('path');
const appRouter = require('./routers/router');
const app = express();
require('./db/mongoose');

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(appRouter);

app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`);
})

