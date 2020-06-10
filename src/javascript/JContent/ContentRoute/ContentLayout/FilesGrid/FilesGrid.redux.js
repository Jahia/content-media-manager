import JContentConstants from '../../../JContent.constants';
import {createActions, handleActions} from 'redux-actions';

export const {filesgridSetMode, filesgridSetGridMode, pagesSetListMode} = createActions('FILESGRID_SET_MODE', 'FILESGRID_SET_GRID_MODE', 'PAGES_SET_LIST_MODE');

const localStorage = window.localStorage;
const FILE_SELECTOR_MODE = JContentConstants.localStorageKeys.filesSelectorMode;
const FILE_SELECTOR_GRID_MODE = JContentConstants.localStorageKeys.filesSelectorGridMode;
const PAGE_SELECTOR_LIST_MODE = JContentConstants.localStorageKeys.pagesSelectorListMode;
const THUMBNAIL = JContentConstants.gridMode.THUMBNAIL;
const GRID = JContentConstants.mode.GRID;
const FLAT_LIST = JContentConstants.listMode.FLAT_LIST;

export const filesGridRedux = registry => {
    const initialState = {
        mode: localStorage.getItem(FILE_SELECTOR_MODE) === null ? GRID : localStorage.getItem(FILE_SELECTOR_MODE),
        gridMode: localStorage.getItem(FILE_SELECTOR_GRID_MODE) === null ? THUMBNAIL : localStorage.getItem(FILE_SELECTOR_GRID_MODE),
        listMode: localStorage.getItem(PAGE_SELECTOR_LIST_MODE) === null ? FLAT_LIST : localStorage.getItem(PAGE_SELECTOR_LIST_MODE)
    };

    const filesGrid = handleActions({
        [filesgridSetMode]: (state, action) => ({...state, mode: action.payload}),
        [filesgridSetGridMode]: (state, action) => ({...state, gridMode: action.payload}),
        [pagesSetListMode]: (state, action) => ({...state, listMode: action.payload})
    }, initialState);

    registry.add('redux-reducer', 'filesGrid', {targets: ['jcontent'], reducer: filesGrid});
};
