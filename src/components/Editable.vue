<template>
    <b-container class="bv-example-row">
    <b-row>
        <b-col> 
            <input type="text" placeholder="description" v-model="description" id="value" name="value" class="form-control">
        </b-col>
        <b-col> 
             <input type="number" placeholder="percentage_complete" v-model="percentage_completion" class="form-control" id="percentage_completion" name="percentage_completion">
        </b-col>
        <b-col> 
             <input type="text" placeholder="ETA" v-model="completed_date" id="completed_date" name="completed_date" class="form-control"></b-col>
        <b-col> 
             <button class="addRowBtn btn btn-primary" v-on:click.prevent="addRow" value="">Add new Row</button>
        </b-col>
    </b-row>
    <p v-if="showMessage === true">Data SuccessFully Saved</p>
     <div v-bind:proplabels="labels"> </div>
</b-container>
</template>

<script>
import DataPostApi from "../services/api/loginValidation";

export default {
  name: "Chatpanel",
  props: ["proplabels"],
  data() {
    return {
        showMessage:false,
      description: "",
      percentage_completion: 0,
      completed_date: "",

      nextBarId: 1,
      lastId: 0
    };
  },
  methods: {
    addRow: function() {
      DataPostApi.projectDetailsApi(
        this.description,
        this.percentage_completion,
        this.completed_date
      )
        .then(response => {
            if(response.isSaveSuccessful === true){
                this.showMessage = true;
            }
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

