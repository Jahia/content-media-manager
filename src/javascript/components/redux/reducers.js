import {
    CM_SET_UILANGUAGE,
    CM_NAVIGATE,
    CM_SET_SELECTION,
    CM_SET_PREVIEW,
    CM_SET_PREVIEW_MODE,
    CM_SET_OPEN_PATHS,
    CM_SET_TREE,
    CM_SET_PAGER,
    CM_SET_SORT,
    CM_SET_SEARCH_MODE,
    CM_DRAWER_STATES
} from './actions';
import * as _ from 'lodash';
import {extractPaths} from '../utils.js';

let uiLanguageReducer = dxContext => (state = dxContext.uilang, action) => {
    if (action.uiLang && action.type === CM_SET_UILANGUAGE) {
        return action.uiLang;
    }
    return state;
};

let siteReducer = siteKey => (state = siteKey, action) => {
    if (action.site && action.type === CM_NAVIGATE) {
        return action.site;
    }
    return state;
};

let siteDisplayableNameReducer = siteDisplayableName => (state = siteDisplayableName, action) => {
    if (action.siteDisplayableName && action.type === CM_NAVIGATE) {
        return action.siteDisplayableName;
    }
    return state;
};

let languageReducer = language => (state = language, action) => {
    if (action.language && action.type === CM_NAVIGATE) {
        return action.language;
    }
    return state;
};

let modeReducer = mode => (state = mode, action) => {
    if (action.mode && action.type === CM_NAVIGATE) {
        return action.mode;
    }
    return state;
};

let pathReducer = path => (state = path, action) => {
    if (action.path && action.type === CM_NAVIGATE) {
        return action.path;
    }
    return state;
};

let paramsReducer = params => (state = params, action) => {
    if (action.params && action.type === CM_NAVIGATE) {
        return action.params;
    }
    return state;
};

let selectionReducer = (state = [], action) => {
    if (action.type === CM_SET_SELECTION) {
        return action.selection;
    }
    if (action.type === CM_NAVIGATE) {
        return [];
    }
    return state;
};

let previewModeReducer = (state = 'edit', action) => {
    if (action.previewMode && action.type === CM_SET_PREVIEW_MODE) {
        return action.previewMode;
    }
    return state;
};

let openPathsReducer = (siteKey, path, mode) => (state, action) => {
    if (state === undefined) {
        if (mode === 'apps') {
            state = [];
        } else {
            state = _.dropRight(extractPaths(siteKey, path, mode), 1);
        }
    }

    if (action.type === CM_SET_OPEN_PATHS) {
        if (action.open) {
            return _.union(state, action.open);
        }
        if (action.close) {
            return _.difference(state, action.close);
        }
        return state;
    }
    return state;
};

let previewStateReducer = (state = CM_DRAWER_STATES.HIDE, action) => {
    switch (action.type) {
        case CM_SET_PREVIEW:
            return action.previewState;
        case CM_SET_TREE: {
            if (action.treeState === CM_DRAWER_STATES.SHOW && state === CM_DRAWER_STATES.SHOW) {
                return CM_DRAWER_STATES.TEMP;
            }
            if (action.treeState === CM_DRAWER_STATES.HIDE && state === CM_DRAWER_STATES.TEMP) {
                return CM_DRAWER_STATES.SHOW;
            }
            return state;
        }
        default:
            return state;
    }
};

let treeStateReducer = (state = CM_DRAWER_STATES.SHOW, action) => {
    switch (action.type) {
        case CM_SET_TREE:
            return action.treeState;
        case CM_SET_PREVIEW: {
            if (action.previewState === CM_DRAWER_STATES.SHOW && state === CM_DRAWER_STATES.SHOW) {
                return CM_DRAWER_STATES.TEMP;
            }
            if (action.previewState === CM_DRAWER_STATES.HIDE && state === CM_DRAWER_STATES.TEMP) {
                return CM_DRAWER_STATES.SHOW;
            }
            return state;
        }
        default:
            return state;
    }
};

let paginationReducer = (state = {currentPage: 0, pageSize: 25}, action) => {
    return state;
};

let sortReducer = (state = {order: 'ASC', orderBy: 'lastModified.value'}, action) => {
    return state;
};

let searchModeReducer = params => (state = (params.sql2SearchFrom ? 'sql2' : 'normal'), action) => {
    if (action.type === CM_SET_SEARCH_MODE) {
        return action.searchMode;
    }
    return state;
};

export {languageReducer, uiLanguageReducer, siteReducer, modeReducer, pathReducer, paramsReducer, selectionReducer, previewModeReducer, openPathsReducer, previewStateReducer, treeStateReducer, searchModeReducer, siteDisplayableNameReducer, paginationReducer, sortReducer};
