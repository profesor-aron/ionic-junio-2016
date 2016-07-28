angular
	.module('starter')
	.controller('CategoriesController', CategoriesController);

function CategoriesController($scope, $rootScope, $state) {

	var self = this;

	init();

	function init() {

		initModel();
		initActions();

	}

	function initModel() {

		self.catsCits = $rootScope.data.catsCits;

		var categories = filterCategoriesByIsVisible();

		$scope.model = {};
		$scope.model.rows = [];
		$scope.model.rows.push([]);

		var count = 0;
		var nbColumns = 2;
		var nbCategories = categories.length;

		for (var index = 0; index < nbCategories; index++) {
			var cols = $scope.model.rows[$scope.model.rows.length - 1];
			if (count < nbColumns) {
				cols.push(categories[index]);
				count++;
			} else {
				$scope.model.rows.push([categories[index]]);
				count = 1;
			}
		}

		console.log($scope.model.rows);

	}

	function filterCategoriesByIsVisible() {

		var categories = [];

		angular.forEach(self.catsCits, function(category) {
			if (category.is_visible) {
				categories.push(category);
			}
		});

		return categories;
	}

	function initActions() {

		$scope.actions = {};
		$scope.actions.goToCitation = goToCitation;
		$scope.actions.goToSettingsCategories = goToSettingsCategories;
		$scope.actions.goToSettingsLanguage = goToSettingsLanguage;

	}

	function goToCitation(idCategory) {
		$state.go('citation', { idCategory: idCategory });
	}

	function goToSettingsCategories() {
		$state.go('settingsCategories');
	}

	function goToSettingsLanguage() {
		$state.go('settingsLanguage');
	}

}