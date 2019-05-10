<template>
  <b-list-group horizontal>
    <div class="progressbarwrapper">
    <div v-if="taskItemDetails.allStatus.length && taskItemDetails.task_status === 'Started'">
    <b-progress
    :max="max"
    show-progress 
    animated 
    :value="taskItemDetails.allStatus ? Number(taskItemDetails.allStatus.slice(-1)[0].percentage_completion) : 0"
    >
    </b-progress>
    </div>
    </div>
    <b-list-group-item class="taskitem">
      <b-row>
        <b-col class="text-left">{{taskItemDetails.taskName}}</b-col>
        <b-col class="text-right" v-if="!isTaskCompleted">
          <b-button
            v-if="(taskItemDetails.task_status === 'Not Started')"
            variant="outline-primary"
            @click="startTask(taskItemDetails.taskID)"
          >Start</b-button>
          <b-button
            :disabled="Number(taskItemDetails.allStatus.length && taskItemDetails.allStatus.slice(-1)[0].percentage_completion) === 100 ? false : true"
            variant="danger"
            @click="endTask(taskItemDetails.taskID)"
            v-if="(taskItemDetails.task_status === 'Started')"
            >End</b-button>
          <i
            v-if="(taskItemDetails.task_status === 'Completed')"
            class="fa fa-check-circle fa-2x"
            aria-hidden="true"
          ></i>
        </b-col>
      </b-row>
    </b-list-group-item>
  </b-list-group>
</template>
<script>
import DataPostApi from "../services/api/loginValidation";
export default {
  name: "TaskItem",
  props: ["taskItemDetails", "index", "getUsername", "lastUpdatedPercentage"],
  data() {
    return {
      hasStarted: false,
      isTaskCompleted: false,
      startDate: this.getTodayDate(new Date()),
      endDate: this.getTodayDate(new Date()),
      taskStatus: "Not Started",
      date_updated: this.getTodayDate(new Date()),
      itemList: this.taskItemDetails,
      taskStatusResponseArray: [],
      max: 100
    };
  },
  mounted() {
    console.log("showNoOfAddForm" + JSON.stringify(this.taskItemDetails));
    console.log("lastUpdatedPercentage" + this.lastUpdatedPercentage);
  },
  methods: {

      totalTaskPercentage(){

      },


    getTodayDate: function(dateInput) {
      let newDate = dateInput;
      let mm = newDate.getMonth() + 1;
      let dd = newDate.getDate();
      let yyyy = newDate.getFullYear();
      let date = mm + "/" + dd + "/" + yyyy;
      return date;
    },
    startTask: function(event, taskId) {
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
          if (response.affected.allTasks) {
            this.taskStatusResponseArray = response.affected.allTasks;
            let objToSendToParent = this.filterObjWithStatus('Started');
            console.log("objToSendToParent" + objToSendToParent);
            this.$emit("startedStatusObj", objToSendToParent);
          }
        })
        .catch(err => {
          console.log("Error from statusUpdateAPi" + err);
        });
    },

    filterObjWithStatus(status) {
      let newFilteredArray = [];
      this.taskStatusResponseArray.filter(obj => {
        if (obj.task_status === status) {
          newFilteredArray.push(obj);
        }
      });
      console.log("new filtered array" + newFilteredArray);
      return newFilteredArray;
    },

    endTask: function(taskId, taskName) {
      this.isTaskCompleted = true;
      this.taskStatus = "Completed";
      DataPostApi.updateEndTaskById(
        this.getUsername,
        this.taskItemDetails.taskID,
        this.taskStatus,
        this.endDate,
        this.index
      )
        .then(response => {
          if (response.affected.allTasks) {
            this.taskStatusResponseArray = response.affected.allTasks;
            let objToSendToParent = this.filterObjWithStatus('Completed');
            console.log("objToSendToParent" + objToSendToParent);
            this.$emit("startedStatusObj", objToSendToParent);
          }
        })
        .catch(err => {
          console.log("Error from statusUpdateAPi" + err);
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
.list-group-item.taskitem{
  margin-bottom: 10px !important;
}
i.fa.fa-check-circle.fa-2x {
  color: green;
}
</style>
