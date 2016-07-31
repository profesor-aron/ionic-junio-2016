angular
	.module('starter')
	.service('AppService', AppService);

function AppService($timeout, $http, $rootScope, 
		DatabaseService, TranslateService) {

	var self = this;

	self.getData = getData;
	self.initUI = initUI;

	function getData() {
/*
		$timeout(function() {

			$http.get('data.txt')
            .then(function (data) {
            	console.log(data);
                $rootScope.data = data.data;
            }, function (error) {
                console.log("Error " + error);
            });

		}, 3000);
*/

		var promise = DatabaseService.getData();

		promise.then(function(data) {
			console.log(data);
			//console.log(JSON.stringify(data));
			$rootScope.data = data;

			TranslateService.updateLanguage(data.language.CODE);

		}, function(reason) {
			console.log('Error in DatabaseService.getData(): ' + reason);
		});

	}

	function initUI(functionToCall) {

		$rootScope.$watch("data.catsCits", function() {
			if(angular.isDefined($rootScope.data)) {
				functionToCall();
			}
		}, true);

	}

}