const urls = {
    home: '/',
    login: '/login',
    loginParts: {
        accessCode: 'code',
    },
    logout: '/logout',

    inside: {
        home: '/inside',
        profile: '/inside/profile',
        chat: '/inside/chat',
        programredirect: '/inside/programredirect',
        program: {
            home: '/inside/program',
            parts: {
                do: 'do',
                contentPage: 'content',
                module: 'module',
                plan: 'plan',
                scheduled: 'scheduled',
            },
        },
        progress: '/inside/progress',
    },
};

export default urls;
