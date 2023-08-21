import axios from 'axios'

import { useTokens } from '@/composables/useTokens.js'
const { setTokens, unsetTokens } = useTokens();

var config = {
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        Accept: "application/json",
    },
}

const configuredAxios = axios.create(config);

//Request
configuredAxios.interceptors.request.use(
    config => {
        let token = sessionStorage.getItem('token');

        if (token) {
            config.headers = {
                'Authorization': `Bearer ${token}`
            }
        }
        return config;
    },
    error => Promise.reject(error)
);

//Analyze Responses
configuredAxios.interceptors.response.use(
    response => {
        if (response?.headers?.['auth-token']) {
            sessionStorage.setItem('token', response.headers['auth-token']);
            sessionStorage.setItem('tokenDecoded', response.headers['auth-token-decoded']);
            setTokens(response.headers['auth-token'], response.headers['auth-token-decoded'])
        }

        return Promise.resolve(response);

    },
    error => {
        if (error.response.status === 403 || error.response.status === 401) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('tokenDecoded');
            unsetTokens()
            // window.location.reload(true);
        }
        return Promise.reject(error);
    }
);

export default configuredAxios;
