app.directive('commonCar', ['CONSTANTS', function (CONSTANTS) {
		return {
			restrict: 'E',
			scope: {
				var : '='
			},
			templateUrl: CONSTANTS.BASE_URL + 'ui/cars/divCommonCar.html',
			controller: function ($scope) {
				var car = _.findWhere($scope.$parent.cars, {carId: $scope.var.toString()});
				$scope.type = car.type;
				$scope.status = car.status;
			}
		};
	}])

app.directive('buttonDelete', ['CONSTANTS', '$uibModal', '$filter', 'toaster', function (CONSTANTS, $uibModal, $filter, toaster) {
		return {
			restrict: 'E',
			scope: {
				pk: '@',
				name: "@",
				array: "=",
				icon:"@",
				type:"@"
			},
			compile: function (element, attr) {
				if (angular.isDefined(attr.icon) === false) {
					attr.icon = 'glyphicon glyphicon-trash';
					attr.type = 'btn btn-danger btn-xs';
				} else {
					attr.icon = 'glyphicon glyphicon-remove';
					attr.type = 'btn btn-link btn-xs';
				}
			},	 
			replace: true,				
			templateUrl: CONSTANTS.BASE_URL + 'ui/buttonDelete.html',
			controller: function ($scope, UserService, $filter, toaster) {

				$scope.deleteItem = function (pk) {
					var modalInstance = $uibModal.open({
						animation: true,
						templateUrl: CONSTANTS.BASE_URL + 'ui/divDelete.html',
						scope: $scope,
						backdrop: 'static'
					});

					$scope.closeConfirmDelete = function (result) {
						if (result === true) {
							UserService.delete($scope.name, pk).then(function (response) {
								if (!response.$resolved) {
									toaster.pop('error', "Deletion Error", "There was a problem deleting this " + $scope.name);
								} else {
									var deletedItem = $filter('filter')($scope.array, {id: parseInt(pk)}, true)[0];
									var index = $scope.array.indexOf(deletedItem);
									$scope.array.splice(index, 1);
									toaster.pop('success', "Deletion of record", "Your item has been removed");
								}
							})
							modalInstance.close();
						} else {
							modalInstance.close();
						}
					};
				}
			}
		};
	}])



app.directive('buttonSave', ['CONSTANTS', 'toaster', '$rootScope', function (CONSTANTS, toaster, $rootScope) {
		return {
			restrict: 'E',
			scope: {
				name: "@",
				title: "@"
			},
			templateUrl: CONSTANTS.BASE_URL + 'ui/buttonSave.html',
			controller: function ($scope, UserService, $stateParams) {
					 
				$scope.saveRecord = function () {
					$scope.$parent.editRecord.userId = parseInt($stateParams.userId);
					UserService.save($scope.name, $scope.editRecord).then(function (response) { 
						if (response.$resolved) {
							 toaster.pop('success', "Successful saving of record", "Your item has been saved");
							 
							$scope.$parent.editRecord.id = response.id;
							$scope.$emit('AfterSuccessFullSave', {"name": $scope.name, "editRecord": $scope.$parent.editRecord});
						}
					});
				}
			}
		};
	}])