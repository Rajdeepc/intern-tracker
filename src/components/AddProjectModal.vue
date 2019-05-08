<template>
    <b-form @submit="onSubmit" @reset="onReset">
      <b-form-group id="input-group-1" label="Project name:" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="project_name"
          type="text"
          required
          placeholder="Enter Project Name"
        ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-2" label="Project Description:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="project_description"
          required
          placeholder="Enter Project Description"
        ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-3" label="Status:" label-for="input-3">
        <b-form-select id="input-3" v-model="proj_status_selected" :options="proj_status_all" required></b-form-select>
        <p>Selected {{proj_status_selected}} </p>
      </b-form-group>
      <b-button type="submit" variant="primary">Save</b-button>&nbsp;
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
</template>

<script>
import DataPostApi from "../services/api/loginValidation";

export default {
    name:'AddProjectModalTemplate',
    props:["showModal"],
    data() {
    return {
      hideModal: false,
      project_name: "",
      project_description: "",
      proj_status_selected: null,
      proj_status_all: [
        { text: "Select One", value: null },
        { text: "Started", value: "Started"},
        { text: "In Progress", value: "In Progress" },
        { text: "Completed", value: "Completed" }
      ]
    };
  },
  methods:{
    onSubmit(evt) {
        evt.preventDefault();
        this.projectId ++ ;
        DataPostApi.addProjectToList(this.project_name,this.project_description,this.proj_status_selected)
        .then((response) => {
            console.log("response from save api of project" + JSON.stringify(response));
            let responseFromAddProject = response.saved;
            this.$emit('hideModalFromChild', responseFromAddProject);
        })
        .catch(err => {
            console.log("error from save api" + err);
        })
      },
    onReset(evt){
        this.project_name = '';
          this.project_description = '';
          this.proj_status_selected = null;
    },
  }
};
</script>
<style scoped>
</style>


