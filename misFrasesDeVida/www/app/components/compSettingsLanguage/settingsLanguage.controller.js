angular
	.module('starter')
	.controller('SettingsLanguageController', SettingsLanguageController);

function SettingsLanguageController($scope, $rootScope, $state, DatabaseService) {

	var self = this;

	init();

	function init() {

		initModel();
		initActions();

	}

	function initModel() {

		$scope.languages = $rootScope.data.languages;

		$scope.currentLanguage = $rootScope.data.language;

	}

	function initActions() {

		$scope.actions = {};
		$scope.actions.goToCategories = goToCategories;

	}

	function goToCategories() {
		$state.go('categories');
	}

}