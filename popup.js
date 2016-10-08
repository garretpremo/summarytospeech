window.onload = function() { //SMMRY API abstraction
    console.log("window opened")
        //https://github.com/Dogfalo/materialize/issues/1503
    function resizeTextArea(textarea) {
        var hiddenDiv = $('#textarea1').first();
        if (hiddenDiv.length) {
            hiddenDiv.css('width', textarea.width());
            textarea.css('height', hiddenDiv.height());
        }
    };

    function handleTextSMMRYAsync(res) {
        if (res) {
            // console.log(res);
            // console.log("just the text:...")
            console.log(res.sm_api_content);
            $('textarea#textarea1').val(res.sm_api_content);
            $(window).height(10);
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
        SM_API_URL = "http://api.smmry.com/"
        SM_API_KEY = "0C05A0A3E9" // Mandatory, N represents your registered API key.
            // SM_URL = X // Mandatory, X represents the webpage to summarize.
        SM_LENGTH = lines // Optional, N represents the number of sentences returned, default is 7
            // SM_KEYWORD_COUNT = N // Optional, N represents how many of the top keywords to return
            // SM_QUOTE_AVOID     // Optional, summary will not include quotations
            // SM_WITH_BREAK      // Optional, summary will contain string [BREAK] between each

        //make formatted API request
        var result
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

        // //call smmry
        //reutrns a promise
        getTextSMMRY(text, 2);

        // console.log(text)
        // alert(summary);
        // while(1);
    });
    //alert("opened page");

    //recieve text from context menu click
    function setSelectionText(info) {
      console.log(info);
      //update text area
      $('textarea#textarea1').val(info);
      $('textarea#textarea1').trigger('autoresize');
      //call smmry
      var summary = getTextSMMRY(info);
    }

    //sent message to backgroundjs asking for selectionText
    chrome.runtime.sendMessage({msg: 'selectionText'}, setSelectionText);

}
