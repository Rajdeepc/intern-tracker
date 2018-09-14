<template>
    <div class="dashboard">
        <h1>Dashboard Page</h1>
            <div class="selectProject">
            <select v-model="projectSelected" @change="showTableToEnterData()">
            <option disabled value="">Please select one project</option>
            <option :value="status" v-for="(status,index) in projectList" :key='index'>
                {{ status.project_name }}
            </option>
            </select>
            </div>
              <br>
            <skills v-if="skillTemplateShow === true" :projectSelected="projectSelected"></skills>
    </div>
</template>


<script>
import Skills from "./Skills.vue";
import DataPostApi from "../services/api/loginValidation";

export default {
  name: "Dashboard",
  props:["manager_name","projectList"],
  data() {
    return {
      projectSelected:this.projectSelectedItem,
      skillTemplateShow: false,
      projectList: []
    };
  },
  mounted(){
    this.init()
  },
  components: {
    skills: Skills
  },
  computed: {
    projectSelected: {
      get(){ return this.value },
      set(v){ console.log(v); this.$emit('input', v) }
    }
  },
  methods: {
    showTableToEnterData(e) {
      this.skillTemplateShow = true;
    },
    init(){
      DataPostApi.projectDetailsApi()
    .then(response => {
        this.projectList = response.data;
        console.log(this.projectList);
    }).catch(error => {
      throw error;
    })
    }
  }
};
</script>

