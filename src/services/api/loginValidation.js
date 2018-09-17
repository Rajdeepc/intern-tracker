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
        const url = "http://demo6727947.mockable.io/loginValidation";
        return axios.post(url,body)
        .then(response => {
            return response.data;
        })
    },

    taskSaveApi(description,percentage_completion,completed_date,ownedBy,date_created) {
        const body = {
                description:description,
                percentage_completion:percentage_completion,
                completed_date:completed_date,
                ownedBy:ownedBy,
                date_created:date_created
          };
        const url = "http://localhost:3000/addname";
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
    getStatusbyDate() {
        const url = "http://localhost:3000/getallData";
        return axios.get(url)
        .then(response => {
            return response;
        })
    },

    sendStatusMail() {
        
    }
}

