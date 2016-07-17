angular
	.module('starter')
	.service('DatabaseService', DatabaseService);

function DatabaseService($q, ToolService) {

	var self = this;

	self.db = null;

	self.openDatabase = openDatabase;
	self.getLanguages = getLanguages;
	self.getCitationsByLanguage = getCitationsByLanguage;

	function openDatabase() {

		var deferred = $q.defer();

		if (self.db == null && angular.isDefined(window.sqlitePlugin)) {

		    window.sqlitePlugin.openDatabase(
				{
					name: "myQuotesOfLife.db",
					location: 'default',
					createFromLocation: 1
				},
				openDatabaseSuccess,
				openDatabaseError
			);

		    function openDatabaseSuccess(db) {
		    	self.db = db;
		    	console.log('Open database OK');
		    	deferred.resolve();
		    }

		    function openDatabaseError(error) {
		    	console.log('Error to open database: ' + error.message);
		    	deferred.reject(error.message);
		    }

		} else {
			deferred.resolve();
		}

		return deferred.promise;
	}

	function getLanguages() {

		var deferred = $q.defer();
		
		var promise = self.openDatabase();

		promise.then(function() {

			var query = "SELECT * FROM APP_LANGUAGE";

			getDataBySelectQuery(deferred, query);

		}, function(reason) {

			console.log('Error: ' + reason);

		});

		return deferred.promise;
	}

	function getDataBySelectQuery(deferred, query) {

		self.db.executeSql(query, [], executeSqlSuccess, executeSqlError);

		function executeSqlSuccess(resultSet) {

			var rows = ToolService.getRowsByFunctionAndLength(
					resultSet.rows.item, resultSet.rows.length);

			deferred.resolve(rows);

		}

		function executeSqlError(error) {

			deferred.reject(error.message);

		}

	}

	function getCitationsByLanguage(codeLanguage) {

		var deferred = $q.defer();

		var promise = self.openDatabase();

		promise.then(function() {

			var codeLan = codeLanguage.toUpperCase(); // EN, ES, FR
			var columnCategoryName = "NAME_" + codeLan;
			var columnCitationContent = "CONTENT_" + codeLan;
			var columnCitationAuthor = "AUTHOR_" + codeLan;

			var query = 
				"SELECT CAT.ID AS ID_CATEGORY, " +
				"CAT." + columnCategoryName + " AS CATEGORY, " +
				"CAT.RANGE, " +
				"CIT.ID AS ID_CITATION, " +
				"CIT." + columnCitationContent + " AS CITATION, " +
				"CIT." + columnCitationAuthor + " AS AUTHOR, " +
				"CIT.IS_LOVED " +
	            "FROM APP_CATEGORY CAT, APP_CITATION CIT " +
	            "WHERE " +
	            "CAT.ID = CIT.ID_CATEGORY " +
	            "AND CAT.IS_VISIBLE = 1 " +
	            "ORDER BY CAT.RANGE";

			getDataBySelectQuery(deferred, query);

		}, function(reason) {

			console.log('Error: ' + reason);

		});

		return deferred.promise;
	}

}