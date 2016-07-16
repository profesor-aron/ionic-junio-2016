angular
	.module('starter')
	.config(configStateAndRouterProvider);

function configStateAndRouterProvider($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/citation');

	$stateProvider
	.state('citation', {
		cache: false,
		url: '/citation',
		templateUrl: 'app/components/compCitation/citation.view.html',
		controller: 'CitationController'
	})
	;

}