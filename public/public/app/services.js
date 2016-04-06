// a factory helps pass data around angular controllers, they can be injected

// user factory hold data about the current user
app.factory("user", function(){
    return {
        mongoID: '',
        username: '',
        email: '',
        password: '',
        surveyData: {}
    };
});

// session values tells angular if user is logged in or not, to block access to restricted pages
app.factory("sessionValues", function(){
    return {
        loggedIn: false
    };
});
