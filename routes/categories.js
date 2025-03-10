var express = require('express');
var router = express.Router();
let categorySchema = require('../models/categories')
const { fail } = require('assert');

//http://localhost:3000/products?name=iph&price[$gte]=1600&price[$lte]=3000
/* GET users listing. */
router.get('/', async function (req, res, next) {
    let categories = await categorySchema.find();
    res.send(categories);
});
router.post('/', async function (req, res, next) {
    let body = req.body;
    console.log(body);
    let newCategory = new categorySchema({
        categoryName: body.categoryName,
        description: body.description
    })
    await newCategory.save()
    res.send(newCategory);
});


module.exports = router;