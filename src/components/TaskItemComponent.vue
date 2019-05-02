<template>
  <b-list-group horizontal>
    <b-list-group-item class="taskitem">
      <b-row>
        <b-col class="text-left">{{taskItemDetails.taskName}}</b-col>
        <b-col class="text-right" v-if="!isTaskCompleted">
          <b-button
            v-if="(taskItemDetails.task_status === 'Not Started')"
            variant="outline-primary"
            @click="startTask(taskItemDetails.taskID)"
          >Start</b-button>
          <!-- <span
                  v-if="(percentage_completion > 0 && percentage_completion < 100)"
          >{{percentage_completion}}</span> -->

          <b-button
            variant="outline-danger"
            @click="endTask(taskItemDetails.taskID)"
            v-if="(taskItemDetails.task_status === 'Started')"
          >End</b-button>
        </b-col>
        <b-col class="text-right completedWrapper" v-if="(taskItemDetails.task_status === 'Completed')">
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
      endDate: this.getTodayDate(new Date()),
      taskStatus: "Not Started",
      date_updated: this.getTodayDate(new Date()),
      itemList: this.taskItemDetails,
      taskStatusResponseArray:[]
    };
  },
  mounted(){
  //  console.log(this.taskItemDetails)
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
    startTask: function(event,taskId) {
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
          if(response.affected.allTasks){
            this.taskStatusResponseArray = response.affected.allTasks;
            let objToSendToParent = this.filterObjWithStatusStarted();
            console.log("objToSendToParent" + objToSendToParent)
            this.$emit('startedStatusObj', objToSendToParent);
          }
         
        })
        .catch(err => {
          console.log("Error from statusUpdateAPi" + err);
        });
    },


    filterObjWithStatusStarted(){
      let newFilteredArray = [];
      this.taskStatusResponseArray.filter(obj => {
         if(obj.task_status === 'Started'){
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
          if(response.affected.allTasks){
            this.taskStatusResponseArray = response.affected.allTasks;
            let objToSendToParent = this.filterObjWithStatusStarted();
            console.log("objToSendToParent" + objToSendToParent)
            this.$emit('startedStatusObj', objToSendToParent);
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
#app .editableform .taskitem {
  margin-bottom: 10px;
}
i.fa.fa-check-circle.fa-2x {
  color: green;
}
</style>
