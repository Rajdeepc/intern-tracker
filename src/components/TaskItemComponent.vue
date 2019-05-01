<template>
  <b-list-group horizontal>
    <b-list-group-item class="taskitem">
      <b-row>
        <b-col class="text-left">{{taskItemDetails.taskName}}</b-col>
        <b-col class="text-right" v-if="!isTaskCompleted">
          <b-button
            v-if="(taskItemDetails.task_status !== 'Started') && hasStarted === false"
            variant="outline-primary"
            @click="startTask(taskItemDetails.taskID)"
          >Start</b-button>
          <!-- <span
                  v-if="(percentage_completion > 0 && percentage_completion < 100)"
          >{{percentage_completion}}</span> -->

          <b-button
            variant="outline-danger"
            @click="endTask(taskItemDetails.taskID)"
            :disabled="!hasStarted ? true : false"
          >End</b-button>
        </b-col>
        <b-col class="text-right completedWrapper" v-if="isTaskCompleted">
          <i class="fa fa-check-circle fa-2x" aria-hidden="true"></i>
        </b-col>
      </b-row>
    </b-list-group-item>
  </b-list-group>
</template>
<script>
import DataPostApi from "../services/api/loginValidation";

export default {
  name: "TaskItem",
  props: ["taskItemDetails","index",'getUsername'],
  data() {
    return {
      hasStarted:false,
      isTaskCompleted: false,
      startDate: this.getTodayDate(new Date()),
      taskStatus: "Not Started",
      date_updated: this.getTodayDate(new Date()),
      itemList: this.taskItemDetails
    };
  },
  mounted(){
    console.log("props from parent" + JSON.stringify(this.taskItemDetails))
  },
  methods: {
    getTodayDate: function(dateInput) {
      let newDate = dateInput;
      let mm = newDate.getMonth() + 1;
      let dd = newDate.getDate();
      let yyyy = newDate.getFullYear();
      let date = mm + "/" + dd + "/" + yyyy;
      return date;
    },
    startTask: function(taskId) {
      this.hasStarted = true;
      this.taskStatus = "Started";
      DataPostApi.updateStartTaskById(
        this.getUsername,
        this.taskItemDetails.taskID,
        this.taskStatus,
        this.startDate,
        this.index
      )
        .then(response => {
          if(response.updated === true){
            this.hasStarted = true;
          }
        })
        .catch(err => {
          console.log("Error from statusUpdateAPi" + err);
        });
    },

    endTask: function(taskId, taskName) {
      this.hasStarted = false;
      this.isTaskCompleted = true;
      this.taskStatus = "Completed";
      this.$emit("passEndTaskValue", {
        id: taskId,
        task: taskName,
        task_status: this.taskStatus
      });
    },
    getTodayDate: function(dateInput) {
      let newDate = dateInput;
      let mm = newDate.getMonth() + 1;
      let dd = newDate.getDate();
      let yyyy = newDate.getFullYear();
      let date = mm + "/" + dd + "/" + yyyy;
      return date;
    }
  }
};
</script>
<style>
#app .editableform .taskitem {
  margin-bottom: 10px;
}
i.fa.fa-check-circle.fa-2x {
  color: green;
}
</style>
