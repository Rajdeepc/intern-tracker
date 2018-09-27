<template>
  <div class="dashboard">
    <b-navbar type="dark" variant="info" fixed="top">
      <h4>Submit Your Status</h4>
        <b-btn v-b-modal.modallg variant="primary">Open Admin</b-btn>
      <b-button @click="clearSessionLogout">Logout</b-button>
    </b-navbar>
    <div class="container">
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
           <AdminPanel :getUsername="getUsername"></AdminPanel>

  </div>
</template>


<script>
  import AddStatus from "./AddStatus.vue";
  import AdminPanel from "./AdminPanel.vue";
  import DataPostApi from "../services/api/loginValidation";
  
  export default {
    name: "Dashboard",
    props: [],
    data() {
      return {
        projectSelected: this.projectSelectedItem,
        skillTemplateShow: false,
        projectList: [],
        occuranceList:[],
        getUsername: ''
      };
    },
    mounted() {
      this.getUsername = this.$route.params.username;
      this.init();
      // DataPostApi.getUtterance()
      // .then(response => {
      //   this.occuranceList = response.data;
      //   console.log("converse list" + JSON.stringify(this.occuranceList));
      // }).catch(error => {
      //   throw error;
      // })
    },
    components: {
      AddStatus: AddStatus,
      AdminPanel:AdminPanel
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

