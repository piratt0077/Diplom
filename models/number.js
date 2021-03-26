const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const number = new Schema({
    // название игры
    number:{
        type: String,
        default:'Отсутвует'
    },
    rating:{
        type:Number,
        default:0
    },
    region:{
        type:String,
        default:"Отсутвует"
    },
    operator:{
        type:String,
        default:"Отсутвует"
    },
    reports:[{
        type:{type:String,default:"Другое"},
        date:{type:Date,default:Date.now()},
    }],
    firstReportDate:{
        type:Date,
        default:Date.now()
    },
    lastReportDate:{
        type:Date,
        default:Date.now()
    }
}, {versionKey:false});


module.exports = mongoose.model('numbers', number);