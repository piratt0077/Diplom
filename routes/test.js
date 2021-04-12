var express = require("express");
var router = express.Router();
var M_Number = require("../models/number");
var passport = require("passport");

var admin = require("firebase-admin");
var serviceAccount = require("../configs/diplom-cf1d1-firebase-adminsdk-8512w-2a2ca11e7e.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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
  var registrationToken=req.query.token;

  var message = {
    notification: {
      title: "Message from node",
      body: "hey there",
    },
    token:registrationToken
  };
  // Send a message to devices subscribed to the provided topic.
  admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
      res.send('success');
    })
    .catch((error) => {
      console.log("Error sending message:", error);
      res.send('error');
    });

});

router.get("/all", function (req, res) {
  console.log("idet idet idet");
  M_Number.find().then((doc) => {
    res.send(doc);
  });
});

router.get("/testpuk", function (req, res) {
  //number,rating,operator,type,signupDate,lastreportDate
  console.log("pishim pishim pishim");
  let doc = new M_Number({
    number: "88005553535",
    region: "Moscow",
    rating: 10,
    operator: "BIline",
    reports: { vid: "vrag", date: new Date() },
  });
  console.log(doc);
  doc.save();
  res.send(doc);
});

module.exports = router;
