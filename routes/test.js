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
  var registrationToken='ePti_yPKSw-H9Ui2hyGp_s:APA91bEw_Y_oSpA943GnTSczzojOLP0FI45di0nedwXF7f03yV__urLpZryVRsPImtdtMdLSItXfGpcFFbdcZKpAecTjfa7dR4YOHfEVacEHwqzoilV0gyGJ_tfJuquGBl3xFySd0vsy';
  notification.send(registrationToken,'u have parents');
  res.send({success:true,errorCode:0,data:{}})
});

//work on login
router.post("/login", async function (req, res){
  var {uid,token} = req.body;
  M_User.findOne({uid:uid,registrationToken:token})
  .then(async doc=>{
    if(doc==undefined){
      throw new Error('wrong door');
    }
    var token=await jwt.sign({
      uid:doc._id,
      registrationToken:doc.registrationToken
    },process.env.SECRET)
    res.send({success:true,errorCode:0,data:{token:token}});
  })
  .catch(err=>{
    res.send({success:false,errorCode:0,data:{coc:'suck'}});
  })
});

//////test for parent/child relationship
router.get("/addChild", function (req, res) {
  var childUID=req.query.uid;
  M_User.findOne({uid:childUID})
  .then(doc=>{
    if(doc==undefined){
      throw new Error('not Found')
    }
    doc=doc.toJSON();
    notification.send(doc.registrationToken,'ur Dada found u'+req.user.uid);
    res.send()
  })
  .catch(err=>{
    res.send({success:false,errorCode:0,data:err.message});
  })
});

router.get("/addParent", function (req, res) {
  var parentUID=req.query.uid;
  M_User.findOne({_id:parentUID})
  .then(doc=>{
    doc.children.push(req.body.uid)
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



module.exports = router;
