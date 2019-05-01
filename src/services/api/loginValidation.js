import axios from 'axios';

export default {

    /**
     * axios call to post signup data
     */
    addtosignupDb(email,username, password,confpassword) {
        const body = {
            email:email,
            username: username,
            password: password,
            confpassword: confpassword
        };
        const url = "http://localhost:3000/signup";
        return axios.post(url, body)
            .then(response => {
                return response.data;
            })
    },
    /**
     * axios call to validate sign in creds
     */
    validateSignIn(email, password) {
        const body = {
            email:email,
            password: password
        };
        const url = "http://localhost:3000/signin";
        return axios.post(url, body)
            .then(response => {
                return response.data;
            })
    },
    /** Save status to db */

    taskSaveApi(topic_name,description, percentage_completion, manager_name, date_created, project_name) {
        this.statusId++;
        const body = {
            topic_name:topic_name,
            description: description,
            percentage_completion: percentage_completion,
            completed_date: completed_date,
            manager_name: manager_name,
            date_created: date_created,
            project_name: project_name
        };
        const url = "http://localhost:3000/addname";
        return axios.post(url, body)
            .then(response => {
                return response.data;
            })
    },
    /** Add Project to db by admin */

    projectsaveApi(project_name, member_email, manager_name, allTasks) {
        const body = {
            project_name: project_name,
            member_email: member_email,
            manager_name: manager_name,
            allTasks: allTasks
        };
        const url = "http://localhost:3000/postprojectdata";
        return axios.post(url, body)
            .then(response => {
                return response.data;
            })
    },

    projectDetailsApi(username) {
        console.log(username);
        const url = `http://localhost:3000/getprojectdata/${username}`;
        return axios.get(url)
            .then(response => {
                console.log(response);
                return response;
            })
    },

    /** get status by date on load**/
    getStatusbyDate(project_name) {
        const url = `http://localhost:3000/getallData/${project_name}`;
        return axios.get(url)
            .then(response => {
                return response;
            })
    },

    /** update fields */

    updateStatusById(_id, description, percentage_completion, completed_date) {
        const url = `http://localhost:3000/${_id}/updatestatus`;
        const body = {
            _id: _id,
            description: description,
            percentage_completion: percentage_completion,
            completed_date: completed_date
        }
        return axios.put(url, body)
            .then(response => {
                return response.data;
            })
    },

    /**
     * delete status
     */

    deleteStatusById(_id) {
        console.log("StatusId" + _id);
        const url = `http://localhost:3000/${_id}/deleterecord`;
        return axios.delete(url)
            .then(response => {
                return response;
            })
    },
    sendStatusMail(to, htmlbody) {
        const body = {
            to: to,
            htmlbody: htmlbody
        };
        const url = "http://localhost:3000/sendemail";
        return axios.post(url, body)
            .then(response => {
                return response.data;
            })
    },

    getAllStatusByDateCreated(date_created) {
        const body = {
            date_created:date_created
        };
        const url = "http://localhost:3000/getallStatusbyDate";
        return axios.post(url,body)
        .then(response => {
            return response.data;
        })
    },




    updateStartTaskById(member_email,taskID,task_status,start_date,index) {
        const body = {
            member_email:member_email,
            taskID:taskID,
            task_status:task_status,
            start_date:start_date,
            index:index
        };
        const url = `http://localhost:3000/${taskID}/taskStatus`;
        return axios.put(url,body)
        .then(response => {
            return response.data;
        })
    }
}

