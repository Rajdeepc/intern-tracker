<template>
<div class="editableform">
    <div class="formToAdd">
      <h4>Add Your Status For today:</h4>
       <b-form inline @submit.prevent>
        <div class="form-group">
            <b-input class="mb-2 mr-sm-2 mb-sm-0" type="text" v-model="description"/>
        </div>
        <div class="form-group">
            <b-input class="mb-2 mr-sm-2 mb-sm-0" type="text" v-model="percentage_completion"/>
        </div>
        <div class="form-group">
            <!-- <b-input class="mb-2 mr-sm-2 mb-sm-0"  type="text" v-model="completed_date"/> -->
            <datepicker></datepicker>
        </div>
         <!-- <div class="form-group">
            Owned By: {{ownedBy}}
        </div> -->
       <button class="addRowBtn btn btn-primary" @click="addRow()">Add new Row</button>
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
      DataPostApi.projectDetailsApi(
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
      //   this.lastId = this.labels.length;
      //   var newRow = {
      //     id: this.nextBarId++,
      //     description: this.description,
      //     percentage_completion: this.percentage_completion,
      //     completed_date: this.completed_date
      //   };
      //   this.labels.push(newRow);
      //   alert(JSON.stringify(newRow));
    }
  }
};
</script>

