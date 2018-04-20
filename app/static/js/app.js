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
            <li v-if="token" class="nav-item active">
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
            token: localStorage.token
        }
    }
});

Vue.component('app-footer', {
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; Flask Inc.</p>
        </div>
    </footer>
    `
});

const Home = Vue.component('home', {
   template: `
    <div class="row landing-container">
        <div class="col-md-4 landing-container-child" style="margin-left: 15%;">
            <img src="/static/images/landing.jpg" id="landing-img"/>
        </div>
        <div class="col-md-4  landing-container-child float-clear">
          <div class="card" style="width: 28rem; height: 23rem; box-shadow: 2px 2px 10px grey;">
            <img class="card-img-top" src="static/images/photogramLogo.png" alt="Card image cap" style="width: 60%; margin: 0 auto; padding-top: 20px;">
            <div class="card-body" style="padding-top: 0px;">
              <hr>
              <p class="card-text">Share photos of your favourite moments with friends, family and the world.</p>
              <div style="margin-top: 20%;">
                  <button class="btn btn-success col-md-5">Register</button>
                  <button class="btn btn-primary col-md-5">Login</button>
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


// Define Routes
const router = new VueRouter({
    routes: [
        { path: "/", component: Home },
        { path: "/register", component: Register},
        { path: "/login",},
        {path: "/logout",},
        {path: "explore"},
        
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});