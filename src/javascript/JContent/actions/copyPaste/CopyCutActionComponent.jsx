import {useDispatch, useSelector} from 'react-redux';
import {useApolloClient} from '@apollo/react-hooks';
import {useNodeChecks} from '@jahia/data-helper';
import copyPasteConstants from './copyPaste.constants';
import {hasMixin} from '../../JContent.utils';
import {setLocalStorage} from './localStorageHandler';
import {copypasteCopy, copypasteCut} from './copyPaste.redux';
import PropTypes from 'prop-types';
import React from 'react';

export const CopyCutActionComponent = ({context, render: Render, loading: Loading}) => {
    const {language, displayLanguage} = useSelector(state => ({
        language: state.language,
        displayLanguage: state.uilang
    }));
    const client = useApolloClient();
    const dispatch = useDispatch();

    const type = context.copyCutType || copyPasteConstants.COPY;

    const res = useNodeChecks(
        {path: context.path, paths: context.paths, language, displayLanguage},
        {
            ...context,
            getPrimaryNodeType: true,
            getDisplayName: true,
            requiredPermission: type === copyPasteConstants.COPY ? ['jcr:read'] : ['jcr:removeNode'],
            getProperties: ['jcr:mixinTypes']
        }
    );

    if (res.loading) {
        return (Loading && <Loading context={context}/>) || false;
    }

    let isVisible = res.checksResult && (res.node ? !hasMixin(res.node, 'jmix:markedForDeletionRoot') : res.nodes.reduce((acc, node) => acc && !hasMixin(node, 'jmix:markedForDeletionRoot'), true));

    return (
        <Render context={{
            ...context,
            isVisible: isVisible,
            enabled: isVisible,
            onClick: () => {
                let nodes = res.node ? [res.node] : res.nodes;
                setLocalStorage(type, nodes, client);
                dispatch(type === 'copy' ? copypasteCopy(nodes) : copypasteCut(nodes));
            }
        }}/>
    );
};

CopyCutActionComponent.propTypes = {
    context: PropTypes.object.isRequired,

    render: PropTypes.func.isRequired,

    loading: PropTypes.func
};
