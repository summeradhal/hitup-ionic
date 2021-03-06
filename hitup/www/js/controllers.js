angular.module('starter.controllers',['ngCordova'])

.controller('tabCtrl',function($scope,$localStorage){
userOn=$localStorage.user;
console.log(userOn)
})
.controller('DashCtrl', function($scope) {})
.controller('EventResponseCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})
.controller('ProfileCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})
.controller('PostCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('LoginCtrl', function($scope, $http, $stateParams, $state,$rootScope,$localStorage) {
  var url = "http://localhost:3000";
   $scope.user={};
  $scope.login = function() {
    console.log($scope.user.username)
    console.log($scope.user.password)

    $http.post(url + '/login', {
     
      user: $scope.user

    }).then(function success(rspns) {
       if (rspns.data.failure == 'noToken' || rspns.data.failure == 'badPass'){
        console.log("oh vey")
      }else if(rspns.data.success=="userFound"){
      console.log(rspns);
       $localStorage.token = rspns.data.token;
       $localStorage.user = rspns.data.docs.username;
        $rootScope.logged=true;
        console.log(rspns.data.docs.username);
        console.log($localStorage.user);

       //where there is main, put dash
        console.log('Tab dash')
        var expDate = new Date();
        expDate.setDate(expDate.getTime() + (30 * 60000));
        // $cookies.put('token',response.data.token);
        
        console.log(rspns) 
       $state.go('tab.dash');  
       
      }
    }, function failure(rspns) {
        console.log("AJAX failed")
        console.log("Your log in failed summer")
        console.log(rspns);
    });
  };
})


.controller('RegisterCtrl', function($scope, $http, $stateParams, $state,$location) {
  $scope.home = function(){
    $state.go('tab.dash', {});
  };
  $scope.landing = function(){
    $state.go('login', {});
  };
  var url = "http://localhost:3000";
  $scope.user = {};
  $scope.confirm = {};
  var pw = $scope.confrimPW;
 
  $scope.register = function() {
    
    console.log($scope.user);
    console.log($scope.confirm);
    if ($scope.user.password == $scope.confirm.password) {
      console.log("Password match");
      $http.post(url + '/register', {
        user: $scope.user
      }).then(function success(rspns) {
        console.log(rspns);
        $location.path('/login');
      }, function fail(rspns) { 
        console.log("error")
      });
    } else {
      console.log("Try confirmPW again");
    }
  };
})


.controller('EventPostCtrl',function($scope,$http,$stateParams,$state,$location,$localStorage){
  var url="http://localhost:3000";
  $scope.eventPost={};
  $scope.eventPost.username=$localStorage.user;
  console.log($scope.eventPost.username);
  $scope.submitEventPost=function(){
    console.log($scope.eventPost);
    $http.post(url+'/eventPost',{
      eventPost:$scope.eventPost

    }).then(function success(rspns){
      console.log(rspns);
     
      $state.go('tab.dash');
    }, function fail(rspns){
      console.log("error")

    })
  }

})

.controller('EventFeed', function($scope, $http,$localStorage,deletePost,hitup,hitupButton) {
  
  $scope.submitEventPostId=function(id){
    $localStorage.eventPostId=id;
    $scope.eventPostId=$localStorage.eventPostId;
    console.log($localStorage.eventPostId);
    console.log($scope.eventPostId);
  }
    $scope.submitDeletePost=function(id){
      console.log(id);
      deletePost.deletePostService(id);
    }
    $scope.submitHitup=function(id){
      console.log("HEy does this work?")
    hitup.hitupService(id);
  }
  $scope.profileUsername=function(username){
    console.log("Thisthishtis")
       console.log(username);
      $localStorage.profileUsername=username;
      console.log($localStorage.profileUsername);
  }

  hitupButton.hitupButtonService($localStorage.eventPostId)
   $scope.hitupButton=$localStorage.hitupButton;

  var url = "http://localhost:3000";
  $http.post(url + '/eventFeed')
  .then(function succeess(rspns) {
    console.log(rspns.data.object);
    console.log("big win")

    $scope.eventFeed = rspns.data;
  }, function fail(rspns) {
    console.log("big fail")
    console.log(rspns);
    $state.go($state.tab.dash, {}, {reload: true});
  });
  console.log("Posts");

})

.controller('EventCommentCtrl',function($scope,$http,$localStorage,$stateParams,$state,$location,commentEvent){
  var url="http://localhost:3000";
  $scope.eventComment={};
  $scope.eventComments=[];
  $scope.eventComment.username=$localStorage.user;
  console.log($scope.eventComment.username);

  $scope.submitEventComment=function(id){
    
    console.log($scope.eventComment);
      console.log(id+"COMMENTS SUMEMR ID");

  
     commentEvent.commentEventService(id,$scope.eventComment);
      
  }

  var url = "http://localhost:3000";
  $http.post(url + '/eventCommentFeed')
  .then(function succeess(rspns) {
    console.log("big win")
    console.log(rspns.data.Object);
    // console.log(rspns.data[0].object);
    // console.log(rspns.data[0]);
    
   
      $scope.eventComment = rspns.data;
      console.log($scope.eventComment[0]);
      console.log($scope.eventComment[1].username);
      console.log("ugh")
      console.log($localStorage.eventPostCommentId);
    for(var i=0;i<$scope.eventComment.length;i++){
      console.log("FOR LOOP")
    if($scope.eventComment[i].eventPostId == $localStorage.eventPostId){
       console.log("FOR LOOP IF THAN THIS THAT")

       $scope.eventComments.push($scope.eventComment[i]);
       console.log($scope.eventComments);
       $state.go($state.eventComment, {}, {reload: true});
    }
  }
  }, function fail(rspns) {
    console.log("big fail")
    console.log(rspns);
  });
  console.log("Posts");


  

})



.controller('ProfileCtrl', function($scope,$http,$localStorage,$rootScope,$stateParams,$state,$location,friendRequestFactory,deleteFriend,friendButtons) {
  var url = "http://localhost:3000";
  console.log("DID IT WORK Profile");
  console.log($localStorage.user+"Wjhlakjwdhwla");
$scope.profileUsername=$localStorage.user;
console.log($scope.profileUsername+"WAAAAAAAAAA")
 $scope.submitProfileUsername=function(username){
    console.log("Thisthishtis")
      console.log(username);
      $localStorage.profileUsername=username;
      console.log($localStorage.profileUsername);

  }


   $scope.submitFriendRequest=function(username){
    console.log($localStorage.profileUsername);
    console.log("Adding friends is fun");
    
    friendRequestFactory.friendFactory($localStorage.profileUsername);

  }

  $scope.submitDeleteFriend=function(){
      deleteFriend.friendDeleteService($localStorage.profileUsername);
        console.log($localStorage.profileUsername);

      
  }

    friendButtons.friendButtonsService();
    console.log("yoyoyoyo")
     console.log("Hey i hope sure this warked"+$localStorage.friendFollowed);
   
     $rootScope.friendFollowed=$localStorage.friendFollowed;
     console.log($rootScope.friendFollowed+" for root scope")



  $http.post(url + '/eventFeed')
  .then(function succeess(rspns) {
    
  
   $scope.profileUsername=$localStorage.profileUsername;
   console.log($scope.profileUsername)
    $scope.eventFeed = rspns.data;

  }, function fail(rspns) {
    console.log("big fail")
    console.log(rspns);
    $state.go($state.tab.profile, {}, {reload: true});
  });
  console.log("Posts");

})

.service('friendRequestFactory',function($http,$localStorage){
 
 this.friendFactory=function(username){
  var url = "http://localhost:3000";
  console.log(username+" the service")
  

   $http.post(url + '/addFriends',{
    friendUsername:$localStorage.profileUsername,
    username:$localStorage.user
   
 })
  .then(function succeess(rspns) {
    return rspns;
    console.log(friendUsername);
   $state.go($state.tab.profile, {}, {reload: true});
  }, function fail(rspns) {
    return rspns;
   
  });
  
 }

})


.service('friendButtons',function($http,$localStorage){
 var url = "http://localhost:3000";
 this.friendButtonsService=function(){
  

   return $http.post(url + '/friendButtons',{
    friendUsername:$localStorage.profileUsername,
    username:$localStorage.user

   
 })
  .then(function succeess(rspns) {
    console.log(rspns);
    
     console.log(rspns.config.data.friendUsername);
     console.log($localStorage.profileUsername);

      console.log(rspns.data.passfail);
      if(rspns.data.passfail==0){
      
      console.log(rspns.data.passfail);
        
      
         $localStorage.friendFollowed=false;
     
          $state.go($state.tab.profile, {}, {reload: true});

      }else{

      console.log(rspns.data.passfail);


 
 
          $localStorage.friendFollowed=true;
      }

  }, function fail(rspns) {
    return rspns;
   
  });
  
 }

 })




.service('hitup',function($http,$localStorage){
 
 this.hitupService=function(id){
  var url = "http://localhost:3000";
  console.log(id+" the service");
  console.log("Hit me up mofo");

   $http.post(url + '/hitup',{
    id:id,
    username:$localStorage.user,

   
 })
  .then(function succeess(rspns) {
    return rspns;
    console.log(id);
   $state.go($state.tab.dash, {}, {reload: true});
  }, function fail(rspns) {
    return rspns;
   
  })
  
 }

 })

.service('hitupButton',function($http,$localStorage){
 
 this.hitupButtonService=function(id){
  var url = "http://localhost:3000";
  console.log(id+" the service");
  console.log("Hit me up mofo");

   $http.post(url + '/hitupButton',{
    id:id,
    username:$localStorage.user,
   
 })
  .then(function succeess(rspns) {
    if(rspns.data.passfail==0){
      
      console.log(rspns.data.passfail);
        
      
         $localStorage.hitupButton=false;
     
          

      }else{

      console.log(rspns.data.passfail);


 
 
          $localStorage.hitupButton=true;

      }
      $state.go($state.tab.dash, {}, {reload: true});
    console.log(id);

   
  }, function fail(rspns) {
   
   
  })
  
 }

 })
.service('deletePost',function($http,$localStorage){
 
 this.deletePostService=function(id){
  var url = "http://localhost:3000";
  console.log(id+" the service")
  

   $http.post(url + '/remove_post',{
    id:id
   
 })
  .then(function succeess(rspns) {
    return rspns;
    console.log(id);
   $state.go($state.tab.dash, {}, {reload: true});
  }, function fail(rspns) {
    return rspns;
   
  })
  
 }


 })

.service('commentEvent',function($http,$localStorage){
  this.commentEventService=function(id,eventComment){
    var url = "http://localhost:3000";
    console.log(eventComment);
    $http.post(url+'/eventComments',{

      eventComment:eventComment,
      eventPostId:$localStorage.eventPostId

    }).then(function success(rspns){
      console.log(rspns);
      console.log("LWJDKLWAJLDK");
      $state.go($state.eventComment, {}, {reload: true});
      
    }, function fail(rspns){
      console.log("error")

    })
  }
})
.service('deleteFriend',function($http,$localStorage){
 
 this.friendDeleteService=function(username){
  var url = "http://localhost:3000";
  console.log($localStorage.profileUsername+" the service")
  

   $http.post(url + '/remove_friend',{
   friendUsername:$localStorage.profileUsername,
    username:$localStorage.user
   
 })
  .then(function succeess(rspns) {
    return rspns;
    console.log(id);
    $state.go($state.tab.profile, {}, {reload: true});
   
  }, function fail(rspns) {
    return rspns;
   
  })
  
 }

 });



