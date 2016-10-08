//SMMRY API abstraction
function getTextSMMRY(text){
	//Set up API constants
	SM_API_URL="http://api.smmry.com/"
	SM_API_KEY="0C05A0A3E9"       // Mandatory, N represents your registered API key.
	SM_URL=X           // Mandatory, X represents the webpage to summarize.
	SM_LENGTH=N        // Optional, N represents the number of sentences returned, default is 7 
	SM_KEYWORD_COUNT=N // Optional, N represents how many of the top keywords to return
	// SM_QUOTE_AVOID     // Optional, summary will not include quotations
	// SM_WITH_BREAK      // Optional, summary will contain string [BREAK] between each
	//make formatted API request
	var result
	$.ajax({
		url:SM_API_URL + "&SM_API_KEY=" + SM_API_KEY +
						 "&SM_LENGTH=" + SM_LENGTH +
						 "&SM_WITH_BREAK",
		type:"POST",
		beforeSend:function(xhr){
			xhr.setRqequestHeader('Expect:')
		},
		data:{sm_api_input:text},
		dataType:"text",
		success: function (res){
			result = res;

		}
	});
	console.log("We got this:" + result);
	//return resulting API text
}
$("#submitbtn1").click(function() {
	alert("clicked the button");
	//get the text from the text area
    var text = $('textarea#textarea1').val();

    //call smmry
    var summary = getTextSMMRY(text);
    alert(summary);
});
alert("opened page");
