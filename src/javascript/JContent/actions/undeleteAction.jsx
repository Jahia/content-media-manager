import {ellipsizeText, hasMixin} from '../JContent.utils';
import {useSelector} from 'react-redux';
import {useNodeChecks} from '@jahia/data-helper';
import PropTypes from 'prop-types';
import React from 'react';
import {PATH_CONTENTS_ITSELF, PATH_FILES_ITSELF} from './actions.constants';

function checkAction(node) {
    return hasMixin(node, 'jmix:markedForDeletionRoot');
}

export const UndeleteActionComponent = ({context, render: Render, loading: Loading}) => {
    const {language} = useSelector(state => ({language: state.language}));

    const res = useNodeChecks(
        {path: context.path, paths: context.paths, language},
        {
            getProperties: ['jcr:mixinTypes'],
            getDisplayName: true,
            getOperationSupport: true,
            requiredPermission: ['jcr:removeNode'],
            hideOnNodeTypes: ['jnt:virtualsite', 'jnt:page'],
            hideForPaths: [PATH_FILES_ITSELF, PATH_CONTENTS_ITSELF]
        }
    );

    if (res.loading) {
        return (Loading && <Loading context={context}/>) || false;
    }

    const isVisible = res.checksResult && (res.node ? checkAction(res.node) : res.nodes.reduce((acc, node) => acc && checkAction(node), true));

    return (
        <Render context={{
            ...context,
            isVisible: isVisible,
            enabled: isVisible,
            onClick: () => {
                if (res.node) {
                    window.authoringApi.undeleteContent(res.node.uuid, res.node.path, (res.node.displayName ? ellipsizeText(res.node.displayName, 100) : ''), res.node.name);
                } else if (res.nodes) {
                    window.authoringApi.undeleteContents(res.nodes.map(node => ({uuid: node.uuid, path: node.path, displayName: node.displayName, nodeTypes: ['jnt:content'], inheritedNodeTypes: ['nt:base']})));
                }
            }
        }}/>
    );
};

UndeleteActionComponent.propTypes = {
    context: PropTypes.object.isRequired,

    render: PropTypes.func.isRequired,

    loading: PropTypes.func
};