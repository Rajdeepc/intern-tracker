<template>
<div class="editableform">
     <h4>Project Details:</h4>
     <b-card>
     <b-container class="bv-example-row">
    <b-row>
        <b-col>Project:{{projectSelected.project_name}} </b-col>
        <b-col>Manager:{{projectSelected.manager_name}} </b-col>
        <b-col>Date: {{getTodayDate()}} </b-col>
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

            <b-input class="mb-2 mr-sm-2 mb-sm-0" type="text" v-model="description" name="description" required/>
        </div>
        <div class="form-group col-md-3 mb-3">
                <label for="validationCustom01">Percentage Completed</label>

            <b-input class="mb-2 mr-sm-2 mb-sm-0" type="text" v-model="percentage_completion" rname="percentage_completion" equired/>
        </div>
        <div class="form-group col-md-3 mb-3">
                <label for="validationCustom01">Date of Completion</label>

            <b-input class="mb-2 mr-sm-2 mb-sm-0"  type="date" v-model="completed_date" name="completed_date"/>
        </div>
         <div class="form-group col-md-3 mb-3">
                <label for="validationCustom01">Owned By</label>
              <b-input class="mb-2 mr-sm-2 mb-sm-0"  type="text" v-model="ownedBy" value="" readonly="" name="ownedBy"/>

        </div>
        <input type="hidden" value="" v-model="date_created" name="date_created"/>
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
    <div class="showstatus">
        <table class="table table-striped">
            <thead>
              <tr>
                <td>Sl</td>
                <td>Status For Today</td>
                <td>Percentage Completed</td>
                <td>Date Created</td>
                <td>Date To Be Completed</td>
                <td>Owned By</td>
                </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in items" :key='index'>
                       <td>{{index + 1}}</td>
                        <td>{{item.description}}</td>
                         <td>{{item.percentage_completion}}</td>
                          <td>{{item.date_created}}</td>
                          <td>{{item.completed_date}}</td>
                          <td>{{item.ownedBy}}</td>
                        </tr>
                    </tbody>
            </table>
            </div>
</div>
 </template>
<script>
import DataPostApi from "../services/api/loginValidation";
export default {
  name: "AddStatus",
  props: ["projectSelected","getUsername"],
  data() {
    return {
      showAllStatus:[],
      showMessage: false,
      description: "",
      percentage_completion: 0,
      completed_date: "",
      ownedBy:this.getUsername,
      date_created:this.getTodayDate(),
      nextBarId: 1,
      lastId: 0,
    };
  },
    watch: {
    projectSelected: {
      handler: function(projectSelected) {
        console.log(projectSelected);
      },
      immediate: true
    }

  },
  methods: {
    getTodayDate: function(){
      let newDate = new Date();
      let mm = newDate.getMonth() + 1;
      let dd = newDate.getDate();
      let yyyy = newDate.getFullYear();
      let date = mm + "/" + dd + "/" + yyyy;
      return date;
},
    addRow: function() {
      if(!this.description || !this.percentage_completion){
        return false;
      } else {
      DataPostApi.taskSaveApi(
        this.description,
        this.percentage_completion,
        this.completed_date,
        this.ownedBy,
        this.date_created
      )
        .then(response => {
            this.showAllStatus = response.data;
            console.log(this.showAllStatus);
        })
        .catch(error => {
          throw error;
        });
    }
  }
  }
};
</script>

