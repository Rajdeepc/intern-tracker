<template>
     <b-list-group horizontal>
          <b-list-group-item class="taskitem"> 
            <b-row>
              <b-col class="text-left">{{taskItemDetails.task}}</b-col>
              <b-col class="text-right" v-if="!isTaskCompleted">
                <b-button v-if="!hasStarted" variant="outline-primary" @click="startTask(taskItemDetails.id,taskItemDetails.task)">Start</b-button>
                <!-- <span
                  v-if="(percentage_completion > 0 && percentage_completion < 100)"
                >{{percentage_completion}}</span> -->
                
                <b-button variant="outline-danger" @click="endTask(taskItemDetails.id,taskItemDetails.task)" :disabled="!hasStarted ? true : false">End</b-button>
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
    props:["taskItemDetails","nameOfUser","project"],
    data(){
        return{
            hasStarted:false,
            isTaskCompleted: false,
            taskStatus:'Not Started',
            date_updated: this.getTodayDate(new Date()),
        }
    },

    methods:{

      startTask: function(taskId,taskName) {
        this.hasStarted = true;
        this.taskStatus = 'Started';
        this.$emit('passStartTaskValue', { id:taskId, task : taskName, task_status: this.taskStatus } );
        DataPostApi.updateTaskById(this.project,taskId,taskName,this.nameOfUser,this.date_updated,this.taskStatus)
        .then((response) => {
            console.log("response from statusUpdateAPi" + JSON.stringify(response));
        })
        .catch(err => {
          console.log("Error from statusUpdateAPi" + err);
        })
      },

      endTask: function(taskId, taskName) {
        this.hasStarted = false;
        this.isTaskCompleted = true;
        this.taskStatus = 'Completed';
        this.$emit('passEndTaskValue', { id:taskId, task : taskName, task_status:this.taskStatus } )
      },
      getTodayDate: function(dateInput) {
      let newDate = dateInput;
      let mm = newDate.getMonth() + 1;
      let dd = newDate.getDate();
      let yyyy = newDate.getFullYear();
      let date = mm + "/" + dd + "/" + yyyy;
      return date;
    },

    }
}
</script>
<style>
#app .editableform .taskitem {
  margin-bottom: 10px;
}
i.fa.fa-check-circle.fa-2x {
    color: green;
}
</style>
