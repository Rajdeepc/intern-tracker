<template>
  <div class="dashboard">
    <b-navbar type="dark" variant="info" fixed="top">
  <h4>Submit Your Status</h4>
      <b-button @click="clearSessionLogout">Logout</b-button>
    </b-navbar>
    <div class="container">
      <!-- <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
              <div class="container-fluid">
              </div>
          </nav> -->
  
      <br>
      <p>Welcome <b>{{getUsername}}</b>,
        <p>
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
  </div>
</template>


<script>
  import AddStatus from "./AddStatus.vue";
  import DataPostApi from "../services/api/loginValidation";
  
  export default {
    name: "Dashboard",
    props: [],
    data() {
      return {
        projectSelected: this.projectSelectedItem,
        skillTemplateShow: false,
        projectList: [],
        getUsername: ''
      };
    },
    mounted() {
      this.getUsername = this.$route.params.username;
      this.init();
  
    },
    components: {
      AddStatus: AddStatus
    },
    beforeCreate: function() {
      if (!this.$session.exists('username')) {
        this.$router.push('/')
      }
    },
    methods: {
      showTableToEnterData(e) {
        this.skillTemplateShow = true;
      },
      init() {
        console.log(this.getUsername);
        DataPostApi.projectDetailsApi(this.getUsername)
          .then(response => {
            this.projectList = response.data;
            console.log(this.projectList);
          }).catch(error => {
            throw error;
          })
      },
      clearSessionLogout: function() {
        this.$session.remove('username');
        this.$router.push('/')
      }
    }
  };
</script>

