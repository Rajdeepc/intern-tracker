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
        <button class="btn btn-primary float-right" @click="addFields()">Add More</button>
        <div class="form-group" v-for="(newInput,index) in newInputArray" :key='index'>
          {{newInput}}
        </div>
        <!-- <div class="form-group">
          <label for="exampleInputPassword1">Add Members</label><span> 
            
        </span> -->
        <div id="content">
          <input id="wrapper" type="email" class="form-control" placeholder="member email">
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
        arrayOfinput: ["<input type='text' class='form-control' id='' aria-describedby='emailHelp' placeholder='Enter email id'>"],
        newInputArray:[]
      };
    },
    mounted() {},
    methods: {
      addFields: function() {
        this.arrayOfinput.map((item) => {
          this.newInputArray.push(item);
        })
  
      }
    }
  };
</script>

