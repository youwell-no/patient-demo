import { hasValue } from './objectUtils';

export const validateRequired = text => ({
    valid: !!text && text.trim().length >= 1,
    errorTextKey: 'validations.mandatory',
});

export const validateChars = maxChars => text => ({
    valid: !text || text.length < maxChars,
    errorTextKey: 'validations.text_too_long',
});

const rfcEmail = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const validateEmail = email => ({
    valid: !email || rfcEmail.test(email),
    errorTextKey: 'validations.not_valid_email',
});

export const validateRole = role => ({
    valid: !!role && role.trim().length >= 1,
    errorTextKey: 'validations.please_select_role',
});

export const validatePassword = password => ({
    valid: !password || password.trim().length >= 8,
    errorTextKey: 'validations.password_must_be_at_least_eight_characters',
});

export const validatePasswordConfirm = (passwordConfirm, state, fieldName) => ({
    valid: !passwordConfirm || passwordConfirm === state[fieldName.slice(0, -'Confirm'.length)],
    errorTextKey: 'validations.passwords_does_not_match',
});

export const validateFnr = (fnr) => {
    if (!hasValue(fnr)) {
        return {
            valid: true,
        };
    }
    const birthNumber = fnr.toString();
    if (!birthNumber || birthNumber.length !== 11) {
        return {
            valid: false,
            errorTextKey: 'validations.notValidFnr',
        };
    }

    const calculate = (number, factors) => {
        let sum = 0;
        for (let i = 0, l = factors.length; i < l; ++i) {
            sum += parseInt(number.charAt(i), 10) * factors[i];
        }
        return sum;
    };

    let checksum1 = 11 - (calculate(birthNumber, [3, 7, 6, 1, 8, 9, 4, 5, 2]) % 11);
    if (checksum1 === 11) checksum1 = 0;
    let checksum2 = 11 - (calculate(birthNumber, [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]) % 11);
    if (checksum2 === 11) checksum2 = 0;

    return {
        valid: checksum1 === parseInt(birthNumber.charAt(9), 10)
            && checksum2 === parseInt(birthNumber.charAt(10), 10),
        errorTextKey: 'validations.notValidFnr',
    };
};

export const validateField = (state, validatorFunction, fieldName) => {
    const validatorFunctions = validatorFunction ? [].concat(validatorFunction) : [];

    const validation = validatorFunctions.reduce((prev, currentFunction) => {
        if (!currentFunction) return prev;
        const currentValidation = currentFunction(state[fieldName], state, fieldName);
        return (
            {
                valid: prev.valid && currentValidation.valid,
                errorTextKey: prev.valid ? currentValidation.errorTextKey : prev.errorTextKey,
            }
        );
    }, { valid: true });

    const validationErrors = {
        ...state.validationErrors, [fieldName]: validation.valid ? null : validation.errorTextKey,
    };

    const hasErrors = Object.keys(validationErrors).reduce(
        (prev, key) => prev || (key !== 'hasErrors' && validationErrors[key] !== null),
        false
    );

    return { ...validationErrors, hasErrors };
};

export const validateAllFields = (state, validators) => {
    const validatedState = Object.keys(validators).reduce(
        (prev, key) => ({ ...prev, validationErrors: validateField(prev, validators[key], key) }),
        state
    );

    return validatedState.validationErrors;
};

export const addValidator = (validators, target, ...newValidators) => ({
    ...validators,
    [target]: validators[target] ? [].concat(validators[target], newValidators) : newValidators,
});
