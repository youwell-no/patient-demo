const urlvalues = {
    baseUrl: '',
    media: '/media',
    loginredirect: '/login',
    app: {
        message: 'app/message',
        auth: 'app/auth',
        user: 'app/user',
        program: 'app/program',
    },
};

const urls = { ...urlvalues };

export const setBaseUrl = (baseUrl) => {
    urls.baseUrl = baseUrl;
    urls.media = `${baseUrl}/media`;
    urls.loginredirect = `${baseUrl}/login`;
};

export const currentRoot = () => `${window.location.protocol}//${window.location.host}`;
export default urls;
