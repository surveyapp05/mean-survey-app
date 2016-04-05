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
            templateUrl : 'app/components/home/dash-view.html',
            controller  : 'DashCtrl'
        })

        .otherwise({
            redirectTo: '/'
        });

        //$httpProvider.interceptors.push("authInter");
        $locationProvider.html5Mode(true);

});
