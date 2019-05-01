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
      <div v-if="taskDetailsShow === true">
        <h4>Project Details:</h4>
        <b-list-group horizontal>
          <b-card>
            <b-row>
              <b-col>
                <b>Project:</b>
                <!-- {{project_name}} -->
                {{projectSelected.project_name}}
              </b-col>
              <b-col>
                <b>Supervisor:</b>
                <!-- {{projectSelected.manager_name}} -->
                Bala Narasimhalu
                <a
                  href="mailto:n.balanarasimhalu@accenture.com?Subject=Need%20Clarification"
                >Email</a>
              </b-col>
            </b-row>
          </b-card>
        </b-list-group>
        <br>
        <br>
        <h4>Your Tasks</h4>
        <b-row>
          <b-col col md="3" v-for="(taskItem,index) in this.tasksArray" :key="taskItem.id">
            <TaskItem
              :projectSelected="projectSelected"
              :taskItemDetails="taskItem"
              :index="index"
              :getUsername="getUsername"
              @startedStatusObj="onClickChildTaskItem"
            ></TaskItem>
          </b-col>
          <!-- completed tasks -->
        </b-row>
      </div>
      <br>
      <!-- add status for today component -->
      <div v-if="(taskDetailsShow === true) && (addStatusTemplateShow === true)">
       <h4>Add Your Status For today:</h4>
      <b-row>
        <b-col col md="12" v-for="(addItem,index) in this.showNoOfAddForm" :key="addItem.id">
          <AddStatus
            :addItemDetails="addItem"
            
            :index="index"
          ></AddStatus>
        </b-col>
      </b-row>
    </div>
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
import TaskItem from "./TaskItemComponent.vue";

export default {
  name: "Dashboard",
  props: [],
  data() {
    return {
      projectSelected: this.projectSelectedItem,
      addStatusTemplateShow: false,
      taskDetailsShow: false,
      projectList: [],
      occuranceList: [],
      getUsername: "",
      showAdminbtn: false,
      tasksArray: [],
      objFromParent: [],
      showNoOfAddForm:[]
    };
  },
  mounted() {
    this.getUsername = this.$route.params.username;
    this.init();
  },
  components: {
    AddStatus: AddStatus,
    AdminPanel: AdminPanel,
    TaskItem: TaskItem
  },
  beforeCreate: function() {
    if (!this.$session.exists("username")) {
      this.$router.push("/");
    }
  },
  methods: {
    onClickChildTaskItem(valueObj) {
      if (valueObj) {
        this.addStatusTemplateShow = true;
      }
      this.objFromParent = valueObj;
      console.log("from child" + JSON.stringify(this.objFromParent)); // someValue
      this.getTaskDetailsFromAPI();
    },
    checkisAdmin(username) {
      let adminArray = constants.ADMIN_ARRAY;
      for (let i = 0; i < adminArray.length; i++) {
        if (adminArray[i] === username) {
          this.showAdminbtn = true;
          break;
        }
      }
    },
    filterObjWithStatusStarted() {
      let newFilteredArrayOnLoad = [];
      this.tasksArray.filter(obj => {
        if (obj.task_status === "Started") {
          this.addStatusTemplateShow = true;
          newFilteredArrayOnLoad.push(obj);
        }
      });
      console.log("new filtered array" + newFilteredArrayOnLoad);
      return newFilteredArrayOnLoad;
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

    getTaskDetailsFromAPI() {
      DataPostApi.projectDetailsApi(this.getUsername)
        .then(response => {
          console.log("Response from API", response);
          this.projectList = response.data;
          this.tasksArray = response.data[0].allTasks;
          this.showNoOfAddForm = this.filterObjWithStatusStarted();
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

