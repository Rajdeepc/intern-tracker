<template>
    <div class="findAll">
        <b-navbar toggleable="md" type="dark" variant="info">
            <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
            <b-nav-text>Submit Your Status</b-nav-text>
            <b-collapse is-nav id="nav_collapse">
                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">
                    <b-nav-item>
                        <b-btn v-b-modal.modallg variant="primary">Add Project</b-btn>
                    </b-nav-item>
                    <b-nav-item>
                        <b-button @click="clearSessionLogout">Logout</b-button>
                    </b-nav-item>
                </b-navbar-nav>
    
            </b-collapse>
        </b-navbar>
        <h1>I am in all status</h1>
        <!-- find all status form -->
        <b-form @submit.prevent action="/insert" method="post">
            <div class="form-row">
                <div class="form-group col-md-3 mb-3">
                    <label for="validationCustom01">Select Project</label>
                    <b-form-select v-model="selected_project_name" class="mb-3">
                        <option :value="status.project_name" v-for="(status,index) in projectList" :key='index'>
                            {{ status.project_name }}
                        </option>
                    </b-form-select>
                    <div>Selected: <strong>{{ selected_project_name }}</strong></div>
                </div>
                <div class="form-group col-md-3 mb-3">
                    <label for="validationCustom01">Select Member</label>
                    <b-form-select v-model="selected_manager_name" class="mb-3">
                        <option :value="status.manager_name" v-for="(status,index) in projectList" :key='index'>
                            {{ status.manager_name }}
                        </option>
                    </b-form-select>
                        <div>Selected: <strong>{{ selected_manager_name }}</strong></div>
                </div>
                <div class="form-group col-xs-2 mb-2">
                    <label for="validationCustom01">Select Date</label>
                    <b-input class="mb-2 mr-sm-2 mb-sm-0" type="date" v-model="completed_date" name="completed_date" id="completed_date" />
                     <div>Selected: <strong>{{ completed_date }}</strong></div>
                </div>
    
    
                <div class="col-xs-3 mb-3">
                    <label for="validationCustom01" class="empty-label">&nbsp;</label>
                    <button class="addRowBtn btn btn-success" @click="find()">Go</button>
                </div>
            </div>
        </b-form>
    
        <!-- find all status form -->
        <a style="cursor: pointer; text-decoration: underline" v-on:click="navigate(username)">Navigate to Dashboard</a>
    
    </div>
</template>

<script>
    import DataPostApi from "../services/api/loginValidation";
    import router from "../router.js";
    export default {
        name: "FindStatus",
        data() {
            return {
                selected_project_name: null,
                selected_manager_name:null,
                projectList: []
            };
        },
        mounted() {
            this.username = this.$route.params.username;
            console.log("username" + this.username);
            this.init();
        },
        beforeCreate: function() {
            if (!this.$session.exists("username")) {
                this.$router.push("/");
            }
        },
    
        methods: {
            init() {
                console.log(this.getUsername);
                DataPostApi.getAllProjectData(this.getUsername)
                    .then(response => {
                        this.projectList = response.data;
                        console.log(this.projectList);
                    })
                    .catch(error => {
                        throw error;
                    });
            },
            navigate(username) {
                this.$router.push({
                    name: "dashboard",
                    params: {
                        username: username
                    }
                });
            },
            clearSessionLogout: function() {
                this.$session.remove("username");
                this.$router.push("/");
            }
        }
    };
</script>
