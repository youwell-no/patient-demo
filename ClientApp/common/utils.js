import urls from '../app/urls';

export const GUID_LENGTH = 36;

export const getCurrentProgramId = (pathname) => {
    if (pathname && pathname.indexOf(urls.inside.program.home) > -1) {
        return pathname.slice(urls.inside.program.home.length + 1, GUID_LENGTH + urls.inside.program.home.length + 1);
    }
    return null;
};

export const getCurrentProgram = (state) => {
    const programId = state.pageSettings.lastProgramId;

    if (programId && state.programStore.details && state.programStore.details[programId]) {
        return state.programStore.details[programId];
    }

    if (state.programStore.list && state.programStore.list.length > 0) {
        return state.programStore.list[0];
    }

    return null;
};
