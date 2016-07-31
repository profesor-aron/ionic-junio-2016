angular
	.module('starter')
	.service('TranslateService', TranslateService);

function TranslateService($translate) {

	var self = this;

	self.updateLanguage = updateLanguage;
	self.getText = getText;

	function updateLanguage(code) {
		$translate.use(code);
	}

	function getText(key) {
		return $translate.instant(key);
	}

}