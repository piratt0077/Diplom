var express = require('express');
var router = express.Router();
var M_Number=require('../models/number')

/* GET users listing. */
router.get('/all', function(req, res) {
  console.log("idet idet idet");
  M_Number.find()
  .then(doc=>{
    res.send(doc);
  })

});






router.get('/testpuk', function(req, res) {
  //number,rating,operator,type,signupDate,lastreportDate
  console.log("pishim pishim pishim");
  let doc=new M_Number({
    number:"88005553535",
    region:"Moscow",
    rating:10,
    operator:"BIline",
    reports:{vid:"vrag",date:new Date}
  })
  console.log(doc);
  doc.save();
  res.send(doc);

});


module.exports = router;
