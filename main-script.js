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

pour la deconnexion :
onbeforeunload
*/
