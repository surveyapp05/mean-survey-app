// Ctrl For Home

app.controller('HomeCtrl', function($scope, $http, $location // injections) { // <-- inject services to use in controllers
    $scope.allSurveys = ''; // scope variables can be used in the controllers view
    // http post is angulars own ajax function, can use to post or get from the server or other domains
    // post off to node.js server in the routes.js and get all surveys
    $http.post('/api/getAllSurveys').success(function(response){
        // set the scope variable to hold the just received survey data - can now loop over it in the home page view template
        $scope.allSurveys = response.data;
    });
    // when someone click a survey on hompage take them to that survey page
    $scope.visitSurveyPage = function(surveyID) {
        // angular redirect adding the survey ID to the url - so we can pick up the id and post it to node to get the data
        $location.path('/survey-view/').search({id: surveyID});
    }
})

// navigation bar controller
app.controller('NaviCtrl', function($scope, $http, user, sessionValues, $location, $localStorage) {
    $scope.sessionValues = sessionValues;
    // define the local storage to use in the controller
    $scope.$storage = $localStorage;
    // if there is user data in local storage
    if($scope.$storage.user) {
        // add that data to the user factory (found in services.js)
        // passport needs this data to authenticate the user
        user.email = $scope.$storage.user.email;
        user.username = $scope.$storage.user.username;
        user.password = $scope.$storage.user.password;
    }



    $scope.logout = function() {
        $http.post('/api/logout').success(function(){
            // session value set to false so angular redirects users trying to visit the dash page
            sessionValues.loggedIn = false;
            // remove local storage
            delete $scope.$storage;
            alert('Logged Out!');
            // redirect to homepage
            $location.path('/');
        });
    }

})

app.controller('RegisterCtrl', function($scope, $http, $location, user) {
    $scope.user = user;
    // send the users registeration details to node.js
    $scope.submitRegisterForm = function() {
        $http.post('/api/register', user).success(function(status){
            if(status.success == true) {
                alert(status.message);
                // if the user register ok then redirect to their dash
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

        // post login form details to node.js - if login details match send back ok to login
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

    // sends to node the user details, passport.js checks if they should be logged in
    $http.post('/api/login-auth', user).success(function(status){
        console.log(status);
        if(status == 0) {
            sessionValues.loggedIn = false;
            $location.path('/');
        } else {
            sessionValues.loggedIn = true;
        }
    });

    // send to node user id to pull back their surveys
    $http.post('/api/getUsersSurveys', {userID: $scope.$storage.user._id}).success(function(status) {
        $scope.user.surveyData = status.data;
    })

    // if they click a user dash page survey, take them to its page
    $scope.visitSurveyPage = function(surveyID) {
        $location.path('/survey-view/').search({id: surveyID});
    }

})

app.controller('ViewSurveyCtrl', function($scope, $location, $http) {
    $scope.singleSurvey = '';
    $scope.surveyInputData = {};
    $scope.surveyResults = {};
    // set these min and max variables to work out percentage of votes for bar chart
    $scope.surveyResultsMax = 0;
    $scope.surveyResultsMin = 0;

    $scope.surveyID = $location.search().id;
    // get the survey data when user visits its page
    $http.post('/api/getSingleSurvey', {'surveyID': $scope.surveyID}).success(function(response){
        // this is looped over in the template file with angular ng-repeat
        $scope.singleSurvey = response;
    })

    // save survey results funtion
    $scope.submitSurvey = function() {
        $('#submit-survey-button').attr('disabled', 'disabled'); // disable button to stop multiple posts
        // send survey id and the values of the users input to node
        $http.post('/api/saveSurveyResults', {'surveyID': $scope.singleSurvey.data._id, 'surveyData': $scope.surveyInputData}).success(function(response){
            if(response.success == true) {
                alert(response.message);
                $scope.surveyResults = response.data;
                // map only the key to an array (the key here, is the number of votes a option has)
                var arr = Object.keys( $scope.surveyResults ).map(function ( key ) { return $scope.surveyResults[key]; });
                // find the min and max number (built in javascript)
                $scope.surveyResultsMin = Math.min.apply( null, arr );
                $scope.surveyResultsMax = Math.max.apply( null, arr );
            }
        })
    }
})

// controller for creating a survey function
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

    // when user adds a box to the create survey page (passes the type of input text,checkbox etc...)
    $scope.addInputBox = function(type) {
        // if a certain type of input then make that inputs title assigned to $scope.label
        if(type == 'text') {$scope.label = $scope.textLabel;}
        if(type == 'textarea') {$scope.label = $scope.textAreaLabel;}
        if(type == 'radio') {
            $scope.label = $scope.radioButtonLabel;
            // if multiple options split them up to an array by comma ,
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
        // add that inputs details to the final array "surveyElements" it will list all the input boxes
        $scope.surveyElements.push(
            {
                id:itemNo,
                type: type,
                label: $scope.label,
                options: {data: $scope.options}
            }
        );
    }

    // let user publish their survey to homepage
    $scope.publishSurvey = function() {
        $http.post('/api/publish-survey', {
            'elements': $scope.surveyElements,
            'userID': $scope.$storage.user._id,
            'surveyName': $scope.surveyName
        }).success(function(status) {
            alert(status.message);
            $location.path('/survey-view/').search({id: status.data._id});
        })
    }
})
