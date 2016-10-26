angular.module('starter.controllers',['ngCordova'])

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

.controller('EventFeed', function($scope, $http) {
  var url = "http://localhost:3000";
  $http.post(url + '/eventFeed')
  .then(function succeess(rspns) {
    console.log(rspns.data.object);
    console.log("big win")
    $scope.eventFeed = rspns.data;
  }, function fail(rspns) {
    console.log("big fail")
    console.log(rspns);
  });
  console.log("Posts");

})

.controller('EventCommentCtrl',function($scope,$http,$localStorage,$stateParams,$state,$location){
   var url="http://localhost:3000";
  $scope.eventComment={};
  $scope.eventComment.username=$localStorage.user;
  console.log($scope.eventComment.username);
  $scope.submitEventComment=function(){
    console.log($scope.eventComment);
    $http.post(url+'/eventComments',{
      eventComment:$scope.eventComment

    }).then(function success(rspns){
      console.log(rspns);
     
      $state.go('tab.dash');
    }, function fail(rspns){
      console.log("error")

    })
  }

})



.controller('ProfileCtrl', function($scope,$http,$localStorage,$stateParams,$state,$location) {
  var url = "http://localhost:3000";
  $http.post(url + '/eventFeed')
  .then(function succeess(rspns) {
    console.log(rspns.data.object);
    console.log("big win")
    $scope.eventFeed = rspns.data;
  }, function fail(rspns) {
    console.log("big fail")
    console.log(rspns);
  });
  console.log("Posts");

})
// End Event comment
