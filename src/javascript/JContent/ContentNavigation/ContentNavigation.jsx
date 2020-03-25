import React from 'react';
import PropTypes from 'prop-types';
import {Accordion, AccordionItem, SecondaryNav} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import NavigationHeader from './NavigationHeader';

const ContentNavigation = ({accordionItems, mode, siteKey, handleNavigation}) => {
    const {t} = useTranslation('jcontent');
    return (
        <SecondaryNav header={<NavigationHeader/>}>
            <Accordion isReversed
                       openedItem={mode}
                       onSetOpenedItem={id => id && mode !== id && handleNavigation(id, accordionItems.find(item => id === item.key).defaultPath(siteKey))}
            >
                {accordionItems.filter(accordionItem => !accordionItem.isEnabled || accordionItem.isEnabled(siteKey)).map(accordionItem => (
                    <AccordionItem key={accordionItem.key}
                                   id={accordionItem.key}
                                   label={t(accordionItem.label)}
                                   icon={accordionItem.icon}
                    >
                        {accordionItem.component ? <accordionItem.component item={accordionItem}/> : accordionItem.render({item: accordionItem})}
                    </AccordionItem>
                ))}
            </Accordion>
        </SecondaryNav>
    );
};

ContentNavigation.propTypes = {
    mode: PropTypes.string,
    siteKey: PropTypes.string.isRequired,
    accordionItems: PropTypes.array.isRequired,
    handleNavigation: PropTypes.func.isRequired
};

export default ContentNavigation;
