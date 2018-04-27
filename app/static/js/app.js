/* Add your Application JavaScript */
Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <img src='static/images/logo.png' class="small-logo"/>
      <a class="navbar-brand" href="#">Photogram</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
        </ul>
      </div>
      
        <ul class="navbar-nav">
            <li class="nav-item active">
                <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
            </li>
            <li class="nav-item active">
              <router-link class="nav-link" to="/explore">Explore</router-link>
            </li>
            <li class="nav-item active">
              <router-link class="nav-link" :to="{name: 'users', params: {user_id: cu_id}}">My Profile</router-link>
            </li>
            <li v-if="auth" class="nav-item active">
              <router-link class="nav-link" to="/logout">Logout</router-link>
            </li>
            <li v-else class="nav-item">
              <router-link class="nav-link active" to="/login">Login</router-link>
            </li>
        </ul>
    </nav>
    `,
    data: function(){
        return {
            auth: localStorage.hasOwnProperty("current_user"),
            cu_id: localStorage.hasOwnProperty("current_user") ? JSON.parse(localStorage.current_user).id : null
        }
    }
});

Vue.component('app-footer', {
    template: `
    <footer>
        <div class="container">
            
        </div>
    </footer>
    `
});

const Home = Vue.component('home', {
   template: `
    <div class="row landing-container">
        <div class="col-md-4 landing-container-child" style="margin-left: 11%;">
            <img src="/static/images/landing.jpg" id="landing-img"/>
        </div>
        <div class="col-md-4  landing-container-child float-clear">
          <div class="card" style="width: 28rem; height: 23rem; box-shadow: 2px 2px 10px grey;">
            <img class="card-img-top" src="static/images/photogramLogo.png" alt="Card image cap" style="width: 60%; margin: 0 auto; padding-top: 20px;">
            <div class="card-body" style="padding-top: 0px;">
              <hr>
              <p class="card-text">Share photos of your favourite moments with friends, family and the world.</p>
              <div style="margin-top: 20%;">
                  <router-link class="btn btn-success col-md-5" to="/register">Register</router-link>
                  <router-link class="btn btn-primary col-md-5" to="/login">Login</router-link>
              </div>
            </div>
          </div>  
        </div>
    </div>
   `,
    data: function() {
       return {}
    }
});


const Login = Vue.component('login', {
    template:`
      <div>
        <form id="login-form" @submit.prevent="login">
            <div class="card-header center">
              <strong>Login</strong>
            </div>
            <div class="card center">
              <div class="card-body login">
                <div style="margin-top:5%;">
                  <label for='username'><strong>Username</strong></label><br>
                  <input type='text' id='username' name='username' style="width: 100%;"/>
                </div>
                <div style="margin-top:5%;">
                  <label for='password'><strong>Password</strong></label><br>
                  <input type='password' id='password' name='password' style="width: 100%;"/>
                </div>
                <div style="margin-top:5%;">
                  <button id="submit" class="btn btn-success">Login</button> 
                </div>
                <div v-if='messageFlag' style="margin-top:5%;">
                  <div class="alert alert-danger center" style="width: 100%; margin-top: 5%;">
                    {{ message }}
                  </div>
                </div>
              </div>
            </div>
        </form>
      </div>
    `,
    methods:{
      login: function(){
        const self = this
        
        let login_data = document.getElementById('login-form');
        let login_form = new FormData(login_data);
        
        fetch("/api/auth/login",{
          method: "POST",
          body: login_form,
          headers: {
          'X-CSRFToken': token
          },
          credentials: 'same-origin'
        }).then(function(response){
          return response.json();
        }).then(function(jsonResponse){
          self.messageFlag = true;
          
          if(jsonResponse.hasOwnProperty("token")){
            cuser={"token":jsonResponse.token, id: jsonResponse.user_id};
            localStorage.current_user = JSON.stringify(cuser);
            
            router.go();
            router.push("/")
          }else{
            self.message = jsonResponse.errors
          }

        }).catch(function(error){
          self.messageFlag = false;
          console.log(error);
        });
      }
    },
    data: function(){
      return {
        messageFlag: false,
        message: ""
      }
    }
});

const Logout = Vue.component("logout", {
  template: `
  <div>
  <div/>`,
  created: function(){
    const self = this;
    
    fetch("api/auth/logout", {
      method: "GET"
    }).then(function(response){
      return response.json();
    }).then(function(jsonResponse){
      localStorage.removeItem("current_user");
      router.go();
      router.push("/");
    }).catch(function(error){
      console.log(error);
    });
  }
});


const NewPost = Vue.component('new-post', {
  template: `
  <div>
    <div v-if='messageFlag' >
      <div v-if="errorFlag">
        <div class="center" style="width: 100%; margin-top: 5%;">
          <ul class="alert alert-danger">
            <li v-for="error in message">
                {{ error }}
            </li>
          </ul>
        </div>
      </div>
      <div v-else class="alert alert-success center" style="width: 100%; margin-top: 5%;">
        {{ message }}
      </div>
    </div>
    
    <form class="center" id="npostform" @submit.prevent="submit">
      <div class="card-header center"><strong>New Post</strong></div>
      <div class="card center">
        <div class="card-body">
          	<label><strong>Photo</strong></label><br>
            <label class="btn" style="border: 0.5px solid black" for="photo"><strong>Browse</strong></label>
            <label>{{ filename }}</label>
            <br>
            <input type = "file" id="photo" style="display: none;" v-on:change="updateFilename"/>
            <label style="margin-top: 5%"><strong>Caption</strong></label><br>
            <textarea style="width:100%" placeholder="Write a caption..."></textarea>
            <button id="submit" class = "btn btn-success">Submit</button>
        </div>    
      </div>
    </form>
  </div>
  `,
  methods: {
    updateFilename :function(){
        const self = this
        let filenameArr = $("#photo")[0].value.split("\\");
        self.filename = filenameArr[filenameArr.length-1]
    },
    submit: function(){
      self = this;
      
      fetch(`/api/users/${JSON.parse(localStorage.user).id}/posts`,{
        method: "POST",
        headers: {
          "Authorization": `Bearer ${JSON.parse(localStorage.current_user).token}`
        },
        body: new FormData(document.getElementById("npostform")),
        headers: {
        'X-CSRFToken': token
        },
        credentials: 'same-origin'
        
      }).then(function(response){
        return response.json();
      }).then(function(jsonResponse){
        self.messageFlag = true;
        
        if(jsonResponse.hasOwnProperty("message")){
          self.message = jsonResponse.message
        }else{
          self.errorFlag = true;
          self.message= jsonResponse.errors;
        }
      }).catch(function(error){
        console.log(error);
      });
    }
  },
  data: function(){
    return {
      filename: 'No File Selected',
      messageFlag: false,
      errorFlag: false,
      message: ""
    }
  }
  
});

const Register=Vue.component("register",{
  
    
  template:`
        <div>
        <div v-if='messageFlag' >
        
            <div v-if="!errorFlag ">
                <div class="alert alert-success" >
                    {{ message }}
                </div>
            </div>
            <div v-else >
                <ul class="alert alert-danger">
                    <li v-for="error in message">
                        {{ error }}
                    </li>
                </ul>
            </div>
            
        </div>
        
          <div>
           <h1>Sign Up</h1>
        <form id="register" @submit.prevent="Register" enctype="multipart/form-data">
        <div>
            <label>Firstname:</label><br/>
            
           <input type='text' id='firstname' name='firstname' style="width: 100%;"/>
        </div>
        <div>
            <label>Lastname:</label><br/>
           <input type='text' id='lastname' name='lastname' style="width: 100%;"/>
        </div>
        <div>
            <label>Username:</label><br/>
           <input type='text' id='username' name='username' style="width: 100%;"/>
           
        </div>
        <div>
            <label>Password:</label><br/>
           <input type='password' id='password' name='password' style="width: 100%;"/>
        </div>
        <div>
            <label>Email:</label><br/>
           <input type='text' id='email' name='email' placeholder="jdoe@example.com" style="width: 100%;"/>
        </div>
        <div>
            <label>Location:</label><br/>
           <input type='text' id='location' name='location' style="width: 100%;"/>
        </div>
        <div>
            <label>Biography:</label><br/>
           <textarea name="biography"> </textarea><br/>
        </div>
        <div>
            <label for='photo' class='btn btn-primary'>Browse....</label> <span>{{ filename }}</span>
            
            <input id="photo" type="file" name='photo' style="display: none" v-on:change = "onFileSelected" /><br/>
            
        </div>
            
             <div>
                  <input type="submit" id="submit" class="btn btn-success" value="Sign Up" /> 
                </div>
            
        </form>
        </div>
    </div>
  `,
   methods: {
      Register : function(){
          let self = this;
          let register = document.getElementById('register');
          let form_data = new FormData(register);
          
          fetch("/api/users/register", {
              method: "POST",
              body: form_data,
              headers: {
              'X-CSRFToken': token
              },
              credentials: 'same-origin'
          }).then(function(response){
              return response.json();
          }).then(function (jsonResponse) {
              // display a success message
              self.messageFlag = true
              
              if (jsonResponse.hasOwnProperty("errors")){
                  self.errorFlag=true;
                  self.message = jsonResponse.errors;
              }else if(jsonResponse.hasOwnProperty("message")){
                  router.push("/login");
              }
        });
      },
      onFileSelected: function(){
        let self = this
        let filenameArr = $("#photo")[0].value.split("\\");
        self.filename = filenameArr[filenameArr.length-1]
      }
   },
   data: function(){
     return {
        errorFlag: false,
        messageFlag: false,
        message: [],
        filename: "No File Selected"
    }
   }
});
/*
const Explore=Vue.component("explore",{
  
  template:`<ul id="post">
  <div v-for="post in posts class="card" style="width: 18rem;>
  <div class="card-header"></div>
  <img class="card-img-top" src="user.photo" alt="user photo">
  <div class="card-body">
    <p class="card-text">{{user.post.text}}</p>
      <div class="card-footer" style="text-align:right">{{user.post.date}}</div>
      <div class="card-footer" style="text-align: left">{{user.post.likes}}</div>
    
  </div>
</div>
  </div>
 </ul>`,
 created() {
    this.property = 'Example property update.'
    console.log('propertyComputed will update, as this.property is now reactive.')
  }
}
  methods:{
    fetch("/api/posts",{
      method: "GET"
          credentials: 'same-origin'
          }).then(function(response){
              return response.json();
          }).then(function (jsonResponse) {
              // display a success message
              self.messageFlag = true
              if (jsonResponse.hasOwnProperty("errors")){
                  self.errorFlag=true;
                  self.message = jsonResponse.errors;
              }else if(jsonResponse.hasOwnProperty("message"))
      
      headers:{"Authorization":`Bearer ${localStorage.token}`
    })
  }
  
})*/


const Profile = Vue.component("profile",{
  template: `
  <div>
    <div class="card row" style="width:100%">
        <div class="card-body row profile-haeder" style="padding: 0;" >
          <img id="profile_image" class="col-md-2" v-bind:src=user.profile_image style="width: 100%; height: 15%" />
          <div id="profile_info" class="col-md-7" style="margin-top: 0px;padding-right: 0;">
            <strong><label>{{ user.firstname }}</label>
            <label>{{ user.lastname }}</label></strong>
            <div id="local" style="color: gray;">
              <label>{{ user.location }}</label><br>
              <label>{{ user.joined_on }}</label>
            </div>
            <p id="bio" style="color: gray;">
              {{ user.bio }}
            </p>
          </div>
          <div id="follows" class="col-sm-3" style="padding-left:  0; padding-right:  0;">
            <strong><label id="posts" class="col-md-5">{{ user.postCount }}</label>
            <label id="followers" class="col-md-5">{{ user.followers }}</label></strong> <br>
            <label class="col-md-5" style="color: gray; font-weight: 600; font-size: larger;">Posts</label>
            <label class="col-md-6" style="color: gray; font-weight: 600; font-size: larger;">Followers</label>
            <div v-if="cu_id">
              <label id="new-post-btn" class="btn btn-success" style="width:100%; margin-top: 17%;">New Post</label>
            </div>
            <div v-else>
              <label id="follow-btn" class="btn btn-primary" v-on:click="follow" style="width:100%; margin-top: 17%;">Follow</label>
            </div>
          </div>
        </div>
    </div>
    
    <div id="post-area" class="row" style="width:100%;">
      <div class="profile-post col-md-4" style="margin-top:3%;" v-for="post in user.posts">
          <img v-bind:src=post.photo style="width: 100%;" />
      </div>
    </div>
  </div>
  `,
  methods: {
    follow: function(){
      self = this;
      
      fetch(`/api/users/${self.user.id}/follow`,{
        method: "POST",
        headers: {
          "Authorization": `Bearer ${JSON.parse(localStorage.current_user).token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({"follower_id": self.current_user.id})
      }).then(function(response){
        if(resposne.hasOwnProperty("message")){
          $("#follow-btn")[0].innerHTML="Following";
          $("#follow-btn").removeClass("btn-primary");
          $("#follow-btn").addClass("btn-success")
          ++ self.user.followers;
        }
      }).catch(function(error){
        console.log(error)
      });
    }
  },
  created: function(){
    self = this;
    
    fetch(`/api/users/${self.$route.params.user_id}/posts`,{
      method: "GET",
      headers: {
        "Authorization": `Bearer ${JSON.parse(localStorage.current_user).token}`
      }
    }).then(function(response){
      return response.json();
    }).then(function(jsonResponse){
      self.user = jsonResponse.post_data;
    }).catch(function(error){
      console.log(error);
    });
  },
  data: function(){
    return {
      user: null,
      cu_id: (this.$route.params.user_id == JSON.parse(localStorage.current_user).id) ? true : false
    }
  }
});
   
// Define Routes
const router = new VueRouter({
    routes: [
        { path: "/", component: Home },
        { path: "/register", component: Register},
        { path: "/login", component: Login},
        // { path: "/explore", component: Explore},
        {path: "/users/:user_id", name:"users",component: Profile},
        {path: "/posts/new", component: NewPost},
        {path: "/logout", component: Logout}
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});