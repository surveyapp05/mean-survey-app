// Ctrl For Home
app.controller('HomeCtrl', function($scope) {
    //
})

app.controller('NaviCtrl', function($scope, $http, user, sessionValues, $location, $localStorage) {
    $scope.sessionValues = sessionValues;
    $scope.$storage = $localStorage;
    user.email = $scope.$storage.user.email;
    user.username = $scope.$storage.user.username;
    user.password = $scope.$storage.user.password;

    $http.post('/api/login-auth', user).success(function(status){
        if(status !== 0) {
            sessionValues.loggedIn = true;
        } else {
            sessionValues.loggedIn = false;
            $location.path('/');
        }
    });



    $scope.logout = function() {
        $http.post('/api/logout').success(function(){
            sessionValues.loggedIn = false;
            alert('Logged Out!');
            $location.path('/');
        });
    }

})

app.controller('RegisterCtrl', function($scope, $http, $location, user) {

    $scope.user = user;

    $scope.submitRegisterForm = function() {
        $http.post('/api/register', user).success(function(status){
            if(status.success == true) {
                alert(status.message);
                $location.path('/dash');
            } else {
                alert(status.message);
            }
        });
    }
})

app.controller('LoginCtrl', function($scope, $http, $location, $localStorage) {
    $scope.submitLoginForm = function() {

        $scope.$storage = $localStorage;

        var loginData = {};
        loginData.username = $scope.username;
        loginData.password = $scope.password;

        $http.post('/api/login', loginData).success(function(status){
            if(status) {
                $scope.$storage.user = status;
                alert('logged In!');
                $location.path('/dash');
            } else {
                alert('Invalid Credentials!');
            }
        });
    }
})

app.controller('DashCtrl', function($scope, sessionValues, $location, user) {
    $scope.user = user;
})
