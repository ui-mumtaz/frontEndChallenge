app.controller("logInController", ['$state', '$scope', '$rootScope', 'UserService',
	function ($state, $scope, $rootScope, UserService) {

		$scope.editRecord = {};
		UserService.query("users").then(function (response) {
			$scope.users = response;
		}).catch("you have the following error" + console.error);

		$scope.logIn = function () {
			$rootScope.userIsLoggedIn = true;
			$state.go('root.account', {"userId": $scope.editRecord.userId});
		}


	}]);

app.controller("accountController", ['UserService', '$window', '$stateParams', '$scope', '$uibModal', 'CONSTANTS', '$rootScope',
	function (UserService, $window, $stateParams, $scope, $uibModal, CONSTANTS, $rootScope) {

		$scope.editRecord = {};
		$rootScope.user = {};
		$scope.readOnly = true;
		UserService.getById("users", parseInt($stateParams.userId)).then(function (response) {
			$scope.editRecord = response;
			$window.sessionStorage.setItem('user', JSON.stringify($scope.editRecord));
			$scope.mapParam = $scope.editRecord.address.geo.lat + "," + $scope.editRecord.address.geo.lng;
		}).catch("you have the following error" + console.error);

		$scope.openGIS = function () {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: CONSTANTS.BASE_URL + 'ui/map.html',
				scope: $scope,
				backdrop: 'static'
			});
			$scope.close = function () {
				modalInstance.close();
			};
		}

	}]);


app.controller("postsController", ['UserService', '$stateParams', '$scope', '$uibModal', 'CONSTANTS', '$state', '$rootScope',
	function (UserService, $stateParams, $scope, $uibModal, CONSTANTS, $state, $rootScope) {
		$scope.posts = [];
		$scope.isMine = false;
		UserService.query("posts").then(function (response) {
			$scope.posts = response;
			for (var i = 0; i < $scope.posts.length; i++) {
				$scope.posts[i].isMine = {};
				if ($scope.posts[i].userId === parseInt($stateParams.userId)) {
					$scope.posts[i].isMine = true;
				} else {
					$scope.posts[i].isMine = false;
				}
			}

		});

		$scope.filterValue = "";
		$scope.filterResults = function () {
			$scope.filterValue = "";
			$scope.filterValue = parseInt($stateParams.userId);
			return $scope.filterValue;
		};
		$scope.callFilter = function () {
			$scope.filterResults();
		};

		$scope.clearFilter = function () {
			$scope.filterValue = "";
		}

		$scope.makingShowtrue = function () {
			$scope.checked = !$scope.checked;
		};


		$scope.loadPost = function (Id) {
			$state.go('root.post', {mode: 'edit', "Id": Id});
		};

	}]);

app.controller("postEditController", ['UserService', '$window', '$stateParams', '$scope', '$q', 'toaster', '$state', '$rootScope',
	function (UserService, $window, $stateParams, $scope, $q, toaster, $state, $rootScope) {

		clearCommentSection = function () {
			$scope.comment = {};
			var user = JSON.parse($window.sessionStorage.getItem('user'));
			$scope.comment.name = user.name;
			$scope.comment.email = user.email;
		}

		var promises = [];
		if ($stateParams.mode === "edit") {
			$scope.postTitle = "Post Details";
			promises.push(UserService.getById("posts", parseInt($stateParams.Id)));
			promises.push(UserService.query1("posts", parseInt($stateParams.Id), "comments"));
			$q.all(promises).then(function (results) {
				if (results) {
					$scope.editRecord = results[0];
					$scope.comments = results[1];
				}
			});
			$scope.showCommentReplySection = true;
			clearCommentSection();
		} else {
			$scope.postTitle = "New Post";
			$scope.showCommentReplySection = false;
			$scope.editRecord = {};
		}

		var promisesForComments = [];
		$scope.submitComment = function () {
			$scope.comment.postId = parseInt($stateParams.Id);
			promisesForComments.push(UserService.query1("posts", parseInt($stateParams.Id), "comments"));
			promisesForComments.push(UserService.save1("posts", parseInt($stateParams.Id), "comments", $scope.comment));
			$q.all(promisesForComments).then(function (res) {
				if (res) {
					$scope.comments = res[0];
					var last = res[res.length - 1];
					$scope.comments.push(last);
					clearCommentSection();
				}
			});
		};

		$scope.$on("AfterSuccessFullSave", function (ev, args) {
			if (args.name === "posts") {
				/* because the new record  isn't actually "saved" into a DB
				 * and because upon loading the list (state :' root.postsList') 
				 * the $scope.posts gets populated again with the GET call
				 * the ui (the array) remains the same
				 */
				$state.go('root.postsList');
			}
		});

	}]);

app.controller("albumController", ['UserService', '$stateParams', '$scope', '$state',
	function (UserService, $stateParams, $scope, $state) {

		UserService.query1("users", parseInt($stateParams.userId), "albums").then(function (response) {
			$scope.albums = response;
		});

	}]);

app.controller("albumEditController", ['$scope', '$q', '$state', '$stateParams', 'UserService', function ($scope, $q, $state, $stateParams, UserService) {
		var albumPromises = [];
		if ($stateParams.albumId) {
			$scope.submitAlbum = false;
			$scope.albumTitle = "Album Details";
			albumPromises.push(UserService.getById("albums", parseInt($stateParams.albumId)));
			albumPromises.push(UserService.query1("albums", parseInt($stateParams.albumId), "photos"));
			$q.all(albumPromises).then(function (results) {
				if (results) {
					$scope.editRecord = results[0];
					$scope.photos = results[1];
				}
			});
		} else {
			$scope.submitAlbum = true;
			$scope.albumTitle = "New Album";
			$scope.editRecord = {};
		}

		$scope.$on("AfterSuccessFullSave", function (ev, args) {
			if (args.name === "albums") {
				/* because the new record  isn't actually "saved" into a DB
				 * and because upon loading the list (state :' root.albumsList') 
				 * the $scope.photos gets populated again with the GET call
				 * the ui (the array) remains the same
				 */
				$state.go('root.albumsList');
			}
		});

		var promisesForPhotos = [];
		$scope.submitPhoto = function () {
			if (!$scope.AlbumsForm.$error.hasOwnProperty('url')) { 
			$scope.photo.albumId = parseInt($stateParams.albumId);
			$scope.photo.thumbnailUrl = $scope.photo.url;
			promisesForPhotos.push(UserService.query1("albums", parseInt($stateParams.albumId), "photos"));
			promisesForPhotos.push(UserService.save1("albums", parseInt($stateParams.albumId), "photos", $scope.photo));
			$q.all(promisesForPhotos).then(function (res) {
				if (res) {
					$scope.photos = res[0];
					var last = res[res.length - 1];
					$scope.photos.push(last);
					$scope.photo = {};
				}
			});
			}
		};
	}]);

app.controller("todoController", ['UserService', '$state', '$rootScope', 'toaster', '$stateParams', '$scope', '$uibModal', 'CONSTANTS', '$filter',
	function (UserService, $state, $rootScope, toaster, $stateParams, $scope, $uibModal, CONSTANTS, $filter) {

		UserService.query1("users", parseInt($stateParams.userId), "todos").then(function (response) {
			$scope.todos = response;
		});

		$scope.editToDo = function (mode, id) {
			if (mode === "edit") {
				$scope.editRecord = angular.copy(_.findWhere($scope.todos, {id: id}));
				$scope.toDoPk = id;
			} else {
				$scope.editRecord = {};
			}

			$rootScope.modalInstance = $uibModal.open({
				animation: true,
				templateUrl: CONSTANTS.BASE_URL + 'ui/toDo.html',
				scope: $scope,
				backdrop: 'static',
				size: 'lg'
			});
			$scope.closeToDo = function (result) {
				if (result === false) {
					$rootScope.modalInstance.close();
				}
			};
		};


	}]);

app.controller("todoEditController", ['$rootScope', '$scope', 'UserService', '$stateParams', function ($rootScope, $scope, UserService, $stateParams) {
		$scope.status = [{"statusId": 1, "completed": true},
			{"statusId": 2, "completed": false}, ];

		$scope.$on("AfterSuccessFullSave", function (ev, args) {
			if (args.name === "todos") {
				$scope.todos.push(args.editRecord);
				$rootScope.modalInstance.close();
			}
		});

	}]);

   