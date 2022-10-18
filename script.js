import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import * as rtdb from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

let db = rtdb.getDatabase(app);

let tweetJSON = {
  "content": "zeke is the best wizard101 player in the world!",
  "likes": -1,
  "retweets": 50,
  "timestamp": 1663335385014,
  //new Date().getTime(),
  "author": {
    "handle": "RyanAllarey",
    "pic":   "https://i.guim.co.uk/img/media/327e46c3ab049358fad80575146be9e0e65686e7/0_56_1023_614/master/1023.jpg?width=1200&quality=85&auto=format&fit=max&s=4592a7be8bdbebd0e0b97e5e10a6c433"
  }
};
/*
let tweetJSON1 = {
  "content": "zeke is the worst wizard101 player",
  "likes": -1,
  "retweets": 50,
  "timestamp": 1663335386014,
  //new Date().getTime(),
  "author": {
    "handle": "RyanAllarey",
    "pic":   "https://i.guim.co.uk/img/media/327e46c3ab049358fad80575146be9e0e65686e7/0_56_1023_614/master/1023.jpg?width=1200&quality=85&auto=format&fit=max&s=4592a7be8bdbebd0e0b97e5e10a6c433"
  }
};
let tweetJSON2 = {
  "content": "dream is so hot! omg #dream",
  "likes": -1,
  "retweets": 50,
  "timestamp": 1663335387014,
  //new Date().getTime(),
  "author": {
    "handle": "RyanAllarey",
    "pic":   "https://i.guim.co.uk/img/media/327e46c3ab049358fad80575146be9e0e65686e7/0_56_1023_614/master/1023.jpg?width=1200&quality=85&auto=format&fit=max&s=4592a7be8bdbebd0e0b97e5e10a6c433"
  }
};
let tweetJSON3 = {
  "content": "jadf;ajsdf",
  "likes": -1,
  "retweets": 50,
  "timestamp": 1663335388014,
  //new Date().getTime(),
  "author": {
    "handle": "RyanAllarey",
    "pic":   "https://i.guim.co.uk/img/media/327e46c3ab049358fad80575146be9e0e65686e7/0_56_1023_614/master/1023.jpg?width=1200&quality=85&auto=format&fit=max&s=4592a7be8bdbebd0e0b97e5e10a6c433"
  }
};
*/
let renderTweet = (tweetObj, uuid)=>{
  // prepend -> newer tweets on top
  $("#alltweets").prepend(` 
  <div class="card mb-3 tweet" data-uuid = "${uuid}" style="max-width: 540px;">
  <div class="row g-0">
    <div class="col-md-4">
      <img src="${tweetObj.author.pic}" class="img-fluid rounded-start" alt="...">
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">${tweetObj.author.handle}</h5>
        <p class="card-text">${tweetObj.content}</p>
        <!--<p class="card-text" like-button" data->tweetid="${uuid}">${tweetObj.likes} Likes</p>-->
        <p class="card-text"><small class="text-muted">Tweeted at ${new Date(tweetObj.timestamp).toLocaleString()}</small></p>
      </div>
    </div>
  </div>
</div>
  `);
}

/*
renderTweet(tweetJSON1);
renderTweet(tweetJSON2);
renderTweet(tweetJSON3);
*/


let tweetRef = rtdb.ref(db, "/tweets"); // "/tweets" is from database
// onValue vs onChildAdded
// onValue takes the entire thing
// onChildAdded fires once for each new key created under that
// e.g. for each new tweets data
rtdb.onChildAdded(tweetRef, (ss)=>{ 

  let tweetObj = ss.val();
  renderTweet(tweetObj, ss.key);
  $(".tweet").off("click");
  $(".tweet").on("click", (evt)=>{
    alert($(evt.currentTarget).attr("data-uuid"));
    //alert(tweetObj);
  });
});


/*
renderTweet(tweetJSON);
$(".tweet").on("click", (evt)=>{
  $(evt.currentTarget).addClass("clicked");
  //jQuery version below
  //$(evt.currentTarget).hide();
})
*/