<template>
  <div class="hello">
   <div class="holder">
     <b-container class="bv-example-row">
    <b-row>
        <b-col>Project: {{}}</b-col>
        <b-col>Manager: {{}}</b-col>
        <b-col>Date: <datepicker></datepicker> </b-col>
    </b-row>
</b-container>
<!-- <form @submit.prevent="addSkill">
<input type="text" placeholder="enter a skill you have..." v-model="skill" v-validate="'min:5'" name="skill">

  <transition name="alert-in" enter-active-class="animated flipInX" leave-active-class="animated flipOutX">
    <p class="alert" v-if="errors.has('skill')">{{errors.first('skill')}}</p>
  </transition>
</form> -->
     <ul>
       <transition-group name="list" enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutDown">
       <li v-for="(data,index) in skills" :key='index'>
         {{data.skill}}
         <i class="fa fa-minus-circle" v-on:click="remove(index)"></i>
       </li>
       </transition-group>
     </ul>
</div>
   <p>These are the skills that you possess</p>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';

export default {
  name: "Skills",
  data() {
    return {
      skill: "",
      skills: [{ skill: "Vue.js" }, { skill: "FrontEnd Developer" }]
    };
  },
  components: {
    Datepicker
  },
  methods: {
    addSkill() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.skills.push({ skill: this.skill });
          this.skill = "";
        } else {
          console;
        }
      });
    },
    remove(id) {
      this.skills.splice(id, 1);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "https://cdn.jsdelivr.net/npm/animate.css@3.5.1";
@import "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";
.holder {
  background: #fff;
}
ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

ul li {
  padding: 20px;
  font-size: 1.3em;
  background-color: #e0edf4;
  border-left: 5px solid #3eb3f6;
  margin-bottom: 2px;
  color: #3e5252;
}
p {
  text-align: center;
  padding: 30px 0;
  color: gray;
}
.container {
  box-shadow: 0px 0px 40px lightgray;
}
input {
  width: calc(100% - 40px);
  border: 0;
  padding: 20px;
  font-size: 1.3em;
  background-color: #323333;
  color: #687f7f;
}
.alert {
  background: #fdf2ce;
  font-weight: bold;
  display: inline-block;
  padding: 5px;
  margin-top: -20px;
}
.alert-in-enter-active {
  animation: bounce-in 0.5s;
}
.alert-in-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
i {
  float: right;
  cursor: pointer;
}
</style>
