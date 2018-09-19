<template>
    <div class="dashboard">
       <div class="container">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div class="container-fluid">
                <!-- <a class="navbar-brand" href=""></a> -->
                <!-- <button @click="logout" class="btn float-right">Log Out</button> -->
                <button class="btn float-right" @click="clearSessionLogout">Logout</button>
            </div>
        </nav>
    </div>
        <h1>Status Submission Page</h1>
        <br>
        <p>Welcome <b>{{getUsername}}</b>,<p>
            <div class="selectProject">
            Select Your Project: <select v-model="projectSelected" @change="showTableToEnterData()">
            <option disabled value="">Please select one project</option>
            <option :value="status" v-for="(status,index) in projectList" :key='index'>
                {{ status.project_name }}
            </option>
            </select>
            </div>
              <br>
              <!-- add status for today component -->
            <AddStatus v-if="skillTemplateShow === true" :projectSelected="projectSelected" :getUsername="getUsername"></AddStatus>
            
    </div>
</template>


<script>
import AddStatus from "./AddStatus.vue";
import DataPostApi from "../services/api/loginValidation";

export default {
  name: "Dashboard",
  props:[],
  data() {
    return {
      projectSelected:this.projectSelectedItem,
      skillTemplateShow: false,
      projectList: [],
      getUsername:''
    };
  },
  mounted(){
    this.getUsername = this.$route.params.username;
    this.init();

  },
  components: {
    AddStatus: AddStatus
  },
   beforeCreate: function () {
    if (!this.$session.exists('username')) {
      this.$router.push('/')
    }
  },
  methods: {
    showTableToEnterData(e) {
      this.skillTemplateShow = true;
    },
    init(){
      console.log(this.getUsername);
      DataPostApi.projectDetailsApi(this.getUsername)
      .then(response => {
        this.projectList = response.data;
        console.log(this.projectList);
    }).catch(error => {
      throw error;
    })
    },
     clearSessionLogout: function () {
      this.$session.remove('username');
      this.$router.push('/')
    }
  }
};
</script>

