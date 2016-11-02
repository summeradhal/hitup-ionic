var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
// var mongoCreds = require('../config/mongoCred');
// console.log(mongoCreds.username)
var User = require('../models/user');
var EventPost = require('../models/eventPost');
var EventComments = require('../models/eventComments');
var Friends= require('../models/friends');
var Hitup= require('../models/hitup');

// mongoose.connect('mongodb://' + mongoCreds.username + ':' + mongoCreds.password + '@ds057476.mlab.com:57476/snaap_dog');
mongoUrl='mongodb://' + 'summer' + ':' + 'summer' + '@ds031617.mlab.com:31617/hitup';
mongoose.connect(mongoUrl,function(error,database){
    if (error){
        console.log(error)
    }else{
        db=database;
        console.log("Connected to mongo successfully")
    }
});





var bcrypt = require('bcrypt-nodejs');
var randToken = require('rand-token');
// LOG IN --------------------------------------------------
router.post('/login', function(req, res, next) {
    var user=req.body.user

    User.findOne({'username': user.username}, function(err, docs) {
            if (err) {
                console.log("Could not Find")
                console.log(err);
                res.json({
                    failure: "badPass",
                    status: "Failed at findOne"
                });
            } else {
                if (docs == null) {
                    console.log("Nothing found. It failed")
                    console.log(docs);
                    res.json({
                        failure: "badPass",
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
                                success: "userFound",
                                status: "User found",
                                docs: docs,
                                token:token
                            });
                        });
                    } else {
                            console.log("else pass")
                            res.json({
                                failure: "badPass",
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
router.post('/eventFeed',function(req,res,next){

    EventPost.find()
            .exec(function(err,docs){

                if(err){
                    console.log("error here")
                    return next(err)
                }else{
                    console.log("Event crap works")
                    res.json(docs)
                    
                }
            })
            
});
// end of eventFeed

// beginning of eventFeed
router.post('/eventCommentFeed',function(req,res,next){

    EventComments.find()
            .exec(function(err,docs){

                if(err){
                    console.log("error here")
                    return next(err)
                }else{
                    console.log("Event crap works")
                    res.json(docs)
                    
                }
            })
            
});
// end of eventFeed
//Comment on post

// Post events
router.post('/eventComments',function(req,res,next){

   
    var eventComment=req.body.eventComment;
    var eventPostId=req.body.eventPostId;
     User.findOne({username:eventComment.username}, function (err, doc) {
        console.log("Here it is summer");
        if (err) {
                console.log('error!');
                console.log(err);
                res.json({
                    passFail: 0,
                    status: "Failed at finding one" 
                });
            } else {
                if (doc ) {
                   var username=doc.username;
                    var newEventComments = new EventComments({
                       username:eventComment.username,
                       comment:eventComment.comment,
                       eventPostId:eventPostId
                       
                    });
                    console.log('Did it work?');
                    newEventComments.save(function(err, saved, status) {
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
                    console.log("IT FAILED SOMER");
                    res.json({
                        passFail: 0,
                        status: "Username not found"
                    });
                }
            }
    });

    });
//end of Comment on post



//emd pf get EventFeed

// Remove post
router.post('/remove_post',function(req,res,next){
    var postId = req.body.id;
    console.log(postId);
    EventPost.findByIdAndRemove(postId, function(err, docs) {
        if (err) { console.log(err);
            res.json({ passFail: 0, status: "Error in finding the post to remove"});
        } else {
            if (docs == null) {
                console.log(docs);
            } else {
                console.log("docs removed");
                res.json({
                    passFail: 1,
                    docs: docs
                });
            }
        }
    });
})


router.post('/friendButtons',function(req,res,next){
    var username=req.body.username;
    var friendUsername=req.body.username;
 Friends.find({username:username})
            .exec(function(err,docs){

                if(err){
                    console.log("error here")
                    return next(err)
                }else{
                    Friends.find({friendUsername:friendUsername},function(err,result){
                        if(err){
                            res.json({
                                passfail:0,
                                result:result
                            })

                        }else{
                             res.json({
                                passfail:1,
                                result:result
                            })

                        }

                    })
                    console.log("Event crap works")
                    
                    
                }
            })

})





// Remove post
router.post('/remove_friend',function(req,res,next){
     console.log(req);
            var friendUsername=req.body.username;
            var username=req.body.friendUsername;
    console.log(username);

    
    Friends.find(friendUsername, function(err, docs) {
        Friends.remove(username,function(err,docs){
          console.log("Yo its here now friends deleting");
        if (err) { 
            console.log(err);
            res.json({ passFail: 0, status: "Error in finding the post to remove"});
        } else {
            if (docs == null) {
                console.log(docs);
            } else {
               console.log("docs removed");
                res.json({
                    passFail: 1,
                    docs: docs
                });
               
                console.log(docs);
            }
        }
    })
    });

})
router.post('/hitup',function(req,res,next){
    // console.log(req);
    var hitupId=req.body.id;
    var hitupUsername=req.body.username;

    User.findOne({username:hitupUsername},function(err,doc){
        if(err){
             res.json({
                            passFail: 0,
                            status: "Failed at finding one" 


                        });
              
         }else{
            if(doc){
                 Hitup.findOne({hitupId: hitupId},function(error,result){
                    Hitup.findOne({hitupUsername:hitupUsername},function(error,result){
                      if(result){
                            
                                console.log(result);
                              console.log(result._id);

                            var username=result.username;
                          
                          result.remove();
                            
                            
                      

                        }else{
                            EventPost.find({_id: hitupId},function(error,result){
                                if(error){

                                }else{
                        
                        if(result){
                            
                            console.log(result[0]._id);

                            var username=result[0].username;
                             console.log(username);
                            
                            var hitupTotal=+1;
                             var newHitup=new Hitup({
                                hitupTotal:hitupTotal,
                                username:username,
                                hitupUsername:hitupUsername,
                                hitupId:hitupId
                })

                     newHitup.save(function(err, saved, status) {
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
                 }
                    }
                        
                 


                    })
                        

               
                }
            
         
    })
    
}) 
}
}
})
})// end of hituop




// Add Friends
router.post('/addFriends',function(req,res,next){
    console.log(req);
            var friendUsername=req.body.username;
            var username=req.body.friendUsername;
    console.log(username);

         console.log("I HOPE THIS WORKS");
    User.findOne({username:username}, function (err, doc) {
        console.log("Here it is summer");
        if (err) {
                console.log('error!');
                console.log(err);
                res.json({
                    passFail: 0,
                    status: "Failed at finding one" 
                });
            } else {
                if (doc ) {
                   var username=doc.username;
                    var newFriends = new Friends({
                       friendUsername:friendUsername,
                       username:username
                       
                    });
                    console.log('Did it work?');
                    newFriends.save(function(err, saved, status) {
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
                    console.log("IT FAILED SOMER");
                    res.json({
                        passFail: 0,
                        status: "Username not found"
                    });
                }
            }
    });
});



module.exports = router;




