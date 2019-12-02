import React, {Suspense} from 'react';
import {registry} from '@jahia/registry';
import {useHistory} from 'react-router-dom';
import {PrimaryNavItem} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import ContentMediaManagerApp8 from './ContentManagerApp8';
import Collections from '@jahia/moonstone/dist/icons/Collections';

const ROUTE = '/cmm';
const SYSTEM_SITE_ROUTE = `${ROUTE}/${window.contextJsParameters.siteKey}/${window.contextJsParameters.locale}/browse`;

const CmmNavItem = () => {
    const history = useHistory();
    const {t} = useTranslation('content-media-manager');
    return (
        <PrimaryNavItem key={ROUTE}
                        isSelected={history.location.pathname.startsWith(ROUTE) && history.location.pathname.split('/').length > 3}
                        label={t('label.name')}
                        icon={<Collections/>}
                        onClick={() => history.push(SYSTEM_SITE_ROUTE)}/>
    );
};

registry.add('cmmGroupItem', {
    type: 'topNavGroup',
    target: ['nav-root-top:2'],
    render: () => <CmmNavItem/>
});

// Make this async
registry.add('route-cmm', {
    type: 'route',
    target: ['nav-root-top:2'],
    path: `${ROUTE}/:siteKey/:lang/:mode`, // Catch everything that's cmm and let the app resolve correct view
    defaultPath: SYSTEM_SITE_ROUTE,
    render: () => <Suspense fallback="loading ..."><ContentMediaManagerApp8/></Suspense>
});

window.contextJsParameters.namespaceResolvers['content-media-manager'] = lang => require('../main/resources/javascript/locales/' + lang + '.json');

console.log('%c Content Media Manager is activated', 'color: #3c8cba');
