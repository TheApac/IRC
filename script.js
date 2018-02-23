function OpenSignIn() {
  $(".passwordConfirm").hide("slow");
  $("input:submit").attr("value","Connexion");
  $("h1").html("Merci de vous connecter avant de pouvoir utiliser le chat en direct");
  $("p").html('Vous ne possédez pas compte ? <button class="black-text" onclick="OpenLogIn()">Inscrivez vous</button>');
}

function OpenLogIn() {
  $(".passwordConfirm").show("slow");
  $("button").attr("onclick","OpenSignIn()");
  $("input:submit").attr("value","Inscription");
  $("h1").html("Merci de créer un compte avant de pouvoir utiliser le chat en direct");
  $("p").html('Vous possédez un compte ? <button class="black-text" onclick="OpenSignIn()">Connectez vous</button>');
}
