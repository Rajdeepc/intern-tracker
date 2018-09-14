<template>
    <div class="dashboard">
        <h1>Dashboard Page</h1>
            <div class="selectProject">
            <select v-model="projectSelected" @change="showTableToEnterData()">
            <option disabled value="">Please select one</option>
            <option :value="data.projectName" v-for="(data,index) in projectList" :key='index'>
                {{ data.projectName }}
            </option>
            </select>
            </div>
            <skills v-if="skillTemplateShow === true" :projectSelected="projectSelected"></skills>
    </div>
</template>


<script>
import Skills from "./Skills.vue";
export default {
  name: "Dashboard",
  data() {
    return {
        projectSelected:'',
      skillTemplateShow: false,
      projectName: "",
      projectList: [{ projectName: "HPE" }, { projectName: "TWIA" }]
    };
  },
  components: {
    skills: Skills
  },
  methods: {
    showTableToEnterData() {
      this.skillTemplateShow = true;
      console.log(this.projectSelected);
    }
  }
};
</script>

