var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
// var mongoCreds = require('../config/mongoCred');
// console.log(mongoCreds.username)
var User = require('../models/user');
var EventPost = require('../models/eventPost');

// mongoose.connect('mongodb://' + mongoCreds.username + ':' + mongoCreds.password + '@ds057476.mlab.com:57476/snaap_dog');

mongoose.connect('mongodb://' + 'summer' + ':' + 'summer' + '@ds031617.mlab.com:31617/hitup');

var bcrypt = require('bcrypt-nodejs');
var randToken = require('rand-token');
// LOG IN --------------------------------------------------
router.post('/login', function(req, res, next) {
    var user=req.body.user

    User.findOne({'username': user.username}, function(err, docs) {
            if (err) {
                console.log("Error")
                console.log(err);
                res.json({
                    passFail: 0,
                    status: "Failed at findOne"
                });
            } else {
                if (docs == null) {
                    console.log("else docs")
                    console.log(docs);
                    res.json({
                        passFail: 0,
                        status: "Failed at findOne, doc is null"
                    });
                } else {
                    var passwordCheck = bcrypt.compareSync(user.password, docs.password);
                    console.log(passwordCheck);
                    if (passwordCheck) {
                        var token = randToken.generate(32);
                        console.log('token:' + token);
                        User.findOneAndUpdate({'_id': docs._id}, {$set: {'token': token}}, {upsert: true, new: true}, function(err, docs) {
                            console.log("password checked");
                            res.json({
                                passFail: 1,
                                status: "User found",
                                docs: docs
                            });
                        });
                    } else {
                            console.log("else pass")
                            res.json({
                                passFail: 0,
                                status: 'User name and password did not match.'
                            });
                    }
                }
            }                   
    });
}); //end of login router
// REGISTER --------------------------------------------------
router.post('/register', function(req, res, next) {
    var user = req.body.user;
    console.log(user);
    User.findOne({'username': user.username}, function (err, doc) {
            if (err) {
                console.log('error!');
                console.log(err);
                res.json({
                    passFail: 0,
                    status: "Failed at finding one" 
                });
            } else {
                if (doc == null) {
                    var newUser = new User({
                        username: user.username,
                        password: bcrypt.hashSync(user.password),
                        email: user.email
                       
                    });
                    console.log(newUser);
                    newUser.save(function(err, saved, status) {
                        if (err) {
                            console.log(err);
                            res.json({
                                passFail: 0,
                                status: "Registration failed."
                            });
                        } else {
                            console.log(saved);
                            res.json({
                                passFail: 1,
                                status: "Registered!",
                                docs: saved,
                                token: token
                            });
                        }
                    });
                } else {
                    res.json({
                        passFail: 0,
                        status: "Found a match. Try a different username."
                    });
                }
            }
    });
});
// Post events
router.post('/eventPost',function(req,res,next){
    var eventPost=req.body.eventPost;
     User.findOne({'username': eventPost.username}, function (err, doc) {
        if (err) {
                console.log('error!');
                console.log(err);
                res.json({
                    passFail: 0,
                    status: "Failed at finding one" 
                });
            } else {
                if (doc ) {
                    var newEventPost = new EventPost({
                       username:eventPost.username,
                       eventTitle:eventPost.eventTitle,
                       place:eventPost.place,
                       eventTime:eventPost.eventTime,
                       eventDescription:eventPost.eventDescription,
                       typeEvent:eventPost.typeEvent
                       
                    });
                    console.log('Did it work?');
                    newEventPost.save(function(err, saved, status) {
                        if (err) {
                            console.log('nope');
                            console.log(err);
                            res.json({
                                passFail: 0,
                                status: "Event post creation failed."
                            });
                        } else {
                            console.log(saved);
                            res.json({
                                passFail: 1,
                                status: "Event post created!"
                            });
                        }
                    });
                } else {
                    res.json({
                        passFail: 0,
                        status: "Username not found"
                    });
                }
            }
    });

    });

// beginning of eventFeed
// router.get('/eventFeed',function(req,res,next){
//     EventPost.find()sort(-date)
//             .exec(function(err,docs){
//                 if(err){
//                     return next(err)
//                 }else{
//                     res.json(docs)
                    
//                 }
//             })
//             }
// });
//end of eventFeed



//emd pf get EventFeed

//Remove post
// router.post('/remove_post',function(req,res,next){
//     var postId = req.body.postId;
//     Posting.findByIdAndRemove(postId, function(err, docs) {
//         if (err) { console.log(err);
//             res.json({ passFail: 0, status: "Error in finding the post to remove"});
//         } else {
//             if (docs == null) {
//                 console.log(docs);
//             } else {
//                 console.log("docs removed");
//                 res.json({
//                     passFail: 1,
//                     docs: docs
//                 });
//             }
//         }
//     });
// }); 
module.exports = router;




