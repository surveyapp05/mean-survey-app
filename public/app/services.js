app.factory("user", function(){
    return {
        username: '',
        email: '',
        password: ''
    };
});

app.factory("sessionValues", function(){
    return {
        loggedIn: false
    };
});
