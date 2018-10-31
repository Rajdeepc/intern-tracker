<template>
  <div>
    <div class="heroimg text-center">
      <b-img center fluid :src="bgImg" alt="" class="bgImg" />
    </div>
    <b-tabs>
      <b-tab title="Login">
        <br>
        <b-card bg-variant="light" text-variant="black" style="max-width: 30rem;margin:0 auto;">
          <form class="form-horizontal" @submit="validateFormSignIn" @reset="resetForm('signIn')">
            <p v-if="errors.length">
              <b>Please fix the following errors</b>
              <ul>
                <li v-for="(data,index) in errors" :key='index'>{{data}}</li>
              </ul>
            </p>
            <div class="form-group">
              <label for="name">Email/Username</label>
              <input class="form-control" type="text" name="email" v-model="signin.email" placeholder="Type your email id..">
            </div>
            <div class="form-group">
              <label for="name">Password</label>
              <input class="form-control" type="password" name="password" v-model="signin.password" placeholder="Type your password..">
            </div>
            <div class="form-group">
              <input type="submit" value="LogIn" class="btn btn-primary">&nbsp;&nbsp;
              <input type="reset" value="Reset" class="btn btn-danger">
            </div>
          </form>
        </b-card>
      </b-tab>
      <b-tab title="Sign Up" active>
        <br>
        <b-card bg-variant="light" text-variant="black" style="max-width: 30rem;margin:0 auto;">
          <form class="form-horizontal" @submit="validateSignup" @reset="resetForm('signUp')">
            <p v-if="errors.length">
              <b>Please fix the following errors</b>
              <ul>
                <li v-for="(data,index) in errors" :key='index'>{{data}}</li>
              </ul>
            </p>
            <div class="form-group">
              <label for="name">Email</label>
              <input class="form-control" type="text" name="email" v-model="signup.email" placeholder="Type your email id..">
            </div>
            <div class="form-group">
              <label for="name">Username</label>
              <input class="form-control" type="text" name="username" v-model="signup.username" placeholder="Type your username..">
            </div>
            <div class="form-group">
              <label for="name">Password</label>
              <input class="form-control" type="password" name="password" v-model="signup.password" placeholder="Type your password..">
            </div>
            <div class="form-group">
              <label for="name">Confirm Password</label>
              <input class="form-control" type="password" name="confpassword" v-model="signup.confpassword" placeholder="Confirm your password..">
            </div>
            <div class="form-group">
              <input type="submit" value="SignUp" class="btn btn-primary">&nbsp;&nbsp;
              <input type="reset" value="Reset" class="btn btn-danger">
            </div>
            <div v-if="submitClicked">
              <p v-if="signUpText">Sign Up Successful</p>
              <p v-if="!signUpText">Sign Up Not Successful,Duplicate Record found</p>
            </div>
          </form>
        </b-card>
      </b-tab>
  
    </b-tabs>
  
  </div>
</template>


<script>
  import DataPostApi from "../services/api/loginValidation";
  import bgImg from "../assets/New_Applied_Now.png";
  export default {
    name: "Login",
    /**
     * lifecycle hook for data rendering
     */
    data() {
      return {
        bgImg: bgImg,
        errors: [],
        signin: {
          email: null,
          password: null
        },
        signup: {
          email: null,
          username: null,
          password: null,
          confpassword: null
        },
        signUpText: false,
        submitClicked: false
      };
    },
    /**
     * lifecycle hook for data rendering
     */
    created() {},
  
    /**
     * form validtion
     */
    methods: {
      /**
       * Validate login form submit
       */
      validateFormSignIn: function(e) {
        if (this.signin.email && this.signin.password) {
          this.calltoValidateLogin(this.signin.email, this.signin.password);
        }
        this.errors = [];
        if (!this.signin.email) {
          this.errors.push("Please type an email");
        }
        if (!this.signin.password) {
          this.errors.push("Please type a password");
        }
        e.preventDefault();
      },
      /**
       * Validate login and redirect to dashbaord
       */
      calltoValidateLogin: function(email, password) {
        DataPostApi.validateSignIn(email, password)
          .then(response => {
            if (response) {
              this.$router.push({
                name: "dashboard",
                params: {
                  username: username
                }
              });
              this.$session.set('username', username);
            } else {
              this.errors.push('Invalid Credentials');
            }
          })
          .catch(error => {
            throw error;
          });
      },
  
  
      validateSignup: function(e) {
         this.errors = [];
        if (this.signup.email && this.signup.username && this.signup.password && this.signup.confpassword) {
          if (this.signup.password === this.signup.confpassword) {
            this.submitSignupToDb(
              this.signup.email,
              this.signup.username,
              this.signup.password,
              this.signup.confpassword
            );
          } else {
             this.errors.push("Password doesnt match");
          }
        }
       
        if (!this.signup.email) {
          this.errors.push("Please type an email");
        }
        if (!this.signup.username) {
          this.errors.push("Please type an username");
        }
        if (!this.signup.password) {
          this.errors.push("Please type a password");
        }
        if (!this.signup.confpassword) {
          this.errors.push("Please confirm the password");
        }
        e.preventDefault();
      },
      /**
       * method to post signup data
       */
      submitSignupToDb: function(email, username, password, confpassword) {
        DataPostApi.addtosignupDb(email, username, password, confpassword)
          .then(response => {
            this.submitClicked = true;
            if (response.saved === true) {
              console.log("Response Saved to DB");
              this.signUpText = true;
            } else {
              this.signUpText = false;
            }
          })
          .catch(error => {
            throw error;
          });
        setTimeout(() => {
          this.submitClicked = false;
        }, 3000);
      },
  
      resetForm: function(e, isSigninForm) {
        e.preventDefault();
        this.isSigninForm = isSigninForm;
        if (isSigninForm == 'signIn') {
          this.signin.email = "";
          this.signin.password = "";
        }
        if (isSigninForm == 'signUp') {
          this.signup.email = "";
          this.signup.username = "";
          this.signup.email = "";
          this.signup.confpassword = "";
        }
      }
    }
  };
</script>


<style scoped>
  .bgImg {
    height: 200px;
    max-width: 100%;
    margin-bottom: 30px;
  }
</style>
