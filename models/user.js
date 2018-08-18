const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const defaultShipCompanies = require('./const/shipping');

const saltRounds = 10;

const userSchema = Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    fees: { type:{
             ebayPercentageFromSaleFee:{type: Number, min:0, required:true},
             paypalPercentageFromSaleFee:{ type: Number, min: 0, required:true},
             paypalFlatFee:{ type: Number, min: 0, required:true}
            }
        , default:{ebayPercentageFromSaleFee:9.15, paypalPercentageFromSaleFee: 2.9,
        paypalFlatFee: 0.30}, required: true},
    shipCompanies:{ type:[{
        name: {type: String, required: true},
        shipMethods: { type: [{
                name: {type: String, required: true},
                description:{type: String},
                ozPrice: {type:[{
                    oz: { type: Number, min: -1 },
                    price: { type: Number, required: true, min: 0} }]}
            }], required: true },
        }], default:defaultShipCompanies, required: true

    },
    ebayKey: {type: String, default:""}
});
userSchema.index({ email: 1, "fixedShippingInfo.service": 1 }, { unique: true })

const User = module.exports = mongoose.model('User', userSchema);

module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(saltRounds, (err, salt) =>{
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) callback(err, null);
            else{
                newUser.password = hash;
                newUser.save(callback);
            }

        });
    })
};

module.exports.getUserById  = function(userId, callback){
    User.findOne({_id: userId}, null, {select:'-password -__v'}, callback);
};

module.exports.getUserByEmail  = function(email, callback){
    User.findOne({email: email}, callback);
};

module.exports.comparePassword = function(inputPassword, hashPassword, callback){
    bcrypt.compare(inputPassword, hashPassword, (err, isMatch) => {
        if(err)
            callback(err, null);
        else
            callback(null, isMatch);
    });
}

module.exports.getFeesById  = function(userId, callback){
    User.findOne({_id: userId}, null, {select:'fees -_id'}, (err, user) =>{
        callback(err, user.fees);
    });
};


module.exports.updateFeesById = function(userId, newFees, callback){
    User.findOneAndUpdate({_id: userId}, {fees:newFees}
        , { select:'fees -_id', new: true, runValidators: true }, (err, user) =>{
            if(err) callback(err,null);
            else{
                if(user) callback(err, user);
                else callback(new Error("userId not found"), null);
            }
    });
};

module.exports.getShipCompaniesById = function(userId, callback){
    User.findOne({_id: userId}, null, {select:'shipCompanies -_id'}, (err, user) =>{
        callback(err, user.shipCompanies);
    });
};

module.exports.getShipMethodById = function(shipMethodId, callback){
    let shipMethodObjId = mongoose.Types.ObjectId(shipMethodId);
    //https://stackoverflow.com/questions/33422770/mongodb-find-a-specific-obj-within-nested-arrays
    User.aggregate([
            {"$unwind":"$shipCompanies"},
            {"$unwind":"$shipCompanies.shipMethods"},
            {"$match":{"shipCompanies.shipMethods._id":shipMethodObjId}},
            {"$project":{"shipCompanies.shipMethods":1}},
            {"$group":{"_id":"$shipCompanies.shipMethods"}}
        ], (err, shipMethod) =>{
            callback(err, shipMethod[0]._id);
        }
    );
};

module.exports.addShipMethod = function(userId, shipMethod, callback){
    User.findOneAndUpdate({_id:userId}, {
        $push: {
            "shipCompanies.shipMethods": shipMethod
        }
    }, callback);
};

module.exports.deleteShipMethod = function(userId, shipMethodId, callback){
    User.findOneAndUpdate({_id:userId},
        {$pull: {"shipCompanies.$[].shipMethods": {"_id":shipMethodId}}
        }, (err, user) =>{
            callback(err, shipMethodId);
    });
};

module.exports.updateShipMethod = function(shipMethodId, shipMethod, callback){
    /////////////////User.findOneAndUpdate()
};