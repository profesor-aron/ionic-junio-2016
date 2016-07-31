angular
	.module('starter')
	.controller('CitationController', CitationController);

function CitationController($scope, $rootScope, $state, DatabaseService, ToolService, AppService) {

	var self = this;

	self.catsCits = null;
	self.indexCurrentCategory = 0;
	self.indexCurrentCitation = 0;

	AppService.initUI(init);

	function init() {

		initModel();
		initActions();

	}

	function initModel() {

		self.catsCits = $rootScope.data.catsCits;

		updateIndexCategoryAndCitation();

		generateCitationInfo();

	}

	function updateIndexCategoryAndCitation() {

		var idCategory = $state.params.idCategory;

		if (idCategory != null) {

			angular.forEach(self.catsCits, function(category, index) {

				if (category.id === idCategory) {
					self.indexCurrentCategory = index;
					self.indexCurrentCitation = 0;
				}

			});

			$state.params.idCategory = null;

		}

	}

	function generateCitationInfo() {

		var category = self.catsCits[self.indexCurrentCategory];
		var citation = category.citations[self.indexCurrentCitation];

		$scope.model = {};
		$scope.model.idCitation = citation.id;
		$scope.model.nameCategory = category.name; 
		$scope.model.rangeCitation = (self.indexCurrentCitation + 1) + "/" +
			category.citations.length;
		$scope.model.contentCitation = citation.content;
		$scope.model.authorCitation = citation.author;

		$scope.model.imageIsLoved = citation.is_loved;

		generateCitationImageLoved();

	}

	function generateCitationImageLoved() {

		var pathImageLoved = "assets/img/thumbs/";

		if ($scope.model.imageIsLoved) {
			$scope.model.imageLoved = pathImageLoved + "green-thumb.png";
		} else {
			$scope.model.imageLoved = pathImageLoved + "white-thumb.png";
		}

	}

	function initActions() {

		$scope.actions = {};
		$scope.actions.goToNextCitation = goToNextCitation;
		$scope.actions.goToPrecedentCitation = goToPrecedentCitation;
		$scope.actions.updateCitationImageIsLoved = updateCitationImageIsLoved;
		$scope.actions.goToCategories = goToCategories;

	}

	function goToNextCitation() {

		var category = self.catsCits[self.indexCurrentCategory];

		if (self.indexCurrentCitation < category.citations.length - 1) {

			self.indexCurrentCitation += 1;

		} else {

			self.indexCurrentCitation = 0;

			if (self.indexCurrentCategory < self.catsCits.length - 1) {

				self.indexCurrentCategory += 1;

			} else {

				self.indexCurrentCategory = 0;

			}

		}

		generateCitationInfo();

	}

	function goToPrecedentCitation() {

		if (self.indexCurrentCitation > 0) {

			self.indexCurrentCitation -= 1;

		} else {

			if (self.indexCurrentCategory > 0) {

				self.indexCurrentCategory -= 1;

			} else {

				self.indexCurrentCategory = self.catsCits.length - 1;

			}

			var category = self.catsCits[self.indexCurrentCategory];

			self.indexCurrentCitation = category.citations.length - 1;

		}

		generateCitationInfo();

	}

	function updateCitationImageIsLoved() {

		$scope.model.imageIsLoved = ToolService.changeIsVisible(isImageLoved());

		generateCitationImageLoved();

		updateCatsCitsByImageIsLove();

		updateNbCitationsLoved();

		updateCitationDB();

	}

	function updateCatsCitsByImageIsLove() {

		var category = self.catsCits[self.indexCurrentCategory];
		var citation = category.citations[self.indexCurrentCitation];

		citation.is_loved = isImageLoved();

	}

	function updateNbCitationsLoved() {

		angular.forEach(self.catsCits, function(category) {

			var count = 0;

			angular.forEach(category.citations, function(citation) {
				count += citation.is_loved;
			});

			category.nbCitationsLoved = count;

		});

	}

	function updateCitationDB() {

		DatabaseService.updateCitationImageLoved(
				$scope.model.idCitation, isImageLoved());

	}

	function isImageLoved() {
		return $scope.model.imageIsLoved;
	}

	function goToCategories() {
		$state.go('categories');
	}

}