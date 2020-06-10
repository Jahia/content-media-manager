import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {pagesSetListMode} from '../../ContentLayout/FilesGrid/FilesGrid.redux';
import JContentConstants from '../../../JContent.constants';
import {Section, ViewList} from '@jahia/moonstone/dist/icons';
import {Button} from '@jahia/moonstone';

const localStorage = window.localStorage;

const FLAT_LIST = JContentConstants.listMode.FLAT_LIST;
const STRUCTURED_LIST = JContentConstants.listMode.STRUCTURED_LIST;
const PAGE_SELECTOR_LIST_MODE = JContentConstants.localStorageKeys.pagesSelectorListMode;

const buttons = [FLAT_LIST, STRUCTURED_LIST];
const icons = {
    [STRUCTURED_LIST]: <Section/>,
    [FLAT_LIST]: <ViewList/>
};

export const PageModeSelector = () => {
    const {t} = useTranslation();

    const {listMode} = useSelector(state => ({
        listMode: state.jcontent.filesGrid.listMode
    }));

    const dispatch = useDispatch();
    const onChange = mode => dispatch(pagesSetListMode(mode));

    const handleChange = selectedMode => {
        switch (selectedMode) {
            case FLAT_LIST:
                onChange(FLAT_LIST);
                localStorage.setItem(PAGE_SELECTOR_LIST_MODE, FLAT_LIST);
                break;
            case STRUCTURED_LIST:
                onChange(STRUCTURED_LIST);
                localStorage.setItem(PAGE_SELECTOR_LIST_MODE, STRUCTURED_LIST);
                break;
            default:
                onChange(FLAT_LIST);
        }
    };

    return (
        buttons.map(v => (
            <Button key={v}
                    data-sel-role={'set-view-mode-' + v}
                    aria-selected={listMode === v}
                    color={listMode === v ? 'accent' : 'default'}
                    title={t('jcontent:label.contentManager.filesGrid.' + v)}
                    size="default"
                    variant="ghost"
                    icon={icons[v]}
                    onClick={() => handleChange(v)}
            />
        ))
    );
};

export default PageModeSelector;

