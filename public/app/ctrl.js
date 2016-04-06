// Ctrl For Home
app.controller('HomeCtrl', function($scope, $http) {
    $scope.allSurveys = '';
    $http.post('/api/getAllSurveys').success(function(response){
        $scope.allSurveys = response.data;
    });
})

app.controller('NaviCtrl', function($scope, $http, user, sessionValues, $location, $localStorage) {
    $scope.sessionValues = sessionValues;
    $scope.$storage = $localStorage;
    if($scope.$storage.user) {
        user.email = $scope.$storage.user.email;
        user.username = $scope.$storage.user.username;
        user.password = $scope.$storage.user.password;
    }



    console.log(sessionValues.loggedIn);



    $scope.logout = function() {
        $http.post('/api/logout').success(function(){
            sessionValues.loggedIn = false;
            delete $scope.$storage;
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

app.controller('DashCtrl', function($scope, sessionValues, $location, user, $localStorage, $http) {
    $scope.user = user;
    $scope.$storage = $localStorage;

    $http.post('/api/login-auth', user).success(function(status){
        console.log(status);
        if(status == 0) {
            sessionValues.loggedIn = false;
            $location.path('/');
        } else {
            sessionValues.loggedIn = true;
        }
    });

    $http.post('/api/getUsersSurveys', {userID: $scope.$storage.user._id}).success(function(status) {
        $scope.user.surveyData = status.data;
        console.log($scope.user.surveyData);
    })

    $scope.visitSurveyPage = function(surveyID) {
        $location.path('/survey-view/').search({id: surveyID});
    }

})

app.controller('ViewSurveyCtrl', function($scope, $location, $http) {
    $scope.singleSurvey = '';
    $scope.surveyInputData = {};
    $scope.surveyResults = {};
    $scope.surveyResultsMax = 0;
    $scope.surveyResultsMin = 0;

    $scope.surveyID = $location.search().id;
    $http.post('/api/getSingleSurvey', {'surveyID': $scope.surveyID}).success(function(response){
        $scope.singleSurvey = response;
    })

    $scope.submitSurvey = function() {
        console.log($scope.surveyInputData);
        $http.post('/api/saveSurveyResults', {'surveyID': $scope.singleSurvey.data._id, 'surveyData': $scope.surveyInputData}).success(function(response){
            if(response.success == true) {
                alert(response.message);
                $scope.surveyResults = response.data;
                var arr = Object.keys( $scope.surveyResults ).map(function ( key ) { return $scope.surveyResults[key]; });
                $scope.surveyResultsMin = Math.min.apply( null, arr );
                $scope.surveyResultsMax = Math.max.apply( null, arr );
            }
        })
    }
})

app.controller('CreateSurveyCtrl', function($scope, sessionValues, $location, user, $http, $localStorage) {
    $scope.$storage = $localStorage;
    $scope.user = user;
    $scope.surveyName = '';
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
        $http.post('/api/publish-survey', {
            'elements': $scope.surveyElements,
            'userID': $scope.$storage.user._id,
            'surveyName': $scope.surveyName
        }).success(function(status) {

        })
    }
})
