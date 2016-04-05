// Directives Path
var dir = 'app/components/';

app.directive('head', function() {
	return {
		templateUrl: dir+'head.html',
		controller: 'NaviCtrl',
	}
})

app.directive('navi', function() {
	return {
		templateUrl: dir+'navi.html',
		controller: 'NaviCtrl',
	}
})
