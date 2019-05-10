<template>
  <div class="container">
    <b-alert :show="dismissCountDown" dismissible variant="primary">{{saveOrUpdate}} Successful</b-alert>
    <b-row>
      <b-col cols="12">
        <h5>Select Project &amp; Member:</h5>
        <b-card>
          <b-row>
            <b-col cols="5">
              <div class="form-group">
                <div class="projectDropdown">
                  Select A Project:
                  <select v-model="selectedProject">
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
            <b-col cols="5">
              <div class="form-group">
                <div class="projectDropdown">
                  Select A Member:
                  <select
                    v-model="selectedMember"
                    @change="showIfTasksByNameAndProject()"
                  >
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
        </b-card>
      </b-col>
    </b-row>
    <!-- add tasks -->

    <!-- <b-row v-for="(newTask,index) in newTaskArray" :key="'TaskRow' + index">
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
            <b-row>
              <b-col>
                <div class="text-right">
                  <b-button variant="success" @click="handleSubmit()">Save</b-button>&nbsp;
                  <b-button variant="danger" @click="clearFields()">Clear</b-button>
                </div>
              </b-col>
    </b-row>-->
    <br>
    <div class="add_show_tasks" v-if="selectedMember && selectedProject">
      <h5>Add/Update Tasks: </h5>
    <b-row>
      <b-col>
        <b-card>
          <b-form @submit.prevent action="/insert" method="post">
            <div class="form-row">
              <div class="form-group col-md-9 mb-9">
                <label for="validationCustom01">Task Description</label>
                <b-input class="col-xs-9 mb-9" type="text" v-model="taskName" name="task_name"/>
              </div>
              <input type="hidden" value v-model="date_created" name="date_created">
              <div class="col-md-3 mb-3">
                <div for="validationCustom01">&nbsp;</div>
                <button
                  v-if="noData"
                  class="updateadd btn btn-success"
                  @click="addTasks()"
                >Add New</button>
                <button
                  v-if="!noData"
                  class="updateadd btn btn-warning"
                  @click="updatedTasks()"
                >Update More</button>
              </div>
            </div>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
    <br>

    <b-row v-if="!noData">
      <b-col cols="12">
        <h5>Showing All Tasks Assigned to <i>{{selectedMember ? selectedMember.email : ''}}</i></h5>
        <b-card>
          <br>
          <b-table striped hover :items="allTasks" :fields="fields"></b-table>
        </b-card>
      </b-col>
    </b-row>

    <b-row v-if="noData">
      <b-col cols="12 text-center">
        <b-card>
          <h5>No Tasks Assigned!</h5>
        </b-card>
      </b-col>
    </b-row>
    </div>
  </div>
</template>

<script>
import DataPostApi from "../services/api/loginValidation";
export default {
  name: "AdminPanel",
  props: ["getUsername"],
  data() {
    return {
      saveOrUpdate:'',
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
      taskName: "",
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
      noData: true,
      selectedMember:false,
      allTasks: [],
      fields: [
        "taskName",
        "task_status",
        "start_date",
        "end_date",
        "date_created"
      ]
    };
  },
  // watch: {
  //   allTasks: function(val) {
  //     this.showIfTasksByNameAndProject();
  //   }
  // },
  created: function() {
    // this.getAllTasksCall();
    this.getAllProjectList();
    this.getAllMemberEmail();
  },
  methods: {
    showIfTasksByNameAndProject() {
      this.member_email = this.selectedMember.email;
      DataPostApi.getTasksByNameAndProject(this.member_email)
        .then(response => {
          if (response.data.length) {
            this.noData = false;
            console.log(
              "status by name" + JSON.stringify(response.data[0].allTasks)
            );
            this.allTasks = response.data[0].allTasks;
          } else {
            this.noData = true;
          }
        })
        .catch(err => {
          console.log("Error from api by name" + err);
        });
    },

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

    clearFields() {
      this.selectedProject = null;
      this.selectedMember = null;
      this.allTasks = [];
    },

    /** update tasks */
    updatedTasks() {
      this.taskID =  Math.random().toString(36).substring(7);
      this.member_email = this.selectedMember.email;
      this.taskName,
      this.task_status =  "Not Started" ;
      this.start_date =  "";
      this.end_date = "" ;
      this.date_created =  this.getTodayDate();   
      if (this.taskName === '') {
        return false;
      } else {
        DataPostApi.projectUpdateApi(
          this.taskID,
          this.member_email,
          this.taskName,
          this.task_status,
          this.start_date,
          this.end_date,
          this.date_created,
          this.statusArray
        )
          .then(response => {
            if (response.saved === true) {
              this.showIfTasksByNameAndProject(this.member_email);
              this.taskName = "";
              this.saveOrUpdate = 'Update';
              this.dismissCountDown = true;
              setTimeout(() => {
                this.dismissCountDown = false;
              }, 3000);
              
            }
          })
          .catch(error => {
            console.log("Error in saving" + error);
          });
      }
    },

    addTasks() {
      this.project_name = this.selectedProject.project_name;
      this.member_email = this.selectedMember.email;
      this.manager_name = this.getUsername;
      this.allTasks.push({
        taskID: Math.random().toString(36).substring(7),
        taskName: this.taskName,
        task_status: "Not Started",
        start_date: "",
        end_date: "",
        date_created: this.getTodayDate(),
        allStatus: this.statusArray
      });
      if (
        this.project_name === "" ||
        this.member_email === "" ||
        this.manager_name === "" ||
        this.allTasks === []
      ) {
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
               this.showIfTasksByNameAndProject(this.member_email);
              this.taskName = "";
              this.saveOrUpdate = 'Save';
              this.dismissCountDown = true;
              setTimeout(() => {
                this.dismissCountDown = false;
              }, 3000);
             
            }
          })
          .catch(error => {
            console.log("Error in saving" + error);
          });
      }
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
button.updateadd{
    margin-top: 7px;
}
</style>
