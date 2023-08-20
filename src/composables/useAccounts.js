import { ref } from 'vue'
import axios from "axios";
// import {configureAxios} from "@/utils/axios.js"

let newUser = ref({
    username: null,
    password: null,
    password2: null,
    email: null,
    useCase: null,
    notes: null,
})

let responseMessage = ref(null);

let resetPassword = ref({
    resetToken: null,
    password: null,
    password2: null,
})

let token = ref(null)
let tokenDecoded = ref(null)

// const {configuredAxios } = configureAxios();


// by convention, composable function names start with "use"
export function useAccounts() {

    function resetNewUser() {
        newUser.value =
        {
            username: null,
            password: null,
            password2: null,
            email: null,
            useCase: null,
            notes: null,
        }
    }


    function resetResetPassword() {
        resetPassword.value =
        {
            resetToken: null,
            password: null,
            password2: null,
        }
    }
    function newAccount() {

        return new Promise(async (resolve, reject) => {

            try {
                var params = newUser.value;
                // console.log("Params", params)
                var response = await axios.post(import.meta.env.VITE_API_URL + '/accounts',  params );
                responseMessage.value = response.data.payload;
                resolve(responseMessage.value);
                //TODO enhance to receive the code as well
                // console.log("Loaded Personas", personas.value)
            }
            catch (error) {
                console.log("Error", error)
                reject(error);

            }
        })
    }

    function login(username, password) {
        return new Promise(async (resolve, reject) => {
            try {
                var params = {username, password};
                var response = await axios.post(import.meta.env.VITE_API_URL + '/accounts/login',  params );
                console.log("Login Response", response)
                resolve(response.data.payload);
            }
            catch (error) {
                console.log("Error", error)
                reject(error);

            }
        })

    }
    function logout() {

    }

    function sendPasswordResetRequest(email) {
        //Create a password reset token
        //Send it to the email address
    }

    function attemptPasswordReset(token) {
        //Submit the new passwords
    }

    // expose managed state as return value
    return {
        newUser,
        resetPassword,
        token,
        tokenDecoded,

        resetNewUser,
        resetResetPassword,
        newAccount,
        login,
        logout,
        sendPasswordResetRequest,
        attemptPasswordReset,
    }
}