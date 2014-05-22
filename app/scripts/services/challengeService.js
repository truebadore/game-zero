var challengeServiceModule = angular.module('ChallengeRepositoryService', []);

challengeServiceModule.factory("ChallengeRepositoryService", function ($rootScope, $http, $q) {
  var Repository = {};
  var promise;

  Repository.getData = function() {
    var defer = $q.defer();
    $http.get('../docs/challenges.json', { cache: 'true'})
    .success(function(data) {
        defer.resolve(data);
    });
    return defer.promise;
  };

  return Repository;

});
