<template>
    <div class="loginForm">
        <form class="form-horizontal" @submit="validateForm">
          <p v-if="errors.length">
            <b>Please fix the following errors</b>
            <ul>
              <li v-for="(data,index) in errors" :key='index'>{{data}}</li>
            </ul>
          </p>
            <div class="form-group">
               <label for="name">Email</label>
                <input class="form-control" type="text"  name="email" v-model="email" placeholder="Type your email id..">
            </div>
            <div class="form-group">
               <label for="name">Password</label>
                <input class="form-control" type="password" name="password"  v-model="password" id="" placeholder="Type your password..">
            </div>
            <div class="form-group">
              <input type="submit" value="submit"  class="btn btn-primary" >
               <input type="reset" value="Cancel" class="btn btn-danger">
            </div>
        </form>
    </div>
</template>


<script>
import DataPostApi from "../services/api/loginValidation";

export default {
  name: "Login",
  /**
   * lifecycle hook for data rendering
   */
  data() {
    return {
    errors:[],
    email:null,
    password:null
    }
  },
   /**
   * lifecycle hook for data rendering
   */
  created() {
   
  },


  /**
   * form validtion
   */
  methods: {
    validateForm: function(e) {
      if(this.email && this.password){
        this.callToValidateLogin(this.email,this.password);
      }
      this.errors = [];
      if(!this.email) {
        this.errors.push('Please type an email');
      }
      if(!this.password) {
        this.errors.push('Please type a password');
      }
      e.preventDefault();
    },
    callToValidateLogin: function(username,password) {
       DataPostApi.validateLogin(username,password)
      .then(response => {
        if(response.isLoginSuccess === true) {
          this.$router.push("/dashboard");
        } else {
           this.errors.push('Invalid Credentials');
        }
      })
      .catch(error => {
        // console.log("Response from Component" + error);
      });
    }
  }
};
</script>


<style scoped>
</style>
