angular
	.module('starter')
	.directive('aehpImg', aehpImg);

function aehpImg() {
	return {
		restrict: 'E',
		templateUrl: 'app/shared/directives/aehp-img/aehpImg.directive.html',
		scope: {
			src: '@',
			width: '@?'
		}
	};
}