const express = require('express');
const Client = require('../models/client');
const router = new express.Router();

router.post('/api/clients', async (req, res) => {
    try {
        const newClient = new Client(req.body);
        const data = await newClient.save()
        await res.status(200).send(data);
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.get('/api/clients', (req, res) => {
    console.log('get is working')
    res.status(200).send();
})

module.exports = router;