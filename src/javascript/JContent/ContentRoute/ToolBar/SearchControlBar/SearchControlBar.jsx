import React from 'react';
import styles from './SearchControlBar.scss';
import {Separator, Chip} from '@jahia/moonstone';
import Edit from '@jahia/moonstone/dist/icons/Edit';
import {useSelector} from 'react-redux';
import {DisplayAction} from '@jahia/ui-extender';
import {getButtonRenderer} from '~/utils/getButtonRenderer';
import JContentConstants from '../../../JContent.constants';
import {useTranslation} from 'react-i18next';
import {useNodeInfo} from '@jahia/data-helper';

const ButtonRenderer = getButtonRenderer();

export const SearchControlBar = () => {
    const {t} = useTranslation();
    const {path, mode, from, language, searchPath, searchContentType} = useSelector(state => ({
        path: state.jcontent.path,
        site: state.site,
        mode: state.jcontent.mode,
        from: state.jcontent.params.sql2SearchFrom,
        searchContentType: state.jcontent.params.searchContentType,
        searchPath: state.jcontent.params.searchPath,
        language: state.language
    }));

    const nodeInfo = useNodeInfo({path: searchPath, language: language}, {getDisplayName: true});
    const location = nodeInfo.node ? nodeInfo.node.displayName : '';

    const advancedSearchMode = mode === JContentConstants.mode.SQL2SEARCH;

    let typeInfo;
    if (advancedSearchMode) {
        typeInfo = from;
    } else {
        typeInfo = searchContentType !== '' ? searchContentType : t('jcontent:label.contentManager.search.anyContent');
    }

    return (
        <React.Fragment>
            <DisplayAction actionKey="search" context={{path, buttonLabel: 'Edit query', buttonIcon: <Edit/>}} render={ButtonRenderer} variant="ghost" data-sel-role="open-search-dialog"/>
            <Separator variant="vertical" invisible="firstOrLastChild"/>
            {advancedSearchMode &&
            <>
                <Chip className={styles.chipMargin} label={t('jcontent:label.contentManager.search.advancedOn')}/>
                <Chip className={styles.chipMargin} label={t('jcontent:label.contentManager.search.advancedSearchOnType', {type: typeInfo})}/>
            </>}
            {!advancedSearchMode && <Chip className={styles.chipMargin} label={t('jcontent:label.contentManager.search.advancedSearchOnType', {type: typeInfo})}/>}
            <Chip className={styles.chipMargin} label={t('jcontent:label.contentManager.search.location', {siteName: location})}/>
            <div className={`${styles.grow}`}/>
        </React.Fragment>
    );
};

export default SearchControlBar;