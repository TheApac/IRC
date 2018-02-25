var indApp = angular.module('indexApp',['ngAnimate', 'ngCookies']);
indApp.controller('indexCtrl', function($scope, $cookies){
   if ($cookies.get('user') !== undefined)
    location.href = "/main.html";
  $scope.model = {};
  $scope.model.username = '';
  $scope.model.password = '';
  $scope.model.passwordConfirm = '';
  $scope.model.isLogIn = false;
  $scope.switchLogInSignIn = function() {
    $scope.model.isLogIn = !$scope.model.isLogIn;
    $scope.model.passwordConfirm = '';
  };
  $scope.submitSignIn = function() {
    if ($scope.model.username != '' && $scope.model.password == $scope.model.passwordConfirm){
      var rep = socket.emit('signin', [$scope.model.username, $scope.model.password]);
      if (rep) {
        $cookies.put('user', $scope.model.username);
        location.href="/main.html";
      } else
        console.log(rep);
    }
  };
  $scope.submitLogIn = function() {
    if($scope.model.username != '') {
      var rep = socket.emit('tryConnect', [$scope.model.username, $scope.model.password]);
      if (rep) {
        $cookies.put('user', $scope.model.username);
        location.href="/main.html";
      } else
        console.log(rep);
    }
  };
});

/* socket functions :

pour la deconnexion :
onbeforeunload
*/
