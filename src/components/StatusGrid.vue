<template>
     <div v-if="this.statusItemDetails.length">
      <div class="showstatus">
        <table class="table table-striped">
          <thead>
            <tr class>
              <td>SL</td>
              <td>Status For Today</td>
              <td>Percentage Completed(%)</td>
              <td>&nbsp;</td>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(status,index) in this.statusItemDetails"
              :key="index"
              :class="{editing: status == editedStatus}"
              v-cloak
            >
              <td class="width3">{{index + 1}}</td>
              <td class="width40">
                <div class="view">{{status.statusDesc}}</div>
                <div class="edit">
                  <input type="text" class="form-control" v-model="status.description">
                </div>
              </td>
              <td class="width10">
                <div class="view">{{status.percentage_completion}}%</div>
                <div class="edit">
                  <input type="text" class="form-control" v-model="status.percentage_completion">
                </div>
              </td>
              <!-- <td class="width10">
                <div class="view">{{status.completed_date}}</div>
                <div class="edit">
                  <input type="date" class="form-control" v-model="status.completed_date">
                </div>
              </td> -->
              <!-- <td class="width15">{{status.manager_name}}</td> -->
              <!-- <td class="width25">
                <div class="view float-left">
                  <b-button
                    variant="warning"
                    :disabled="status.manager_name !== manager_name"
                    @click="editFields(status)"
                  >
                    <i class="fa fa-edit"></i>
                  </b-button>
                </div>
                <div class="edit float-left">
                  <b-button
                    variant="success"
                    :disabled="status.manager_name !== manager_name"
                    @click="saveFields(status)"
                  >
                    <i class="fa fa-save"></i>
                  </b-button>
                </div>
                <b-button
                  variant="danger"
                  class="float-left"
                  :disabled="status.manager_name !== manager_name"
                  @click="deleteRecord(index,status._id)"
                >
                  <i class="fa fa-trash"></i>
                </b-button>
              </td> -->
            </tr>
          </tbody>
        </table>
        <!-- <div class="text-right">
          <button
            class="btn btn-success"
            disabled="countSubmitted !== countTotal"
            @click="sendmail()"
          >Send Email</button>
        </div> -->
      </div>
      <!-- <p v-if="this.emailsenttext === true">Email successfully sent</p> -->
    </div>
</template>
<script>
export default {
     name: "StatusGrid",
     props:["projectSelected","statusItemDetails"],
    data(){
        return {

        }
    },
    mounted(){
        console.log("statusItemDetails" + JSON.stringify(this.statusItemDetails))
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
    },
    }
}
</script>
<style>

</style>
