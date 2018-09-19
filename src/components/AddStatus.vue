<template>
  <div class="editableform">
    <h4>Project Details:</h4>
    <b-card>
      <b-container class="bv-example-row">
        <b-row>
          <b-col>Project:{{projectSelected.project_name}} </b-col>
          <b-col>Manager:{{projectSelected.manager_name}} </b-col>
          <b-col>Date: {{getTodayDate(new Date())}} </b-col>
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
          <div class="form-group col-md-3 mb-3">
            <label for="validationCustom01">Percentage Completed</label>
  
            <b-input class="mb-2 mr-sm-2 mb-sm-0" type="text" v-model="percentage_completion" name="percentage_completion" required/>
          </div>
          <div class="form-group col-md-3 mb-3">
            <label for="validationCustom01">Date To Be Completed</label>
  
            <b-input class="mb-2 mr-sm-2 mb-sm-0" type="date" v-model="completed_date" name="completed_date" id="completed_date" />
          </div>
          <div class="form-group col-md-3 mb-3">
            <label for="validationCustom01">Owned By</label>
            <b-input class="mb-2 mr-sm-2 mb-sm-0" type="text" v-model="ownedBy" value="" readonly="" name="ownedBy" />
  
          </div>
          <input type="hidden" value="" v-model="date_created" name="date_created" />
          <div class="col-md-3 mb-3">
            <button class="addRowBtn btn btn-primary" @click="addRow()">Add New Status</button>
          </div>
        </div>
      </b-form>
      <p v-if="showMessage === true">Data SuccessFully Saved</p>
    </div>
    <br>
    <!-- show the messages added -->
    <h4>Status for Today:</h4>
    <p><span>Members Submitted: </span><span>{{ countSubmitted }}</span> / <span>{{ countTotal }} </span>
      <p>
        <div class="showstatus">
          <table class="table table-striped">
            <thead>
              <tr class="">
                <td>Sl</td>
                <td>Status For Today</td>
                <td>Percentage Completed</td>
                <td>Date To Be Completed</td>
                <td>Owned By</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(status,index) in showAllStatus" :key='index' class="">
                <td>{{index + 1}}</td>
                <td>{{status.description}}</td>
                <td>{{status.percentage_completion}}</td>
                <td>{{status.completed_date}}</td>
                <td>{{status.ownedBy}}</td>
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
        emailsenttext: false,
        countSubmitted: 0,
        countTotal: this.projectSelected.no_of_members,
        showAllStatus: [],
        showMessage: false,
        description: "",
        percentage_completion: null,
        completed_date: this.getDateYYYYMMDD(new Date()),
        ownedBy: this.getUsername,
        date_created: this.getTodayDate(new Date()),
        nextBarId: 1,
        lastId: 0
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
              this.ownedBy,
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
      mapOverAllStatusTosendEmail: function(){
        let trStr = '';
        this.showAllStatus.map((item,i) => {
          trStr += `<tr class="">
            <td>${i + 1}</td><td style="word-wrap:break-word;word-break:break-all;max-width:100px">${item.description}</td><td>${item.percentage_completion}</td>
            <td>${item.completed_date}</td><td>${item.ownedBy}</td>
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
          tempArr.push(item.ownedBy);
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

