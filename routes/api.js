var express = require('express');
var router = express.Router();
var M_Number=require('../models/number')

var defnumber={
  id:0,
  number:0,
  rating:0,
  region:"0",
  operator:"0",
  reports:[],
  isBan:0
}

/* GET home page. */
router.get('/search', async function(req, res) {
  console.log(req.body);
  M_Number.findOne({number:req.query.number})
  .then(async doc=>{
    ////place for test

    //function for sleep
    if(req.query.number==1){
      console.log("timeToSleep 1sec");
      await new Promise(resolve => setTimeout(resolve, 2000));  
    }
    if(req.query.number==5){
      console.log("timeToSleep 5sec");
      await new Promise(resolve => setTimeout(resolve, 7000));
    }
    ////////////////////////

    if (doc==undefined) {
      defnumber.number=req.query.number;
      return res.send({success:true,errorCode:0,data:defnumber});
    }
    



    outdoc=doc.toJSON();
    delete outdoc.firstReportDate;
    delete outdoc.lastReportDate;
    outdoc.id=outdoc._id;
    delete outdoc._id;
    outdoc.isBan=0;
    var newreps=await analog(doc.reports);
    outdoc.reports=newreps;
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

///////скучный говнокод
  function analog(reports){
  
    newreps=[];
    reports.forEach(element => {
      var boool=true;
      newreps.forEach(elem=>{
        if (element.type==elem.type) {
          elem.count+=1;
          boool=false;
        }
      })
      if (boool) {
        newreps.push({type:element.type,count:1})  
      }
    });
    return newreps;
  }
///////гениальное дизайнерское решение
function analog2(reports){
  newreps=[];
  reports.reduce(function(accum,curval){
    if (newreps[curval.type]==undefined) {
      newreps.type=[curval.type];

    }
    else {
      newreps[curval.type]+=1;
    }
    return accum;
  },newreps)
  return newreps;
}

module.exports = router;
