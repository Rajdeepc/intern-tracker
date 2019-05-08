<template>
  <div v-if="this.statusItemDetails.length">
    <!-- <div class="showstatus">
        <div v-for="(status,index) in this.statusItemDetails" :key="index">
           <h5><b>Task Name:</b> {{status.taskName}}</h5>
        <table class="table table-striped" v-for="(statusItem,index) in status.allStatus" :key="index">
          <thead>
            <tr>
              <th>Status Description</th>
              <th>Date Updated</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{statusItem.statusDesc}}</td>
              <td>{{statusItem.date_updated}}</td>
            </tr>
          </tbody>
        </table>
    </div>
    </div> -->
    <div role="tablist" class="accordian_status">
    <b-card no-body class="mb-1" v-for="(status,indexItem) in this.statusItemDetails" :key="indexItem">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block href="#" v-b-toggle="'accordion-' + indexItem" variant="outline-primary">{{index}}{{status.taskName}}</b-button>
      </b-card-header>
      <b-collapse :id="'accordion' + '-' + (indexItem)" visible accordion="my-accordion" role="tabpanel" v-for="(statusItem,index) in status.allStatus" :key="index">
        <b-card-body>
          <b-row>
            <b-col cols="10">{{statusItem.statusDesc}}</b-col>
            <b-col cols="2">{{ statusItem.date_updated }}</b-col>
          </b-row>
        </b-card-body>
      </b-collapse>
    </b-card>
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
.accordian_status .card-header .btn-block{
      text-align: left;
    text-transform: uppercase;
}
</style>
