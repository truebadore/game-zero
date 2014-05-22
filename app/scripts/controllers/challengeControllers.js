var challengeControllers = angular.module('challengeControllers', []);

challengeControllers.controller('ChallengeController', function($scope, gameStateService, eventBusService, ChallengeRepositoryService, OptionRepositoryService) {
	$scope.eventBus = eventBusService;
	$scope.gameState = gameStateService;
	$scope.ChallengeRepository = ChallengeRepositoryService;
	$scope.OptionRepository = OptionRepositoryService;
	$scope.state._challengeRepository = {};
	$scope.state._optionRepository = {};
	$scope.$on('handleBroadcast', function(message) {
	  if($scope.eventBus.message.lastIndexOf('displayChallenge', 0) === 0) {
	  	var challengeId = parseInt($scope.eventBus.message.substr($scope.eventBus.message.lastIndexOf(':') + 2,$scope.eventBus.message.length));
	  	$scope.state._currentChallenge = $scope.getChallengeWithID(challengeId);
	  } else if ($scope.eventBus.message.lastIndexOf('findChallengeForOption', 0) === 0) {
		var optionId = parseInt($scope.eventBus.message.substr($scope.eventBus.message.lastIndexOf(':') + 2,$scope.eventBus.message.length));
		$scope.updateMoney($scope.getOptionWithID(optionId));
	  	$scope.removeChallengesForOption(optionId);
	  	$scope.addChallengesForOption(optionId);
	  	$scope.getChallengeForOption(optionId);
	  }
	});

	$scope.challengeRepository = function() {
		$scope.ChallengeRepository.getData().then(function(data) {
			$scope.state._challengeRepository.challenges = data.challenges.challenge;
		});
	}


	$scope.optionRepository = function() {
		$scope.OptionRepository.getData().then(function(data) {
			$scope.state._optionRepository.options = data.options.option;
		});
	}

	$scope.getChallengeWithID = function(id) {
	    var challenge,
	      i = 0;

	    for(; i < $scope.state._challengeRepository.challenges.length; i++) {
	      if( id == $scope.state._challengeRepository.challenges[i]['@id']) {
	        challenge = $scope.state._challengeRepository.challenges[i];
	        $scope.state._challengeRepository.challenges[i].inactive = true;
	      }
	    }

	    return ( challenge );

	}


	$scope.getOptionWithID = function(id) {
	    var option,
	      i = 0;

	    for(; i < $scope.state._optionRepository.options.length; i++) {
	      if( id == $scope.state._optionRepository.options[i]['@id']) {
	        option = $scope.state._optionRepository.options[i];
	      }
	    }

	    return ( option );

	}

	$scope.getOptionsForChallengeID = function(id) {
	    var options = [],
	      i = 0,
	      challenge = $scope.getChallengeWithID(id);

	    for(; i < challenge.options.length; i++) {
	      if( id == $scope.state._optionRepository.options[i]['@id']) {
	        options[i] = $scope.state._optionRepository.options[i];
	      }
	    }

	    return ( options );

	}

	$scope.getNextChallenge = function () {
	    var challenges = [],
		i = 0,
		j = 0,
		k = 0;
    	for (; j < $scope.state._challengeRepository.challenges.length; j++) {
      		if(!$scope.state._challengeRepository.challenges[j].inactive) {
      			challenges.push($scope.state._challengeRepository.challenges[j]);
      		} else if ($scope.state._challengeRepository.challenges[j].inactive === false) {
        		challenges.push($scope.state._challengeRepository.challenges[j]);
        	}
      	}
      	$scope.state._currentChallenge = challenges[Math.floor(Math.random()*challenges.length)];
      	$scope.eventBus.prepForBroadcast('selectedChallenge: ' + $scope.state._currentChallenge['@id']);

	}
	$scope.removeChallengesForOption = function (optionId) {
	    var challenges = {},
	      i = 0,
	      j = 0,
	      k = 0;

	    for(; i < $scope.state._optionRepository.options.length; i++) {
	      if( optionId == $scope.state._optionRepository.options[i]['@id']) {
	        if ($scope.state._optionRepository.options[i].removeChallenge) {
	        	challenges = $scope.state._optionRepository.options[i].removeChallenge.challenge;
	        }
	      }
	    }
	    if (challenges.length > 0) {
	    	console.log('removed challenges');
	    	console.log(challenges);
		    for(; k < challenges.length; k++) {
		    	for (; j < $scope.state._challengeRepository.challenges.length; j++) {
		      		if( challenges[k]['@id'] === $scope.state._challengeRepository.challenges[j]['@id']) {
		        		$scope.state._challengeRepository.challenges[j].inactive = true;
		        	}
		      	}
		    }
		}
	}

	$scope.addChallengesForOption = function (optionId) {
	    var challenges = {},
	      i = 0,
	      j = 0,
	      k = 0;

	    for(; i < $scope.state._optionRepository.options.length; i++) {
	      if( optionId == $scope.state._optionRepository.options[i]['@id']) {
	        if ($scope.state._optionRepository.options[i].addChallenge) {
	        	challenges = $scope.state._optionRepository.options[i].addChallenge.challenge;
	        }
	      }
	    }
	    if (challenges.length > 0) {
	    	console.log('added challenges');
	    	console.log(challenges);
		    for(; k < challenges.length; k++) {
		    	for (; j < $scope.state._challengeRepository.challenges.length; j++) {
		      		if( challenges[k]['@id'] === $scope.state._challengeRepository.challenges[j]['@id']) {
		        		$scope.state._challengeRepository.challenges[j].inactive = false;
		        	}
		      	}
		    }
		}
	}

	$scope.getChallengeForOption = function (option) {
		$scope.removeChallengesForOption(option);
		$scope.addChallengesForOption(option);
		switch (option) {
			case -1:
				$scope.eventBus.prepForBroadcast('selectedChallenge: ' + '1');
				$scope.mainControllerReference.enableControls();
				break;
			case 643:
				$scope.eventBus.prepForBroadcast('selectedChallenge: ' + '2');
				break;
			case 288:
				$scope.eventBus.prepForBroadcast('selectedChallenge: ' + '2');
				break;
			case 311:
				$scope.eventBus.prepForBroadcast('selectedChallenge: ' + '2');
				break;
			case 83:
				$scope.eventBus.prepForBroadcast('selectedChallenge: ' + '3');
				break;
			case 99:
				$scope.eventBus.prepForBroadcast('selectedChallenge: ' + '3');
				break;
			case 374:
				$scope.eventBus.prepForBroadcast('selectedChallenge: ' + '4');
				break;
			case 733:
				$scope.eventBus.prepForBroadcast('selectedChallenge: ' + '4');
				break;
			case 85421:
				$scope.eventBus.prepForBroadcast('selectedChallenge: ' + '4');
				break;
			case 0:
				$scope.eventBus.prepForBroadcast('game: ' + 'over');
				break;
			default:
				$scope.getNextChallenge();
		}
	};

	$scope.challengeRepository();
	$scope.optionRepository();

});

challengeControllers.controller('SingleChallengeController', function($scope, eventBusService, gameStateService, ChallengeRepositoryService, OptionRepositoryService, eventBusService) {
	$scope.eventBus = eventBusService;
	$scope.$on('handleBroadcast', function(message) {
	  if($scope.eventBus.message.lastIndexOf('displayChallenge', 0) === 0) {
	  	var challengeId = parseInt($scope.eventBus.message.substr($scope.eventBus.message.lastIndexOf(':') + 2,$scope.eventBus.message.length));
	  	$scope.displayChallenge(challengeId);
	  }
	});

	$scope.displayChallenge = function(id) {
		if(id !== 'null') {
			$scope.challenge = $scope.getChallengeWithID(id);
			$scope.currentChallengeOptions = [];
		    for(k=0; k < $scope.challenge.options.option.length; k++) {
		    	for (i=0; i < $scope.state._optionRepository.options.length; i ++ ) {
		      		if( $scope.state._optionRepository.options[i]['@id'] == $scope.challenge.options.option[k]['@id']) {
		        		$scope.currentChallengeOptions.push($scope.state._optionRepository.options[i]);
		      		}
		      	}
		    }
		    console.log($scope.currentChallengeOptions);
			$scope.challengeCopy = $scope.challenge.copy;
			$scope.challengeType = $scope.challenge.type;
			if ($scope.challengeType == 'complex') {
				$scope.viewSrc = 'views/partials/complex/' + id + '.html';
			} else {
				$scope.viewSrc = 'views/partials/challenge.html';
			}
		}

		$scope.viewLoaded = function () {
			$scope.eventBus.prepForBroadcast('onChallengeDisplayComplete: ' + id);
		}
	}
	

});