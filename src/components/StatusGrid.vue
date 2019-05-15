<template>
  <div v-if="this.statusItemDetails.length">
        <div role="tablist" class="accordian_status">
      <b-card
        no-body
        class="mb-1"
        v-for="(status,indexItem) in this.statusItemDetails"
        :key="indexItem"
      >
        <b-card-header header-tag="header" class="p-1" role="tab" v-if="status.allStatus.length">
          <b-button block href="#" v-b-toggle="'accordion-' + indexItem" variant="primary">
          {{status.taskName}}
            <i class="fa fa-chevron-down" aria-hidden="true"></i>
          </b-button>
        </b-card-header>
        <b-collapse
          :id="'accordion' + '-' + (indexItem)"
          visible
          accordion="my-accordion"
          role="tabpanel"
        >
          <b-card-body>
            <b-row v-for="(statusItem,index) in status.allStatus" :key="index">
              <b-col
                cols="12"
              ><b>Date Updated:</b> {{ statusItem.date_updated === getTodayDate(new Date()) ? 'Today' :statusItem.date_updated }}</b-col>
              <b-col cols="12"><p><b>Description:</b> {{statusItem.statusDesc}}</p></b-col>
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
    getTodayDate: function(dateInput) {
      let newDate = dateInput;
      let mm = newDate.getMonth() + 1;
      let dd = newDate.getDate();
      let yyyy = newDate.getFullYear();
      let date = mm + "/" + dd + "/" + yyyy;
      return date;
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
.accordian_status .card-header .btn-block {
  text-align: left;
  text-transform: uppercase;
}
</style>
