var express = require('express');
var router = express.Router();
var M_Number=require('../models/number')

/* GET home page. */
router.get('/search', function(req, res) {
  console.log(req.body);
  M_Number.findOne({number:req.query.number})
  .then(doc=>{
    ////place for calculate



    outdoc=doc.toJSON();
    delete outdoc.firstReportDate;
    //nado li
    delete outdoc.lastReportDate;
    outdoc.id=outdoc._id;
    delete outdoc._id;
    outdoc.isBan=0;
    if (outdoc.rating<9) {
      outdoc.isBan=1;
    }
    console.log(outdoc);
    res.send({success:true,errorCode:0,data:outdoc})
  })
  .catch(err=>{
    console.log(err);
    res.status(500).send({success:false,errorCode:1,data:err});
  })
  });

module.exports = router;
