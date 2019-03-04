import Auth from '../common/Auth';

const HTTP_STATUS_CODES = {
    Unauthorized: 401,
    Forbidden: 403,
};

export const TOKEN_EXPIRED = 'APP/TOKEN_EXPIRED';

class FetchError extends Error {
    constructor(url, status, data) {
        super(data);
        this.url = url;
        this.status = status;

        if (!data) {
            this.errorCode = status;
        } else {
            try {
                const json = JSON.parse(data);
                this.errorCode = json.errorCode;
            } catch (e) {
                this.errorCode = status;
            }
        }
    }
}

export const handleErrors = () => (response) => {
    if (!response.ok) {
        return response.text().then(data => Promise.reject(new FetchError(response.url, response.status, data)));
    }

    return Promise.resolve(response);
};

export const json = response => response.json();

export const text = response => response.text();

export const blob = (response) => {
    const disposition = response.headers.get('content-disposition');
    const contentType = response.headers.get('content-type');
    const filenameValues = disposition && disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    const filename = filenameValues && filenameValues[1];

    return response.blob().then(blobData => Promise.resolve({ blobData, filename, contentType }));
};

export const authHeader = (tokenIn) => {
    const token = tokenIn || Auth.getToken();

    if (!token) {
        // throw new Error('No token');
        return null;
    }
    if (!Auth.isUserAuthenticated(token)) {
        // throw new Error('Token expired');
        return null;
    }

    return {
        Authorization: `Bearer ${token}`,
    };
};

export const jsonHeader = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
};

export const getErrorMessageOrKey = (error) => {
    if (!error) {
        return '901';
    }

    return error instanceof Error ? (error.errorCode && error.errorCode.toString()) || error.message || '903' : '902';
};

export const dispatchError = (dispatch, type, options, error) => {
    const errorMessageKey = getErrorMessageOrKey(error);

    if (error && error.error === HTTP_STATUS_CODES.Unauthorized) {
        dispatch({ type, options });
        dispatch({ type: TOKEN_EXPIRED, error: errorMessageKey });
    } else {
        dispatch({ type, options, error: errorMessageKey });
    }
};

export const downloadBlobAsFile = (filename, contentType, blobData) => {
    // It is necessary to create a new blob object with mime-type explicitly set
    // otherwise only Chrome works like it should
    const newBlob = new Blob([blobData], { type: contentType });

    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob, filename);
        return;
    }

    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(newBlob);
    const link = document.createElement('a');
    link.href = data;
    link.download = filename;
    link.click();
    setTimeout(() => {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
    }, 100);
};
