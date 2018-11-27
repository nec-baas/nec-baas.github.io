$(function() {
    // 初期化
    Nebula.initialize(NebulaConfig);
    //ユーザ情報オブジェクトバケット
    var USER_BUCKET_NAME = "free_license_user";
    //ライセンスキー格納ファイルバケット
    var LICENSE_KEY_BUCKET_NAME = "free_license";
    //ライセンスキー名の PREFIX
    var FILENAME_PREFIX = "free_license_";
    //ライセンスキー名の PREFIX
    var FILENAME_SUFFIX = ".txt";
    var EMAIL = "email";

    var App = {

        // 初期化
        init: function () {
            var self = this;

            // ログインチェック
            var user = Nebula.User.current();
            if (user === null) {
                window.location.href = "login.html"; // 未ログイン
                return;
            }
            self.user = user; // ユーザ情報保存

            self.initApp();
        },
        //アプリ初期化
        initApp: function() {

            var self = this;
            // ログアウト
            $("#logout").click(function() {
                self.logout();
            });
            $("#user_settings").click(function() {
                self.goToUserSettings();
            });
            $("#request_form").click(function() {
                self.goToRequestForm();
            });
            $("#register").click(function () {
                if($("#requestForm").valid()) {
                    self.register();
                }
            });
            $("#change_password").click(function () {
                self.changePassword()
                    .then(function (userInfo) {
                        self.reLogin(userInfo)
                            .then(function(user) {
                            self.user = user;
                        });
                    });
            });
            $("#delete_user").click(function () {
                self.deleteUserDialog();
            });
            $('#download_license_key').click(function () {
                var filename = FILENAME_PREFIX + this.value + FILENAME_SUFFIX;
                self.downloadLicenseKey(filename)
                    .then(function (blob) {
                        var link = document.createElement( 'a' );
                        link.href = window.URL.createObjectURL( new Blob( [blob] ) );
                        link.download = filename;
                        link.click();
                    });
            });
            $('#updateBtn').click(function () {
                $('#result-div').hide();
                self.fetch()
                    .then(function (data) {
                        $('#request-div').show();
                        self.showUpdateDisplay(data[0]);
                    });
            });
            // Object Bucket を準備し、データをロードする
            this.bucket = new Nebula.ObjectBucket(USER_BUCKET_NAME);
            self.showMainDisplay();
        },
        // ログアウト処理
        logout: function() {
            Nebula.User.logout()
                .then(function() {
                    window.location.href = "login.html";
                })
                .catch(function(e) {
                    window.location.href = "login.html";
                })
        },
        // リクエストフォーム画面へ遷移
        goToRequestForm: function () {
            window.location.href = "requestform.html";
        },
        // ユーザ設定処理
        goToUserSettings: function() {
            window.location.href = "settings.html";
        },
        // パスワードの変更
        changePassword: function() {
            var defer = $.Deferred();
            var self = this;
            var new_password = $("#new_password").val();
            var new_password_cf = $("#new_password_confirm").val();
            if (new_password !== "" && new_password === new_password_cf) {
                var user = Nebula.User.current();
                user.password = new_password;
                Nebula.User.update(user)
                    .then(function(userObj) {
                        self.clearChangePasswordForm();
                        alert("User password Changed.");
                        var userInfo = { username: userObj.username, password: new_password };
                        defer.resolve(userInfo);
                    })
                    .catch(function(e) {
                        self.clearChangePasswordForm();
                        alert(e.status + " " + e.statusText + " " + e.responseText);
                    });
            }
            return defer.promise();
        },
        // パスワード変更後の再ログイン
        reLogin: function(userInfo) {
            var defer = $.Deferred();
            Nebula.User.login(userInfo)
                .then(function(user) {
                    defer.resolve(user);
                })
                .catch(function(e) {
                    alert(e.status + " " + e.statusText + " " + e.responseText);
                });
            return defer.promise();
        },
        // ユーザ削除
        deleteUser: function() {
            var self = this;
            Nebula.User.remove(self.user)
                .then(function() {
                    alert("User deleted.");
                    window.location.href = "login.html";
                })
                .catch(function(e) {
                    alert(e.status + " " + e.statusText + " " + e.responseText);
                });
        },
        // ユーザ削除の確認画面
        deleteUserDialog: function() {
            var self = this;
            var dialog = $("#delete_user_dialog").dialog({
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,
                buttons: {
                    "削除": function () {
                        self.deleteUser();
                        $(this).dialog("close");
                    },
                    "キャンセル": function () {
                        $(this).dialog("close");
                    }
                }
            });
            dialog.dialog("open");
        },
        //メイン画面表示
        showMainDisplay: function () {
            var self = this;
            self.fetch()
                .then(function (data) {
                        if (data.length === 0 ) {
                            $('#request-div').show();
                        } else {
                            $('#result-div').show();
                            self.showResultDisplay(data[0]);
                        }
                });
        },
        // ユーザ情報取得
        fetch: function () {
            var defer = $.Deferred();
            var self = this;

            // クエリ生成
            var query = new Nebula.ObjectQuery();
            var clause = Nebula.Clause.equals(EMAIL, self.user.email);
            query.setClause(clause);
            query.setSortOrder("updateAt", false);

            // クエリ実行
            this.bucket.query(query)
                .then(function (objects) {
                    defer.resolve(objects);
                }).catch(function (e) {
                console.log("fetch failed");
                alert(e.status + " " + e.statusText + " " + e.responseText);
            });

            return defer.promise();
        },
        //更新画面設定
        showUpdateDisplay: function (data) {
            var self = this;
            $('#_id').val(data._id);
            $('#Job_Role').find('option[value="' + data.Job_Role + '"]').prop('selected',true);
            $('#Company').val(data.Company);
            $('#Industry').find('option[value="' + data.Industry + '"]').prop('selected',true);
            $('#Country').find('option[value="' + data.Country + '"]').prop('selected',true);
            $('#Level_of_Usage').find('option[value="' + data.Level_of_Usage + '"]').prop('selected',true);
            $('#Project_Timeframe').find('option[value="' + data.Project_Timeframe + '"]').prop('selected',true);
            $('#Solution_Area').find('option[value="' + data.Solution_Area + '"]').prop('selected',true);
            $('#eula-div').hide();
            $('#register').text("更新").prop('disabled', false);

        },
        //入力画面設定
        showResultDisplay: function (data) {
            var self = this;
            $('#result_Job_Role').text(data.Job_Role);
            $('#result_Company').text(data.Company);
            $('#result_Industry').text(data.Industry);
            $('#result_Country').text(data.Country);
            $('#result_Level_of_Usage').text(data.Level_of_Usage);
            $('#result_Project_Timeframe').text(data.Project_Timeframe);
            $('#result_Solution_Area').text(data.Solution_Area);
        },
        //ユーザ情報を登録
        register: function () {
            var self = this;
            var parseJson = function(data) {
                var returnJson = {};
                for (idx = 0; idx < data.length; idx++) {
                    returnJson[data[idx].name] = data[idx].value
                }
                return returnJson;
            };
            var list = $('#requestForm').serializeArray();
            var data = parseJson(list);
            //新規作成の場合は、 _idを排除
            if ($.isEmptyObject(data._id)) {
                delete data._id;
            }
            data[EMAIL]=self.user.email;
            self.insertDataToServer(USER_BUCKET_NAME, data)
                .then(function (data) {
                    $('#request-div').hide();
                    $('#result-div').show();
                    self.showResultDisplay(data);
                });
        },
        //サーバへデータ登録
        insertDataToServer: function (bucketName, data ) {
            var defer = $.Deferred();
            var bucket = new Nebula.ObjectBucket(bucketName);
            bucket.save(data)
                .then(function (object) {
                    defer.resolve(object);
                })
                .catch(function (e) {
                    console.log("insert failed");
                    alert(e.status + " " + e.statusText + " " + e.responseText);
                });
            return defer.promise();
        },
        //ライセンスキーのダウンロード
        downloadLicenseKey: function (filename) {
            var defer = $.Deferred();
            var bucket = new Nebula.FileBucket(LICENSE_KEY_BUCKET_NAME);
            bucket.load(filename)
                .then(function(blob) {
                    defer.resolve(blob);
                })
                .catch(function(e) {
                    console.log("download failed");
                    alert(e.status + " " + e.statusText + " " + e.responseText);
                });
            return defer.promise();
        },
        //パスワードインプットのクリア
        clearChangePasswordForm: function() {
            $("#new_password").val("");
            $("#new_password_confirm").val("");
        }
    };
    App.init();
});
