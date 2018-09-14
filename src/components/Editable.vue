<template>
<div class="editableform">
    <div class="formToAdd">
      <h4>Add Your Status For today:</h4>
       <b-form @submit.prevent>
           <div class="form-row">

        <div class="form-group col-md-3 mb-3">
                <label for="validationCustom01">Status</label>

            <b-input class="mb-2 mr-sm-2 mb-sm-0" type="text" v-model="description" required/>
        </div>
        <div class="form-group col-md-3 mb-3">
                <label for="validationCustom01">Percentage Completed</label>

            <b-input class="mb-2 mr-sm-2 mb-sm-0" type="text" v-model="percentage_completion" required/>
        </div>
        <div class="form-group col-md-3 mb-3">
                <label for="validationCustom01">Date of Completion</label>

            <!-- <b-input class="mb-2 mr-sm-2 mb-sm-0"  type="text" v-model="completed_date"/> -->
            <datepicker></datepicker>
        </div>
         <!-- <div class="form-group">
            Owned By: {{ownedBy}}
        </div> -->
        <div class="col-md-3 mb-3">
                <label for="validationCustom01">&nbsp;</label>

       <button class="addRowBtn btn btn-primary" @click="addRow()">Add new Row</button>
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
                <td>Date To Be Completed</td>
                <td>Owned By</td>
                </tr>
                </thead>
                <tbody>
                    <tr v-for="(status,index) in showAllStatus" :key='index'>
                       <td>{{index + 1}}</td>
                        <td>{{status.description}}</td>
                         <td>{{status.percentage_completion}}</td>
                          <td>{{status.completed_date}}</td>
                          <td>{{status.ownedBy}}</td>
                        </tr>
                    </tbody>
            </table>
            </div>
</div>
 </template>
<script>
import Datepicker from 'vuejs-datepicker';
import DataPostApi from "../services/api/loginValidation";

export default {
  name: "Chatpanel",
  props: ["proplabels"],
  data() {
    return {
      showAllStatus:[],
      showMessage: false,
      description: "",
      percentage_completion: 0,
      completed_date: "",
      ownedBy:'',
      nextBarId: 1,
      lastId: 0
    };
  },
  components:{
    Datepicker
  },
  methods: {
    addRow: function() {
      if(!this.description || !this.percentage_completion || !this.completed_date){
        return
      } else {
      DataPostApi.taskDetailsApi(
        this.description,
        this.percentage_completion,
        this.completed_date,
        this.ownedBy
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

