/**
 * Main application file
 */

//d8zZuX7-gbw:APA91bEG1sb56IAWsU6WYjQeMmIGwJ83FqdRsv79svHGjXxN5qN3vmQMyTSV36XfkRfsMut_5ExFeKFixZabBraaH_ogOuUaCEjTvf0vryAn9NKKKgyd5_n8x92lmyj9TbpI9u1_Hn-k
//page_type: 'page_1','page_2','page_3','page_4',

'use strict';

var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

var FCM = require('fcm-node');
var serverKey = 'YOUR_SERVER_KEY_HERE';
var fcm = new FCM(serverKey);

var app = express();

app.use(bodyParser.json({
    limit: '200mb'
}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '200mb'
}));

var server = http.createServer(app);


app.post('/notification', function(req, res) {

    var deviceToken = req.body.device_token
    var pageType = req.body.page_type
    var notificationTitle = req.body.notification_title
    var notificationBody = req.body.notification_body
    var badgeCount = req.body.badge_count

    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: deviceToken,
        collapse_key: 'green',

        notification: {
            title: notificationTitle,
            body: notificationBody,
            badge: badgeCount
        },

        data: { //you can send only notification or only data(or include both)
            page_type: pageType
        }
    };

    fcm.send(message, function(err, response) {
        if (err) {
            console.log("Something has gone wrong!", err);
            return res.status(400).json(err)
        } else {
            console.log("Successfully sent with response: ", response);
            return res.status(200).json(response)
        }
    });


});

// Start server
server.listen(9000, function() {
    console.log('Express server listening on %d', 9000);
});


// Expose app
exports = module.exports = app;