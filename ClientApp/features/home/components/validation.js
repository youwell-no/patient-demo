import {
    validateRequired, validateEmail, validateFnr, validatePassword, validatePasswordConfirm,
} from '../../../youwell-common/validationUtils';
import { patientUserLevels } from '../../../youwell-common/constants';


export const defaultValidators = {
    fnr: validateFnr,
    email: validateEmail,
    userLevel: validateRequired,
    newPassword: validatePassword,
    newPasswordConfirm: validatePasswordConfirm,
};

export const getRuleValidators = (userLevel) => {
    switch (userLevel) {
    case patientUserLevels.none: {
        return {
            userLevel: validateRequired,
            name: validateRequired,
            fnr: validateFnr,
            email: validateEmail,
        };
    }
    case patientUserLevels.anonymous: {
        return {
            userLevel: validateRequired,
            username: validateRequired,
            newPassword: validatePassword,
            newPasswordConfirm: validatePasswordConfirm,
        };
    }
    case patientUserLevels.person: {
        return {
            userLevel: validateRequired,
            name: validateRequired,
            email: [validateEmail, validateRequired],
            newPassword: validatePassword,
            newPasswordConfirm: validatePasswordConfirm,
        };
    }
    case patientUserLevels.patient: {
        return {
            userLevel: validateRequired,
            name: validateRequired,
            fnr: [validateFnr, validateRequired],
            email: validateEmail,
        };
    }
    default: {
        return defaultValidators;
    }
    }
};
