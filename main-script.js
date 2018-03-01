var mainApp = angular.module('mainApp', ['ngAnimate', 'ngCookies']);
mainApp.controller('mainCtrl', function($scope, $cookies){
  console.log($cookies.get('user'));
   if ($cookies.get('user') === undefined)
    location.href = "/index.html";
   $scope.main = {};
   $scope.model = {};
   $scope.main.user = $cookies.get('user'); // current user
   $scope.main.channelTabs = ""; // list of opened channels
   $scope.main.message = ""; // current message typed by user
   $scope.main.listUsersInChannel = {}; // list of connected users in each channel
   $scope.main.listMsgInChannel = {}; // list of msg displayed in the channel since current user's connection
   $scope.model.availableChannelsList = []; // list of all opened channels in the server
   $scope.model.writeChannels = false;
   $scope.model.selectedChannel = "";

   socket.emit("getChannels");

   // lorsqu'on se déconnecte du serveur
   $scope.deconnexion = function() {
     $cookies.remove('user');
     location.href = ('/index.html');
     // socet.emit('deconnexion', $scope.main.user)
   };
   // lorsqu'on clique sur un autre tab
   $scope.switchTab = function(tabName) {
     // rien a emettre ! socket.emit('')

   };
   // lorsqu'on ouvre la fenetre pour rejoindre un autre channel
   $scope.joinTab = function() {
     socket.emit('newConnection', [main.user, model.selectedChannel])
   };
   // lorsqu'on envoie un messages
   $scope.sendMessage = function() {
     var tmpMsg = $scope.main.message;
     if (tmpMsg.substr(0, 1) == '/') {
       $scope.execCommand(tmpMsg);
     } else {
       socket.emit('NewMsg', [tmpMsg, $scope.main.user, $scope.get_current_date()]);
     }
     // on vide inputMessages
     main.message = "";
   };
   // pour parser et executer la commande
   $scope.execCommand = function() {
     var tmpMsg = main.message.split(" ");
     if (len(tmpMsg) < 1)
       return;
     switch (tmpMsg[0]) {
       case "/pseudo":
         if(len(tmpMsg) == 2) {
           // socket.emit('renamePseudo', [$scope.main.user, tmpMsg[1]]);
           // $scope.main.user = tmpMsg[1]; //TODO in socket.on('changedPseudo')
         } else {
           $scope.dispErrorCmd();
         }
         break;
       case "/channels":
         if(len(tmpMsg) == 1) {
           socket.emit('getChannels', [$scope.main.user]);
           $scope.model.writeChannels = true;
         } else {
           $scope.dispErrorCmd();
         }
         break;
       case "/disconnect":
         if(len(tmpMsg) == 1) {
           $scope.deconnexion();
         } else {
           $scope.dispErrorCmd();
         }
         break;
       case "/delete":
         if(len(tmpMsg) == 2 && tmpMsg[1] in $scope.main.listUsersInTab.keys) {
           // socet.emit('DeletingChannel', [$scope.main.user, tmpMsg[1]])
         } else {
           $scope.dispErrorCmd();
         }
         break;
       case "/rename":
         if(len(tmpMsg) == 3 && tmpMsg[1] in $scope.main.listUsersInTab.keys) {
           // socet.emit('renameChan', [$scope.main.user, tmpMsg[1], tmpMsg[2]])
         } else {
           $scope.dispErrorCmd();
         }
         break;
       case "/leave":
         if(len(tmpMsg) == 2 && tmpMsg[1] in $scope.main.listUsersInTab.keys) {
           socket.emit('deconnexionChannel', [tmpMsg[1], $scope.main.user])
         } else {
           $scope.dispErrorCmd();
         }
         break;
       case "/join":
         if(len(tmpMsg) == 2 && tmpMsg[1] in $scope.main.listUsersInTab.keys) {
           socket.emit('newConnection', [main.user, tmpMsg[1]])
         } else {
           $scope.dispErrorCmd();
         }
         break;
       case "/help":
         alert("'/pseudo name' to rename your pseudo into 'name'\n"
              +"'/channels' to display the list of all existing channels\n"
              +"'/disconnect' to disconnect from the server\n"
              +"'/delete chan' to remove the channel 'chan'\n"
              +"'/rename chan name' to rename channel 'chan' into 'name'\n"
              +"'/leave chan' to leave channel 'chan'\n"
              +"'/join chan' to join channel 'chan'");
         break;
       default:
         $scope.dispErrorCmd();
     }
   };
   $scope.dispErrorCmd = function() {
     var errorMsg = "Command syntaxe error : "+$scope.main.message+"\n";
     errorMsg += "Type '/help' to display the list of available commands";
     // write errorMsg in chat (in red)
     alert(errorMsg);
   };
   $scope.cancelJoinTab = function() {
     $scope.model.selectedChannel = "";
   };
   $scope.get_current_date = function() {
     var today = new Date();
     var dd = today.getDate() < 10 ? '0'+today.getDate() : today.getDate();
     var mo = today.getMonth()+1 < 10 ? '0'+today.getMonth()+1 : today.getMonth()+1;
     var yyyy = today.getFullYear() < 10 ? '0'+today.getFullYear() : today.getFullYear();
     var hh = today.getHours() < 10 ? '0'+today.getHours() : today.getHours();
     var mm = today.getMinutes() < 10 ? '0'+today.getMinutes() : today.getMinutes();
     var ss = today.getSeconds() < 10 ? '0'+today.getSeconds() : today.getSeconds();

     today = dd+'/'+mo+'/'+yyyy+' '+hh+':'+mm+':'+ss;
     console.log(today);
     return today;
   };
   socket.on("ChannelCreated", function() {
     $scope.$apply(function() {
       var tabs = $scope.main.channelTabs;
       if(tabs == "")
         tabs = "<ul class='tabs'>";
       else {
         tabs.slice(0, -5); // remove '</ul>'
       }
       var newTab = "<li class='tab col m2'><a href='#"+tabName+"'>"+tabName+"</a></li>";
       $scope.main.channelTabs = tabs+newTab+'</ul>';
     });
   });
   socket.on("ChannelExists", function() {
     alert("channel name already used");
   });
   socket.on("deconnexionChannel", function(param){
     $scope.$apply(function() {
       if (param[1] == $scope.main.user) {
         // l'utilisateur actuel vient de se déco du channel param[0]
         $scope.main.channelTabs.splice(param[0]);
         delete $scope.main.listUsersInChannel[param[0]];
         delete $scope.main.listMsgInChannel[param[0]];
       } else {
         // un autre utilisateur vient de se déco du channel param[0]
         $scope.main.listUsersInChannel[param[0]].splice(param[1]);
         // TODO write msg: param[1]+" left  the channel"
       }
     });
   });
   socket.on("ChannelNames", function(channels) {
     $scope.$apply(function() {
       $scope.model.availableChannelsList = [];
       var msg = "";
       for(var i = 0 ; i < channels.length ; i++) {
         $scope.model.availableChannelsList.push(channels[i].Name);
         if($scope.model.writeChannels) {
           if (msg == "")
             msg+= ", ";
           msg += channels[i].Name;
         }
       }
       if($scope.model.writeChannels) {
         // TODO write msg: msg
         $scope.model.writeChannels = false;
       }
     });
   });
   socket.on("newMessage", function(params) {
     $scope.$apply(function() {
       // params = [content, user, date_time]
       // TODO write msg: params
       if (params[1] == $scope.main.user) {
         // write on the right
       } else {
         // write on the left
       }
     });
   });
 });

/* socket functions :

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
