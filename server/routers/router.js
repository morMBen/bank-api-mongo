const express = require('express');
const Client = require('../models/clients');
const Accounts = require('../models/accounts');
const Transactions = require('../models/transactions')
const router = new express.Router();

router.use(express.json())

//deposit money to account
router.patch('/api/accounts/deposit/:id', async (req, res) => {
    try {
        if (!req.body.deposit || req.body.deposit < 0) {
            throw new Error('Invalid input data')
        }
        const account = await Accounts.findByIdAndUpdate({ _id: req.params.id }, { $inc: { cash: req.body.deposit } }, { new: true })
        if (!account) {
            return res.status(404).send('No Account found')
        }
        updateTransaction('Deposit money to account', account._id, account._id, req.body.deposit);
        res.status(201).send(account);
    } catch (e) {
        res.status(400).send(e.message)
    }
})

//add account
router.post('/api/accounts/:id', async (req, res) => {
    try {
        const results = await Client.findOne({ _id: req.params.id })
        if (!results) throw new Error('No client with the specific id!')
        const clientData = { ...req.body, clientId: results._id };
        const newAccount = new Accounts(clientData);
        const data = await newAccount.save()
        if (data) {
            await Client.findByIdAndUpdate(results._id, { $push: { accounts: data.id } })
        }
        await res.status(201).send(data);
    } catch (e) {
        res.status(400).send(e.message)
    }
})

//get specific account
router.get('/api/Accounts/:accountNumber', async (req, res) => {
    try {
        const results = await Accounts.find({ _id: "60848184c397732bb0164c29" })
        if (!results) throw new Error('No account with the specific account number!')
        res.status(200).send(results);
    } catch (e) {
        res.status(400).send(e.message);
    }
})

//add client
router.post('/api/clients', async (req, res) => {
    try {
        const newClient = new Client(req.body);
        const data = await newClient.save()
        await res.status(201).send(data);
    } catch (e) {
        res.status(400).send(e.message)
    }
})

//get specific client
router.get('/api/clients/:id', async (req, res) => {
    try {
        const results = await Client.findOne({ _id: req.params.id })
        if (!results) throw new Error('No client with the specific id!')
        res.status(200).send(results);
    } catch (e) {
        res.status(400).send(e.message);
    }
})

//get all clients
router.get('/api/clients', async (req, res) => {
    try {
        const results = await Client.find()
        res.status(200).send(results);
    } catch (e) {
        res.status(400).send(e.message);
    }
})
router.get('/api/accounts', async (req, res) => {
    try {
        const results = await Accounts.find()
        res.status(200).send(results);
    } catch (e) {
        res.status(400).send(e.message);
    }
})

const updateTransaction = async (des, from, to, amount) => {
    const newTransContent = { description: des, from: from, to: to, current: amount }
    const newTrans = await new Transactions(newTransContent).save()
    const account1 = await Accounts.findByIdAndUpdate(from, { $push: { transaction: newTrans._id } })
    const client1 = await Client.findByIdAndUpdate(account1.clientId, { $push: { transaction: newTrans._id } })
    if (from !== to) {
        const account2 = await Accounts.findByIdAndUpdate(to, { $push: { transaction: newTrans._id } })
        const client2 = await Client.findByIdAndUpdate(account2.clientId, { $push: { transaction: newTrans._id } })
    }
}

module.exports = router;