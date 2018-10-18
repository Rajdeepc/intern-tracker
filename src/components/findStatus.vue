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
        <br>
        <h4 class="float-left">Find Status By Date:</h4>
        <a style="cursor: pointer; text-decoration: underline" class="float-right" v-on:click="navigate(username)">Back to Dashboard</a>
        <div class="clearfix"></div>
        <br>
        <!-- find all status form -->
        <div class="form-row">
            <div class="form-group col-xs-2 mb-2">
                <label for="validationCustom01">Select Date</label>
                <b-input class="mb-2 mr-sm-2 mb-sm-0" type="date" v-model="date" name="date" id="date" />
            </div>
            <div class="col-xs-3 mb-3">
                <label for="validationCustom01" class="empty-label">&nbsp;</label>
                <button class="addRowBtn btn btn-success" @click="find()">Find Status</button>
            </div>
        </div>
    
        <!-- find all status form -->
        <div class="showstatus" v-if="this.showAllStatus.length > 0">
            <div>Showing Status for : <b>{{date}}</b></div>
            <table class="table table-striped">
                <thead>
                    <tr class="">
                        <td>Sl</td>
                        <td>Status</td>
                        <td>Percentage Completed</td>
                        <td>Date Created</td>
                        <td>Date To Be Completed</td>
                        <td>Owned By</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(status,index) in showAllStatus" :key='index' v-bind:class="{isDanger : status.isOverdue}">
                        <td>{{index + 1}}</td>
                        <td> {{status.description}}</td>
                        <td> {{status.percentage_completion}}</td>
                        <td>{{status.date_created}}</td>
                        <td> {{status.completed_date}}</td>
                        <td>{{status.manager_name}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    
        <div v-if="this.showAllStatus.length < 0">
            <p>No data Found</p>
        </div>
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
                selected_manager_name: null,
                showAllStatus: [],
                date: "",
                isOverdue: false
            };
        },
        mounted() {
            this.username = this.$route.params.username;
            console.log("username" + this.username);
        },
        beforeCreate: function() {
            if (!this.$session.exists("username")) {
                this.$router.push("/");
            }
        },
        methods: {
            getTodayDate: function(dateInput) {
                let newDate = dateInput;
                let mm = newDate.getMonth() + 1;
                let dd = newDate.getDate();
                let yyyy = newDate.getFullYear();
                let date = mm + "/" + dd + "/" + yyyy;
                return date;
            },
            find: function() {
                this.date = this.getTodayDate(new Date(this.date));
                DataPostApi.getAllStatusByDateCreated(this.date).then(
                    response => {
                        this.showAllStatus = response;
                        console.log("Status by date", JSON.stringify(this.showAllStatus));
                        this.styleRows();
                        
                    }
                );
            },
            styleRows: function() {
                this.showAllStatus.map(item => {
                            let completedDate = Date.parse(item.completed_date);
                            let todayDate = Date.parse(new Date());
                            if (item.percentage_completion < 100 && completedDate < todayDate) {
                                item.isOverdue = true;
                            } else {
                                item.isOverdue = false;
                            }
                        })
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

<style scoped>
    label {
        display: inline-block;
        margin-bottom: 0.5rem;
        width: 100%;
    }
    
    tr.isDanger {
        border-left: 2px solid red;
    }
</style>

