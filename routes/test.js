var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
var M_Number = require("../models/number");
var M_User =require("../models/user");
var passport = require("passport");
var notificator = require("../notifications");
var jwt = require("jsonwebtoken");
/* GET users listing. */

//TEST FOR PASSPORT
// router.get('/test',function(req,res){
//   passport.authenticate('google', { scope: ['profile'] });
//   console.log("hello testtesttesttest");
// });
// router.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });






//TEST FOR FIREBASE
router.get("/firetest", function (req, res) {
  console.log("hello from firebase");
  //var registrationToken = req.user.registrationToken;
  var registrationToken='fOZnSMFYSqu3ndqhR6sOw1:APA91bFwE83mccFi0ZH3d6c-uZ_cybMS2XmGWUta0NcaMh0uFx3YD1uEf3o3pRN7OWGM1jPwmCBTeq1cSOiUGC57UAviulFhDTgCFozHpif0AIoqea-IzQgIoqQ_lbJJ9zW7KHNOinAP';
  notificator.send(registrationToken,'u have parents',{uid:'1123123123'});
  res.send({success:true,errorCode:0,data:{}})
});

//work on lists
router.post('/setToBlackList',function (req, res){
  phone=req.body.number;
  console.log(req.user);
  M_User.findById({_id:req.user.user._id})
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


//////test for parent/child relationship
router.get("/addChild", function (req, res) {
  if(req.header('Authorization')==null){
    return res.send('not authorized');
  }
  var childUID=req.query.uid;
  M_User.findOne({_id:childUID})
  .then(doc=>{
    if(doc==undefined){
      throw new Error('user not Found');
    }
    doc=doc.toJSON();
    notificator.send(doc.registrationToken,'ur Dada found u'+req.user._id);
    res.send({success:true,errorCode:0,data:doc})
  })
  .catch(err=>{
    res.send({success:false,errorCode:0,data:err.message});
  })
});

router.get("/addParent", function (req, res) {
  if(req.header('Authorization')==null){
    return res.send('not authorized');
  }
  var parentUID=req.query.uid;
  M_User.findOne({_id:parentUID})
  .then(doc=>{
    doc.children.push(req.body.uid)
    doc.save();
    res.send({success:true,errorCode:0,data:doc})
  })
  .catch(err=>{
    res.send({success:false,errorCode:0,data:err.message});
  })
});





//get all for test
router.get("/allNumber", function (req, res) {
  console.log("idet idet idet");
  M_Number.find().then((doc) => {
    res.send(doc);
  });
});
router.get("/allUser", function (req, res) {
  console.log("idet idet idet");
  M_User.find().then((doc) => {
    res.send(doc);
  });
});


router.get("/testpuk", function (req, res) {
  //number,rating,operator,type,signupDate,lastreportDate
  console.log("pishim pishim pishim");
  let numberdoc = new M_Number({
    number: "88005553535",
    region: "Moscow",
    rating: 10,
    operator: "BIline",
    reports: { type: "vrag", date: new Date() },
  });
  numberdoc.save();
  console.log(numberdoc);
  let userdoc = new M_User({
    login: "123123123",
    password:"123123"
  });
  userdoc.save();
  console.log(userdoc);
  res.send({success:true,errorCode:0,data:userdoc});
});


//test token
router.get("/testtoken", function (req, res) {
  console.log("test test test");
  //var registrationToken = req.user.registrationToken;
  var data ={
    data:'data',
    dada:'netnet',
    netnet:'dada'
  }
  console.log("data BEFORE sign");
  console.log(data);
  var key=jwt.sign(data,process.env.SECRET);
  console.log("data AFTER sign");
  console.log(key);
  var open=jwt.verify(key,process.env.SECRET);
  console.log("data AFTER AFTER");
  console.log(open);
  
  res.send({success:true,errorCode:0,data:{open}})
});



module.exports = router;
