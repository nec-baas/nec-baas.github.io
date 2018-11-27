$(function() {
    Nebula.initialize(NebulaConfig);
    var EMAIL_SUFFIX = "@freelicense.necbaas.com";
     var signup = function() {
         var date = new Date();
         var time = date.getTime();
         var username = $("#username").val();
         var email = username + "_" + time + EMAIL_SUFFIX;
         var password = $("#password").val();
         var password_confirmation = $("#password_confirm").val();
         if (password !== password_confirmation) {
            alert("Passwords does not match.");
            return;
         }
         var user = new Nebula.User();
         user.set("username", username);
         user.set("email", email);
         user.set("password", password);
         user.register()
            .then(function(u) {
                alert("User registered.");
                window.location.href = "login.html";
            })
            .catch(function(e) {
                console.debug(e.status + " " + e.statusText + " " + e.responseText);
                alert(e.status + " " + e.statusText + " " + e.responseText);
                clear();
            })
    };

    var clear = function() {
        $(":text").val("");
        $(":password").val("");
    }

    $("#signup").click(signup);
});
