var rescueControllers = angular.module('rescueControllers', []);

rescueControllers.controller('RescueListController', ['$scope', '$http', function($scope, $http) {
  $http.get('../docs/rescues.json').success(function(data) {  // mk-build
    $scope.rescues = data.rescues.rescue;
  });

 }]);
