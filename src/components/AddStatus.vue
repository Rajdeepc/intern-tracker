<template>
  <div class="editableform">
    <h4>Project Details:</h4>
    <b-card>
      <b-container class="bv-example-row">
        <b-row>
          <b-col><b>Project:</b> {{projectSelected.project_name}} </b-col>
          <b-col><b>Manager:</b> {{projectSelected.manager_name}} </b-col>
          <b-col><b>Date:</b> {{getTodayDate(new Date())}} </b-col>
        </b-row>
      </b-container>
    </b-card>
    <br>
    <div class="formToAdd">
      <h4>Add Your Status For today:</h4>
      <b-form @submit.prevent action="/insert" method="post">
        <div class="form-row">
  
          <div class="form-group col-md-3 mb-3">
            <label for="validationCustom01">Status</label>
  
            <b-textarea class="mb-2 mr-sm-2 mb-sm-0" type="text" v-model="description" name="description" rows="1" cols="10" style="resize: none;" required/>
          </div>
          <div class="form-group col-xs-2 mb-2">
            <label for="validationCustom01">Percentage Completed</label>
  
            <b-input class="mb-2 mr-sm-2 mb-sm-0" type="text" v-model="percentage_completion" name="percentage_completion" required/>
          </div>
          <div class="form-group col-xs-2 mb-2">
            <label for="validationCustom01">Date To Be Completed</label>
  
            <b-input class="mb-2 mr-sm-2 mb-sm-0" type="date" v-model="completed_date" name="completed_date" id="completed_date" />
          </div>
          <div class="form-group col-xs-2 mb-2">
            <label for="validationCustom01">Owned By</label>
            <b-input class="mb-2 mr-sm-2 mb-sm-0" type="text" v-model="manager_name" value="" readonly="" name="manager_name" />
  
          </div>
          <input type="hidden" value="" v-model="date_created" name="date_created" />
          <div class="col-xs-3 mb-3">
            <label for="validationCustom01" class="empty-label">&nbsp;</label>
            <button class="addRowBtn btn btn-success" @click="addRow()">Add New Status</button>
          </div>
        </div>
      </b-form>
      <p v-if="showMessage === true">Data SuccessFully Saved</p>
    </div>
    <br/>
    <br/>
    <!-- show the messages added -->
    <h5>
   <p class="float-left"><b>Status for Today:</b></p>  
    <p class="float-right">
      <b>Members Submitted: </b><span>{{ countSubmitted }}</span> / <span>{{ countTotal }} </span>
    </p>
    </h5>
    <div class="showstatus">
      <table class="table table-striped">
        <thead>
          <tr class="">
            <td>Sl</td>
            <td>Status For Today</td>
            <td>Percentage Completed</td>
            <td>Date To Be Completed</td>
            <td>Owned By</td>
            <td>&nbsp;</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(status,index) in showAllStatus" :key='index' :class="{editing: status == editedStatus}" v-cloak>
            <td>{{index + 1}}</td>
            <td>  <div class="view">{{status.description}}</div><div class="edit"><input type="text" class="form-control"  v-model="status.description"></div></td>
            <td>  <div class="view">{{status.percentage_completion}}</div><div class="edit"><input type="text" class="form-control"  v-model="status.percentage_completion"></div></td>
            <td>  <div class="view">{{status.completed_date}}</div><div class="edit"><input type="date" class="form-control"  v-model="status.completed_date"></div></td>
            <td>{{status.manager_name}}</td>
            <td>
              <div class="view float-left">
              <b-button variant="warning" :disabled="status.manager_name !== manager_name" @click="editFields(status)"><i class="fa fa-edit"></i></b-button>
              </div>
              <div class="edit float-left">
              <b-button variant="success" :disabled="status.manager_name !== manager_name" @click="saveFields(status)"><i class="fa fa-save"></i></b-button>
              </div>
              <b-button variant="danger" class="float-left" :disabled="status.manager_name !== manager_name" @click="deleteRecord(index,status._id)"><i class="fa fa-trash"></i></b-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="row text-right">
      <button class="btn btn-primary" v-if="countSubmitted === countTotal" @click="sendmail()">Send Email</button>
    </div>
    <p v-if="this.emailsenttext === true">Email successfully sent</p>
  
  </div>
</template>

<script>
  import DataPostApi from "../services/api/loginValidation";
  export default {
    name: "AddStatus",
    props: ["projectSelected", "getUsername"],
    data() {
      return {
        shouldDisable: true,
        emailsenttext: false,
        countSubmitted: 0,
        countTotal: this.projectSelected.no_of_members,
        showAllStatus: [],
        showMessage: false,
        description: "",
        percentage_completion: null,
        completed_date: this.getDateYYYYMMDD(new Date()),
        manager_name: this.getUsername,
        date_created: this.getTodayDate(new Date()),
        nextBarId: 1,
        lastId: 0,
        isEdit: true,
        id: status._id,
        editMode: false,
        editedStatus: null
      };
    },
    mounted() {
      this.getAllStatusToday();
      this.setMaxDateToday();
      console.log("number of memebers" + this.projectSelected.no_of_members);
    },
    watch: {
      projectSelected: {
        handler: function(projectSelected) {
          console.log(projectSelected);
          this.getAllStatusToday();
          //this.setMaxDateToday();
        },
        immediate: true
      }
    },
    methods: {
      deleteRecord: function(index, id) {
        DataPostApi.deleteStatusById(id)
          .then(response => {
            if (response.data) {
              this.getAllStatusToday();
            }
          }).catch(err => {
            console.log("Error in update" + err);
          });
  
      },
      editFields: function(status){
        this.beforEditCache = status;
        this.editedStatus = status;
      },
      saveFields: function(status) {
          /** for update api call */
          this.editedStatus = null;
          DataPostApi.updateStatusById(status._id,status.description,status.percentage_completion,status.completed_date)
            .then(response => {
              console.log("Update Successful");
            }).catch(err => {
              console.log("Error in update" + err);
            })
      },
      getTodayDate: function(dateInput) {
        let newDate = dateInput;
        let mm = newDate.getMonth() + 1;
        let dd = newDate.getDate();
        let yyyy = newDate.getFullYear();
        let date = mm + "/" + dd + "/" + yyyy;
        return date;
      },
      addRow: function() {
        if (!this.description || !this.percentage_completion) {
          return false;
        } else {
          this.completed_date = this.getTodayDate(new Date(this.completed_date));
          DataPostApi.taskSaveApi(
              this.description,
              this.percentage_completion,
              this.completed_date,
              this.manager_name,
              this.date_created,
              this.projectSelected.project_name
            )
            .then(response => {
              if (response.saved === true) {
                this.getAllStatusToday();
                this.resetFields();
              }
            })
            .catch(error => {
              throw error;
            });
        }
      },
      /**to get all status */
      getAllStatusToday: function() {
        DataPostApi.getStatusbyDate(this.projectSelected.project_name).then(
          response => {
            this.showAllStatus = response.data;
            console.log(
              "Show all status data" + JSON.stringify(this.showAllStatus)
            );
            this.findUniqueOwner();
          }
        );
      },
      setMaxDateToday: function() {
        let today = this.getDateYYYYMMDD(new Date());
        document.getElementById("completed_date").setAttribute("min", today);
      },
      getDateYYYYMMDD(date) {
        var today = date;
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
          dd = "0" + dd;
        }
        if (mm < 10) {
          mm = "0" + mm;
        }
  
        today = yyyy + "-" + mm + "-" + dd;
        return today;
      },
      resetFields() {
        this.description = "";
        this.percentage_completion = 0;
        this.completed_date = this.getDateYYYYMMDD(new Date());
      },
      mapOverAllStatusTosendEmail: function() {
        let trStr = '';
        this.showAllStatus.map((item, i) => {
          trStr += `<tr class="">
              <td>${i + 1}</td><td style="word-wrap:break-word;word-break:break-all;max-width:100px">${item.description}</td><td>${item.percentage_completion}</td>
              <td>${item.completed_date}</td><td>${item.manager_name}</td>
            </tr>`;
        })
        return trStr;
      },
      sendmail: function() {
        let to = "rajrock38@gmail.com";
        let body = `<table class="table table-striped">
                <thead>
                  <tr class="text-center">
                    <td>Sl</td>
                    <td>Status For Today</td>
                    <td>Percentage Completed</td>
                    <td>Date To Be Completed</td>
                    <td>Owned By</td>
                  </tr>
                </thead>
                <tbody>
                  
                  ${this.mapOverAllStatusTosendEmail()}
  
                </tbody>
              </table>`;
        DataPostApi.sendStatusMail(to, body).then(response => {
          if (response.sendemail === true) {
            this.emailsenttext = true;
          }
        });
      },
      /**
       * find unique element from owner
       */
      getUniqueElement: function(newArr) {
        let unique = newArr.filter(function(item, i, ar) {
          return ar.indexOf(item) === i;
        });
        return unique;
      },
      findUniqueOwner: function() {
        let showAllstatus = this.showAllStatus;
        let tempArr = [];
        showAllstatus.map(item => {
          tempArr.push(item.manager_name);
        });
        let uniqueOwnerCount = this.getUniqueElement(tempArr);
        if (uniqueOwnerCount) {
          this.countSubmitted = uniqueOwnerCount.length;
        }
        console.log(this.countSubmitted);
      }
    }
  };
</script>

<style scoped>
[v-cloak] {
      display: none;
    }
    .edit {
      display: none;
    }
    .editing .edit {
      display: block
    }
    .editing .view {
      display: none;
    }
    .empty-label {
      width: 100%;
    }
</style>

