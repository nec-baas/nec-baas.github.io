$().ready(function () {
    // initialize validate Form
    $("#requestForm").validate({
        rules: {
            Job_Role: {
                required: true
            },
            Company: {
                required: true
            },
            Industry: {
                required: true
            },
            Level_of_Usage: {
                required: true
            },
            Project_Timeframe: {
                required: true
            },
            Solution_Area: {
                required: true
            }
        },
        messages: {
            Job_Role:{
                required: '職種を選択してください'
            },
            Company: {
                required: '御社名を入力してください'
            },
            Industry: {
                required: '業種を選択してください'
            },
            Level_of_Usage: {
                required: 'ご利用状況を選択してください'
            },
            Project_Timeframe: {
                required: '導入予定時期を選択してください'
            },
            Solution_Area: {
                required: 'ご利用用途を選択してください'
            }
        }
    });
});
