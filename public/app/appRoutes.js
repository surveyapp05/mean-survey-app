app.config(function($routeProvider, $locationProvider, $httpProvider) {

    $routeProvider

        .when('/', {
            templateUrl : 'app/components/home/home-view.html',
            controller  : 'HomeCtrl'
        })

        .when('/register', {
            templateUrl : 'app/components/home/register-view.html',
            controller  : 'RegisterCtrl'
        })

        .when('/login', {
            templateUrl : 'app/components/home/login-view.html',
            controller  : 'LoginCtrl'
        })

        .when('/dash', {
            templateUrl : 'app/components/dash/dash-view.html',
            controller  : 'DashCtrl'
        })

        .when('/create-survey', {
            templateUrl : 'app/components/dash/create-survey-view.html',
            controller  : 'CreateSurveyCtrl'
        })

        .when('/survey-view', {
            templateUrl : 'app/components/home/survey-view.html',
            controller  : 'ViewSurveyCtrl'
        })

        .otherwise({
            redirectTo: '/'
        });

        //$httpProvider.interceptors.push("authInter");
        $locationProvider.html5Mode(true);

});
