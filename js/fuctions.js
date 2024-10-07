var baseUrl = 'https://pws.bizlr.net/';

function loadingStart(){
    $('.loadingDiv').removeClass('d-none');
}

function loadingStop(){
    $('.loadingDiv').addClass('d-none');
}

function signout(){
    localStorage.setItem("remedialUser","");
    window.location = 'login.html';
}

function successMessage(e){
    $('.output').html('');
    $('.output').addClass('alert-success');
    $('.output').html('<center><i class="bi bi-check2-circle"></i> '+e+'</center>');
    $('.output').removeClass("d-none");
    setTimeout(function(){ $(".output").addClass("d-none"); $('.output').removeClass("alert-success"); }, 2000);
}

function errorMessage(e){
    $('.output').html('');
    $('.output').addClass('alert-danger');
    $('.output').html('<center><i class="bi bi-x-circle"></i> '+e+'</center>');
    $('.output').removeClass("d-none");
    setTimeout(function(){ $(".output").addClass("d-none"); $('.output').removeClass("alert-danger"); }, 2000);
}

function infoMessage(e){
    $('.output').html('');
    $('.output').addClass('alert-primary');
    $('.output').html('<center><i class="bi bi-info-circle"></i> '+e+'</center>');
    $('.output').removeClass("d-none");
    setTimeout(function(){ $(".output").addClass("d-none"); $('.output').removeClass("alert-primary"); }, 5000);
}


function formatNumber(number) {
    if (number >= 1000000000) {
        return (number / 1000000000).toFixed(1) + 'B';
    } else if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + 'M';
    } else if (number >= 1000) {
        return (number / 1000).toFixed(1) + 'K';
    } else {
        return number.toString();
    }
}

function validation() {
  const remedialUser = localStorage.getItem('remedialUser');
  if (!remedialUser) {
    // Reload the page to index.html
    window.location.href = 'index.html';
  }
}



function sanitizeInput(input, allowEmail = false) {
  // Replace special characters to prevent XSS attacks
  let sanitizedInput = input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  // Remove whitespace characters from the beginning and end
  sanitizedInput = sanitizedInput.trim();

  // Allow "@" symbol if specified
  if (allowEmail) {
    sanitizedInput = sanitizedInput.replace('@', '&#64;');
  }

  // Prevent SQL injection by replacing single quotes
  sanitizedInput = sanitizedInput.replace(/'/g, "''");

  // Limit the input length to prevent buffer overflow
  const maxLength = 1000; // Set your desired maximum length
  const finalInput = sanitizedInput.slice(0, maxLength);

  // Remove potentially dangerous HTML tags
  const sanitizedHTML = finalInput.replace(/<[^>]*>/g, '');

  // Encode remaining HTML entities
  const encodedInput = encodeURIComponent(sanitizedHTML);

  return encodedInput;
}

function read_messages(postToken, userToken){
    var obj = {
        "postToken":postToken,
        "userToken":userToken
    }

    $.ajax({
        type: "POST",
        data: obj,
        url: baseUrl+"markAsRead.php",
        dataType: "json",
        success: function (response) {
        
            
        },
        
    });

}

function fetchFirstAid(){
    $.ajax({
        type: "GET",
        url: "../api/fetchFirstaid.json",
        dataType: "json",
        success: function (response) {
            $('#first-aid').html('');

            if(response.result != ""){
                var result = response.result;
                result.sort()
                for(i in result){
                    var obj = JSON.stringify(result[i]);
                    var firstaid = '<div class="firstaidone row p-3 fs-6 border-top mx-auto" description="'+result[i].firstAidDescription+'" firstAidLoad = "'+btoa(obj)+'">'+result[i].firstAidCase+'</div>';
                    $('#first-aid').append(firstaid);
                }

                $('.firstaidone').click(function(){
                    var firstAidcase = $(this).html();
                    var firstAidDescription = $(this).attr("description");
                    var firstAidData = $(this).attr("firstAidLoad");
                    localStorage.setItem("firstAidcase", firstAidcase);
                    localStorage.setItem("firstAidDescription",firstAidDescription);
                    localStorage.setItem("firstAidLoad",firstAidData);
                    window.location = "openFirstAid.html";
                    
                });
                
            }
            
        },
        error: function(data){
            var result = data.responseText;
            console.log(result);
            errorMessage("Error occured, please try again");
        }
    });
}

function formatDateTime(inputDateTime) {
    const currentDate = new Date();
    const inputDate = new Date(inputDateTime);

    const daysAgo = Math.floor((currentDate - inputDate) / (1000 * 60 * 60 * 24));

    if (daysAgo === 0) {
        // Same day
        const hours = inputDate.getHours();
        const minutes = inputDate.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        const formattedTime = `${(hours % 12) || 12}:${minutes.toString().padStart(2, '0')}${ampm}`;
        return `Today at ${formattedTime}`;
    } else if (daysAgo === 1) {
        // Yesterday
        const hours = inputDate.getHours();
        const ampm = hours >= 12 ? 'pm' : 'am';
        const formattedTime = `${(hours % 12) || 12}${ampm}`;
        return `Yesterday at ${formattedTime}`;
    } else if (daysAgo <= 7) {
        // Within the last 7 days
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
        return `${daysOfWeek[inputDate.getDay()]} at ${inputDate.getHours()}:${inputDate.getMinutes().toString().padStart(2, '0')}${inputDate.getHours() >= 12 ? 'pm' : 'am'}`;
    } else {
        // More than a week ago
        const day = inputDate.getDate();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${day}${day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th'} ${monthNames[inputDate.getMonth()]}`;
    }
}



function fetchEmergency(){
    $.ajax({
        type: "GET",
        url: "../api/fetchEmergency.json",
        dataType: "json",
        success: function (response) {
            $('#first-aid').html('');

            if(response.result != ""){
                var result = response.result;
                for(i in result){
                    var firstaid = '<div class="firstemergencyone row p-3 fs-6 border-top mx-auto" description="'+result[i].emergencyToken+'">'+result[i].emergency+'</div>';
                    $('#first-aid').append(firstaid);
                }

                $('.firstemergencyone').click(function(){
                    var firstAidcase = $(this).html();
                    var firstAidDescription = $(this).attr("description");
                    localStorage.setItem("emergencyContact", firstAidcase);
                    localStorage.setItem("emergencyToken",firstAidDescription);
                    window.location = "emergency2.html";
                });
                
            }
            
        },
        error: function(data){
            var result = data.responseText;
            console.log(result);
            errorMessage("Error occured, please try again");
        }
    });
}

function formatNumbers(number) {
    if (number >= 1000000000) {
        return (number / 1000000000).toFixed(1) + 'B';
    } else if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + 'M';
    } else if (number >= 1000) {
        return (number / 1000).toFixed(1) + 'K';
    } else {
        return number.toString();
    }
}

function goBack() {
    window.history.back();
}

function onBookmark(x){
    var messageToken = $(x).attr("tokenizer");
    
    console.log(messageToken);
    
    var obj = {
        "messageToken":messageToken,
        "userToken":localStorage.getItem("remedialUser"),
        "statusUpdate":1
    }
    
    var currNum = $('#bookMarker_'+messageToken).html();
    var newNum = Number(currNum) + 1;
    $('#bookMarker_'+messageToken).html(newNum);
    
    $('#tokenenizedBook_'+messageToken).html('<i class="bi bi-bookmark-check-fill text-success" tokenizer="'+messageToken+'" onclick="offBookmark(this)"></i>');
    
    $.ajax({
        type: 'POST',
        url: baseUrl+'bookmarkPost.php', // Replace with your API endpoint for signup
        data: obj,
        dataType:"json",
        success: function(response) {
          
        }
    });
    
}

function offBookmark(x){
    var messageToken = $(x).attr("tokenizer");
    
    var obj = {
        "messageToken":messageToken,
        "userToken":localStorage.getItem("remedialUser"),
        "statusUpdate":0
    }
    
    var currNum = $('#bookMarker_'+messageToken).html();
    var newNum = Number(currNum) - 1;
    $('#bookMarker_'+messageToken).html(newNum);
    $('#tokenenizedBook_'+messageToken).html('<i class="bi bi-bookmark" tokenizer="'+messageToken+'" onclick="onBookmark(this)"></i>');
    
    $.ajax({
        type: 'POST', 
        url: baseUrl+'bookmarkPost.php', // Replace with your API endpoint for signup
        data: obj,
        dataType:"json",
        success: function(response) {
          
        }
    });
    
}

function postPresentation(result){
    for(i in result){
        let trimmedText = result[i].message.trim();

        // Display the first 100 characters of the trimmed text
        let first100Characters = trimmedText.substring(0, 100);

        var views = formatNumbers(result[i].views);
        var comments = formatNumbers(result[i].comments);
        var bookmarks = formatNumbers(result[i].bookmark);
        var bookmarkStatus = '<i class="bi bi-bookmark"></i>';
        
        if(result[i].bookmarkStatus == 0){
            bookmarkStatus = '<i class="bi bi-bookmark" tokenizer="'+result[i].postToken+'" onclick="onBookmark(this)"></i>';
        }else{
            bookmarkStatus = '<i class="bi bi-bookmark-check-fill text-success" tokenizer="'+result[i].postToken+'" onclick="offBookmark(this)"></i>';
        }

        var body = '<div class="row border-top border-bottom border-1 py-3 px-2">';
                body += '<div class="row mb-2">';
                   body += '<div class="col-6">';
                    body += '<i class="bi bi-incognito"></i> <i class="bi bi-dot"></i> ';
                    body += result[i].country; 
                    body += '</div>';
                    body += '<div class="col-6">';
                    body += '<f class="badge alert-primary float-end" style="font-size: 12px;">'+result[i].tag+'</f>';
                   body += '</div>';
                body += '</div>';
                body += '<div class="postRow" postToken="'+result[i].postToken+'" country="'+result[i].country+'" message="'+result[i].message+'" postTime="'+result[i].time+'">';
                    body += first100Characters+'...';
                body += '</div>';
                body += '<div class="mt-2 text-end" style="font-size: 12px;">'+formatDateTime(result[i].time)+'</div>';
                body += '<div class="row mt-3">';
                    body += '<div class="col"><i class="bi bi-eye"></i> '+views+'</div>';
                    body += '<div class="col text-center"><i class=" bi bi-chat-quote"></i> '+comments+'</div>';
                    body += '<div class="col text-center" books="'+result[i].bookmark+'"><span id="tokenenizedBook_'+result[i].postToken+'">'+bookmarkStatus+'</span> <span id="bookMarker_'+result[i].postToken+'">'+bookmarks+'</span></div>';
                    var encoded = btoa(result[i].postToken);
                    body += '<div class="col text-end sharePost" postToken="readStory.php?+'+encoded+''+result[i].postToken+'"><i class=" bi bi-share"></i></div>';
                body += '</div>'; 
                body += '<div class="d-none postTokenizer">'+result[i].postToken+'</div>';
            body += '</div>';
            
        $('#postContent').append(body);
    }
    
    
    
    
    
    $('.sharePost').click(function(){
        var url = $(this).attr('postToken');
        
        if (navigator.share) {
          try {
            navigator.share({
              title: 'Paxify!',
              text: 'Check this story on Paxify',
              url: url
            });
            // successMessage('Content shared successfully');
          } catch (error) {
            errorMessage('Error sharing content:', error);
          }
        } else {
          errorMessage('Sharing is not supported on this device');
        }
    });

    $('.postRow').click(function(){
        var country = $(this).attr("country");
        var time = $(this).attr("postTime");
        var message = $(this).attr("message");
        var postToken = $(this).attr("postToken");
        localStorage.setItem("postCountry_"+postToken, country);
        localStorage.setItem("postTime_"+postToken,time);
        localStorage.setItem("postMessage_"+postToken,message);
        localStorage.setItem("postToken_"+postToken,postToken);
        var encoded = btoa(postToken);
        window.location = "readStory.html?"+encoded+''+postToken;
        
    });
                        
}

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}





function fetchProfileMetrics(){
    var obj = {
        "userToken": localStorage.getItem("remedialUser")
    }
    
    loadingStart();
    

    $.ajax({
        type: 'POST',
        url: baseUrl+'fetchProfileMetrics.php', // Replace with your API endpoint for signup
        data: obj,
        dataType:"json",
        success: function(response) {
          if(response.result === "success"){
            loadingStop();
            $('#posts').html(response.posts);
            $('#bookmarks').html(response.bookmarks);
          }else{
            errorMessage(response.result);
            loadingStop();
          }
        },
        error: function(data) {
          // Handle errors here
          errorMessage('Connection failed. Please try again later.');
          console.log(data.responseText)
          loadingStop();
        }
    });
}



function validateOTP(){
    const otpInputs = $('.otp-input');
    const otpValue = otpInputs
        .map(function() {
        return $(this).val();
        })
        .get()
        .join('');

    // Validate the OTP
    if (otpValue.length !== 4) {
        errorMessage('Please enter a valid OTP.');
        return false;
    }

    var email = localStorage.getItem("remedialUser");

    var obj = {
        "email":email,
        "otp":otpValue
    }

    loadingStart();
    // Call the API with the concatenated OTP value
    $.ajax({
        type: 'POST',
        url: baseUrl+'otp.php', // Replace with your API endpoint for OTP verification
        data: obj,
        dataType:"json",
        success: function(response) {
            
            if(response.result == "success"){
                successMessage('OTP validation successful!');
                window.location = 'welcome.html';
                localStorage.setItem("remedialUser",response.userToken);
            }else{
                errorMessage(response.result);
            }
            
            // You can perform any additional actions here based on the API response.
            loadingStop();
        },
        error: function(xhr, status, error) {
            errorMessage('OTP validation failed. Please try again later.');
            loadingStop();
        }
    });

}



