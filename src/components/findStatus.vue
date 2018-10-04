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
        <a style="cursor: pointer; text-decoration: underline" v-on:click="navigate(username)">Navigate to Dashboard</a>
    
    </div>
</template>

<script>
    import router from "../router.js";
    export default {
        name: "FindStatus",
        data() {
            return {
                projectList: []
            }
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
