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
    }
    
}

