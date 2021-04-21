var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
var M_Number = require("../models/number");
var M_User =require("../models/user");
var passport = require("passport");
var notificator = require("../notifications");
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
router.post("/login", function (req, res){
  var {uid,token} = req.body;
  M_User.findOne({uid:uid,registrationToken:token})
  .then(doc=>{
    if(doc==undefined){
      throw new Error('wrong door');
    }
    res.send(doc);
  })
  .catch(err=>{
    res.send({success:false,errorCode:0,data:{coc:'suck'}});
  })
})

router.get("/all", function (req, res) {
  console.log("idet idet idet");
  M_Number.find().then((doc) => {
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



router.get('/setToBlackList',function (req, res){
  phone='123';
  M_User.findOne({login:'321321321'})
  .then(doc=>{
    if(doc==undefined){
      res.send({success:false,errorCode:1,data:err})
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



module.exports = router;
