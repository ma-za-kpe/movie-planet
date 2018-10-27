var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var  Seller = mongoose.model('Seller');

// get sellers
router.get('/', async(req, res, next) => {

    const sellers = await Seller.find().sort('email')
    res.send(sellers);
  });

//  create seller
router.post('/', async(req, res, next) => {
    let seller = await Seller.findOne({email: req.body.email});
    if (seller) {
        return res.status(400).send('Seller already registered');
    }

    seller = new Seller({
        email: req.body.email,
        password: req.body.password
    })
    seller.password = seller.encryptPassword();
    await seller.save();
    res.send(seller);
})


module.exports = router;