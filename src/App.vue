<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  // import Skills from './components/Skills.vue'
  import Login from './components/Login.vue'
  
  export default {
    name: 'app',
    components: {
      Login
    }
  }
</script>

<style>
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
  @import url('https://fonts.googleapis.com/css?family=Montserrat:400,700');
  body {
    background-color: #EEEEEE;
    display: grid;
    grid-template-rows: auto;
    justify-items: center;
    font-family: 'Roboto', sans-serif !important;
  }
  
  body,
  html {
    margin: 0;
    height: 100%;
    font-weight: 100;
  }
  
  #app {
    width: 100%;
  }
  
  .bodywrapper {
    padding: 3em 1em 1em;
  
  }
  
  nav {
    padding: 20px 20px 20px 0;
  }
  
  nav a {
    padding: 10px;
    text-decoration: none;
    background: #fff;
    border-radius: 3px;
    color: rgb(0, 110, 255);
    font-weight: bold;
    margin-right: 15px;
  }
    .width3{
        width: 3%
    }
    .width40{
        width: 40%
    }
    .width10{
        width: 10%
    }
    .width15{
        width:15%
    }
    .width30{
        width:30%
    }
    .width7{
        width:7%
    }
    .width15{
        width:15%
    }
    .width25{
        width:25%
    }
    .dashboard {
    background: #fafafa;
}
</style>
