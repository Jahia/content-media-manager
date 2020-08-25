import React, {useEffect} from 'react';
import {useNodeChecks} from '@jahia/data-helper';
import PropTypes from 'prop-types';
import {ellipsizeText, getLanguageLabel, isMarkedForDeletion, uppercaseFirst} from '../JContent.utils';
import * as _ from 'lodash';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {setRefetcher, unsetRefetcher} from '../JContent.refetches';

function checkAction(res, node, context) {
    let enabled = true;
    let isVisible = res.checksResult && node.operationsSupport.publication;

    if (context.publishType === 'unpublish') {
        isVisible = isVisible &&
            !isMarkedForDeletion(node);
        enabled = enabled &&
            node.aggregatedPublicationInfo.publicationStatus !== 'NOT_PUBLISHED' &&
            node.aggregatedPublicationInfo.publicationStatus !== 'MANDATORY_LANGUAGE_UNPUBLISHABLE' &&
            node.aggregatedPublicationInfo.publicationStatus !== 'UNPUBLISHED';
    } else {
        isVisible = isVisible &&
            !isMarkedForDeletion(node);
        enabled = enabled &&
            (context.publishType === 'publishAll' || node.aggregatedPublicationInfo.publicationStatus !== 'PUBLISHED');
    }

    if (context.allLanguages) {
        isVisible = isVisible && node.site.languages.length > 1;
    }

    if (enabled && !node.publish && !node['publication-start']) {
        enabled = false;
    }

    return {enabled, isVisible};
}

function checkActionOnNodes(res, context) {
    const defaults = {
        enabled: true,
        isVisible: true
    };

    return res.nodes ? res.nodes.reduce((acc, node) => mergeChecks(acc, checkAction(res, node, context)), defaults) : defaults;
}

const mergeChecks = (v1, v2) => {
    const res = {};
    Object.keys(v1).forEach(key => {
        res[key] = v1[key] && v2[key];
    });
    return res;
};

function getButtonLabelParams(context, language, res, t) {
    if (!res.nodes) {
        return {
            displayName: t('jcontent:label.contentManager.selection.items', {count: 0}),
            language: language
        };
    }

    return {
        displayName: t('jcontent:label.contentManager.selection.items', {count: context.paths.length}),
        language: res.nodes[0].site ? _.escape(uppercaseFirst(getLanguageLabel(res.nodes[0].site.languages, language).displayName)) : null
    };
}

const constraintsByType = {
    publish: {
        hideOnNodeTypes: ['jnt:virtualsite', 'jnt:contentFolder', 'nt:folder']
    },
    publishAll: {
        showOnNodeTypes: ['jnt:folder', 'jnt:contentFolder', 'jnt:page']
    },
    unpublish: {
        hideOnNodeTypes: ['jnt:virtualsite']
    }
};

export const PublishActionComponent = ({context, render: Render, loading: Loading}) => {
    const {language} = useSelector(state => ({language: context.language ? context.language : state.language}));
    const {t} = useTranslation();

    const res = useNodeChecks({path: context.path, paths: context.paths, language}, {
        getDisplayName: true,
        getProperties: ['jcr:mixinTypes'],
        getSiteLanguages: true,
        getAggregatedPublicationInfo: {subNodes: true},
        getOperationSupport: true,
        getPermissions: ['publish', 'publication-start'],
        ...constraintsByType[context.publishType]
    });

    useEffect(() => {
        setRefetcher(context.id, {
            refetch: res.refetch
        });

        return () => unsetRefetcher(context.id);
    }, []);

    if (res.loading) {
        return (Loading && <Loading context={context}/>) || false;
    }

    let {enabled, isVisible} = res.node ? checkAction(res, res.node, context) : checkActionOnNodes(res, context);

    const buttonLabelParams = res.node ? {
        displayName: _.escape(ellipsizeText(res.node.displayName, 40)),
        language: res.node.site ? _.escape(uppercaseFirst(getLanguageLabel(res.node.site.languages, language).displayName)) : null
    } : getButtonLabelParams(context, language, res, t);

    return (
        <Render context={{
            ...context,
            buttonLabelParams,
            isVisible,
            enabled,
            onClick: () => {
                if (context.path) {
                    window.authoringApi.openPublicationWorkflow([res.node.uuid], context.publishType === 'publishAll', context.allLanguages, context.publishType === 'unpublish');
                } else if (context.paths) {
                    window.authoringApi.openPublicationWorkflow(res.nodes.map(n => n.uuid), context.publishType === 'publishAll', context.allLanguages, context.publishType === 'unpublish');
                }
            }
        }}/>
    );
};

PublishActionComponent.propTypes = {
    context: PropTypes.object.isRequired,

    render: PropTypes.func.isRequired,

    loading: PropTypes.func
};
