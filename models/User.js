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
        number:{type:String,default:"null"}
    }],
    personalWhiteList:[{
        number:{type:String,default:"null"}
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
    }
}, {versionKey:false});


module.exports = mongoose.model('users', user);