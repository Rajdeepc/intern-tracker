import axios from 'axios';

export default {

    /**
     * axios call to validate login credentials
     */
    validateLogin(username,password) {
        const body = {
            username: username,
            password: password
          };
        const url = "http://localhost:3000/login";
        return axios.post(url,body)
        .then(response => {
            return response.data;
        })
    },
    
    /** Save status to db */
    
    taskSaveApi(description,percentage_completion,completed_date,manager_name,date_created,project_name) {
       this.statusId ++ ;
        const body = {
                description:description,
                percentage_completion:percentage_completion,
                completed_date:completed_date,
                manager_name:manager_name,
                date_created:date_created,
                project_name:project_name
          };
        const url = "http://localhost:3000/addname";
        return axios.post(url,body)
        .then(response => {
            return response.data;
        })
    },
        /** Add Project to db by admin */

    projectsaveApi(date_created,manager_name,project_name,no_of_members,member_names) {
        const body = {
                date_created:date_created,
                project_name:project_name,
                manager_name:manager_name,
                no_of_members:no_of_members,
                member_names:member_names
          };
        const url = "http://localhost:3000/postprojectdata";
        return axios.post(url,body)
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

    // getUtterance() {
    //     const url = "http://localhost:3000/getlogs";
    //     return axios.get(url)
    //     .then(response => {
    //         return response;
    //     })
    // },
    /** update fields */

    updateStatusById(_id,description,percentage_completion,completed_date) {
        const url = `http://localhost:3000/${_id}/updatestatus`;
        const body ={
            _id:_id,
            description:description,
            percentage_completion:percentage_completion,
            completed_date:completed_date
        }
        return axios.put(url,body)
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
    sendStatusMail(to,htmlbody) {
        const body = {
            to:to,
            htmlbody:htmlbody
      };
    const url = "http://localhost:3000/sendemail";
    return axios.post(url,body)
    .then(response => {
        return response.data;
    })
}
}

