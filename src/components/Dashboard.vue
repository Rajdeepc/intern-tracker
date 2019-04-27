<template>
  <div class="dashboard">
    <b-navbar toggleable="md" type="dark" variant="dark">
  
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
  
      <b-nav-text>
        <h4>Accenture Status Tracker</h4>
      </b-nav-text>
  
      <b-collapse is-nav id="nav_collapse">
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-if="showAdminbtn">
            <b-btn v-b-modal.modallg variant="primary">Add Project</b-btn>
          </b-nav-item>
          <b-nav-item>
            <b-button @click="clearSessionLogout">Logout</b-button>
          </b-nav-item>
        </b-navbar-nav>
  
      </b-collapse>
    </b-navbar>
    <div class="bodywrapper">
          <a class="float-right" v-on:click="navitageToAllStatus(getUsername)"><span>GoTo All Status Page </span><i class="fa fa-arrow-right" aria-hidden="true"></i></a>

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
  import router from '../router.js';
  import constants from '../utils/constants';
  
  export default {
    name: "Dashboard",
    props: [],
    data() {
      return {
        projectSelected: this.projectSelectedItem,
        skillTemplateShow: false,
        projectList: [],
        occuranceList: [],
        getUsername: '',
        showAdminbtn: false
      };
    },
    mounted() {
      this.getUsername = this.$route.params.username;
      this.init();
    },
    components: {
      AddStatus: AddStatus,
      AdminPanel: AdminPanel
    },
    beforeCreate: function() {
      if (!this.$session.exists('username')) {
        this.$router.push('/')
      }
    },
    methods: {
  
      checkisAdmin(username) {
        let adminArray = constants.ADMIN_ARRAY;
        for (let i = 0; i < adminArray.length; i++) {
          if (adminArray[i] === username) {
            this.showAdminbtn = true;
            break;
          }
        }
      },
  
      navitageToAllStatus(username) {
        console.log("username ----------> ", username);
        this.$router.push({
          name: "findall",
          params: {
            username: username
          }
        });
      },
      showTableToEnterData(e) {
        this.skillTemplateShow = true;
      },
      init() {
        this.checkisAdmin(this.getUsername);
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

<style scoped>
  .navbar-dark .navbar-text {
    color: #fff;
  }
</style>

