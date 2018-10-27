var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Buyer = mongoose.model('Buyer');

// get buyers
router.get('/', async(req, res, next) => {
    const buyers = await Buyer.find().sort('email')
    res.send(buyers);
  });

router.post('/', async(req, res, next) => {
    let buyer = await Buyer.findOne({email: req.body.email})
    if (buyer) {
        return res.status(400).send('Buyer already registered')
    }
    buyer = new Buyer({
        email: req.body.email,
        password: req.body.password
    })
    buyer.password = buyer.encryptPassword();
    await buyer.save();
    res.send(buyer)
})








module.exports = router;