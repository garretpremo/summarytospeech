(function() {
  'use strict';
  angular.module('pow-demo').factory('voiceFactory',['$http', '$sce', '$httpParamSerializerJQLike' ,function($http, $sce, $httpParamSerializerJQLike){

    function getSrc(voicesrc,text){
      return $sce.trustAsResourceUrl("http://52.32.197.208:59125/process?INPUT_TEXT="+text+"&INPUT_TYPE=TEXT&OUTPUT_TYPE=AUDIO&LOCALE=en_US&AUDIO=WAVE_FILE&VOICE="+voicesrc+"");
      //return $http.post('/api/v1/voices');
    }

    function getAudio(opts) {
      return $http({
        method: 'POST',
        url: "http://api.euphonyinc.com/api/v1/voices",
        headers: {
          apikey: '5a21f55c958f40bcb61e83de0cd1c3c1',
          'Content-Type': 'application/json'
        },
        data: {
          text: opts.text,
          voice: opts.voice
        },
        responseType: 'arraybuffer'
      }).then(function(response) {
        return response.data;
      })
      .catch(function(err){
        var utterance = new SpeechSynthesisUtterance(opts.text);
        window.speechSynthesis.speak(utterance);
        console.log(err);
      });
    }

    return {
      getAudioSrc: function (voicesrc,text){
        return getSrc(voicesrc,text);
      },
      getAudio: function(opts) {
        return getAudio(opts);
      }
    };

  }]);
})();
