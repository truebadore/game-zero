'use strict';

var spentApp = angular.module('spentApp', [
    'matchmedia-ng',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    // controllers
    'mainController',
    'challengeControllers',
    'optionControllers',
    'rescueControllers',
    'bankBalanceControllers',
    'canvasControllers',
    'dayListControllers',
    'playerControllers',
    // directives
    'layoutManagerDirectives',
    // services
    'eventBusService',
    'gameStateService',
    'DayDataService',
    'ChallengeRepositoryService',
    'OptionRepositoryService'

  ]);

spentApp.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainController'
    })
    .otherwise({
      redirectTo: '/'
    });
});

