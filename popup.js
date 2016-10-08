window.onload = function() { //SMMRY API abstraction
    console.log("window opened")

    function getTextSMMRY(text) {
        //Set up API constants
        SM_API_URL = "http://api.smmry.com/"
        SM_API_KEY = "0C05A0A3E9" // Mandatory, N represents your registered API key.
            // SM_URL = X // Mandatory, X represents the webpage to summarize.
        SM_LENGTH = 5 // Optional, N represents the number of sentences returned, default is 7
            // SM_KEYWORD_COUNT = N // Optional, N represents how many of the top keywords to return
            // SM_QUOTE_AVOID     // Optional, summary will not include quotations
            // SM_WITH_BREAK      // Optional, summary will contain string [BREAK] between each
            //make formatted API request
        var result
        $.ajax({
            url: SM_API_URL + "&SM_API_KEY=" + SM_API_KEY +
                "&SM_LENGTH=" + SM_LENGTH +
                "&SM_WITH_BREAK",
            type: "POST",
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Expect:')
            },
            data: { sm_api_input: text },
            dataType: "text",
            success: function(res) {
            	console.log(res.responseText)
                result = res;

            },
            error: function(xhr, status, error) {
                console.log(xhr.responseText)
            }
        });
        console.log("We got this:" + result);
        //return resulting API text
    }
    $("#submitbtn1").click(function() {
        // $(body).css("background-color", "blue");

        console.log("clicked the button");
        //get the text from the text area
        var text = $('textarea#textarea1').val();
        console.log(text);

        // //call smmry
        var summary = getTextSMMRY(text);
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
