<template>
  <div class="container-fluid">
    <b-alert :show="dismissCountDown" dismissible variant="primary">Save Successful</b-alert>
    <b-row>
      <b-col cols="5">
        <b-card>
          <form @submit.stop.prevent="handleSubmit" method="post">
            <p>
              <i>This panel is only visible to Admin</i>
            </p>
            <!-- <div class="form-group">
          <label for="exampleInputEmail1">Supervisor Name:</label>
          <input type="text" class="form-control" id="" v-model="getUsername" readonly="" name="manager_name" aria-describedby="emailHelp">
            </div>-->
            <b-row>
              <b-col>
                <div class="form-group">
                    <div class="projectDropdown">
                      Select A Project:
                      <select v-model="selectedProject" @change="selectProjectItem()">
                        <option disabled value>Please select one project</option>
                        <option
                          :value="projectItem"
                            v-for="(projectItem,index) in this.projectListArray"
                          :key="index"
                        >{{ projectItem.project_name }}</option>
                      </select>
                    </div>
                </div>
              </b-col>
              <b-col>
                <div class="form-group">
                  <div class="projectDropdown">
                      Select A Member:
                      <select v-model="selectedMember" @change="selectMember()">
                        <option disabled value>Please select one member</option>
                        <option
                          :value="memberItem"
                            v-for="(memberItem,index) in this.userIdsArray"
                          :key="index"
                        >{{ memberItem.email }}</option>
                      </select>
                    </div>
                </div>
              </b-col>
            </b-row>

            <!-- add tasks -->

            <b-row v-for="(newTask,index) in newTaskArray" :key="'TaskRow' + index">
              <b-col cols="11">
                <div class="form-group">
                  <label for="taskName">Task Name:</label>
                  <input
                    type="text"
                    class="form-control"
                    id
                    aria-describedby="addtasks"
                    placeholder="Enter Task Description"
                    v-model="taskArray[index]"
                  >
                </div>
              </b-col>
              <input type="hidden" v-model="taskArray[index]">
              <input type="hidden" v-model="taskArray[index]">
              <input type="hidden" v-model="taskArray[index]">
              <input type="hidden" v-model="taskArray[index]">
              <b-col cols="1">
                <div class="form-group">
                  <label for="taskName">&nbsp;</label>
                  <a v-on:click="removeTask(index);" style="cursor: pointer">
                    <i class="fa fa-trash fa-lg"></i>
                  </a>
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <a href="#" class="float-right" @click="addTasks()">
                  Add More
                  <i class="fa fa-plus"></i>
                </a>
              </b-col>
            </b-row>
            <br>
            <br>
            <b-row>
              <b-col>
                <div class="text-right">
                  <b-button variant="success" @click="handleSubmit()">Save</b-button>&nbsp;
                  <b-button variant="danger" @click="clearFields()">Clear</b-button>
                </div>
              </b-col>
            </b-row>
          </form>
        </b-card>
      </b-col>
      <b-col cols="7">
        <b-card>
          <h5>Find Status</h5>
          <div class="selectProject">
            Select Your Member:
            <select v-model="memberSelected" @change="showDetailsOfMember()">
              <option disabled value>Please select one Member</option>
              <option
                :value="memberItem"
                v-for="(memberItem,index) in this.allDataArray"
                :key="index"
              >{{ memberItem.member_email }}</option>
            </select>
          </div>
          <br>
          <b-table v-if="taskArrayOfMember.length" striped hover :items="taskArrayOfMember" :fields="fields"></b-table>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import DataPostApi from "../services/api/loginValidation";
export default {
  name: "AdminPanel",
  props: ["getUsername"],
  data() {
    return {
      dismissCountDown: false,
      memberSelected: null,
      allDataArray: [],
      selected: null,
      options: [],
      newTaskArray: [""],
      taskArray: [],
      statusArray: [],
      project_name: "",
      member_email: "",
      taskid: "",
      task_name: "",
      task_status: "",
      start_date: "",
      end_date: "",
      manager_name: this.getUsername,
      date_created: this.getTodayDate(),
      items: [],
      taskArrayOfMember: [],
      projectListArray: [],
      userIdsArray: [],
      selectedProject: null,
      selectedMember: null,
      fields: ['taskName', 'task_status', 'start_date','end_date','date_created'],
    };
  },
  watch: {
    options: function(val) {
      this.getAllTasksCall();
    }
  },
  created: function() {
    this.getAllTasksCall();
    this.getAllProjectList();
    this.getAllMemberEmail();
  },
  methods: {
    getAllProjectList() {
      DataPostApi.getAllProjectListData()
        .then(response => {
          console.log("All project Data" + JSON.stringify(response.data));
          this.projectListArray = response.data;
        })
        .catch(err => {
          console.log("Error" + err);
        });
    },
    getAllMemberEmail() {
      DataPostApi.getAllUsersList()
        .then(response => {
          console.log("All users email" + JSON.stringify(response.data));
          this.userIdsArray = response.data;
        })
        .catch(err => {
          console.log("Error" + err);
        });
    },
    getTodayDate: function() {
      let newDate = new Date();
      let mm = newDate.getMonth() + 1;
      let dd = newDate.getDate();
      let yyyy = newDate.getFullYear();
      let date = mm + "/" + dd + "/" + yyyy;
      return date;
    },

    addTasks: function() {
      this.newTaskArray.push("");
      console.log("new array with tasks" + this.taskArray);
      console.log("no of tasks" + this.newTaskArray.length);
    },

    handleOk(evt) {
      // Prevent modal from closing
      evt.preventDefault();
      if (!this.project_name) {
        alert("Please enter your name and project members");
      } else {
        this.handleSubmit();
      }
    },

    clearFields() {
      (this.project_name = ""), (this.member_email = ""), (this.memberArr = []);
    },

    getTaskArrayFormatted() {
      this.taskArrayFormatted = [];
      let count = 0;
      for (let i = 0; i < this.taskArray.length; i++) {
        this.taskArrayFormatted.push({
          taskID: `Task${count}`,
          taskName: this.taskArray[i],
          task_status: "Not Started",
          start_date: "",
          end_date: "",
          date_created: this.getTodayDate(),
          allStatus: this.statusArray
        });
        count++;
      }
      return this.taskArrayFormatted;
    },

    handleSubmit() {
      this.project_name = this.selectedProject.project_name;
      this.member_email = this.selectedMember.email;
      this.manager_name = this.getUsername;
      this.allTasks = this.getTaskArrayFormatted();
      if(this.project_name === '' || this.member_email === '' || this.manager_name === '' || this.allTasks === []){
        return false;
      } else {
        DataPostApi.projectsaveApi(
        this.project_name,
        this.member_email,
        this.manager_name,
        this.allTasks
      )
        .then(response => {
          if (response.saved === true) {
            this.clearFields();
            // this.$refs.modal.hide();
            this.dismissCountDown = true;
            setTimeout(() => {
              this.dismissCountDown = false;
            }, 3000);
            this.getAllTasksCall();
          }
        })
        .catch(error => {
          console.log("Error in saving" + error);
        });
      }
      
    },

    getAllTasksCall() {
      DataPostApi.getAllTasks()
        .then(response => {
          console.log("Response from save" + response.data);
          this.allDataArray = response.data;
        })
        .catch(err => {
          console.log("Error" + err);
        });
    },

    showDetailsOfMember(e) {
      if (this.memberSelected) {
        DataPostApi.getStatusbyEmail(this.memberSelected.member_email)
          .then(response => {
            this.taskArrayOfMember = response.data[0].allTasks;
            console.log(
              "this.taskArrayOfMember" + JSON.stringify(this.taskArrayOfMember)
            );
          })
          .catch(err => {
            console.log("Error" + err);
          });
      } else {
        return false;
      }
    },

    removeTask: function(index) {
      this.newTaskArray.splice(index, 1);
    }
  }
};
</script>

<style scoped>
a.btn.btn-success.float-right {
  margin-bottom: 10px;
  color: #fff;
}
.dashboard {
  background: #fafafa;
}
select {
    height: 36px;
    background: transparent;
    border-radius: 0px;
}
</style>
