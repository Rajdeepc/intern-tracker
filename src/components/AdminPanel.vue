<template>
  <div>
    <b-modal id="modallg" title="Add Project Details">
      <form @submit.prevent action="/addproject" method="post">
        <p>This panel is only visible to TL and Above</p>
        <div class="form-group">
          <label for="exampleInputEmail1">Your Name</label>
          <input type="text" class="form-control" id="" v-model="getUsername" readonly="" name="ownedBy" aria-describedby="emailHelp">
        </div>
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
  export default {
    name: "AdminPanel",
    props: ["getUsername"],
    data() {
      return {
        newInputArray:[""],
        memberArr: [],
        project_name:''
      };
    },
    mounted() {},
    methods: {
      addFields: function() {
        this.newInputArray.push("");
  
      }
    }
  };
</script>

