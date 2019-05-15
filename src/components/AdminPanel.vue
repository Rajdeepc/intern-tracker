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
            <b-col cols="5">
              <div class="form-group" v-if="(selectedMember && (haveProjectNameAndTAsks === false))">
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
              <div class="form-group" v-if="(selectedMember && (haveProjectNameAndTAsks === true))">
                <b>Project Assigned:</b> {{projectNameAssignedTo}}
                <b-button variant="danger" @click="openConfirmModal(selectedMember.email)">Delete</b-button>
              </div>
            </b-col>
           
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <br>
      <div class="add_show_tasks" v-if="(selectedMember && selectedProject) || (selectedMember && (haveProjectNameAndTAsks === true))">
        <h5>Add/Update Tasks:</h5>
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
                      v-if="!allTasks.length"
                      class="updateadd btn btn-success"
                      @click="addTasks()"
                    >Add New</button>
                    <button
                      v-if="allTasks.length"
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

        <b-row v-if="haveProjectNameAndTAsks === true">
          <b-col cols="12">
            <h5>
              Showing All Tasks Assigned to
              <b>{{selectedMember ? selectedMember.email : ''}}</b>
            </h5>
            <b-card>
              <br>
              <b-table :items="allTasks" :fields="fields">
                <template slot="taskName" slot-scope="data" >
                        <input type="text" 
                              class="form-control-sm"
                              :value="data.item.taskName"
                              :disabled="!editable"
                              v-on:input="handleQuantityChange($event)"/>
                </template>
                 <template slot="Actions" slot-scope="data" v-if="data.item.task_status === 'Not Started'">
                   <i class="fa fa-pencil fa-lg" v-if="editable === false" aria-hidden="true" @click="editField(data.item)"></i> 
                   <i class="fa fa-floppy-o fa-lg" v-if="editable" aria-hidden="true" @click="saveField(data.item)"></i>
                   <i class="fa fa-trash fa-lg" v-if="data.index >= 1" aria-hidden="true" @click="deleteFields(data.item)"></i>
                </template>

              </b-table>
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
        <confirmModal v-if="modalshow === true" :emailObjToDelete="selectedMember.email" @close="closeModal" @deleteClose="deleteAndClose"/>
    </div>
  </div>
</template>

<script>
import DataPostApi from "../services/api/loginValidation";
import confirmModal from './ConfirmModal.vue';

export default {
  name: "AdminPanel",
  props: ["getUsername"],
  data() {
    return {
      haveProjectNameAndTAsks:false,
      saveOrUpdate: "",
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
      noData: null,
      allTasks: [],
      alreadyAssigned: null,
      projectNameAssignedTo:'',
      editable:false,
      fields: [
        "taskName",
        "task_status",
        "start_date",
        "end_date",
        "date_created",
        "Actions"
      ],
      modalshow:false
    };
  },
  components:{
    confirmModal
  },
  created: function() {
    // this.getAllTasksCall();
    this.getAllProjectList();
    this.getAllMemberEmail();
  },
  methods: {
    openConfirmModal(email){
      this.modalshow = true;
    },
    closeModal() {
      this.modalshow = false;
    },
    deleteAndClose(){
      this.modalshow = false;
      window.location.reload();
    },

    handleQuantityChange(e){
        console.log(e.target.value);
        this.newTaskName = e.target.value;
    },
    editField(item,index){
      this.editable = true;
    },
    saveField(taskid){
      /** call api to update taskname */
      this.member_email = this.selectedMember.email;
      DataPostApi.updateTaskNameAndSave(taskid.taskID,this.newTaskName,this.member_email)
      .then(response => {
        if(response.save === true){
           this.editable = false;
           this.showIfTasksByNameAndProject(this.member_email);
        }
      })
      .catch(err => {
        console.log("Err" + err);
      })
    },
    deleteFields(taskItem){
      /** call api to delete taskname */
      let taskId = taskItem.taskID;
      this.member_email = this.selectedMember.email;
      DataPostApi.deleteTasksById(taskId,this.member_email)
      .then(response => {
        console.log("Response from delete api" + JSON.stringify(response));
        this.$nextTick(function () {
           this.showIfTasksByNameAndProject(this.member_email);
        })
       
      })
      .catch(err => {
        console.log("Error from error api" + err)
      })

    },
    showIfTasksByNameAndProject() {
      this.member_email = this.selectedMember.email;
      DataPostApi.getTasksByNameAndProject(this.member_email)
        .then(response => {
            this.allTasks = response.data[0] ? response.data[0].allTasks : [];
            if (response.data.length) {
            this.projectNameAssignedTo = response.data[0].project_name;
            if (response.data[0].project_name !== undefined && response.data[0].allTasks.length >= 0) { // have a project name and tasks to a member
              this.haveProjectNameAndTAsks = true;
            }
          } else {
            this.haveProjectNameAndTAsks = false;
          }
        })
        .catch(err => {
          console.log("Error from api by name" + err);
        });
    },

    getAllProjectList() {
      DataPostApi.getAllProjectListData()
        .then(response => {
          //console.log("All project Data" + JSON.stringify(response.data));
          this.projectListArray = response.data;
        })
        .catch(err => {
          console.log("Error" + err);
        });
    },

    getAllMemberEmail() {
      DataPostApi.getAllUsersList()
        .then(response => {
          // console.log("All users email" + JSON.stringify(response.data));
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
      this.taskID = Math.random()
        .toString(36)
        .substring(7);
      this.member_email = this.selectedMember.email;
      this.taskName, (this.task_status = "Not Started");
      this.start_date = "";
      this.end_date = "";
      this.date_created = this.getTodayDate();
      if (this.taskName === "") {
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
              this.saveOrUpdate = "Update";
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
      this.project_name = this.selectedProject ? this.selectedProject.project_name : this.projectNameAssignedTo;
      this.member_email = this.selectedMember.email;
      this.manager_name = this.getUsername;
      this.allTasks = [];
      this.allTasks.push({
        taskID: Math.random()
          .toString(36)
          .substring(7),
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
              this.saveOrUpdate = "Save";
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
button.updateadd {
  margin-top: 7px;
}
.fa-pencil{
  color:#4286f4;
  cursor: pointer;
}
.fa-trash{
  color: #e5306c;
   margin-left: 10px;
    cursor: pointer;
}
.fa-floppy-o {
  color:#14ce49;
   cursor: pointer;
  
}
input.form-control-sm:disabled {
    background: transparent;
    border: 0;
}
</style>
