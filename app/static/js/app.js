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
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
        </ul>
      </div>
    </nav>
    `
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
    <div class="row container-center">
        <div class="col-md-4 container-child">
            <img src="/static/images/landing.jpg" id="landing-img"/>
        </div>
        <div class="col-md-4 container-child">
          <h1>insert form here</h1>  
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
        { path: "/", component: Home }
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});