<template>
  <div v-if="this.statusItemDetails.length">
    <div class="showstatus">
          <div v-for="(status,index) in this.statusItemDetails" :key="index">
           
            <p>{{status.taskName}}</p>
              <div class="view" v-for="(statusItem,index) in status.allStatus" :key="index">
                {{statusItem.statusDesc}}
              </div>
    </div>
    <!-- <p v-if="this.emailsenttext === true">Email successfully sent</p> -->
  </div>
  </div>
</template>
<script>
import TaskItemComponentVue from "./TaskItemComponent.vue";
export default {
  name: "StatusGrid",
  props: ["projectSelected", "statusItemDetails"],
  data() {
    return {};
  },
  mounted() {
    console.log("statusItemDetails" + JSON.stringify(this.statusItemDetails));
  },

  methods: {
    deleteRecord: function(index, id) {
      DataPostApi.deleteStatusById(id)
        .then(response => {
          if (response) {
            this.getAllStatusToday();
          }
        })
        .catch(err => {
          console.log("Error in delete record" + err);
        });
    },
    editFields: function(status) {
      this.beforEditCache = status;
      this.editedStatus = status;
    },
    saveFields: function(status) {
      /** for update api call */
      this.editedStatus = null;
      DataPostApi.updateStatusById(
        status._id,
        status.description,
        status.percentage_completion,
        status.completed_date
      )
        .then(response => {
          console.log("Update Successful");
        })
        .catch(err => {
          console.log("Error in update" + err);
        });
    }
  }
};
</script>
<style>
</style>
