import Axios from 'axios'
// import { useAccounts } from '@/composables/useAccounts.js'
// const { token, tokenDecoded } = useAccounts();


export function configureAxios() {

    let configuredAxios = Axios;

    //axios
    configuredAxios.defaults.headers.common.Accept = 'application/json'
    //Axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

    configuredAxios.interceptors.request.use(
        config => {
            let token = localStorage.getItem('token');

            if (token) {
                config.headers = {
                    'Authorization': `Bearer ${token}`
                }
            }
            return config;
        },
        error => Promise.reject(error)
    );

    configuredAxios.interceptors.response.use(
        response => {
            if (response?.headers?.['auth-token']) {
                // token.value = response.headers['auth-token'];
                // tokenDecoded.value = JSON.parse(response.headers['auth-token-decoded']);
                localStorage.setItem('token', response.headers['auth-token']);
                localStorage.setItem('tokenDecoded', response.headers['auth-token-decoded']);
            }

        },
        error => {
            if (error.response.status === 403 || error.response.status === 401) {
                // token.value = null;
                // tokenDecoded.value = null;
                localStorage.removeItem('token');
                localStorage.removeItem('tokenDecoded');
                window.location.reload(true);
            }
            return Promise.reject(error);
        }
    );


    // module.exports = { configuredAxios };


    return {configuredAxios}
}

//   let url=null

// if(localStorage.getItem("config")!==null){
//     let config = JSON.parse(localStorage.getItem("config"))
//     url = config
// }
