var optionServiceModule = angular.module('OptionRepositoryService', []);

optionServiceModule.factory("OptionRepositoryService", function ($rootScope, $http, $q) {
  var Repository = {};
  var promise;

  Repository.getData = function() {
    var defer = $q.defer();
    $http.get('../docs/options.json', { cache: 'true'})
    .success(function(data) {
        defer.resolve(data);
    });

    return defer.promise;
  };
  
  return Repository;

});


