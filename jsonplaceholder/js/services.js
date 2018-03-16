app.factory('AllUsersService', ['$http','CONSTANTS', function ($http, CONSTANTS) {
	 var factory = { 	users: [] };
	
	factory.getAllUsers = function () { 
			var url = CONSTANTS.SERVICES_URL + '/users';
			var promise = $http.get(url).then(function (response)
				{  factory.users = response.data;
				}); 
		return promise;
		};
		return factory;
	}]);


app.factory('UserService', ['$http','CONSTANTS', '$resource' , function ($http, CONSTANTS,$resource) {
 
	var factory ={};
 	 
	factory.resource = $resource(CONSTANTS.SERVICES_URL+'/:entityName/', {}, {
		query: {url:CONSTANTS.SERVICES_URL+'/:entityName/',method:'GET', isArray: true},
		query1: {url:CONSTANTS.SERVICES_URL+'/:parent/:id/:entityName/',method:'GET', isArray: true},
		getById: {url: CONSTANTS.SERVICES_URL+'/:entityName/:id', method: 'GET'},
		delete: {url: CONSTANTS.SERVICES_URL+'/:entityName/:id', method: 'DELETE'},
		save: {url: CONSTANTS.SERVICES_URL+'/:entityName', method: 'POST'},
		save1: {url: CONSTANTS.SERVICES_URL+'/:parent/:id/:entityName/', method: 'POST'} 
		
	});
	 
 
	factory.getById = function(entityName, id) {
		return factory.resource.getById({entityName: entityName, id: id}).$promise;
	};
	factory.query = function(entityName) {
		 return factory.resource.query({entityName: entityName }).$promise; 
	};
	factory.query1 = function (parent, id ,entityName){
		return factory.resource.query1({ parent: parent,id: id ,entityName: entityName}).$promise; 
	};
	factory.delete = function(entityName, id) {
		return factory.resource.delete({entityName: entityName, id: id}).$promise;
	};
	factory.save = function(entityName, editRecord) {
		return factory.resource.save({entityName: entityName }, editRecord).$promise;
	};
	factory.save1 = function(parent, id, entityName, editRecord) {
		return factory.resource.save({ parent: parent,id: id ,entityName: entityName}, editRecord).$promise;
	};
	 
	return factory;
  
 
}]);





app.factory('GetOneUserService', ['$http','CONSTANTS', function ($http, CONSTANTS) {
	 var factory = { 	results: [] };
	
	factory.getAllUsers = function (userId) { 
			var url = CONSTANTS.SERVICES_URL + 'Services/Contracts/CalculateTotalsInstructionLimitAmounts/'+ contractId;
			var promise = $http.post(url, {cache: false})
					.then(function (response) {
						factory.results = response.data.results;
					});
			return promise; 
		};
		return factory;
	}]);