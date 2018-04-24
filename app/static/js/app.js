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
              <router-link class="nav-link" to="#">My Profile</router-link>
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
            auth: localStorage.hasOwnProperty("token")
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
                <div>
                  <label for='usrname'><strong>Username</strong></label><br>
                  <input type='text' id='usrname' name='username' style="width: 100%;"/>
                </div>
                <div>
                  <label for='passwd'><strong>Password</strong></label><br>
                  <input type='password' id='passwd' name='password' style="width: 100%;"/>
                </div>
                <div>
                  <button id="submit" class="btn btn-success">Login</button> 
                </div>
                <div v-if='messageFlag' >
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

        fetch("api/auth/login",{
          method: "POST",
          body: new FormData(document.getElementById('login'))
        }).then(function(response){
          return response.json()
        }).then(function(jsonResponse){
          self.messageFlag = true;

          if(jsonResponse.hadOwnProperty(token)){
            localStorage.token = jsonResponse.token
            router.go();
            router.push("/")
          }else{
            self.message = jsonResponse.message
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
  created: function(){
    const self = this;
    
    fetch("api/auth/logout", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.token}`
      },
      credentials: "same-origin"
    }).then(function(response){
      return response.json();
    }).then(function(jsonResponse){
      localStorage.removeItem("token");
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
          "Authorization": `Bearer ${localStorage.token}`
        },
        body: new FormData(document.getElementById("npostform"))
        
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
            <label for='profile_photo' class='btn btn-primary'>Browse....</label> <span>{{ filename }}</span>
            
            <input id="photo" type="file" name='photo' style="display: none" v-on:change = "onFileSelected" /><br/>
            
            <input type="submit" value="Upload" class="btn btn-success"/>
        </div>
            
             <div>
                  <button id="submit" class="btn btn-success">Sign Up</button> 
                </div>
            
        </form>
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
                "Authorization": `Bearer ${localStorage.token}`
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
                  self.errorFlag = false;
                  self.message = "Profile Successful created";
              }
        });
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
        {path: "/logout", component: Logout}
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});