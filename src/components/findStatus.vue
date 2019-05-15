<template>
    <div class="findAll">
        <b-navbar toggleable="md" type="dark" variant="dark">
            <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
            <b-nav-text>
                <h4>Accenture Status Tracker</h4>
            </b-nav-text>
    
            <b-collapse is-nav id="nav_collapse">
                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">
                    <b-nav-item>
                        <b-button @click="clearSessionLogout">Logout</b-button>
                    </b-nav-item>
                </b-navbar-nav>
    
            </b-collapse>
        </b-navbar>
    
    
        <div class="clearfix"></div>
        <!-- find all status form -->
        <div class="bodywrapper">
            <a style="cursor: pointer; text-decoration: underline" class="float-right" v-on:click="navigate(username)">Back to Dashboard</a>
            <div class="form-row">
                <div class="form-group col-xs-2 mb-2">
                    <b-input class="mb-2 mr-sm-2 mb-sm-0" type="date" v-model="date" name="date" id="date" />
                </div>
                <div class="col-xs-3 mb-3">
                    <button class="btn btn-primary" @click="find()">Find Status</button>
                </div>
            </div>
            <br>
            <div v-if="getAllStatus">
                <div class="showstatus" v-if="this.showAllStatus.length > 0">
                    <h4 class="float-left">Showing Status for : <b>{{date}}</b></h4>
                    <!-- <table class="table table-striped ">
                        <thead>
                            <tr>
                                <td><b>SL</b></td>
                                <td><b>Status Description</b></td>
                                <td><b>Completed %</b></td>
                                <td><b>Date Created</b></td>
                                <td><b>ETA</b></td>
                                <td><b>Find: <i v-if="selectedType != 'none'" class="fa fa-close" @click="clearSelection()"> Clear</i> </b> <br><select class="" v-model="selectedType" @change="showDataByDev()">
                                                <option disabled value="none">All</option>
                                                <option :value="status" v-for="(status,index) in distinctName" :key='index' >
                                                    {{status}}
                                                </option>
                                        </select>
                                    
                                </td>
                                <td><b>Follow Up</b></td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(status,index) in showAllStatus" :key='index' v-bind:class="{'isDanger': status['isOverdue'],  'onTrack': !status['isOverdue'],'allGood' : status['notOverdue']}">
                                <td class="width3">{{index + 1}}</td>
                                <td class="width35"> {{status.description}}</td>
                                <td class="width10"> {{status.percentage_completion}} %</td>
                                <td class="width10">{{status.date_created}}</td>
                                <td class="width15"> {{status.completed_date}}
                                    <b-btn class="btn_icon" v-if="status.isOverdue" v-b-tooltip.hover title="'You have exceeded the completion time'">
                                        <i class="fa fa-exclamation-triangle"></i>
                                    </b-btn>
                                </td>
                                <td class="width20">{{status.manager_name}}</td>
                                <td class="width7">
                                    <b-btn v-if="status.isOverdue" v-b-tooltip.hover title="'Send Email for ETA'" class="btn btn-success">
                                        Follow Up <i class="fa fa-envelope"></i>
                                    </b-btn>
                                    <p v-if="!status.isOverdue"> Not Required</p>
                                </td>
                            </tr>
                        </tbody>
                    </table> -->
                </div>
                <!-- show only if no data returned from api -->
                <div v-if="this.showAllStatus.length === 0">
                    <p>No data Found</p>
                </div>
            </div>
        </div>
        <!-- find all status form -->
    
    
    </div>
</template>

<script>
    import DataPostApi from "../services/api/loginValidation";
    import router from "../router.js";
    export default {
        name: "FindStatus",
        data() {
            return {
                selectedType: "none",
                selected_project_name: null,
                selected_manager_name: null,
                showAllStatus: [],
                distinctName: [],
                cloneAllStatus: [],
                date: "",
                isOverdue: false,
                notOverdue: false,
                getAllStatus: false
            };
        },
        computed: {},
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
            clearSelection: function() {
                this.showAllStatus = this.cloneAllStatus;
                this.selectedType = "none";
            },
            showDataByDev: function() {
                let filterType = this.selectedType;
                let filteredArr = this.showAllStatus;
    
                if (filterType && filterType.length) {
                    this.showAllStatus = this.cloneAllStatus.filter(item => {
                        return item.manager_name == filterType;
                    });
                }
            },
            getTodayDate: function(dateInput) {
                let newDate = dateInput;
                let mm = newDate.getMonth() + 1;
                let dd = newDate.getDate();
                let yyyy = newDate.getFullYear();
                let date = mm + "/" + dd + "/" + yyyy;
                return date;
            },
            find: function() {
                this.getAllStatus = true;
                this.date = this.getTodayDate(new Date(this.date));
                DataPostApi.getAllStatusByDateCreated(this.date).then(response => {
                    this.showAllStatus = response;
                    this.cloneAllStatus = response;
                    console.log("Status by date", JSON.stringify(this.showAllStatus));
                    this.styleRows();
                    this.selectedType = "none";
                });
            },
            styleRows: function() {
                this.distinctName = [];
                let unique = {};
                this.showAllStatus.map(item => {
                    if (typeof unique[item.manager_name] == "undefined") {
                        this.distinctName.push(item.manager_name);
                        console.log("Distinct Name" + this.distinctName);
                    }
                    unique[item.manager_name] = 0;
                    let completedDate = Date.parse(item.completed_date);
                    let todayDate = Date.parse(new Date());
                    if (item.percentage_completion < 100 && completedDate < todayDate) {
                        item.isOverdue = true;
                        item.notOverdue = false;
                    } else if (
                        item.percentage_completion === 100 &&
                        completedDate < todayDate
                    ) {
                        item.notOverdue = true;
                    } else {
                        item.isOverdue = false;
                        item.notOverdue = false;
                    }
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

<style scoped>
    label {
        display: inline-block;
        margin-bottom: 0.5rem;
        width: 100%;
    }
    
    .isDanger {
        border-left: 5px solid red;
    }
    
    .onTrack {
        border-left: 5px solid orange;
    }
    
    .allGood {
        border-left: 5px solid green;
    }
    
    .btn_icon {
        background: transparent;
        border: 0px;
        color: red;
    }
    
    .btn_icon:hover {
        background: transparent;
        border: 0px;
        color: red;
    }
    
    .navbar-dark .navbar-text {
        color: #fff;
    }
    .fa-close{
        color: red
    }
    
</style>

