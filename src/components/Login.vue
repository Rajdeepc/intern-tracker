<template>
<div>
  <div class="heroimg text-center">
    <b-img center fluid :src="bgImg" alt="" class="bgImg"/>
  </div>
<b-card  bg-variant="light" text-variant="black"
            
            style="max-width: 30rem;margin:0 auto;"
            >
        <form class="form-horizontal" @submit="validateForm" @reset="resetForm">
          <p v-if="errors.length">
            <b>Please fix the following errors</b>
            <ul>
              <li v-for="(data,index) in errors" :key='index'>{{data}}</li>
            </ul>
          </p>
            <div class="form-group">
               <label for="name">Email/Username</label>
                <input class="form-control" type="text"  name="email" v-model="email" placeholder="Type your email id..">
            </div>
            <div class="form-group">
               <label for="name">Password</label>
                <input class="form-control" type="password" name="password"  v-model="password" id="" placeholder="Type your password..">
            </div>
            <div class="form-group">
              <input type="submit" value="Submit"  class="btn btn-primary" >&nbsp;&nbsp;
               <input type="reset" value="Reset" class="btn btn-danger">
            </div>
        </form>
</b-card>
</div>
</template>


<script>
import DataPostApi from "../services/api/loginValidation";
import bgImg from '../assets/New_Applied_Now.png';
export default {
  name: "Login",
  /**
   * lifecycle hook for data rendering
   */
  data() {
    return {
      bgImg:bgImg,
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

    resetForm: function(e) {
      e.preventDefault();
      this.email = '';
      this.password = '';
    },
    callToValidateLogin: function(username,password) {
       DataPostApi.validateLogin(username,password)
      .then(response => {
        if(response.saved === true) {
          this.$router.push({ name: "dashboard", params: {username: username } });
           this.$session.set('username', username);

        } else {
           this.errors.push('Invalid Credentials');
        }
      })
      .catch(error => {
        throw error;
      });
    }
  }
};
</script>


<style scoped>
.bgImg{
  height: 200px;
  max-width: 100%;
  margin-bottom: 30px;
}
</style>
