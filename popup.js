var TEXT_TOO_SHORT_ERROR = "Input text too short. Are you SURE you need to tl;dr that?";
var USE_GOOGLE_VOICE = /chrome/i.test( navigator.userAgent );
window.onload = function() { //SMMRY API abstraction
    //https://github.com/Dogfalo/materialize/issues/1503
    window.speechSynthesis.cancel();
    console.log("window loaded");

    document.title = "Summary to Speech";

    var speechUtteranceChunker = function (utt, chunkSize, callback) {
      var chunkLength = chunkSize;
      var pattRegex = new RegExp('^[\\s\\S]{' + Math.floor(chunkLength / 2) + ',' + chunkLength + '}[.!?,]{1}|^[\\s\\S]{1,' + chunkLength + '}$|^[\\s\\S]{1,' + chunkLength + '} ');

      var arr = [];
      var txt = utt.text
      while (txt.length > 0) {
            arr.push(txt.match(pattRegex)[0]);
            txt = txt.substring(arr[arr.length - 1].length);
        }
        $.each(arr, function () {
            var u = new SpeechSynthesisUtterance(this.trim());
            u.voice = utt.voice;
            window.speechSynthesis.speak(u);
        });
    };

    function handleTextSMMRYAsync(res) {
        if (res) {
            if (!errorcheck(res)) {
                return res;
            }

            console.log(res);
            // console.log(res);
            // console.log("just the text:...")
            console.log(res.sm_api_content);
            // var lbefore =  $('textarea#textarea1').val.length();
            $('textarea#textarea1').val(res.sm_api_content);
            $('textarea#textarea1').trigger("autoresize");

            //This defaults to chrome
            if (USE_GOOGLE_VOICE) {
                var utterance = new SpeechSynthesisUtterance(res.sm_api_content);
                var voices = window.speechSynthesis.getVoices();
                utterance.voice = voices.filter(function(voice) { return voice.name == "Google US English"; })[0];
                speechUtteranceChunker(utterance, 160, function () {
                    //some code to execute when done
                });
            } else {
                //this calls uphony QQ
                angular.element($("#angularupdate")).scope().update(res.sm_api_content);
                angular.element($("#angularupdate")).scope().$apply();
            }

            // quick fix for resizing the popup after the text is summarized
            $(window).height(10);
            window.scrollTo(0, 0);

            return res.sm_api_content;

        }
    }


    // Get summarized text
    function getTextSMMRY(text, lines) {
        // Set up API constants
        SM_API_URL = "https://guarded-forest-33799.herokuapp.com/?";
        SM_LENGTH = lines; // Optional, N represents the number of sentences returned, default is 7
        // SM_KEYWORD_COUNT = N // Optional, N represents how many of the top keywords to return
        // SM_QUOTE_AVOID     // Optional, summary will not include quotations
        // SM_WITH_BREAK      // Optional, summary will contain string [BREAK] between each

        //make formatted API request
        var result;
        return Promise.resolve($.ajax({
            url: SM_API_URL + "&SM_LENGTH=" + SM_LENGTH,
            type: "POST",
            data: { sm_api_input: text },
            dataType: "json",
            success: handleTextSMMRYAsync,
            error: function(xhr, status, error) {
                console.log("Error: " + xhr.responseText)
            }
        }));
    }


    // clean up good result and just spit out the text
    // return resulting API text
    $("#submitbtn1").click(function() {
        //get the text from the text area
        var text = $('textarea#textarea1').val();

        // call smmry
        // returns a promise

        // exit function if less than 40 characters are entered
        if (text.length < 40) {
            $('textarea#textarea1').val(TEXT_TOO_SHORT_ERROR);
            $('textarea#textarea1').select();
            return;
        }
        $("#submitbtn1").fadeOut(800);
        $("#loader").fadeIn(800);
        verbocity = $("#selverbocity").val();

        getTextSMMRY(text, verbocity);

    });

    $(document).ready(function() {
        $('select').material_select();
    });

    function errorcheck(res) {
        if (!res.sm_api_error) {
            return true;
        }
        if (res.sm_api_error == 3) {
            console.log(TEXT_TOO_SHORT_ERROR);
            return false;
        }
    }

    //recieve text from context menu click
    function setSelectionText(info) {

        //update text area
        $('textarea#textarea1').val(info);
        $('textarea#textarea1').trigger('autoresize');
        $('label[for="textarea1"]').attr('class', 'active');
        
    }

    //sent message to backgroundjs asking for selectionText
    chrome.runtime.sendMessage({ msg: 'selectionText' }, setSelectionText);

}
