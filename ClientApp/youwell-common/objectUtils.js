export const isEmpty = obj => obj === ''
    || obj === null
    || obj === undefined
    || (obj.constructor === Object && Object.keys(obj).length === 0)
    || (obj.constructor === Array && obj.length === 0);

export const hasValue = obj => !isEmpty(obj);
