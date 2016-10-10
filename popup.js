var TEXT_TOO_SHORT_ERROR = "Input text too short. Are you SURE you need to tl;dr that?";
var USE_GOOGLE_VOICE = false;
window.onload = function() { //SMMRY API abstraction
    //https://github.com/Dogfalo/materialize/issues/1503
    window.speechSynthesis.cancel();
    console.log("window loaded");

    document.title = "Summary to Speech";

    var speechUtteranceChunker = function (utt, settings, callback) {
        settings = settings || {};
        var newUtt;
        var txt = (settings && settings.offset !== undefined ? utt.text.substring(settings.offset) : utt.text);
        if (utt.voice && utt.voice.voiceURI === 'native') { // Not part of the spec
            newUtt = utt;
            newUtt.text = txt;
            newUtt.addEventListener('end', function () {
                if (speechUtteranceChunker.cancel) {
                    speechUtteranceChunker.cancel = false;
                }
                if (callback !== undefined) {
                    callback();
                }
            });
        }
        {
            var chunkLength = (settings && settings.chunkLength) || 160;
            var pattRegex = new RegExp('^[\\s\\S]{' + Math.floor(chunkLength / 2) + ',' + chunkLength + '}[.!?,]{1}|^[\\s\\S]{1,' + chunkLength + '}$|^[\\s\\S]{1,' + chunkLength + '} ');
            var chunkArr = txt.match(pattRegex);

            if (chunkArr[0] === undefined || chunkArr[0].length <= 2) {
                //call once all text has been spoken...
                if (callback !== undefined) {
                    callback();
                }
                return;
            }
            var chunk = chunkArr[0];
            newUtt = new SpeechSynthesisUtterance(chunk);
            var x;
            for (x in utt) {
                if (utt.hasOwnProperty(x) && x !== 'text') {
                    newUtt[x] = utt[x];
                }
            }
            newUtt.addEventListener('end', function () {
                if (speechUtteranceChunker.cancel) {
                    speechUtteranceChunker.cancel = false;
                    return;
                }
                settings.offset = settings.offset || 0;
                settings.offset += chunk.length - 1;
                speechUtteranceChunker(utt, settings, callback);
            });
        }

        if (settings.modifier) {
            settings.modifier(newUtt);
        }
        console.log(newUtt); //IMPORTANT!! Do not remove: Logging the object out fixes some onend firing issues.
        //placing the speak invocation inside a callback fixes ordering and onend issues.
        setTimeout(function () {
            newUtt.voice = utt.voice;
            speechSynthesis.speak(newUtt);
        }, 0);
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
                speechUtteranceChunker(utterance, {chunkLength: 300}, function () {
                  //some code to execute when done
                  console.log('Finished speaking.');
                });
            } else {
                //this calls uphony QQ
                angular.element($("#angularupdate")).scope().update(res.sm_api_content);
                angular.element($("#angularupdate")).scope().$apply();
            }

            $(window).height(10);
            // var diff = $('textarea#textarea1').val.length() - lbefore;
            window.scrollTo(0, 0);

            return res.sm_api_content;
            // result = res;
            // return res["sm_api_title"];
        }
        // console.log(res.responseText)
        // result = res;
    }

    function getTextSMMRY(text, lines) {
        //Set up API constants
        SM_API_URL = "http://api.smmry.com/";
        SM_API_KEY = "0C05A0A3E9"; // Mandatory, N represents your registered API key.
        // SM_URL = X // Mandatory, X represents the webpage to summarize.
        SM_LENGTH = lines; // Optional, N represents the number of sentences returned, default is 7
        // SM_KEYWORD_COUNT = N // Optional, N represents how many of the top keywords to return
        // SM_QUOTE_AVOID     // Optional, summary will not include quotations
        // SM_WITH_BREAK      // Optional, summary will contain string [BREAK] between each

        //make formatted API request
        var result;
        return Promise.resolve($.ajax({
            url: SM_API_URL + "&SM_API_KEY=" + SM_API_KEY +
                "&SM_LENGTH=" + SM_LENGTH,
            type: "POST",
            data: { sm_api_input: text },
            dataType: "json",
            success: handleTextSMMRYAsync,
            error: function(xhr, status, error) {
                console.log("Error: " + xhr.responseText)
            }
        }));
    }




    //clean up good result and just spit out the text.
    // return result.sm_api_content
    // console.log("We got this:" + result);
    //return resulting API text
    $("#submitbtn1").click(function() {
        // $(body).css("background-color", "blue");
        //get the text from the text area
        var text = $('textarea#textarea1').val();

        // //call smmry
        //reutrns a promise
        if (text.length < 40) {
            console.log(TEXT_TOO_SHORT_ERROR);
            $('textarea#textarea1').val(TEXT_TOO_SHORT_ERROR);
            $('textarea#textarea1').select();
            return;
        }
        $("#submitbtn1").fadeOut(800);
        $("#loader").fadeIn(800);
        verbocity = $("#selverbocity").val();
        console.log("Verbocity is: " + verbocity);
        getTextSMMRY(text, verbocity);

        // console.log(text)
        // alert(summary);
        // while(1);
    });
    //alert("opened page");
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
        console.log(info);
        //update text area
        $('textarea#textarea1').val(info);
        $('textarea#textarea1').trigger('autoresize');
        $('label[for="textarea1"]').attr('class', 'active');
        //call smmry
        //var summary = getTextSMMRY(info);
    }

    //sent message to backgroundjs asking for selectionText
    chrome.runtime.sendMessage({ msg: 'selectionText' }, setSelectionText);

}
