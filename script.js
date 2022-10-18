
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBgQyRNg9LuUQJzg6zl7AB6GQfsQqtwgxc",
    authDomain: "twitter-4f92d.firebaseapp.com",
    databaseURL: "https://twitter-4f92d-default-rtdb.firebaseio.com",
    projectId: "twitter-4f92d",
    storageBucket: "twitter-4f92d.appspot.com",
    messagingSenderId: "444552325596",
    appId: "1:444552325596:web:d87dda56d190cd445c4719",
    measurementId: "G-VTRJQREXSD"
  };

  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

let toggleLike = (tweetRef, uid)=>{
  tweetRef.transaction((tObj) => {
    if (!tObj) {
      tObj = {likes: 0};
    }
    if (tObj.likes && tObj.likes_by_user[uid]) {
      tObj.likes--;
      tObj.likes_by_user[uid] = null;
    } else {
      tObj.likes++;
      if (!tObj.likes_by_user) {
        tObj.likes_by_user = {};
      }
      tObj.likes_by_user[uid] = true;
    }
    return tObj;
  });
}

let renderedTweetLikeLookup = {};

let renderTweet = (tObj, uuid)=>{
  $("#alltweets").prepend(`
<div class="card mb-3 tweet" data-uuid="${uuid}" style="max-width: 540px;">
  <div class="row g-0">
    <div class="col-md-4">
      <img src="${tObj.author.pic}" class="img-fluid rounded-start" alt="...">
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">${tObj.author.handle}</h5>
        <p class="card-text">${tObj.content}</p>
        <p class="card-text like-button" data-tweetid="${uuid}"></p>
        <p class="card-text"><small class="text-muted">Tweeted at ${new Date(tObj.timestamp).toLocaleString()}</small></p>
      </div>
    </div>
  </div>
</div>
  `);
  firebase.database().ref("/likes").child(uuid).child("likes").on("value", ss=>{
    $(`.like-button[data-tweetid=${uuid}]`).html(`${ss.val() || 0} Likes`);
  });
}
let renderLogin = ()=>{
  $("body").html(`
  <div class = "sign-in">
    <div class="row align-items-center">
      <div class="col">
        <h3>Sign Up</h3>
        <!--
        <input type = "text" placeholder = "Fullname" id = "new-user-name" class = form-control mb-3">
        -->
        <input type = "text" placeholder = "Email" id = "new-user-email" class = form-control mb-3">
        <!--
        <input type = "text" placeholder = "Username" id = "userInp" class = form-control mb-3">
        -->
        <input type = "password" placeholder = "Password" id = "new-user-password" class = form-control mb-3">
        <input type = "password" placeholder = "Confirm Password" id = "confirm-password" class = form-control mb-3">
        <button type = "text" id = "signup" class = "btn btn-outline-primary mb-3">Sign Up</button>
        <button type = "text" id = "login" class = "btn btn-outline-primary mb-3">Google</button>
        <input type="checkbox" id = "checkbox">Show Password
      </div>
    </div>
  </div>


  `);

  $("#checkbox").on("click", ()=>{
    var x = document.getElementById("new-user-password");
    var y = document.getElementById("confirm-password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
    if (y.type === "password") {
      y.type = "text";
    } else {
      y.type = "password";
    }
  })

  

  $("#signup").on("click", ()=>{

    var userEmail = $("#new-user-email").val();
    var userPassword = $("#new-user-password").val();
    var confirmPassword = $("#confirm-password").val();

    console.log(userEmail, userPassword, confirmPassword);
    if (userPassword === confirmPassword) {
      auth.createUserWithEmailAndPassword(userEmail, userPassword)
        .then((userCredential)=> {
          var user = userCredential.user;
        })
        .catch((error)=>{
          var errorCode = error.code;
          var errorMessage = error.message;
        });
    } else {
      window.alert("Passwords must match!");
    }
  });

  $("#login").on("click", ()=>{
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
  });
}

let renderPage = (loggedIn)=>{
  let myuid = loggedIn.uid;
  $("body").html(`

  <div class="row align-items-center">
    <div class="col"> 
      <h3>Tweet</h3>
      <input type = "text" id = "addme">
      <button id = "sendit">Send it</button>
      <button id = "nukes">Delete</button>
      <div id = "alltweets"></div>
      <button id = "logout">LOG OUT</button>
    </div>
  </div>

  `);

  $("#logout").on("click", ()=>{
    firebase.auth().signOut();
  });

  var userEmail;

  let rosterRef = firebase.database().ref("/roster");

  $("#sendit").on("click", ()=>{
    var thename = $("#addme").val();
    var person = {
      name: thename
    }
    let newPersonRef = rosterRef.push();
    newPersonRef.set(person);
  })

  rosterRef.on("child_added", (ss)=>{
    let rosterObj = ss.val();
    let theIDs = Object.keys(rosterObj);
    theIDs.map(anId=>{
      let thePlayer = rosterObj[anId];
      console.log(thePlayer);
      $("#alltweets").append(`<div>${thePlayer}</div>`);
    });
  });

  $("#nukes").on('click', ()=>{
    rosterRef.remove();
  })

  let tweetRef = firebase.database().ref("/tweets");
  tweetRef.on("child_added", (ss)=>{

    let tObj = ss.val();
    renderTweet(tObj, ss.key);
    $(".like-button").off("click");
    $(".like-button").on("click", (evt)=>{
      let clickedTweet = $(evt.currentTarget).attr("data-tweetid");
      let likesRef = firebase.database().ref("/likes").child(clickedTweet);
      toggleLike(likesRef, myuid);
    });
  });
};

firebase.auth().onAuthStateChanged(user=>{
  if (!user){
    renderLogin();
  } else {
    renderPage(user);
  }
})
