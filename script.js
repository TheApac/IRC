var app = angular.module('indexApp',[]);
app.controller('indexCtrl', function($scope){
  $scope.username = '';
  $scope.password = '';
  $scope.passwordConfirm = '';
  $scope.isLogIn = false;
  $scope.switchLogInSignIn = function() {
    $scope.isLogIn = !$scope.isLogIn;
  }
});

function OpenLogIn() {
  $(".passwordConfirm").hide("slow");
  $("input:submit").attr("value", "Connexion");
  $("h1").html("Merci de vous connecter avant de pouvoir utiliser le chat en direct");
  $("p").html('Vous ne possédez pas compte ? <button class="black-text" onclick="OpenLogIn()">Inscrivez vous</button>');
}

function OpenSignIn() {
  $(".passwordConfirm").show("slow");
  $("button").attr("onclick", "OpenSignIn()");
  $("input:submit").attr("value", "Inscription");
  $("h1").html("Merci de créer un compte avant de pouvoir utiliser le chat en direct");
  $("p").html('Vous possédez un compte ? <button class="black-text" onclick="OpenSignIn()">Connectez vous</button>');
}


/* socket functions :

principe :
socket.emit('truc qui est recu sur le serveur', [parametre1, parametre2, ...., parametre n]);

pour la connexion :
socket.emit('tryConnect', [$("input[type=text]").val(), $("input[type=password]").val()]);

pour la deconnexion :
onbeforeunload
*/
