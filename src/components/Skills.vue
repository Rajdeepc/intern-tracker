<template>
  <div class="hello">
   <div class="holder">
       <h4>Project Details:</h4>
     <b-card>
     <b-container class="bv-example-row">
           
    <b-row>
        <b-col>Project:{{projectSelected.project_name}} </b-col>
        <b-col>Manager:{{projectSelected.manager_name}} </b-col>
        <b-col>Date: {{new Date}} </b-col>
    </b-row>
</b-container>
     </b-card>
<br>
<Chatpanel />
</div>
  </div>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import Chatpanel from "./Editable.vue";

export default {
  name: "Skills",
  props: ["projectSelected"],
  data() {
    return {
      
    };
  },
  components: {
    Datepicker,
    Chatpanel
  },
  watch: {
    projectSelected: {
      handler: function(projectSelected) {
        console.log(projectSelected);
      },
      immediate: true
    }

  },
  methods: {
   
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "https://cdn.jsdelivr.net/npm/animate.css@3.5.1";
@import "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";
</style>
