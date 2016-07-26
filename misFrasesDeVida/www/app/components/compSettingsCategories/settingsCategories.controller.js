angular
	.module('starter')
	.controller('SettingsCategoriesController', SettingsCategoriesController);

function SettingsCategoriesController($scope, $rootScope, $state, DatabaseService) {

	var self = this;

	init();

	function init() {

		initModel();
		initActions();

	}

	function initModel() {

		self.catsCits = $rootScope.data.catsCits;

		$scope.model = {};
		$scope.model.categories = self.catsCits;
		
		
	}

	function initActions() {

		$scope.actions = {};
		$scope.actions.goToCategories = goToCategories;
		$scope.actions.moveItem = moveItem;

	}

	function goToCategories() {
		$state.go('categories');
	}

	function moveItem(item, fromIndex, toIndex) {

		var categories = getCategories();

		categories.splice(fromIndex, 1);
		categories.splice(toIndex, 0, item);

		updateRangeCategories();

		updateRangeCategoriesDB();

		console.log(categories);
	}

	function updateRangeCategories() {

		var categories = getCategories();

		angular.forEach(categories, function(category, index) {
			category.range = index + 1;
		});

	}

	function updateRangeCategoriesDB() {

		var categories = getCategories();

		angular.forEach(categories, function(category) {

			DatabaseService.updateRangeCategory(category.id, category.range);

		});

	}

	function getCategories() {
		return $scope.model.categories;
	}

}