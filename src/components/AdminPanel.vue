<template>
  <div>
    <b-modal id="modallg" title="Add Project Details" @ok="handleOk" ref="modal">
      <form @submit.stop.prevent="handleSubmit" method="post">
        <p><i>This panel is only visible to TL and Above</i></p>
        <div class="form-group">
          <label for="exampleInputEmail1">Supervisor Name:</label>
          <input type="text" class="form-control" id="" v-model="getUsername" readonly="" name="manager_name" aria-describedby="emailHelp">
        </div>
          <div class="form-group">
          <label for="exampleInputEmail1">Add Your Project Name:</label>
          <input type="text" class="form-control" id="" v-model="project_name" name="project_name" aria-describedby="project_name" required>
        </div>
        <label>Your Project Members:</label><a class="btn btn-success float-right" @click="addFields()">Add Members<i class="fa fa-plus"></i></a>
        <div class="form-group" v-for="(newInput,index) in newInputArray" :key='index'>
          <span><input type='text' class='form-control' id='' aria-describedby='addmembers' placeholder='Enter member email id' v-model="memberArr[index]"></span>
          <span><a v-on:click="removeElement(index);" style="cursor: pointer">Cancel <i class="fa fa-close"></i></a></span>
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
        manager_name: this.getUsername,
        date_created: this.getTodayDate()
      };
    },
    mounted() {
      
    },
    methods: {
      getTodayDate: function() {
        let newDate = new Date();
        let mm = newDate.getMonth() + 1;
        let dd = newDate.getDate();
        let yyyy = newDate.getFullYear();
        let date = mm + "/" + dd + "/" + yyyy;
        return date;
      },
      addFields: function() {
        this.newInputArray.push("");
        console.log("new array with email ids" + this.memberArr)
       console.log("no of members" + this.newInputArray.length)
      },
      handleOk (evt) {
      // Prevent modal from closing
      evt.preventDefault()
      if (!this.project_name) {
        alert('Please enter your name and project members')
      } else {
        this.handleSubmit()
      }
    },
    clearFields(){
      this.project_name = "",
      this.memberArr = []
    },
    handleSubmit () {
      this.no_of_members = this.memberArr.length;
      this.manager_name = this.getUsername;
      this.member_names = this.memberArr;
      this.date_created = this.getTodayDate();
      DataPostApi.projectsaveApi(
        this.date_created,this.manager_name,this.project_name,this.no_of_members,this.member_names
      )
      .then(response => {
        if(response.saved === true){
          this.clearFields();
          this.$refs.modal.hide();
        }
      }).catch(error => {
        console.log("Error in saving" + error);
      })
    },
      removeElement: function(index) {
       this.newInputArray.splice(index, 1);
      },
    }
  };
</script>

