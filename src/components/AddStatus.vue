<template>
  <div class="editableform">
    <div class="formToAdd">
     
      <b-form @submit.prevent action="/insert" method="post" v-if="addItemDetails.task_status != 'Completed'">
        <div class="form-row">
            <div class="form-group col-xs-2 mb-2">
              <label for="validationCustom01">Your Task</label>
              <b-input
              class="mb-2 mr-sm-2 mb-sm-0"
              type="text"
              v-model="addItemDetails.taskName"
              name="topic_name"
              disabled
            />
          </div>
          <div class="form-group col-md-3 mb-3">
            <label for="validationCustom01">Status Description</label>
            <b-textarea
              class="mb-2 mr-sm-2 mb-sm-0"
              type="text"
              v-model="statusDesc"
              name="description"
              rows="1"
              cols="10"
              style="resize: none;"
            />
          </div>
          <div class="form-group col-xs-2 mb-2">
            <label for="validationCustom01">Percentage Completed</label>
            <b-input
              class="mb-2 mr-sm-2 mb-sm-0"
              type="number"
              v-model="percentage_completion"
              name="percentage_completion"
            />
          </div>
          <!-- <div class="form-group col-xs-2 mb-2">
            <label for="validationCustom01">Date To Be Completed</label>

            <b-input
              class="mb-2 mr-sm-2 mb-sm-0"
              type="date"
              v-model="completed_date"
              name="completed_date"
              id="completed_date"
            />
          </div> -->
          <!-- <div class="form-group col-xs-2 mb-2">
            <label for="validationCustom01">Owner </label>
            <b-input class="mb-2 mr-sm-2 mb-sm-0" type="text" v-model="manager_name" value="" readonly="" name="manager_name" />
  
          </div>-->
          <input type="hidden" value v-model="date_created" name="date_created">
          <div class="col-xs-3 mb-3">
            <label for="validationCustom01" class="empty-label">&nbsp;</label>
            <button class="addRowBtn btn btn-success" @click="addStatus()">Add New Status</button>
          </div>
        </div>
      </b-form>
      <p v-if="showMessage === true">Data SuccessFully Saved</p>
    </div>
    <!-- show the messages added -->
  </div>
</template>

<script>
import DataPostApi from "../services/api/loginValidation";


export default {
  name: "AddStatus",
  props: ["addItemDetails", "getUsername", "tasksArray"],
  data() {
    return {
      shouldDisable: true,
      emailsenttext: false,
      countSubmitted: 0,
     // countTotal: this.projectSelected.no_of_members,
      showAllStatus: [],
      showMessage: false,
      statusDesc: "",
      percentage_completion: null,
      completed_date: this.getDateYYYYMMDD(new Date()),
      member_email: this.getUsername,
      date_created: this.getTodayDate(new Date()),
      nextBarId: 1,
      lastId: 0,
      isEdit: true,
      id: status._id,
      editMode: false,
      editedStatus: null,
      showStatusGrid: false,
      date_updated: this.getTodayDate(new Date()),
      count:0,
      statusID:''
    };
  },
  mounted() {
   console.log("this.addItemDetails" + JSON.stringify(this.addItemDetails));
  },
  methods: {

    checkPercentage(){
      
    },

    onClickChildTogetStartTask:function(startValue){
        console.log("value from child" + JSON.stringify(startValue))
        this.assigned_topic = startValue.taskName
    },
    onClickChildTogetEndTask: function(endValue){
        console.log("value from child" + JSON.stringify(endValue))
    },
   
    getTodayDate: function(dateInput) {
      let newDate = dateInput;
      let mm = newDate.getMonth() + 1;
      let dd = newDate.getDate();
      let yyyy = newDate.getFullYear();
      let date = mm + "/" + dd + "/" + yyyy;
      return date;
    },

    addStatus: function() {
        //if(this.percentage_completion < (this.addItemDetails.allStatus.pop().percentage_completion) || this.statusDesc === ''){
        //  return false;
      //  } else {
        if(this.statusDesc === '' || this.percentage_completion === null) {
          alert("Please fill all the inputs");
          return false;
        } else {
        this.statusID = `Status${this.count}`;
        this.taskiD = this.addItemDetails.taskID;
        DataPostApi.statusSaveApi(
          this.member_email,
          this.taskiD,
          this.statusID,
          this.statusDesc,
          this.percentage_completion,
          this.date_updated
        )
          .then(response => {
            if(response.affected.allTasks){
            this.resetFields();
            this.taskStatusResponseArray = response.affected.allTasks;
            let objToSendToParent = this.filterObjWithStatusStarted();
            this.$emit('filteredObjFromChild', objToSendToParent);
          }
          })
          .catch(error => {
            throw error;
          });
          this.count ++;
    }
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
    /**to get all status */
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
      this.statusDesc = "";
      this.percentage_completion = null;
    },
    mapOverAllStatusTosendEmail: function() {
      let trStr = "";
      this.showAllStatus.map((item, i) => {
        trStr += `<tr class="">
                <td>${i +
                  1}</td><td style="word-wrap:break-word;word-break:break-all;max-width:100px">${
          item.description
        }</td><td>${item.percentage_completion}</td>
                <td>${item.completed_date}</td><td>${item.manager_name}</td>
              </tr>`;
      });
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
  display: block;
}

.editing .view {
  display: none;
}

.empty-label {
  width: 100%;
}

.view.float-left {
  margin-right: 10px;
}
</style>

