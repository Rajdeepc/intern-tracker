<template>
  <div>
    <b-modal id="modallg" size="lg" title="Add Project Details" @ok="handleOk" ref="modal">
      <form @submit.stop.prevent="handleSubmit" method="post">
        <p>
          <i>This panel is only visible to TL and Above</i>
        </p>
        <!-- <div class="form-group">
          <label for="exampleInputEmail1">Supervisor Name:</label>
          <input type="text" class="form-control" id="" v-model="getUsername" readonly="" name="manager_name" aria-describedby="emailHelp">
        </div>-->
        <b-row>
          <b-col>
            <div class="form-group">
              <label for="exampleInputEmail1">Project Name:</label>
              <input
                type="text"
                class="form-control"
                id
                v-model="project_name"
                name="project_name"
                aria-describedby="project_name"
                required
              >
            </div>
          </b-col>
          <b-col>
            <div class="form-group">
              <label for="exampleInputEmail1">Member Email ID:</label>
              <input
                type="text"
                class="form-control"
                id
                v-model="member_email"
                name="member_email"
                aria-describedby="member_email"
                required
              >
            </div>
          </b-col>
        </b-row>

        <!-- add tasks -->
        <b-row>
          <b-col>
            <label>Add Tasks</label>
            <a class="btn btn-success float-right" @click="addTasks()">
              Add More Tasks
              <i class="fa fa-plus"></i>
            </a>
          </b-col>
        </b-row>

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
          <input type="hidden" v-model="taskArray[index]"/>
          <input type="hidden" v-model="taskArray[index]"/>
          <input type="hidden" v-model="taskArray[index]"/>
          <input type="hidden" v-model="taskArray[index]">
          <b-col cols="1">
           <div class="form-group">
              <div for="taskName">&nbsp;</div>
              <a v-on:click="removeTask(index);" style="cursor: pointer">
                <i class="fa fa-close"></i>
              </a>
           </div>
          </b-col>
        </b-row>

        <!-- <label>Your Project Members:</label>
        <a class="btn btn-success float-right" @click="addFields()">
          Add Members
          <i class="fa fa-plus"></i>
        </a>-->

        <!-- <div class="form-group" v-for="(newInput,index) in newInputArray" :key="'Member' + index">
          <span>
            <input
              type="text"
              class="form-control"
              id
              aria-describedby="addmembers"
              placeholder="Enter member email id"
              v-model="memberArr[index]"
            >
          </span>
          <span>
            <a v-on:click="removeElement(index);" style="cursor: pointer">
              Cancel
              <i class="fa fa-close"></i>
            </a>
          </span>
        </div>-->
      </form>
    </b-modal>
  </div>
</template>

<script>
import DataPostApi from "../services/api/loginValidation";

export default {
  name: "AdminPanel",
  props: ["getUsername"],
  data() {
    return {
      newTaskArray: [""],
      taskArray: [],
      project_name: "",
      member_email: "",
      taskid: "",
      task_name: "",
      task_status: "",
      start_date: "",
      end_date: "",
      manager_name: this.getUsername,
      date_created: this.getTodayDate()
    };
  },
  mounted() {},
  methods: {
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
      (this.project_name = ""), (this.memberArr = []);
    },

    getTaskArrayFormatted() {
      this.taskArrayFormatted = [];
      let count = 0;
      for (let i = 0; i < this.taskArray.length; i++) {
        this.taskArrayFormatted.push({
          taskID: `Task${count}`,
          taskName: this.taskArray[i],
          task_status: "Not Started",
          start_date: '',
          end_date:'',
          date_created: this.getTodayDate()
        });
        count++;
      }
      return this.taskArrayFormatted;
    },

    handleSubmit() {
      this.project_name = this.project_name;
      this.member_email = this.member_email;
      this.manager_name = this.getUsername;
      this.allTasks = this.getTaskArrayFormatted();
      DataPostApi.projectsaveApi(
        this.project_name,
        this.member_email,
        this.manager_name,
        this.allTasks
      )
        .then(response => {
          if (response.saved === true) {
            this.clearFields();
            this.$refs.modal.hide();
          }
        })
        .catch(error => {
          console.log("Error in saving" + error);
        });
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
</style>
