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

		updateSelectAllCategories();

	}

	function updateSelectAllCategories() {

		var categories = getCategories();

		var count = 0;
		var nbCategories = categories.length;

		angular.forEach(categories, function(category) {
			count += category.is_visible;
		});

		if (count === nbCategories) {
			$scope.model.selectAllCategories = true;	
		} else {
			$scope.model.selectAllCategories = false;
		}

	}

	function initActions() {

		$scope.actions = {};
		$scope.actions.goToCategories = goToCategories;
		$scope.actions.moveItem = moveItem;
		$scope.actions.updateCategoryByIsVisible = updateCategoryByIsVisible;
		$scope.actions.updateCategoriesBySelectAll = updateCategoriesBySelectAll;

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

	function updateCategoryByIsVisible(category) {

		category.is_visible = !category.is_visible;

		updateSelectAllCategories();

		updateIsVisibleCategoryDB(category);

	}

	function updateCategoriesBySelectAll() {

		var categories = getCategories();

		$scope.model.selectAllCategories = !$scope.model.selectAllCategories;

		angular.forEach(categories, function(category) {
			category.is_visible = $scope.model.selectAllCategories;
		});

		updateIsVisibleCategoriesDB();

	}

	function updateIsVisibleCategoryDB(category) {

		var isVisibleCategory = Number(category.is_visible);

		DatabaseService.updateIsVisibleCategory(category.id, isVisibleCategory);

	}

	function updateIsVisibleCategoriesDB() {

		var categories = getCategories();

		angular.forEach(categories, function(category) {
			updateIsVisibleCategoryDB(category);
		});

	}

	function getCategories() {
		return $scope.model.categories;
	}

}