/* global CONSTANTS */ 
'use strict'; 
var app = angular.module('app', ['ui.router', 'ngResource' ,'ui.bootstrap', 'ngMap', 'angular.filter','ngAnimate','toaster',])

app.run( [ '$rootScope', '$state', '$stateParams', 'CONSTANTS', function ( $rootScope, $state, $stateParams,  CONSTANTS)
	{	
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
		 
		  
 	} 
])
app.config(['$urlRouterProvider', '$stateProvider', 'CONSTANTS', function($urlRouterProvider, $stateProvider,CONSTANTS) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
	  
      .state('root', {
        abstract: true,
		url: '/:userId',
		template: "<ui-view/>"
      }) 
	  .state('root.account', {
        url: '/account',
        templateUrl: CONSTANTS.BASE_URL + 'ui/account.html',
		controller: 'accountController'
      }) 
	  .state('root.postsList', {
        url: '/postsList',
        templateUrl: CONSTANTS.BASE_URL + 'ui/postsList.html',
		controller: 'postsController'
      })
	   .state('root.post', {
        url: '/:mode/:Id',
        templateUrl: CONSTANTS.BASE_URL + 'ui/postEdit.html',
		controller: 'postEditController'
      })
	  
	  .state('root.albumsList', {
        url: '/albumsList',
        templateUrl: CONSTANTS.BASE_URL + 'ui/albumList.html',
		controller: 'albumController'
      }) 
	   .state('root.album', {
        url: '/album/:mode/:albumId',
        templateUrl: CONSTANTS.BASE_URL + 'ui/albumEdit.html',
		controller: 'albumEditController'
      })
	  
	  .state('root.todosList', {
        url: '/:todosList',
        templateUrl: CONSTANTS.BASE_URL + 'ui/toDoList.html',
		controller: 'todoController'
      })
	    .state('root.todo', {
        url: '/:mode/:todoId',
        templateUrl: CONSTANTS.BASE_URL + 'ui/toDo.html',
		controller: 'todoEditController'
      })
	  
	  .state('root.home', {
        url: '/home',
        templateUrl: CONSTANTS.BASE_URL + 'ui/home.html',
		controller: 'homeController'
      })
	  .state('root.home.child1', {
        url: '/child1',
        templateUrl:  CONSTANTS.BASE_URL + 'ui/child1.html' 
      })
	  .state('root.home.bmw', {
        url: '/:carId',
        templateUrl:  CONSTANTS.BASE_URL + 'ui/cars/bmw.html' 
      }) 
	  .state('root.home.ford', {
        url: '/:carId',
        templateUrl:  CONSTANTS.BASE_URL + 'ui/cars/ford.html' 
      }) 
	   
      .state('root.about', {
        url: '/about',
        templateUrl:  CONSTANTS.BASE_URL +'ui/about.html',
        controller: 'aboutController'
      })
      .state('root.contact', {
        url: '/contact',
        templateUrl: CONSTANTS.BASE_URL +'ui/contact.html'
      })
  }])
  .constant('CONSTANTS', {
			 BASE_URL: "" ,
	         SERVICES_URL: "https://jsonplaceholder.typicode.com"
		})	
  