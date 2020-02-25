import React from 'react';
import PropTypes from 'prop-types';
import {compose} from '~/utils';
import {useTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {ProgressOverlay, withNotifications} from '@jahia/react-material';
import {useSiteInfo} from '@jahia/data-helper';
import {registry} from '@jahia/ui-extender';
import {Dropdown} from '@jahia/moonstone';

export const LanguageSwitcher = ({
    notificationContext,
    siteKey,
    lang,
    onSelectLanguage
}) => {
    const {siteInfo, error, loading} = useSiteInfo({siteKey, displayLanguage: lang});
    const {t} = useTranslation();

    const onSelectLanguageHandler = lang => {
        console.debug(`%c  Switching language to: ${lang}`, 'color: #6B5CA5');
        onSelectLanguage(lang);
        // Switch edit mode linker language
        window.authoringApi.switchLanguage(lang);
    };

    if (error) {
        console.error('Error when fetching data: ', error);
        const message = t('jcontent:label.contentManager.error.queryingContent', {details: (error.message ? error.message : '')});
        notificationContext.notify(message, ['closeButton', 'noAutomaticClose']);
        return null;
    }

    if (loading) {
        return <ProgressOverlay/>;
    }

    return (
        <Dropdown
            label={lang}
            value={lang}
            data={siteInfo.languages.map(l => ({label: l.language, value: l.language}))}
            onChange={(e, item) => {
                onSelectLanguageHandler(item.label);
                return true;
            }}
        />
    );
};

const mapStateToProps = state => ({
    siteKey: state.site,
    lang: state.language
});

const mapDispatchToProps = dispatch => ({
    onSelectLanguage: lang => {
        dispatch(registry.get('redux-reducer', 'language').actions.setLanguage(lang));
    }
});

LanguageSwitcher.propTypes = {
    onSelectLanguage: PropTypes.func.isRequired,
    notificationContext: PropTypes.object.isRequired,
    siteKey: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired
};

export default compose(
    withNotifications(),
    connect(mapStateToProps, mapDispatchToProps)
)(LanguageSwitcher);
