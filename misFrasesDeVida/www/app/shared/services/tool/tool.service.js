angular
	.module('starter')
	.service('ToolService', ToolService);

function ToolService() {

	var self = this;

	self.getRowsByFunctionAndLength = getRowsByFunctionAndLength;

	function getRowsByFunctionAndLength(func, nb) {
		var rows = [];

		for (var index = 0; index < nb; index++) {
		    rows.push(func(index));
		}

		return rows;
	}

}