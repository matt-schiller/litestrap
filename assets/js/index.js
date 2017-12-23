// Initialize Firebase
var config = {
  apiKey: "AIzaSyBehS1ZkgbQu3L5DOCuK94U-XnORSAaTDM",
  authDomain: "multiplayer-rps-game.firebaseapp.com",
  databaseURL: "https://multiplayer-rps-game.firebaseio.com",
  projectId: "multiplayer-rps-game",
  storageBucket: "multiplayer-rps-game.appspot.com",
  messagingSenderId: "91957864832"
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

