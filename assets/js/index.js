// Initialize Firebase
var config = {
  apiKey: "AIzaSyBlKj2jRupVR1G_yBsZehTc8Et2o3P3WUA",
  authDomain: "litestrap-for-bootstrap.firebaseapp.com",
  databaseURL: "https://litestrap-for-bootstrap.firebaseio.com",
  projectId: "litestrap-for-bootstrap",
  storageBucket: "litestrap-for-bootstrap.appspot.com",
  messagingSenderId: "749716475249"
};
firebase.initializeApp(config);
var database = firebase.database();

//Handle login status
firebase.auth().onAuthStateChanged(user => {
  //If user is logged in
  if(user) {
    // Set username and image variables
    username = firebase.auth().currentUser.displayName;
    userImage = firebase.auth().currentUser.photoURL;
    // Display username and image in navbar
    $("#username").text(username);
    if (userImage != null ) {
      $("#user-image").attr("src",userImage);
    }
  // If user is not logged in
  } else {
    $("#username").text("Anonymous user");
    // Redirect to login page
    // window.location = 'login.html';  
  }
});

// Logout link
$(document).on("click", "#logout", function(event) {
  event.preventDefault(); 
  firebase.auth().signOut();
});

// Declare empty variables
var downloadURL;
var html;
var classes = [];
var tags = [];
var selectors = [];
var classesMatched;
var classesUnmatched

// Prepopulate CSS file with html and body tag properties
var css = "html{font-family:sans-serif;line-height:1.15;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;}body{margin:0;}";

// Upload CSS file
$(document).on("click", "#submit", function(event) {
  event.preventDefault();
  // Get a reference (timestamp) to the upload location from your firebase storage bucket
  var timestamp = Number(new Date());
  var storageRef = firebase.storage().ref(timestamp.toString());
  // Get upload button and add its contents to a variable
  var file_data = $("#upload").prop("files")[0];
  // Upload file to firebase
  var uploadTask = storageRef.put(file_data);
  // Listen for state changes, errors, and completion of the upload
  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    function(snapshot) {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, function(error) {
    switch (error.code) {
      case 'storage/unauthorized':
        console.log("User doesn't have permission to access the object");
        break;
      case 'storage/canceled':
        console.log("User canceled the upload");
        break;
      case 'storage/unknown':
        console.log("Unknown error occurred, inspect error.serverResponse");
        break;
    }
  }, function() {
    // Upload completed successfully, get download URL value
    downloadURL = uploadTask.snapshot.downloadURL;
    importHTML();
    console.log(uploadTask.snapshot);
  });
});

//Import HTML
function importHTML() {
  $.get(downloadURL, function(data) {
    html = $(data);
    // Loop through all items in html file and get class names
    $('*',html).each(function(){
      console.log($(this).prop("tagName"));
      if($(this).prop("tagName")!=""){tags.push($(this).prop("tagName").toLowerCase())};
      if(this.className!=""){classes.push(this.className)};
    });
    // Remove duplicate tags
    console.log(tags);
    tags = $.uniqueSort(tags);
    // Split up combo classes (separated by space) and remove duplicate classes
    classes = $.uniqueSort(classes.join(" ").split(" "));
    // Display the class list containers
    $(".selector-container").show();
    // Loop through database list of selectors
    database.ref("bs").on("value", function(snapshot) {
      for (i=1; i<1384; i++) {
        var selector = snapshot.child(i).val().selector;
        var declarations = snapshot.child(i).val().declarations;
        try {
          var appearances = $(selector, html).length;
        }
        catch(err) {
          console.log("Error with selector '" + selector + "' (" + err + ")");
        }
        if(appearances>0) {
          css = css + selector + "{" + declarations + "}";
        }

      }
    });

    //START COMMENTED OUT SECTION

    // // Lookup in database
    // database.ref("bootstrap").on("value", function(snapshot) {
    //   // Loop through tags
    //   for (i=0; i<tags.length; i++) {
    //     var tagBadge = $("<span class='badge badge-secondary'>");
    //     tagBadge.text(tags[i]);
    //     $("#tags").append(tagBadge);
    //     // Check if tag is in database
    //     if(snapshot.child(tags[i]).val() == null) {
    //       // Add badge to unmatched list
    //       $("#unmatched-tags").append(tagBadge);
    //     } else {
    //       var declarations = snapshot.child(tags[i]).val().declarations;
    //       // Add badge to matched list
    //       $("#matched-tags").append(tagBadge);
    //       // Populate CSS variable with correct syntax
    //       css = css + tags[i] + "{" + declarations + "}";
    //     }
    //   }
    //   // Loop through classes
    //   for (i=0; i<classes.length; i++) {
    //     // Create DOM element to insert into class list
    //     var classBadge = $("<span class='badge badge-secondary'>");
    //     classBadge.text(classes[i]);
    //     // Create name to lookup in DB
    //     var tempClass = "@" + classes[i];
    //     // Check if class is in database
    //     if(snapshot.child(tempClass).val() == null) {
    //       // Add badge to unmatched list
    //       $("#unmatched-classes").append(classBadge);
    //     } else {
    //       var declarations = snapshot.child(tempClass).val().declarations;
    //       // Add badge to matched list
    //       $("#matched-classes").append(classBadge);
    //       // Populate CSS variable with correct syntax
    //       css = css + "." + classes[i] + "{" + declarations + "}";
    //     }
    //   }

    //   // Download CSS file without uploading to Firebase

    //   // var hiddenElement = document.createElement('a');
    //   // hiddenElement.href = 'data:attachment/text,' + encodeURI(css);
    //   // hiddenElement.target = '_blank';
    //   // hiddenElement.download = 'myFile.css';
    //   // hiddenElement.click();


    //   // Upload CSS file to Firebase Storage
    //   // Get a reference (timestamp) to the upload location from your firebase storage bucket
    //   var timestamp = Number(new Date());
    //   var storageRef = firebase.storage().ref(timestamp.toString());
    //   //Set metadata
    //   var metadata = {
    //     contentType: 'text/css'
    //   };
    //   // Upload file to firebase
    //   var uploadTask = storageRef.putString(css,'raw',metadata);
    //   // Listen for state changes, errors, and completion of the upload
    //   uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    //     function(snapshot) {
    //       // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    //       var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //       console.log('Upload is ' + progress + '% done');
    //       switch (snapshot.state) {
    //         case firebase.storage.TaskState.PAUSED: // or 'paused'
    //           console.log('Upload is paused');
    //           break;
    //         case firebase.storage.TaskState.RUNNING: // or 'running'
    //           console.log('Upload is running');
    //           break;
    //       }
    //     }, function(error) {
    //     switch (error.code) {
    //       case 'storage/unauthorized':
    //         console.log("User doesn't have permission to access the object");
    //         break;
    //       case 'storage/canceled':
    //         console.log("User canceled the upload");
    //         break;
    //       case 'storage/unknown':
    //         console.log("Unknown error occurred, inspect error.serverResponse");
    //         break;
    //     }
    //   }, function() {
    //     // Upload completed successfully, get download URL value
    //     downloadURL = uploadTask.snapshot.downloadURL;
    //     setDownloadButton();
    //   });
    // });

    //END COMMENTED OUT SECTION

  });
};

function setDownloadButton() {
  $("#download-info").text("Your custom Litestrap CSS file is ready")
  $("#download").attr({href:downloadURL, download:"litestrap.css"}).show();
};