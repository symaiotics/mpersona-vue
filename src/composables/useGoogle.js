import { ref, computed } from 'vue'
// import axios from "axios";
import configuredAxios from "@/utils/axios.js"
import { notify } from "notiwind"


let googleCode = ref(null)
let googleTokens = ref(null)
let googleTokensDecoded = ref(null)
let numberOfEmails = ref(10)

let emails = ref(null)
let selectedEmail = ref(null);

// by convention, composable function names start with "use"
export function useGoogle() {

    function clearTokens() {
        googleCode.value = null;
        googleTokens.value = null;
        googleTokensDecoded.value = null;
    }

    function upgradeGoogleCode() {

        return new Promise(async (resolve, reject) => {

            try {
                var params = { code: googleCode.value };
                // console.log("Params", params)
                var response = await configuredAxios.post('/google/upgrade', params);
                console.log(response);
                googleTokens.value = response.data.payload.tokens;
                googleTokensDecoded.value = response.data.payload.tokensDecoded;
                googleCode.value = null;
                resolve(googleTokens.value)
            }
            catch (error) {
                notify({ group: "failure", title: "Error", text: "Error upgrading your code to a token." }, 4000) // 4s
                console.log("Error", error)
                reject(error);

            }
        })
    }



    function getEmails() {

        return new Promise(async (resolve, reject) => {

            try {
                var params = { tokens: googleTokens.value, numberOfEmails: numberOfEmails.value };
                // console.log("Params", params)
                var response = await configuredAxios.post('/google/emails', params);
                console.log(response);
                emails.value = response.data.payload;
                // googleTokenDecoded.value = response.data.payload.tokenDecoded;
                resolve(true)
            }
            catch (error) {
                notify({ group: "failure", title: "Error", text: "Error loading your emails." }, 4000) // 4s
                console.log("Error", error)
                reject(error);

            }
        })
    }


    // expose managed state as return value
    return {
        googleCode,
        googleTokens,
        googleTokensDecoded,
        emails,
        selectedEmail,

        upgradeGoogleCode,
        clearTokens,
        getEmails,

    }
}