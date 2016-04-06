app.factory("user", function(){
    return {
        mongoID: '',
        username: '',
        email: '',
        password: '',
        surveyData: {}
    };
});

app.factory("sessionValues", function(){
    return {
        loggedIn: false
    };
});
