const express = require('express');
const Client = require('../models/clients');
const Accounts = require('../models/accounts');
const Transactions = require('../models/transactions')
const router = new express.Router();

router.use(express.json())

//transfer money
router.patch('/api/transfer', async (req, res) => {
    try {
        const { from, to, amount } = req.body
        const fromAccount = await Accounts.findOne({ _id: from.id })
        const toAccount = await Accounts.findOne({ _id: to.id })
        if (!fromAccount || !toAccount) {
            throw new Error('Accounts did not found check them and rewrite')
        }
        if (fromAccount.cash + fromAccount.credit - amount < 0) {
            throw new Error('Over withraw limit, cannot complete the transfer')
        }
        const accountSend = await Accounts.findByIdAndUpdate({ _id: from }, { cash: fromAccount.cash - amount }, { new: true })
        const accountGet = await Accounts.findByIdAndUpdate({ _id: to }, { $inc: { cash: amount } }, { new: true })
        const newTrans = await updateTransaction('Transfer money', from, to, amount);
        res.send(newTrans)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

//get all transactions
router.get('/api/transactions', async (req, res) => {
    try {
        const results = await Transactions.find()
        res.status(200).send(results);
    } catch (e) {
        res.status(400).send(e.message);
    }
})
//withraw money form account
router.patch('/api/accounts/withraw/:id', async (req, res) => {
    try {
        if (!req.body.amount || req.body.amount < 0) {
            throw new Error('Invalid input data')
        }
        const account = await Accounts.findOne({ _id: req.params.id })
        if (account.cash + account.credit - req.body.amount < 0) {
            throw new Error('Over your withraw limit')
        }
        const accountUpdate = await Accounts.findByIdAndUpdate({ _id: req.params.id }, { cash: account.cash - req.body.amount }, { new: true })
        if (!accountUpdate) {
            return res.status(404).send('No Account found')
        }
        const newTrans = await updateTransaction('Withraw money', accountUpdate._id, accountUpdate._id, req.body.amount);
        res.status(201).send(accountUpdate);

    } catch (e) {
        res.status(400).send(e.message)
    }
})
//update account credit
router.patch('/api/accounts/credit/:id', async (req, res) => {
    try {
        if (!req.body.credit || req.body.credit < 0) {
            throw new Error('Invalid input data')
        }
        const account = await Accounts.findByIdAndUpdate({ _id: req.params.id }, { credit: req.body.credit }, { new: true })
        if (!account) {
            return res.status(404).send('No Account found')
        }
        const newTrans = await updateTransaction('Update account credit', account._id, account._id, req.body.credit);
        res.status(201).send(account);
    } catch (e) {
        res.status(400).send(e.message)
    }
})
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
        const newTrans = await updateTransaction('Deposit money', account._id, account._id, req.body.deposit);
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
        const results = await Accounts.find({ _id: req.params.accountNumber })
        console.log(results)
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
    return newTrans;
}

module.exports = router;