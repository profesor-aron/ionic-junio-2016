angular
	.module('starter')
	.service('ToolService', ToolService);

function ToolService() {

	var self = this;

	self.getRowsByFunctionAndLength = getRowsByFunctionAndLength;
	self.changeIsVisible = changeIsVisible;

	function getRowsByFunctionAndLength(func, nb) {
		var rows = [];

		for (var index = 0; index < nb; index++) {
		    rows.push(func(index));
		}

		return rows;
	}

	function changeIsVisible(value) {
		return (value ? 0 : 1);
	}

}