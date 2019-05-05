<template>
  <div v-if="this.statusItemDetails.length">
    <div class="showstatus">
        <!-- <div
          class="view"
          v-for="(statusItem,index) in status.allStatus"
          :key="index"
        >{{statusItem.statusDesc}}</div>
        </div>-->
        <!-- <p v-if="this.emailsenttext === true">Email successfully sent</p> -->
        <!-- </div> -->
        <div v-for="(status,index) in this.statusItemDetails" :key="index">
           <h5><b>Task Name:</b> {{status.taskName}}</h5>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>SL No.</th>
              <th>Status Description</th>
              <th>Date Updated</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(statusItem,index) in status.allStatus" :key="index">
              <td>{{index}}</td>
              <td>{{statusItem.statusDesc}}</td>
              <td>{{statusItem.date_updated}}</td>
            </tr>
          </tbody>
        </table>
    </div>
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
.showstatus table {
    width: 100%;
}
</style>
