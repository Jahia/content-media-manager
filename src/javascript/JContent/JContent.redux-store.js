import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import {batchDispatchMiddleware} from 'redux-batched-actions';
import thunk from 'redux-thunk';
import {selectionReducer} from './ContentRoute/ContentLayout/contentSelection.redux-reducers';
import {fileUpload} from './ContentRoute/ContentLayout/Upload/Upload.redux-reducer';
import {copyPaste} from './actions/copyPaste/copyPaste.redux-reducer';
import {filesGrid} from './ContentRoute/ContentLayout/FilesGrid/FilesGrid.redux-reducer';
import {
    availableLanguagesReducer,
    languageReducer,
    modeReducer,
    openPathsReducer,
    paramsReducer,
    pathReducer,
    pathsToRefetchReducer,
    searchModeReducer,
    siteDisplayableNameReducer,
    siteReducer,
    treeStateReducer,
    treeWidthReducer,
    uiLanguageReducer
} from './JContent.redux-reducers';
import {connectRouter, routerMiddleware} from 'connected-react-router';
import {extractParamsFromUrl, getSyncListener} from './JContent.redux-utils';
import {previewModeReducer, previewSelectionReducer, previewStateReducer} from './preview.redux-reducers';
import {sortReducer} from './ContentRoute/ContentLayout/sort.redux-reducers';
import {paginationReducer} from './ContentRoute/ContentLayout/pagination.redux-reducers';

let jContentReduxStore = (dxContext, history) => {
    let currentValueFromUrl = extractParamsFromUrl(history.location.pathname, history.location.search);
    const rootReducer = combineReducers({
        uilang: uiLanguageReducer(dxContext),
        site: siteReducer(currentValueFromUrl.site),
        siteDisplayableName: siteDisplayableNameReducer(dxContext.siteDisplayableName),
        language: languageReducer(currentValueFromUrl.language),
        availableLanguages: availableLanguagesReducer,
        mode: modeReducer(currentValueFromUrl.mode),
        path: pathReducer(currentValueFromUrl.path),
        params: paramsReducer(currentValueFromUrl.params),
        fileUpload: fileUpload,
        previewMode: previewModeReducer,
        previewState: previewStateReducer,
        previewSelection: previewSelectionReducer,
        treeState: treeStateReducer,
        treeWidth: treeWidthReducer,
        openPaths: openPathsReducer(currentValueFromUrl.site, currentValueFromUrl.path, currentValueFromUrl.mode),
        searchMode: searchModeReducer(currentValueFromUrl.params),
        copyPaste: copyPaste,
        filesGrid: filesGrid,
        pagination: paginationReducer,
        sort: sortReducer,
        pathsToRefetch: pathsToRefetchReducer,
        selection: selectionReducer
    });

    const composeEnhancers = window.top.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const store = createStore(
        connectRouter(history)(rootReducer),
        composeEnhancers(
            applyMiddleware(
                routerMiddleware(history),
                batchDispatchMiddleware,
                thunk
                // Logger
            )
        )
    );

    store.subscribe(getSyncListener(store, history));

    return store;
};

export default jContentReduxStore;
