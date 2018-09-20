<template>
  <div>
    <b-modal id="modallg" title="Add Project Details" @ok="handleOk">
      <form @submit.stop.prevent="handleSubmit">
        <p>This panel is only visible to TL and Above</p>
        <div class="form-group">
          <label for="exampleInputEmail1">Your Name</label>
          <input type="text" class="form-control" id="" v-model="getUsername" readonly="" name="ownedBy" aria-describedby="emailHelp">
        </div>
                <input type="hidden" v-model="no_of_members"/>

        <div class="form-group">
          <label for="exampleInputEmail1">Add Your Project</label>
          <input type="text" class="form-control" id="" v-model="project_name" readonly="" name="ownedBy" aria-describedby="emailHelp">
        </div>
        <label for="exampleInputEmail1">Add Members</label>
        <button class="btn btn-primary float-right" @click="addFields()">Add More</button>
        <div class="form-group" v-for="(newInput,index) in newInputArray" :key='index'>
          <input type='text' class='form-control' id='' aria-describedby='emailHelp' placeholder='Enter member email id' v-model="memberArr[index]">
        </div>
  
  </form>
  </b-modal>
  </div>
</template>

<script>
  import DataPostApi from "../services/api/loginValidation";

  export default {
    name: "AdminPanel",
    props: ["getUsername"],
    data() {
      return {
        newInputArray:[""],
        memberArr: [],
        project_name:'',
        no_of_members:this.newInputArray.length
      };
    },
    mounted() {},
    methods: {
      addFields: function() {
        this.newInputArray.push("");
        console.log(this.newInputArray);
      },
      handleOk: function(e){
        e.preventDefault();
        if(!this.project_name){
          alert('Please enter the project name');
        } else {
          this.handleSubmit();
        }
      },
      handleSubmit: function(){
        DataPostApi.projectsaveApi(date_created,ownedBy,project_name,no_of_members,member_names)
        .then(response => {
            if(response.status === "saved") {
              console.log('Data saved to db');
            }
        })
      }
    }
  };
</script>

