<template>
    <div class="dashboard">
        <h1>Dashboard Page</h1>
        <p>Hi {{getUsername}},<p>
            <div class="selectProject">
            <select v-model="projectSelected" @change="showTableToEnterData()">
            <option disabled value="">Please select one project</option>
            <option :value="status" v-for="(status,index) in projectList" :key='index'>
                {{ status.project_name }}
            </option>
            </select>
            </div>
              <br>
            <add-status v-if="skillTemplateShow === true" :projectSelected="projectSelected"></add-status>
            
    </div>
</template>


<script>
import AddStatus from "./AddStatus.vue";
import DataPostApi from "../services/api/loginValidation";

export default {
  name: "Dashboard",
  props:["manager_name"],
  data() {
    return {
      projectSelected:this.projectSelectedItem,
      skillTemplateShow: false,
      projectList: [],
      getUsername:''
    };
  },
  mounted(){
    this.init();
    this.getUsername = this.$route.params.username;

  },
  components: {
    addStatus: AddStatus
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

