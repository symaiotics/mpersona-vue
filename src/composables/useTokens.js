import { ref, computed } from 'vue'


let tokenSet = ref(false);

let token = ref(null)
let tokenDecoded = ref(null)


// by convention, composable function names start with "use"
export function useTokens() {
    // expose managed state as return value

    //WHen the page reloads, try to get the token
    function recallTokens() {
        try {
            var t = sessionStorage.getItem('token');
            var tD = sessionStorage.getItem('tokenDecoded');
            if (t && tD) {
                token.value = t;
                tokenDecoded.value = JSON.parse(tD);
                tokenSet.value = true;
            }
        }
        catch (error) {
            console.log(error)
            return null;
        }

    }

    function setTokens(t, tD) {
        sessionStorage.setItem('token', t)
        sessionStorage.setItem('tokenDecoded', tD)
        token.value = t;
        tokenDecoded.value = JSON.parse(tD);
        tokenSet.value = true;
    }

    function unsetTokens() {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('tokenDecoded')
        token.value = null;
        tokenDecoded.value = null;
        tokenSet.value = false;
    }

    return {
        tokenSet, token, tokenDecoded, recallTokens, setTokens, unsetTokens
    }
}