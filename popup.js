var TEXT_TOO_SHORT_ERROR = "Inputted text too short. You don't need to tl;dr that.";

window.onload = function() { //SMMRY API abstraction
    console.log("window opened")
        //https://github.com/Dogfalo/materialize/issues/1503

    function handleTextSMMRYAsync(res) {
        if (res) {
            if(!errorcheck(res)) {
                return res;
            }
            
        	console.log(res);
            // console.log(res);
            // console.log("just the text:...")
            console.log(res.sm_api_content);
           	// var lbefore =  $('textarea#textarea1').val.length();
            $('textarea#textarea1').val(res.sm_api_content);
            $('textarea#textarea1').trigger("autoresize");

            angular.element($("#angularupdate")).scope().update(res.sm_api_content);
            angular.element($("#angularupdate")).scope().$apply();

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

        console.log("clicked the button");
        //get the text from the text area
        var text = $('textarea#textarea1').val();
        console.log(text);

        $("#submitbtn1").fadeOut(800);
        $("#loader").fadeIn(800);

        // //call smmry
        //reutrns a promise
        if(text.length < 40) {
            console.log(TEXT_TOO_SHORT_ERROR);
            return;
        }
        getTextSMMRY(text, 1);

        // console.log(text)
        // alert(summary);
        // while(1);
    });
    //alert("opened page");

    function errorcheck(res) {
        if (!res.sm_api_error) {
            return true;
        }
        if(res.sm_api_error == 3) {
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
      //call smmry
      //var summary = getTextSMMRY(info);
    }

    //sent message to backgroundjs asking for selectionText
    chrome.runtime.sendMessage({msg: 'selectionText'}, setSelectionText);

}
