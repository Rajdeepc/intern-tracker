<template>
  <div class="dashboard">
    <b-navbar toggleable="md" type="dark" variant="dark">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-nav-text>
        <h4>Accenture Training Tracker</h4>
      </b-nav-text>
      <b-collapse is-nav id="nav_collapse">
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item>
            <b-button @click="clearSessionLogout">Logout</b-button>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    
    <div class="bodywrapper container">
      <div class="clearfix">
      <div class="float-left">
        Welcome
        <b>{{getUsername}}</b>,
      </div>
       <div class="ribbon float-right" v-if="showAdminbtn">
        <div class="innerRibbon text-right">
        <b-button-group>
          <b-button variant="primary" @click="showModal">
            <i class="fa fa-plus" aria-hidden="true"></i>
            Add Project
          </b-button>
          <!-- <b-button variant="danger">
            <i class="fa fa-stop-circle-o" aria-hidden="true"></i>
            End Project
          </b-button> -->
        </b-button-group>
      </div>
    </div>
      </div>
      <br>
      <div class="selectProject" v-if="projectList.length">
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
      <div class="component" v-if="!projectList.length && !showAdminbtn">
        <div
          class="noProject text-center"
        >You have not been assigned any project yet.</div>
      </div>
      <!-- task array -->
      <div v-if="taskDetailsShow === true">
        <div class="component">
          <h4>Project Details:</h4>
          <b-list-group horizontal>
            <b-card>
              <b-row>
                <b-col>
                  <b>Project Selected:</b>
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
                  (For any queries)
                </b-col>
              </b-row>
            </b-card>
          </b-list-group>
        </div>
        <div class="component">
          <h4>Your Tasks</h4>
          <b-row>
            <b-col col md="3" v-for="(taskItem,index) in this.tasksArray" :key="taskItem.id">
              <TaskItem
                :projectSelected="projectSelected"
                :taskItemDetails="taskItem"
                :index="index"
                :getUsername="getUsername"
                @startedStatusObj="onClickChildStartedItem"
                @completedStatusObj="onClickChildCompletedItem"
              ></TaskItem>
            </b-col>
            <!-- completed tasks -->
          </b-row>
        </div>
        <!-- add status for today component -->
        <div class="component">
          <div v-if="(taskDetailsShow === true) && (addStatusTemplateShow === true)">
            <h4 v-if="this.showNoOfAddForm.length">Add Your Status For today:</h4>
            <b-row>
              <b-col col md="12" v-for="(addItem,index) in this.showNoOfAddForm" :key="addItem.id">
                <AddStatus
                  :addItemDetails="addItem"
                  :index="index"
                  :getUsername="getUsername"
                  @filteredObjFromChild="onClickChildTaskItem"
                ></AddStatus>
              </b-col>
            </b-row>
          </div>
        </div>

        <div class="component" v-if="this.statusArray.length">
          <h4>Your Status:</h4>
          <StatusGrid :projectSelected="projectSelected" :statusItemDetails="this.tasksArray"/>
        </div>
      </div>
    </div>
    <AdminPanel v-if="showAdminbtn" :getUsername="getUsername">
    </AdminPanel>
    <b-modal ref="my-modal" size="sm" title="Add New Project" hide-footer no-close-on-backdrop >
      <AddProjectModalTemplate @hideModalFromChild="hideModal"></AddProjectModalTemplate>
    </b-modal>
  </div>
</template>


<script>
import AddStatus from "./AddStatus.vue";
import AdminPanel from "./AdminPanel.vue";
import DataPostApi from "../services/api/loginValidation";
import router from "../router.js";
import constants from "../utils/constants";
import TaskItem from "./TaskItemComponent.vue";
import StatusGrid from "./StatusGrid.vue";
import AddProjectModalTemplate from './AddProjectModal.vue'

export default {
  name: "Dashboard",
  props: [],
  data() {
    return {
      modalShow: false,
      projectSelected: this.projectSelectedItem,
      addStatusTemplateShow: false,
      taskDetailsShow: false,
      projectList: [],
      occuranceList: [],
      getUsername: "",
      showAdminbtn: false,
      tasksArray: [],
      statusArray: [],
      objFromParent: [],
      showNoOfAddForm: []
    };
  },
  mounted() {
    this.getUsername = this.$route.params.username;
    this.init();
  },
  components: {
    AddStatus: AddStatus,
    AdminPanel: AdminPanel,
    TaskItem: TaskItem,
    StatusGrid: StatusGrid,
    AddProjectModalTemplate:AddProjectModalTemplate
  },
  beforeCreate: function() {
    if (!this.$session.exists("username")) {
      this.$router.push("/");
    }
  },
  methods: {
    showModal() {
     // console.log("modal should show")
         this.$refs['my-modal'].show();
    },
    hideModal(value){
      if(value === true){
         this.$refs['my-modal'].hide();
      }
    },
    onClickChildTaskItem(valueObj) {
      if (valueObj) {
        this.addStatusTemplateShow = true;
      }
      this.objFromParent = valueObj;
     // console.log("from child" + JSON.stringify(this.objFromParent)); // someValue
      this.getTaskDetailsFromAPI();
    },
    onClickChildStartedItem(valueItem){
      this.getTaskDetailsFromAPI();
    },
    onClickChildCompletedItem(valueChildItem){
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
     // console.log("new filtered array" + newFilteredArrayOnLoad);
      return newFilteredArrayOnLoad;
    },

    navitageToAllStatus(username) {
     // console.log("username ----------> ", username);
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
         // console.log("Response from API", response);
          this.projectList = response.data;
          this.tasksArray = response.data[0] ? response.data[0].allTasks : [];
          this.statusArray = this.getAllStatusinArray();
          this.showNoOfAddForm = this.filterObjWithStatusStarted();
          //console.log("this.tasksArray", this.tasksArray);
        })
        .catch(error => {
          throw error;
        });
    },

    getAllStatusinArray() {
      let newTempArray = [];
      this.tasksArray.map(item => {
        item.allStatus.map(newItem => {
          newTempArray.push(newItem);
        });
      });
     // console.log("newTempArray" + JSON.stringify(newTempArray));
      return newTempArray;
    },

    getPercentageCompleteToTasItem() {
      let newTempArrayOfPercentage = [];
      this.tasksArray.map(item => {
        let lastItem = item.allStatus.slice(-1).pop();
        newTempArray.push(lastItem);
      });
     // console.log("newTempArray" + JSON.stringify(newTempArrayOfPercentage));
      return newTempArrayOfPercentage;
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
.component {
  display: block;
  margin-top: 30px;
}
.component h4 {
  margin-bottom: 16px;
}
.innerRibbon .btn {
    margin-right: 10px;
}
</style>

