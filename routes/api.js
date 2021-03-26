var express = require('express');
var router = express.Router();
var M_Number=require('../models/number')

/* GET home page. */
router.get('/search', function(req, res) {
  console.log(req.body);
  M_Number.findOne({number:req.query.number})
  .then(doc=>{
    a=doc.toJSON();
    console.log(a);
    delete doc._doc.firstReportDate;
    delete doc._doc.lastReportDate;
    doc._doc.id=doc._id;
    delete doc._id;
    doc._doc.isBan=0;
    if (doc.rating<9) {
      doc._doc.isBan=1;
    }
    console.log("hi");

   //console.log(doc);
    res.send({success:true,errorCode:0,data:doc})
  })
  .catch(err=>{
    console.log(err);
    res.status(500).send({success:false,errorCode:1,data:err});
  })
  });

module.exports = router;
