const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/env');
const uuid = require('uuid/v4');
// const GB = require('../configs/GB');


// Validate Function to check password length
let passwordLengthChecker = (password) => {
    // Check if password exists
    if (!password) {
        return false; // Return error
    } else {
        // Check password length
        if (password.length < 6) {
            return false; // Return error if passord length requirement is not met
        } else {
            return true; // Return password as valid
        }
    }
};

// V

// Array of Password validators
const passwordValidators = {
    validator: passwordLengthChecker,
    message: 'Password must be at least 6 characters'
};

// User Schema
const UserSchema = mongoose.Schema({
    first_name:{type:String,required:true},
    last_name:{type:String,required:true},
    email: { type: String, required: true },
    password: { type: String, required: true, validate: passwordValidators },
    created_at: { type: Date, default: Date.now() },
    updated_token: { type: String, default: null},
    deleted: { type: Boolean, default: false },
    activation_Token: { type: String, default: null },
    isActive: { type: Boolean, default: false }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

module.exports.getUserByEmail = function(email, callback) {
    const query = { email }
    User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback) {
    let salt = bcrypt.genSaltSync(10);
    let email_hash = bcrypt.hashSync(newUser.email, salt);
    let password_hash = bcrypt.hashSync(newUser.password, salt);
    newUser.password = password_hash;
    newUser.activation_Token = email_hash;
    newUser.save(callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}


module.exports.compareToken = function(token, hash, callback) {
    bcrypt.compare(token, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}


module.exports.updateToken = function(email, jwt, callback) {
    let updated_token = jwt;
    User.findOneAndUpdate({ email }, { updated_token }, callback);
}

module.exports.changePassword = async(token, pass, cb) => {
        if (pass && pass !== "" && pass !== undefined) {
            let salt = await bcrypt.genSaltSync(10);
            let password_hash = await bcrypt.hashSync(pass, salt);
            User.findOneAndUpdate({ activation_Token: toen }, { password: password_hash }, cb)
        } else {
            cb(null, { success: false, msg: "Need to set password" });
        }
    }
    // Password Validator