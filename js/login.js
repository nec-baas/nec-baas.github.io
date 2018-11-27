$(function() {
    Nebula.initialize(NebulaConfig);

    var login = function() {

        var username = $("#username").val();
        var password = $("#password").val();
        var userInfo = { username: username, password: password };
        Nebula.User.login(userInfo)
            .then(function(user) {
                window.location.href = "requestform.html";
            })
            .catch(function(e) {
                alert(e.status + " " + e.statusText + " " + e.responseText);
                clear();
            });
    };

    var clear = function() {
        $(":text").val("");
        $(":password").val("");
    }


    $("#login").click(login);
});
