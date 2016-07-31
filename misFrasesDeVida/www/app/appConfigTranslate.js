angular
	.module('starter')
	.config(configTranslateProvider);

function configTranslateProvider($translateProvider) {

	$translateProvider
    .useStaticFilesLoader({
      prefix: 'assets/locales/',
      suffix: '.json'
    })
    .registerAvailableLanguageKeys(['en', 'fr', 'es'], {
      'en' : 'en',
      'fr' : 'fr',
      'es' : 'es'
    })
    .preferredLanguage('en')
    .fallbackLanguage('en')
    .determinePreferredLanguage()
    .useSanitizeValueStrategy('escapeParameters');

}