var mainApp = angular.module('mainApp', ['ngAnimate', 'ngCookies']);
mainApp.controller('mainCtrl', function($scope, $cookies){
  console.log($cookies.get('user'));
   if ($cookies.get('user') === undefined)
    location.href = "/index.html";
   $scope.main = {};
   // récupérer utilisateur connecté
   // rediriger vers index.html le cas échéant
   // recuperer liste des serveurs de l'utilisateur
   // recuperer tous les msg de chacun de ces serveurs
   //
 });

/* socket functions :

//-----------------------------------------------
Récuperer tout les noms de channels :
socket.emit("getChannels");
socket.on("ChannelNames", function(Names) {
  for (var i = 0; i < Names.length; i++) {
    console.log(Names[i].Name);
  }
});
------------------------------------------------//
Récuperer tout les utilisateurs sur un channel :
socket.emit('ConnectedOnChannel',$scope.model.username);
socket.on("ConnectedOnChannel", function(Names) {
  for (var i = 0; i < Names.length; i++) {
    console.log(Names[i]);
  }
});
------------------------------------------------//
pour la deconnexion :
onbeforeunload
*/
