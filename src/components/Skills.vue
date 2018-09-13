<template>
  <div class="hello">
   <div class="holder">
     <b-container class="bv-example-row">
    <b-row>
        <b-col>Project: </b-col>
        <b-col>Manager: </b-col>
        <b-col>Date: <datepicker></datepicker> </b-col>
    </b-row>
</b-container>
<br>
<Chatpanel />
</div>
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
import Chatpanel from './Editable.vue';

export default {
  name: "Skills",
  data() {
    return {
      skill: "",
      skills: [{ skill: "Vue.js" }, { skill: "FrontEnd Developer" }]
    };
  },
  components: {
    Datepicker,
    Chatpanel
  },
  methods: {
    addSkill() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.skills.push({ skill: this.skill });
          this.skill = "";
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

</style>
