<template>
  <div class="loginWrapper">
    <div class="heroimg text-center">
      <!-- <h3>Accenture Digital - Mobile Application Studio</h3> -->
      <h5>Traning Tracking Application</h5>
    </div>
    <b-tabs>
      <b-tab title="Login">
        <b-card text-variant="black" style="max-width: 30rem;margin:0 auto;">
          <form class="form-horizontal" @submit="validateFormSignIn" @reset="resetForm('signIn')">
            <p v-if="errors.length">
              <b>Please fix the following errors</b>
              <ul>
                <li v-for="(data,index) in errors" :key='index'>{{data}}</li>
              </ul>
            </p>
            <div class="form-group">
              <label for="name">Email</label>
              <input class="form-control" type="text" name="username" v-model="username" placeholder="Type your email id..">
            </div>
            <div class="form-group">
              <label for="name">Password</label>
              <input class="form-control" type="password" name="password" v-model="password" placeholder="Type your password..">
            </div>
            <div class="form-group">
              <input type="submit" value="LogIn" class="btn btn-primary">&nbsp;&nbsp;
              <input type="reset" value="Reset" class="btn btn-danger">
            </div>
          </form>
        </b-card>
      </b-tab>
      <b-tab title="Sign Up" active>
        <b-card text-variant="black" style="max-width: 30rem;margin:0 auto;">
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
              <b-toast v-if="signUpText" id="sentDataSuccessToast" variant="success" solid>
                Sign Up Successful
              </b-toast>
              <b-toast v-if="!signUpText" id="sentDataSuccessToast" variant="warning" solid>
                Sign Up Not Successful,Duplicate Record found
              </b-toast>
              <!-- <p v-if="signUpText">Sign Up Successful</p>
                <p v-if="!signUpText">Sign Up Not Successful,Duplicate Record found</p> -->
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
        username: null,
        password: null,
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
        if (this.username && this.password) {
          this.calltoValidateLogin(this.username, this.password);
        }
        this.errors = [];
        if (!this.username) {
          this.errors.push("Please type an username");
        }
        if (!this.password) {
          this.errors.push("Please type a password");
        }
        e.preventDefault();
      },
      /**
       * Validate login and redirect to dashbaord
       */
      calltoValidateLogin: function(username, password) {
        DataPostApi.validateSignIn(username, password)
          .then(response => {
            if (response || !response) {
              this.$router.push({
                name: "dashboard",
                params: {
                  username: username
                }
              });
              this.$session.set("username", username);
            } else {
              this.errors.push("Invalid Credentials");
            }
          })
          .catch(error => {
            throw error;
          });
      },
  
      validateSignup: function(e) {
        this.errors = [];
        if (
          this.signup.email &&
          this.signup.username &&
          this.signup.password &&
          this.signup.confpassword
        ) {
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
  
      resetForm: function(isSigninForm) {
        this.isSigninForm = isSigninForm;
        if (isSigninForm == "signIn") {
          this.signin.email = "";
          this.signin.password = "";
        }
        if (isSigninForm == "signUp") {
          this.signup.email = "";
          this.signup.username = "";
          this.signup.email = "";
          this.signup.confpassword = "";
        }
      }
    }
  };
</script>


<style>
  .loginWrapper {
    background: url("../assets/loginback.jpg");
    background-size: cover;
    height: 100%;
  }
  
  .heroimg {
    color: #fff;
    padding: 3em 0em 0em;
  }
  
  .bgImg {
    height: 200px;
    max-width: 100%;
    margin-bottom: 30px;
  }
  
  #app .nav-tabs .nav-link.active,
  .nav-tabs .nav-item.show .nav-link {
    color: #fff;
    background-color:#007bff;
    border-color: #007bff;
  }
  
   #app .tabs .nav-tabs {
    border-bottom: 0;
}
  #app .tabs .nav-link {
    display: block;
    padding: .95rem .5rem;
    background: transparent;
  }
  
  #app .nav-tabs .nav-link {
    border: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  
  .tabs {
    width: 400px;
    margin: 3em auto;
    background: #fff;
  }
  
  i.fa.fa-heart {
    color: #f442ad;
  }
  
  .nav-tabs .nav-item {
    margin-bottom: -1px;
    width: 50%;
    text-align: center;
  }
  
  .infotitle {
    font-size: 12px;
    color: rgb(136, 136, 136);
    position: absolute;
    left: 0;
    right: 0;
    bottom: 5px;
  }
</style>
