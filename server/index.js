const express = require('express');
const clientRouter = require('./routers/client');
const app = express();
require('./db/mongoose');

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(clientRouter);

app.listen(PORT, () => {
    console.log(`listening to port ${PORT}`);
})

