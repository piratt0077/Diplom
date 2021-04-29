var express = require('express');
var router = express.Router();
var M_Number=require('../models/number');
var M_User=require('../models/user');
var notificator = require('../notifications');
var jwt = require("jsonwebtoken");


var defnumber={
  id:'0',
  number:0,
  rating:0,
  region:"0",
  operator:"0",
  reports:[],
  isBan:0
}

////////////////////////////////////////////////
//parentship section
router.get("/addChild", function (req, res) {
  // if(req.user==undefined)){
  //   return res.send({success:false,errorCode:0,data:err.message});
  // }
  var childUID=req.query.uid;
  M_User.findOne({_id:childUID})
  .then(doc=>{
    if(doc==undefined){
      throw new Error('user not Found');
    }
    if(doc.children.includes(childUID)){
      throw new Error('user not Found');
    }
    doc=doc.toJSON();
    notificator.send(doc.registrationToken,'ur Dada found u',{uid:childUID}/*,{uid:req.user._id}*/);
    res.send({success:true,errorCode:0,data:'puk'})
  })
  .catch(err=>{
    console.log(err);
    res.status(500).send({success:false,errorCode:0,data:err.message});
  })
});

router.get("/addParent", function (req, res) {
  // if(req.user==undefined){
  //   return res.send({success:false,errorCode:0,data:err.message});
  // }
  var parentUID=req.query.uid;
  M_User.findOne({_id:parentUID})//parent finding to add child data
  .then(parentDoc=>{
    parentDoc.children.push(req.query.uid)
    parentDoc.save();

    M_User.findOne({_id:req.query.uid})//child finding to add parent data
    .then(childDoc=>{
      childDoc.parents.push(parentUID);
      childDoc.save();
      notificator.send(parentDoc.registrationToken,'ur Son found u'/*,{uid:req.user._id}*/);

      res.send({success:true,errorCode:0,data:parentDoc})
    })    
  })
  .catch(err=>{
    res.status(500).send({success:false,errorCode:0,data:err.message});
  })
});














////////////////////////////////////////////////
//auth section
router.post("/login", async function (req, res){
  var {uid,registrationToken} = req.body;
  M_User.findOne({_id:uid,registrationToken:registrationToken})
  .then(async doc=>{
    if(doc==undefined){
      throw new Error('wrong door');
    }
    var outdata=doc.toJSON();
    var token = jwt.sign({
      user:outdata
    },process.env.SECRET);
    res.send({success:true,errorCode:0,data:{sessionToken:token,uid:uid,registrationToken:registrationToken}});
  })
  .catch(err=>{
    console.log(err);
    res.status(500).send({success:false,errorCode:0,data:{coc:err.message}});
  })
});



//rework method - split to two methods(signup and login)
  router.get('/updateToken',function (req, res){
    var {registrationToken,macAddress} =req.query;
    M_User.findOne({macAddress:macAddress})
    .then(doc=>{
      if(doc==undefined){
        var user = new M_User({
          registrationToken: registrationToken,
          macAddress:macAddress
        })
        user.save()
        .then(saved=>{
          saved=saved.toJSON();
          saved.uid=saved._id;
          delete saved._id;
          res.send({success:true,errorCode:0,data:saved})
        })
        .catch(err=>{
          res.status(500).send({success:false,errorCode:1,data:err});
        });
      }
      else{
        doc.registrationToken=registrationToken;
        doc.save();
        doc=doc.toJSON();
        doc.uid=doc._id;
        delete doc._id;
        res.send({success:true,errorCode:0,data:doc})
      }
    })
    .catch(err=>{
      res.status(500).send({success:false,errorCode:1,data:err});
    })
  })

  router.get('/signUp',function (req, res){
    var {registrationToken,macAddress} =req.query;
    M_User.findOne({macAddress:macAddress})
    .then(doc=>{
      if(doc==undefined){
        var user = new M_User({
          registrationToken: registrationToken,
          macAddress:macAddress
        })
        user.save()
        .then(saved=>{
          saved=saved.toJSON();
          saved.uid=saved._id;
          delete saved._id;
          res.send({success:true,errorCode:0,data:saved})
        })
        .catch(err=>{
          console.log("error on save new user"+err);
          res.status(500).send({success:false,errorCode:1,data:err});
        });
      }
      else{
        throw new Error('user already registered')
      }
    })
    .catch(err=>{
      res.status(500).send({success:false,errorCode:1,data:err.message});
    })
  })


///////////////////////////////////
//other shet
  router.get('/search', async function(req, res) {
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
        return res.status(200).send({success:true,errorCode:0,data:defnumber});
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
  
  router.post('/setToBlackList',function (req, res){
    phone=req.body.number;
    M_User.findById(req.user._id)
    .then(doc=>{
      if(doc==undefined){
        throw new Error('user not found')
      }
      if(doc.personalBlackList.includes(phone)){
        console.log("allo");
        throw new Error('phone already in Black List')
      }
      else{
        console.log("vkusno");
        doc.personalBlackList.push(phone);
        doc.save();
      }
      res.send({success:true,errorCode:0,data:doc});
    })
    .catch(err=>{
      console.log(err);
      res.status(500).send({success:false,errorCode:1,data:err.message});
    })
  })
  router.post('/setToWhiteList',function (req, res){
    phone=req.body.number;
    M_User.findById(req.user._id)
    .then(doc=>{
      if(doc==undefined){
        throw new Error('user not found')
      }
      if(doc.personalWhiteList.includes(phone)){
        console.log("allo");
        throw new Error('phone already in White List')
      }
      else{
        console.log("vkusno");
        doc.personalWhiteList.push(phone);
        doc.save();
      }
      res.send({success:true,errorCode:0,data:doc});
    })
    .catch(err=>{
      console.log(err);
      res.status(500).send({success:false,errorCode:1,data:err.message});
    })
  })

  router.post('/unsetToBlackList',function (req, res){
    phone=req.body.number;
    M_User.findById(req.user.user._id)
    .then(doc=>{
      if(doc==undefined){
        console.log("user not found");
        throw new Error('user not found')
      }
      if(doc.personalBlackList.includes(phone)){
        doc.personalBlackList.pull(phone);
        console.log("phone removd");
        doc.save();
      }
      else{
        console.log("phone not found in blacklist");
        throw new Error('phone not found in blacklist')
      }
      res.send({success:true,errorCode:0,data:doc});
    })
    .catch(err=>{
      console.log(err);
      res.status(500).send({success:false,errorCode:1,data:err.message});
    })
  })
  
  router.post('/unsetToWhiteList',function (req, res){
    phone=req.body.number;
    M_User.findById(req.user.user._id)
    .then(doc=>{
      if(doc==undefined){
        console.log("user not found");
        throw new Error('user not found')
      }
      if(doc.personalWhiteList.includes(phone)){
        doc.personalWhiteList.pull(phone);
        console.log("phone removd");
        doc.save();
      }
      else{
        console.log("phone not found in Whitelist");
        throw new Error('phone not found in Whitelist')
      }
      res.send({success:true,errorCode:0,data:doc});
    })
    .catch(err=>{
      console.log(err);
      res.status(500).send({success:false,errorCode:1,data:err.message});
    })
  })
  













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
