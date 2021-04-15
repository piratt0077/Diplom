const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    // название игры
    login:{
        type: String,
        default:'Отсутвует'
    },
    password:{
        type:String,
        default:"123"
    },
    personalBlackList:[{
        type:String
    }],
    personalWhiteList:[{
        type:String
    }],
    children:[{
        id:{
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    }],
    parents:[{
        id:{
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    }],
    registrationDate:{
        type:Date,
        default:Date.now()
    },
    macAddress:{
        type: String,
        default:''
    },
    registrationToken:{
        type: String,
        default:''
    } 
}, {versionKey:false});


module.exports = mongoose.model('users', user);