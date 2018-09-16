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

    taskSaveApi(description,percentage_completion,completed_date,ownedBy) {
        const body = {
            description:description,
                percentage_completion:percentage_completion,
                completed_date:completed_date,
                ownedBy:ownedBy
          };
        const url = "http://localhost:3000/addname";
        return axios.post(url,body)
        .then(response => {
            return response.data;
        })
    },

    projectDetailsApi() {
        const url = "https://demo6727947.mockable.io/project-details";
        return axios.get(url)
        .then(response => {
            return response.data;
        })
    }
    
}

