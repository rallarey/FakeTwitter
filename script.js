
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

let renderTweet = (tObj, tweetID)=>{
  $("#alltweets").prepend(`
<div class="card mb-3 tweet" data-uuid="${tweetID}" style="max-width: 540px;">
  <div class="row g-0">
    <div class="col-md-4">
      <img src="${tObj.author.pic}" class="img-fluid rounded-start" alt="...">
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">${tObj.author.handle}</h5>
        <p class="card-text">${tObj.content}</p>
        <p class="card-text like-button" data-tweetid="${tweetID}"></p>
        <p class="card-text"><small class="text-muted">Tweeted at ${new Date(tObj.timestamp).toLocaleString()}</small></p>
      </div>
    </div>
  </div>
</div>
  `);
  firebase.database().ref("/likes").child(tweetID).child("likes").on("value", ss=>{
    $(`.like-button[data-tweetid=${tweetID}]`).html(`${ss.val() || 0} Likes`);
  });
}

let renderLogIn = ()=>{
  $("body").html(`
  <div class = "log-in">
    <div class = "container">
      <div class="row align-items-center">
        
        <div class = "col">
          <h3>Login</h3>
          <input type = "text" placeholder = "Email" id = "user-email" class = form-control mb-3">
          <input type = "password" placeholder = "Password" id = "user-password" class = form-control mb-3">
          <br>
            <i>
              <small id = "signinpage">Go back </small>
            </i>
            <small>
              <input type="checkbox" id = "checkbox2"> Show Password
            </small>
          </br>
          <button type = "text" id = "loginbutton" class = "btn btn-outline-primary mb-3">Login</button>
          <button type = "text" id = "login2" class = "btn btn-outline-primary mb-3">Google</button>
        </div>

      </div>
    </div>
  </div>

  `);

  $("#checkbox2").on("click", ()=>{
    var x = document.getElementById("user-password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  })

  $("#login2").on("click", ()=>{
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then((result)=>{
        var credential = result.credential;
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        var userName = user["displayName"];
        var avatar = user["photoURL"];
        var email = user["email"];
        var uid = user["uid"];
        writeUserData(uid, userName, email);
      }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
      });
  });

  $("#signinpage").on("click", ()=>{
    renderSignIn();
  });

  $("#loginbutton").on("click", ()=>{

    var userEmail = $("#user-email").val();
    var userPassword = $("#user-password").val();

    auth.signInWithEmailAndPassword(userEmail, userPassword)
      .then((userCredential)=> {
        var user = userCredential.user;
      })
      .catch((error)=>{
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
      });
  });
}

let renderSignIn = ()=>{
  $("body").html(`
  <div class = "sign-in">
    <div class = "container">
      <div class="row align-items-center">
        <div class="col">
          <h3>Sign Up</h3>
          
          <input type = "text" placeholder = "Fullname" id = "new-user-name" class = form-control mb-3">
          
          <input type = "text" placeholder = "Email" id = "new-user-email" class = form-control mb-3">
          <!--
          <input type = "text" placeholder = "Username" id = "userInp" class = form-control mb-3">
          -->
          <input type = "password" placeholder = "Password" id = "new-user-password" class = form-control mb-3">
          <input type = "password" placeholder = "Confirm Password" id = "confirm-password" class = form-control mb-3">
          <br>
            <i>
              <small id = "loginpage">Already have an account?</small>
            </i>
            <small>
              <input type="checkbox" id = "checkbox"> Show Password
            </small>
          </br>
    
          <button type = "text" id = "signup" class = "btn btn-outline-primary mb-3">Sign Up</button>
          <button type = "text" id = "login" class = "btn btn-outline-primary mb-3">Google</button>
        </div>

      </div>
    </div>
  </div>


  `);

  $("#loginpage").on("click", ()=>{
    renderLogIn();
  })

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

    var userName = $("#new-user-name").val();

    if (userPassword === confirmPassword) {
      auth.createUserWithEmailAndPassword(userEmail, userPassword)
        .then((userCredential)=> {
          var user = userCredential.user;
          let myuid = user.uid;
          writeUserData(myuid, userName, userEmail);
        })
        .catch((error)=>{
          var errorCode = error.code;
          var errorMessage = error.message;
          alert(errorMessage);
        });
    } else {
      window.alert("Passwords must match!");
    }
  });

  $("#login").on("click", ()=>{
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then((result)=>{
        var credential = result.credential;
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        var userName = user["displayName"];
        var avatar = user["photoURL"];
        var email = user["email"];
        var uid = user["uid"];
        writeUserData(uid, userName, email);
      }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
      });
  });

}

let writeUserData = (userId, name, email) => {
  let usersRef = firebase.database().ref('/users/' + userId);

  usersRef.update({
    username: name,
    email: email,
    /*
    profile_picture : imageUrl
    */
  })
}


let renderPage = (loggedIn)=>{
  let myuid = loggedIn.uid;

  
  $("body").html(`

  <div class="row align-items-center">
    <div class="col"> 
      <h3>Tweet</h3>
      <input type = "text" id = "addme">
      <button id = "sendit">Tweet</button>
      <br>
      </br>
      <div id = "alltweets"></div>
      <button id = "logout">LOG OUT</button>
    </div>
  </div>

  `);


  $("#logout").on("click", ()=>{
    firebase.auth().signOut();
  });

  var userEmail;

  /*
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
*/
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
    renderSignIn();
  } else {
    renderPage(user);
  }
})
