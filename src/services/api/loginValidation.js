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

    projectDetailsApi(description,percentage_completion,completed_date,ownedBy) {
        const body = {
            description:description,
                percentage_completion:percentage_completion,
                completed_date:completed_date,
                ownedBy:ownedBy
          };
        const url = "https://demo6727947.mockable.io/task-details";
        return axios.post(url,body)
        .then(response => {
            return response.data;
        })
    }
    
}

