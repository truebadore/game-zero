var mainController  = angular.module('mainController', ['matchmedia-ng']);

mainController.controller('MainController', function($scope, $route, $window, $document, $timeout, gameStateService, eventBusService, DayDataService, matchmedia) {
  window.S = $scope;
  $scope.state = gameStateService;
  $scope.eventBus = eventBusService;
  $scope.phoneMenuVisible = false;
  $scope.mainControllerReference = { debugMode: false };
  $scope.$watch(function(){
      return gameStateService;
  }, function (newState, oldState) {
      $scope.state = newState;
      $scope.debugMode = $scope.state._debugMode;
      $scope.currentGameDay = $scope.state._currentGameDay;
      $scope.mainControllerReference.debugMode = $scope.state._debugMode;
      //console.log(JSON.stringify(newState));
      //console.log(JSON.stringify(oldState));
  }, true);

  
  $scope.prevDay = function() {
    $scope.eventBus.prepForBroadcast('prevday: ' + 'null');
  }
  $scope.nextDay = function() {
    $scope.eventBus.prepForBroadcast('nextday: ' + 'null');
  }
  $scope.setBankBalance = function(amount) {
    $scope.eventBus.prepForBroadcast('setbalance: ' + amount);
  }
  $scope.debitAccount = function(amount) {
    $scope.eventBus.prepForBroadcast('debitaccount: ' + amount);
  }
  $scope.creditAccount = function(amount) {
    $scope.eventBus.prepForBroadcast('creditaccount: ' + amount);
  }

  $scope.resetGame = function() {
    $window.location.reload();
  }

  $scope.getInvolved = function() {
    $scope.notYetImplemented();
  }

  $scope.gameOverDonate = function () {
    $scope.notYetImplemented();
  }
  $scope.gameOverQuit = function () {
    $scope.notYetImplemented();
  }

  $scope.notYetImplemented = function () {
    $window.alert('Thanks for playing - this feature not yet implemented.');
  }

  $scope.$watch(function(){
    return $scope.state._currentDayIndexInt;
  }, function (newDay) {
    if(newDay > 30) {
      newDay = 30;
    } else if (newDay <=0) {
      newDay = 0;
    }
    $scope.setReadoutXPositions(newDay);
  });

  $scope.viewportHeight = $window.innerHeight;
  $scope.viewportWidth = $window.innerWidth;
  $scope.mainControllerReference.viewportHeight = $scope.viewportHeight;
  $scope.mainControllerReference.viewportWidth = $scope.viewportWidth;

  var unsub = {};
  unsub['print'] = matchmedia.onPrint(function(mediaQueryList){
    $scope.isPrint = mediaQueryList.matches;
  }, $scope);
  unsub['screen'] = matchmedia.onScreen(function(mediaQueryList){
    $scope.isScreen = mediaQueryList.matches;
  }, $scope);
  unsub['phone'] = matchmedia.onPhone(function(mediaQueryList){
    $scope.isPhone = mediaQueryList.matches;
  });
  unsub['tablet'] = matchmedia.onTablet( function(mediaQueryList){
    $scope.isTablet = mediaQueryList.matches;
  });
  unsub['desktop'] = matchmedia.onDesktop( function(mediaQueryList){
    $scope.isDesktop = mediaQueryList.matches;
  });
  unsub['portrait'] = matchmedia.onPortrait(function(mediaQueryList){
    $scope.isPortrait = mediaQueryList.matches;
  });
  unsub['landscape'] = matchmedia.onLandscape(function(mediaQueryList){
    $scope.isLandscape = mediaQueryList.matches;
  });

  angular.element($window).bind('resize', function(e) {
      $scope.viewportHeight = $window.innerHeight;
      $scope.viewportWidth = $window.innerWidth;
  });

  $scope.viewSrc = 'views/partials/complex/-1.html';

  $document.bind('keypress', function(event) {
      if(event.which == 100) { // D key
        $scope.toggleDebugMode();
        $scope.$apply();
      }
  })
  $scope.updateMoney = function(option) {
        // if necessary, adjust pay immediately
        // if payday, apply adjustment
            // update payDayAdjustment
      if(option.balanceAmountChange) {
        $scope.state._currentBankBalance = parseInt($scope.state._currentBankBalance) + parseInt(option.balanceAmountChange);
        if ($scope.state._currentBankBalance < 1) {
          $scope.state._currentBankBalance = 0;
          $scope.eventBus.prepForBroadcast('game: overMoney');
        }
      }
      if(option.changeAllPaychecks) {
        $scope.state._allPayDayAdjustment = parseInt($scope.state._allPayDayAdjustment) + parseInt(option.changeAllPaychecks);
      }
      if(option.changeNextPaycheck) {
        $scope.state._nextPayDayAdjustment = parseInt($scope.state._nextPayDayAdjustment) + parseInt(option.changeNextPaycheck);
        if ($scope.state._currentBankBalance < 1) {
          $scope.state._currentBankBalance = 0;
          $scope.eventBus.prepForBroadcast('game: overMoney');
        }
      }
      if($scope.state._allDayData[$scope.state._currentDayIndexInt].isPayDay === true) {
        $scope.state._currentBankBalance = parseInt($scope.state._currentBankBalance) + (parseInt($scope.state._nextPayDayAdjustment) + parseInt($scope.state._allPayDayAdjustment));
        $scope.state._nextPayDayAdjustment = 0;      
        if ($scope.state._currentBankBalance < 1) {
          $scope.state._currentBankBalance = 0;
          $scope.eventBus.prepForBroadcast('game: overMoney');
        }
      }
      if ($scope.state._currentBankBalance < 1) {
        $scope.state._currentBankBalance = 0;
        $scope.eventBus.prepForBroadcast('game: overMoney');
      }
      if ($scope.state._currentBankBalance > 0 && $scope.state._currentDayIndexInt === 30) {
        $scope.eventBus.prepForBroadcast('game: overWin');
      }
  }

  $scope.beginGame = function() {
    $scope.eventBus.prepForBroadcast('game: ' + 'begin');
    $scope.mainControllerReference.screenLayoutHandler();
    $scope.eventBus.prepForBroadcast('selectedChallenge: 0');
    $scope.state._challengeRepository.challenges[0].inactive = true;
  }

  $scope.$on('onScreenLayoutComplete', function(scope, element, attrs){
    $scope.mainControllerReference.setReadoutXPositions($scope.state._currentDayIndexInt);
  });
  $scope.$on('onDayListComplete', function(scope, element, attrs){
    $scope.mainControllerReference.screenLayoutHandler();
  });


  $scope.setReadoutXPositions = function(currentDay) {
    var dayNumberReadout = angular.element(document.getElementById('day-number-readout'));
    var bankBalanceReadout = angular.element(document.getElementById('bank-balance-readout'));
    var currentGameDayDiv = angular.element(document.getElementById('day_' + currentDay));
    var topValue;
    if(currentDay > 0) {
      topValue = currentGameDayDiv[0].offsetTop;
      dayNumberReadout.css('top', topValue + 'px');
      bankBalanceReadout.css('top', topValue + 'px');
    } else if (currentDay == 0) {
      dayNumberReadout.css('top', '0px');
      bankBalanceReadout.css('top', '0px');
    }
  }

  $scope.toggleSound = function () {
      if ($scope.state._isSoundOn) {
        $scope.eventBus.prepForBroadcast('sound: ' + 'off');
      } else {
        $scope.eventBus.prepForBroadcast('sound: ' + 'on');
      }
  }
  $scope.toggleDebugMode = function () {
      if ($scope.state._debugMode) {
        $scope.eventBus.prepForBroadcast('debug: ' + 'off');
      } else {
        $scope.eventBus.prepForBroadcast('debug: ' + 'on');
      }
  }
  $scope.togglePhoneMenu = function (obj) {
    var t = obj.target.attributes.data.value;
      if (t == 'menu-on-icon') {
        $scope.openPhoneMenu();
      } else {
        $scope.closePhoneMenu();
      }
  }
  $scope.openPhoneMenu = function () {
      $scope.phoneMenuVisible = true;
      var menu = angular.element(document.getElementById('phone-menu-div'));
      menu.addClass('display-visible');
      menu.addClass('pure-menu-open');
      menu.removeClass('display-hidden');
      menu.css('background', 'black');
      menu.css('width', '150px');     
      menu.css('top', '-200px');
      menu.css('left', '0px');  
  }
  $scope.closePhoneMenu = function () {
      $scope.phoneMenuVisible = false;
      var menu = angular.element(document.getElementById('phone-menu-div'));
      menu.addClass('display-hidden');
      menu.removeClass('pure-menu-open');
      menu.removeClass('display-visible');
      menu.css('background', '');
      menu.css('width', '');     
      menu.css('top', '');
      menu.css('left', '');  
  }

 
});
