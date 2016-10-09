(function() {
  'use strict';
  angular.module('pow-demo').controller('AudioCtrl',function($scope, voiceFactory) {
    $scope.data = {};

    $scope.data.text = "";
    $scope.data.locale = "en_US";
    $scope.data.audioType = "WAVE_FILE";
    $scope.data.arrayBuffer = {};
    $scope.update = function(input) {
      $scope.data.audio = {
        text: input.substring(1, Math.min(400, input.length)),
        locale: $scope.data.locale,
        audioType: $scope.data.audioType,
        voice: "Don Happy Basic"
      };

      voiceFactory.getAudio($scope.data.audio).then(function(arrayBuffer) {
        $scope.data.arrayBuffer= arrayBuffer;
        $('#player1').fadeIn(400)
        $("#disabledbutton").fadeOut(400, function() {
          window.player.play();
        });
      });
    };
  });

})();
