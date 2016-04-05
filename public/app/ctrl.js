// Ctrl For Home
app.controller('HomeCtrl', function($scope) {
    //
})

app.controller('NaviCtrl', function($scope, $http, user, sessionValues, $location, $localStorage) {
    $scope.sessionValues = sessionValues;
    $scope.$storage = $localStorage;
    if($scope.$storage.user) {
        user.email = $scope.$storage.user.email;
        user.username = $scope.$storage.user.username;
        user.password = $scope.$storage.user.password;
    }   

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

app.controller('CreateSurveyCtrl', function($scope, sessionValues, $location, user, $http) {
    $scope.surveyName = undefined;
    $scope.textLabel = '';
    $scope.textAreaLabel = '';
    $scope.radioButtonLabel = '';
    $scope.checkboxLabel = '';
    $scope.selectLabel = '';
    $scope.radioOptions = [];
    $scope.checkboxOptions = [];
    $scope.selectOptions = [];
    $scope.surveyElements = [];

    $scope.addInputBox = function(type) {
        if(type == 'text') {$scope.label = $scope.textLabel;}
        if(type == 'textarea') {$scope.label = $scope.textAreaLabel;}
        if(type == 'radio') {
            $scope.label = $scope.radioButtonLabel;
            $scope.options = $scope.radioOptions.split(',');
        }
        if(type == 'checkbox') {
            $scope.label = $scope.checkboxLabel;
            $scope.options = $scope.checkboxOptions.split(',');
        }
        if(type == 'select') {
            $scope.label = $scope.selectLabel;
            $scope.options = $scope.selectOptions.split(',');
        }
        var itemNo = $scope.surveyElements.length + 1;
        $scope.surveyElements.push(
            {
                id:itemNo,
                type: type,
                label: $scope.label,
                options: {data: $scope.options}
            }
        );
    }

    $scope.publishSurvey = function() {
        $http.post('/api/publish-survey', $scope.surveyElements)
        .success(function(status){

        })
    }
})
