<template>
    <div class="dashboard">
        <h1>Dashboard Page</h1>
            <div>
            <b-dropdown id="ddown1" text="Select Your Project" class="m-md-2">
                <b-dropdown-item v-on:click="showTableToEnterData()" v-for="(data,index) in projectList" :key='index'>{{ data.projectName }}</b-dropdown-item>
            </b-dropdown>
            </div>
        <skills v-if="skillTemplateShow === true"></skills>
    </div>
</template>


<script>
import Skills from "./Skills.vue";
export default {
  name: "Dashboard",
  data() {
      return {
      skillTemplateShow: false,
      projectName: "",
      projectList: [{ projectName: "HPE" }, { projectName: "TWIA" }]
      }
  },
  components: {
    'skills': Skills,
},
  methods: {
      showTableToEnterData(){
          this.skillTemplateShow = true;
      }
  }
};
</script>

