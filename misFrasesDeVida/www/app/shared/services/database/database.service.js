angular
	.module('starter')
	.service('DatabaseService', DatabaseService);

function DatabaseService($q, ToolService) {

	var self = this;

	self.db = null;

	self.openDatabase = openDatabase;
	self.getLanguages = getLanguages;
	self.getData = getData;
	self.updateCitationImageLoved = updateCitationImageLoved;
	self.updateRangeCategory = updateRangeCategory;
	self.updateIsVisibleCategory = updateIsVisibleCategory;
	self.updateIsSelectedLanguage = updateIsSelectedLanguage;

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

	function getData() {

		var deferred = $q.defer();

		var promise = self.openDatabase();

		promise.then(function() {

			function getLanguageSelected() {
				var deferred = $q.defer();
				var query = "SELECT * FROM APP_LANGUAGE WHERE IS_SELECTED = 1";
				getDataBySelectQuery(deferred, query);				
				return deferred.promise;
			}

			var promiseLang = getLanguageSelected();

			promiseLang.then(function(languages) {

				var language = languages[0];
				var codeLanguage = language.CODE; // en, es, fr

				codeLanguage = codeLanguage.toUpperCase(); // EN, ES, FR

				function getCitationsByLanguage() {
					var deferred = $q.defer();

					var columnCategoryName = "NAME_" + codeLanguage;
					var columnCitationContent = "CONTENT_" + codeLanguage;
					var columnCitationAuthor = "AUTHOR_" + codeLanguage;

					var query = 
						"SELECT CAT.ID AS ID_CATEGORY, " +
						"CAT." + columnCategoryName + " AS CATEGORY, " +
						"CAT.IS_VISIBLE, " +
						"CAT.RANGE, " +
						"CAT.ICON, " +
						"CIT.ID AS ID_CITATION, " +
						"CIT." + columnCitationContent + " AS CITATION, " +
						"CIT." + columnCitationAuthor + " AS AUTHOR, " +
						"CIT.IS_LOVED " +
			            "FROM APP_CATEGORY CAT, APP_CITATION CIT " +
			            "WHERE " +
			            "CAT.ID = CIT.ID_CATEGORY " +
			            "ORDER BY CAT.RANGE";

					getDataBySelectQuery(deferred, query);
					
					return deferred.promise;
				}

				function getLanguagesData() {
					var deferred = $q.defer();
					var columnLanguageName = "NAME_" + codeLanguage;
					var query = "" +
						"SELECT ID, CODE, " + columnLanguageName + " AS NAME, " +
						"IS_SELECTED FROM APP_LANGUAGE";
					getDataBySelectQuery(deferred, query);
					return deferred.promise;
				}

				function getCategoriesData() {
					var deferred = $q.defer();
					var columnLanguageName = "NAME_" + codeLanguage;
					var query = "" +
						"SELECT ID, " + columnLanguageName + " AS NAME, " +
						"RANGE, IS_VISIBLE, ICON FROM APP_CATEGORY ORDER BY RANGE";
					getDataBySelectQuery(deferred, query);
					return deferred.promise;
				}

				$q.all([
			        getCitationsByLanguage(),
			        getLanguagesData(),
			        getCategoriesData()
		        ]).then(function(values) {

		        	var citations = values[0];
		        	var languages = values[1];
		        	var categories = values[2];

		        	var catsCits = prepareCategoriesAndCitationsData(citations);

					countNumberOfCitationsLoved(catsCits);

					var data = {
						language: language,
						languages: languages,
						categories: categories,
						catsCits: catsCits
					};

					deferred.resolve(data);

			    }, function(reason) {

			    	console.log('Error: ' + reason);
					deferred.reject(reason);

			    });

			}, function(reason) {

				console.log('Error: ' + reason);
				deferred.reject(reason);

			});

		}, function(reason) {

			console.log('Error: ' + reason);
			deferred.reject(reason);

		});

		return deferred.promise;
	}

	function prepareCategoriesAndCitationsData(citationsRef) {
		var categories = [];

		function getCategory(ID_CATEGORY) {

			var categorySelected = null;

			angular.forEach(categories, function(category) {
				if (category.id === ID_CATEGORY) {
					categorySelected = category;
				}
			});

			return categorySelected;
		}

		angular.forEach (citationsRef, function(citationRef) {
			var category = getCategory(citationRef.ID_CATEGORY);
			if (category != null) {
				category.citations.push(
		            {
		            	id: citationRef.ID_CITATION,
		            	content: citationRef.CITATION,
		            	author: citationRef.AUTHOR,
		            	is_loved: citationRef.IS_LOVED
		            }
	            );
			} else {
				categories.push(
					{
						id: citationRef.ID_CATEGORY,
						name: citationRef.CATEGORY,
						is_visible: citationRef.IS_VISIBLE,
						range: citationRef.RANGE,
						icon: citationRef.ICON,
						citations: [
				            {
				            	id: citationRef.ID_CITATION,
				            	content: citationRef.CITATION,
				            	author: citationRef.AUTHOR,
				            	is_loved: citationRef.IS_LOVED
				            }
			            ]
					}
				);
			}
		});

		return categories;
	}

	function countNumberOfCitationsLoved(categories) {

		angular.forEach(categories, function(category) {

			var count = 0;

			angular.forEach(category.citations, function(citation) {
				count = count + citation.is_loved;
			});

			category.nbCitationsLoved = count;

		});

	}

	function updateData(query, params) {

		var deferred = $q.defer();

		var promise = self.openDatabase();

		promise.then(function() {

			self.db.transaction(function (tx) {

		        tx.executeSql(query, params,
        		function(tx, res) {
		        	deferred.resolve(res.rowsAffected);
		        },
		        function(tx, error) {
		        	deferred.reject(0);
		            console.log('UPDATE error: ' + error.message);
		        });

		    }, function(error) {
		        console.log('Transaction error: ' + error.message);
		    }, function() {
		        console.log('Transaction ok');
		    });

		}, function(reason) {

			deferred.reject(0);
			console.log('Error: ' + reason);

		});

		return deferred.promise;
	}

	function updateCitationImageLoved(idCitation, imageIsLoved) {

		var query = "UPDATE APP_CITATION SET IS_LOVED = ? WHERE ID = ?";

		var params = [imageIsLoved, idCitation];

		updateData(query, params);

	}

	function updateRangeCategory(idCategory, rangeCategory) {

		var query = "UPDATE APP_CATEGORY SET RANGE = ? WHERE ID = ?";

		var params = [rangeCategory, idCategory];

		updateData(query, params);

	}

	function updateIsVisibleCategory(idCategory, isVisibleCategory) {

		var query = "UPDATE APP_CATEGORY SET IS_VISIBLE = ? WHERE ID = ?";

		var params = [isVisibleCategory, idCategory];

		updateData(query, params);

	}

	function updateIsSelectedLanguage(idLanguage, isSelectedLanguage) {

		var query = "UPDATE APP_LANGUAGE SET IS_SELECTED = ? WHERE ID = ?";

		var params = [isSelectedLanguage, idLanguage];

		return updateData(query, params);		
	}	

}