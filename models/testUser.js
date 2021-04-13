const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uid = new Schema({
    // название игры
    macAddress:{
        type: String,
        required: true
    },
    registrationToken:{
        type: String,
        required: true
    }    
}, {versionKey:false});
module.exports = mongoose.model('uids', uid);