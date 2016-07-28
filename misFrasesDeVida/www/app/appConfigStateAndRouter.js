angular
	.module('starter')
	.config(configStateAndRouterProvider);

function configStateAndRouterProvider($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/citation');

	$stateProvider
	.state('citation', {
		cache: false,
		url: '/citation',
		params: {
			idCategory: null
	    },
		templateUrl: 'app/components/compCitation/citation.view.html',
		controller: 'CitationController'
	})
	.state('categories', {
		cache: false,
		url: '/categories',
		templateUrl: 'app/components/compCategories/categories.view.html',
		controller: 'CategoriesController'
	})
	.state('settingsCategories', {
		cache: false,
		url: '/settingsCategories',
		templateUrl: 'app/components/compSettingsCategories/settingsCategories.view.html',
		controller: 'SettingsCategoriesController'
	})
	.state('settingsLanguage', {
		cache: false,
		url: '/settingsLanguage',
		templateUrl: 'app/components/compSettingsLanguage/settingsLanguage.view.html',
		controller: 'SettingsLanguageController'
	})
	;

}