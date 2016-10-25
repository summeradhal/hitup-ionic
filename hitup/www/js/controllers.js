angular.module('starter.controllers',['ngCordova'])

.controller('DashCtrl', function($scope) {})

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

.controller('LoginCtrl', function($scope, $http, $stateParams, $state) {
  var url = "http://localhost:3000";
  $scope.username = {};
  $scope.password = {};
  $scope.login = function() {
    console.log($scope.username)
      console.log($scope.password)
    $http.post(url + '/login', {

      username: $scope.username.username,
      password: $scope.password.password
    }).then(function success(rspns) {
        // $rootScope.user = rspns.data.docs;

        $state.go('tab.dash');  //where there is main, put dash
        console.log('Tab dash')
    }, function failure(rspns) {
        console.log("AJAX failed")
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




