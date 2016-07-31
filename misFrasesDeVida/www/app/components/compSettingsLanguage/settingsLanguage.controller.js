angular
	.module('starter')
	.controller('SettingsLanguageController', SettingsLanguageController);

function SettingsLanguageController($scope, $rootScope, $state, $ionicPopup, 
		$q, DatabaseService, AppService, TranslateService) {

	var self = this;

	AppService.initUI(init);

	function init() {

		initModel();
		initActions();

	}

	function initModel() {

		$scope.languages = $rootScope.data.languages;

		$scope.currentLanguage = $rootScope.data.language;

		$scope.selectedLanguage = angular.copy($scope.currentLanguage);

	}

	function initActions() {

		$scope.actions = {};
		$scope.actions.goToCategories = goToCategories;
		$scope.actions.saveLanguage = saveLanguage;
		$scope.actions.updateSelectedLanguage = updateSelectedLanguage;

	}

	function goToCategories() {
		$state.go('categories');
	}

	function saveLanguage() {

		var popupTitle = TranslateService.getText('LANGUAGE_POPUP_TITLE');
		var popupTemplate = TranslateService.getText('LANGUAGE_POPUP_TEMPLATE');
		var popupBtnCancelText = TranslateService.getText('LANGUAGE_POPUP_BTN_CANCEL_TEXT');
		var popupBtnOkText = TranslateService.getText('LANGUAGE_POPUP_BTN_OK_TEXT');

		var confirmPopup = $ionicPopup.confirm({
			title: popupTitle,
			template: popupTemplate,
			cancelText: popupBtnCancelText,
			okText: popupBtnOkText,
			okType: 'button-positive' 
		});

		confirmPopup.then(function(response) {

			if (response) {

				updateTranslate();

				updateLanguage();

				updateLanguageDB();

			}

		});

	}

	function updateTranslate() {

		TranslateService.updateLanguage(getCurrentLanguage().CODE);

	}

	function updateLanguage() {

		var languages = getLanguages();

		angular.forEach(languages, function(language) {

			if (language.CODE === getCurrentLanguage().CODE) {
				language.IS_SELECTED = 1;
			} else {
				language.IS_SELECTED = 0;
			}

		});

	}

	function updateLanguageDB() {

		var languages = getLanguages();

		var promises = [];

		angular.forEach(languages, function(language) {

			promises.push(
				DatabaseService.updateIsSelectedLanguage(
					language.ID,
					language.IS_SELECTED)
			);

		});

		$q.all(promises).then(function(values) {

			AppService.getData();

		}, function(reason) {

			console.log('Error in updateIsSelectedLanguage: ' + reason);

	    });

	}

	function updateSelectedLanguage(language) {

		$scope.selectedLanguage = angular.copy(language);

	}

	function getLanguages() {
		return $scope.languages;
	}

	function getCurrentLanguage() {
		return $scope.currentLanguage;
	}

}