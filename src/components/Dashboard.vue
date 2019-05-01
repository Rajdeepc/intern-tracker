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
      <a class="float-right" v-on:click="navitageToAllStatus(getUsername)">
        <span>GoTo All Status Page</span>
        <i class="fa fa-arrow-right" aria-hidden="true"></i>
      </a>

      <p>
        Welcome
        <b>{{getUsername}}</b>,
      </p>
      <p></p>
      <div class="selectProject">
        Select Your Project:
        <select v-model="projectSelected" @change="showSkillsListToSelect()">
          <option disabled value>Please select one project</option>
          <option
            :value="status"
            v-for="(status,index) in projectList"
            :key="index"
          >{{ status.project_name }}</option>
        </select>
      </div>
      <br>
      <!-- task array -->
      <div  v-if="taskDetailsShow === true">
      <h4>Your Tasks</h4>
      <b-row>
        <b-col col md="3" v-for="(taskItem,index) in this.tasksArray" :key="taskItem.id">
          <TaskItem
            :projectSelected="projectSelected"
            :taskItemDetails="taskItem"
            :index="index"
            :getUsername="getUsername"
          ></TaskItem>
        </b-col>
        <!-- completed tasks -->
      </b-row>
      </div>
      <br>
      <!-- add status for today component -->
      <AddStatus
        v-if="skillTemplateShow === true"
        :projectSelected="projectSelected"
        :getUsername="getUsername"
      ></AddStatus>
    </div>
    <AdminPanel v-if="showAdminbtn" :getUsername="getUsername"></AdminPanel>
  </div>
</template>


<script>
import AddStatus from "./AddStatus.vue";
import AdminPanel from "./AdminPanel.vue";
import DataPostApi from "../services/api/loginValidation";
import router from "../router.js";
import constants from "../utils/constants";
import TaskItem from './TaskItemComponent.vue';

export default {
  name: "Dashboard",
  props: [],
  data() {
    return {
      projectSelected: this.projectSelectedItem,
      skillTemplateShow: false,
      taskDetailsShow:false,
      projectList: [],
      occuranceList: [],
      getUsername: "",
      showAdminbtn: false,
      tasksArray: []
    };
  },
  mounted() {
    this.getUsername = this.$route.params.username;
    this.init();
  },
  components: {
    AddStatus: AddStatus,
    AdminPanel: AdminPanel,
    TaskItem:TaskItem
  },
  beforeCreate: function() {
    if (!this.$session.exists("username")) {
      this.$router.push("/");
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
    showSkillsListToSelect(e) {
      this.taskDetailsShow = true;
    },
    init() {
      this.checkisAdmin(this.getUsername);
      this.getTaskDetailsFromAPI(this.getUsername);
    },

    getTaskDetailsFromAPI(){
      DataPostApi.projectDetailsApi(this.getUsername)
        .then(response => {
          console.log(
            "reposne from project list api" + JSON.stringify(response.data[0])
          );
          this.projectList = response.data;
          this.tasksArray = response.data[0].allTasks;
          console.log("tasks array" + JSON.stringify(this.tasksArray));
          console.log("Project List" + this.projectList);
        })
        .catch(error => {
          throw error;
        });
    },

    clearSessionLogout: function() {
      this.$session.remove("username");
      this.$router.push("/");
    }
  }
};
</script>

<style scoped>
.navbar-dark .navbar-text {
  color: #fff;
}
</style>

