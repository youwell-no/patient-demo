import jwtDecode from 'jwt-decode';


let noBrowserCookie = null;
let cookieName = 'unknown';
if (typeof document === 'undefined') cookieName = 'serverside';
else if (window.serverParams) cookieName = window.serverParams.cookieName;
else cookieName = document.getElementById('react-app').getAttribute('data-cookie-name');

function setCookie(cname, cvalue) {
    const exdays = 1;
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = `expires=${d.toUTCString()}`;
    const cookie = `${cname}=${cvalue};${expires};path=/`;

    if (typeof document === 'undefined') {
        noBrowserCookie = cookie;
    } else {
        document.cookie = cookie;
    }
}

function deleteCookie(cname) {
    const cookie = `${cname}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;

    if (typeof document === 'undefined') {
        noBrowserCookie = cookie;
    } else {
        document.cookie = cookie;
    }
}

function getCookie(cname) {
    let cookie;
    if (typeof document === 'undefined') {
        cookie = noBrowserCookie;
    } else {
        cookie = document.cookie;
    }
    const name = `${cname}=`;
    const decodedCookie = decodeURIComponent(cookie);
    const ca = decodedCookie.split(';');

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

class Auth {
    /**
     * Authenticate a user. Save a token string in Local Storage
     *
     * @param {string} token
     */
    static authenticateUser(token) {
        setCookie(cookieName, token);
    }

    /**
     * Check if a user is authenticated - check if a token is saved in Local Storage
     *
     * @returns {boolean}
     */
    static isUserAuthenticated(tokenIn, requiredProperty) {
        const token = tokenIn || this.getToken();
        if (!token) {
            return false;
        }

        try {
            const decoded = jwtDecode(token);
            return decoded.exp > (Date.now() / 1000) && (!!decoded[requiredProperty] || !requiredProperty);
        } catch (err) {
            return false;
        }
    }

    static getTokenData(key) {
        const token = this.getToken();
        if (!token) {
            return null;
        }

        try {
            const decoded = jwtDecode(token);
            return decoded[key];
        } catch (err) {
            return null;
        }
    }

    /**
     * Deauthenticate a user. Remove a token from Local Storage.
     *
     */
    static deauthenticateUser() {
        deleteCookie(cookieName);
    }

    /**
     * Get a token value.
     *
     * @returns {string}
     */

    static getToken() {
        return getCookie(cookieName);
    }
}

export default Auth;
