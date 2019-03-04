import { push } from 'connected-react-router';

import apiUrls from '../../youwell-common/apiUrls';
import ReduxStoreHelper from '../../youwell-common/ReduxStoreHelper';
import { patientProgramElementGroups } from '../../youwell-common/constants';
import { hasValue } from '../../youwell-common/objectUtils';
import { isToday, today, getLocalDate } from '../../youwell-common/dateUtils';

const ACTION_PREFIX = 'PROGRAM';
const LIST_RECIEVED = 'LIST_RECIEVED';
const DETAILS_RECIEVED = 'DETAILS_RECIEVED';
const TASKRESPONSE_INSERTED = 'TASKRESPONSE_INSERTED';
const TASKVISITED = 'TASKVISITED';
const RESPONSES_RECEIVED = 'RESPONSES_RECEIVED';

const storeHelper = new ReduxStoreHelper(ACTION_PREFIX);

export const actionCreators = {
    redirect: url => (dispatch) => {
        dispatch(push(url));
    },
    getList: storeHelper.createGetListActionCreator(apiUrls.app.program, LIST_RECIEVED),
    getElement: storeHelper.createGetElementActionCreator(apiUrls.app.program, DETAILS_RECIEVED),

    sendTaskResponse: (patientProgramTaskResponse, options) => (dispatch) => {
        storeHelper.fetch(dispatch, {
            url: `${apiUrls.app.program}/resp`,
            method: 'POST',
            body: patientProgramTaskResponse,
            completeAction: `${ACTION_PREFIX}/${TASKRESPONSE_INSERTED}`,
            options,
        });
    },
    visitTask: (taskInfo, options) => (dispatch) => {
        storeHelper.fetch(dispatch, {
            url: `${apiUrls.app.program}/vt`,
            method: 'POST',
            body: taskInfo,
            completeAction: `${ACTION_PREFIX}/${TASKVISITED}`,
            options: { background: true, ...options },
        });
    },
    getElementResponses: storeHelper.createGetElementActionCreator(`${apiUrls.app.program}/responses`, RESPONSES_RECEIVED),
};

const initialState = {
    ...storeHelper.defaultInitialState,
    responses: null,
};

const getLatestQuestionResponses = responses => (responses ? responses.reduce((prev, curr) => (
    { ...prev, [curr.questionId]: prev[curr.questionId] && prev[curr.questionId].created > curr.created ? prev[curr.questionId] : curr }
), {}) : {});

const getTodaysQuestionResponses = responses => (responses ? responses.reduce((prev, curr) => (
    { ...prev, [curr.questionId]: isToday(curr.created) && (!prev[curr.questionId] || prev[curr.questionId].created < curr.created) ? curr : prev[curr.questionId] }
), {}) : {});

const buildTaskViewModel = (task, taskResponse) => {
    if (!task) {
        return null;
    }

    const latestResponses = getLatestQuestionResponses(taskResponse);
    const todaysResponses = getTodaysQuestionResponses(taskResponse);

    return {
        ...task,
        latestResponses,
        todaysResponses,
        lastResponseDateTime: taskResponse && taskResponse.reduce((prev, curr) => (prev > curr.created ? prev : curr.created), null),
        hasQuestions: task.contentElements && task.contentElements.reduce((p, c) => p || hasValue(c.questions), false),
        allQuestionsAnswered: latestResponses && task.contentElements && task.contentElements.reduce((p, c) => p || (c.questions && c.questions.reduce((prev, curr) => prev && !!latestResponses[curr.id], true)), false),
    };
};

const buildElementViewModel = (element, elementResponses) => {
    if (!element) {
        return null;
    }

    return {
        ...element,
        task: buildTaskViewModel(element.task, element.task && elementResponses && elementResponses.filter(d => d.taskId === element.task.id)),
        module: element.module ? {
            ...element.module,
            tasks: element.module.tasks ? element.module.tasks.map(task => buildTaskViewModel(task, elementResponses && elementResponses.filter(d => d.taskId === task.id))) : null,
        } : null,
        isHidden: element.hideWhenCompleted && (element.completed || (element.endTime && getLocalDate(element.endTime) < today())), // can not remove it from collection beacause links rely on index..
        isUnavailable: (element.endTime && getLocalDate(element.endTime) < today()) || (element.startTime && getLocalDate(element.startTime) > today()),
    };
};

const buildViewModel = (programData, programResponses) => {
    if (!programData) {
        return null;
    }
    const groupedElements = programData.elements && programData.elements.reduce((prev, curr) => (
        { ...prev, [curr.elementGroup]: [...prev[curr.elementGroup] || [], buildElementViewModel(curr, programResponses && programResponses[curr.id])] }
    ), {
        [patientProgramElementGroups.main]: [],
        [patientProgramElementGroups.myPlan]: [],
        [patientProgramElementGroups.scheduled]: [],
    });

    return {
        ...programData,
        groupedElements,
        myPlanElement: groupedElements[patientProgramElementGroups.myPlan][0] || null,
        totalModules: groupedElements[patientProgramElementGroups.main].length,
        completedModules: groupedElements[patientProgramElementGroups.main].reduce((prev, curr) => prev + curr.completed, 0),
        hasContentPages: programData.program && programData.program.contentPages && programData.program.contentPages.pages && programData.program.contentPages.pages.length > 0,
        hasScheduledTasks: groupedElements[patientProgramElementGroups.scheduled].length > 0,
    };
};

const stateDetailsWithVisitResponse = (state, action) => ({
    ...state.details[action.reducerParams.patientProgramId],
    elements: state.details[action.reducerParams.patientProgramId].elements.map(e => (e.id === action.data.id ? {
        ...e,
        ...action.data,
        task: e.task ? { ...e.task, visited: true } : null,
        module: e.module ? {
            ...e.module,
            tasks: e.module.tasks.map(t => (t.id === action.reducerParams.taskId ? { ...t, visited: true } : t)),
        } : null,
        completed: action.data.completed,
    } : e)),
});

export const reducer = (state, action) => {
    switch (action.type) {
    case `${ACTION_PREFIX}/${DETAILS_RECIEVED}`: {
        return {
            ...state,
            error: null,
            loading: false,
            details: {
                ...state.details || {},
                [action.data.id]: buildViewModel(action.data, state.responses && state.responses[action.data.id]),
            },
        };
    }
    case `${ACTION_PREFIX}/${LIST_RECIEVED}`: {
        return {
            ...state,
            error: null,
            loading: false,
            list: action.data,
        };
    }
    case `${ACTION_PREFIX}/${TASKVISITED}`: {
        return {
            ...state,
            error: null,
            loading: false,
            details: {
                ...state.details || {},
                [action.reducerParams.patientProgramId]: buildViewModel(stateDetailsWithVisitResponse(state, action),
                    state.responses && state.responses[action.reducerParams.patientProgramId]),
            },
        };
    }
    case `${ACTION_PREFIX}/${TASKRESPONSE_INSERTED}`: {
        const elementResponses = [...((state.responses || {})[action.reducerParams.patientProgramId] || {})[action.data.id] || [],
            ...action.reducerParams.responses.map(r => ({
                taskId: action.reducerParams.taskId,
                patientProgramId: action.reducerParams.patientProgramId,
                patientProgramElementId: action.data.id,
                created: new Date().toISOString(),
                questionId: r.questionId,
                response: r,
            })),
        ];
        const programResponses = {
            ...(state.responses || {})[action.reducerParams.patientProgramId] || {},
            [action.data.id]: elementResponses,
        };

        return {
            ...state,
            error: null,
            loading: false,
            responses: {
                ...state.responses || {},
                [action.reducerParams.patientProgramId]: programResponses,
            },
            details: {
                ...state.details || {},
                [action.reducerParams.patientProgramId]: buildViewModel(stateDetailsWithVisitResponse(state, action), programResponses),
            },
        };
    }
    case `${ACTION_PREFIX}/${RESPONSES_RECEIVED}`: {
        const programResponses = {
            ...(state.responses || {})[action.reducerParams.patientProgramId] || {},
            [action.reducerParams.patientProgramElementId]: action.data,
        };

        return {
            ...state,
            error: null,
            loading: false,
            responses: {
                ...state.responses || {},
                [action.reducerParams.patientProgramId]: programResponses,
            },
            details: {
                ...state.details || {},
                [action.reducerParams.patientProgramId]: buildViewModel((state.details || {})[action.reducerParams.patientProgramId], programResponses),
            },
        };
    }
    default: {
        const stateFromDefaultActions = storeHelper.defaultReducer(state, action, initialState);

        if (stateFromDefaultActions !== null) {
            return stateFromDefaultActions;
        }

        return state || initialState;
    }
    }
};
