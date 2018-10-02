<template>
    <div class="findAll">
        <b-form @submit.prevent action="/insert" method="post">
            <div class="form-row">
                <div class="form-group col-md-3 mb-3">
                    <label for="validationCustom01">Project</label>
                    <div class="selectProject">
                        <select v-model="projectSelected" @change="showAllProject()">
                      <option disabled value="">Please select one project</option>
                      <option :value="status" v-for="(status,index) in projectList" :key='index'>
                          {{ status.project_name }}
                      </option>
                      </select>
                    </div>
                </div>
                <div class="form-group col-xs-2 mb-2">
                    <label for="validationCustom01">Member</label>
                    <div class="selectProject">
                        <select v-model="projectSelected" @change="showAllProject()">
                      <option disabled value="">Please select one member</option>
                      <option :value="status" v-for="(status,index) in projectList" :key='index'>
                          {{ status.project_name }}
                      </option>
                      </select>
                    </div>
                </div>
                <div class="form-group col-xs-2 mb-2">
                    <label for="validationCustom01">Date</label>
                    <b-input class="mb-2 mr-sm-2 mb-sm-0" type="date" v-model="date" name="completed_date" id="" />
                </div>
                <div class="col-xs-3 mb-3">
                    <button class="addRowBtn btn btn-success" @click="findStatus()">Find</button>
                </div>
            </div>
        </b-form>
    </div>
</template>

<script>
    export default {
        name: "FindStatus",
        data() {}
    };
</script>
