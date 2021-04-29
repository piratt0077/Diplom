var admin = require("firebase-admin");
var serviceAccount = require("./configs/diplom-cf1d1-firebase-adminsdk-8512w-2a2ca11e7e.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

function send(token,text,data){
  if(data==undefined){
    data={};
  }
    var message = {
        notification: {
          title: "Notification♥",
          body: text,
        },
        data:data,
        token:token
      };
    admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
}
module.exports.send=send;