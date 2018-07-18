const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const productSchema = Schema({
    brand: {type: String, required: true},
    subbrand: {type: String},
    name: {type: String, required: true},
    UPC: {type: String, unique: true, required: true},
    ASINS: {
        type:
        [{ ASIN: { type: String, required: true },
            packAmt: { type: Number, required: true, min: 1, } }]
        , default: []
    }
});

const Product = module.exports = mongoose.model('Product', productSchema);

module.exports.addProduct = function(body, callback){
    let newProduct = new Product({
        brand: body.brand,
        subbrand: body.subbrand,
        name: body.name,
        UPC: body.UPC,
        ASINS: body.ASINS
    });
    newProduct.save(callback);
};

function modifyProduct(product, body){
    //;
}

module.exports.deleteProducts = function(UPCS, callback){
    Product.remove({ UPC: UPCS}, callback);
};

module.exports.updateProduct = function(body, callback){
    Product.findOne({UPC: body.UPC}, (err, product) => {
        if(err) callback(err);
        else if(!product) callback('UPC not found');
        else{
            modifyProduct(product, body);
            product.save(callback);
        } 
    });
};