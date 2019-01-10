import Node from './Node';
import {copy} from './actions.redux-actions';
import {composeActions} from '@jahia/react-material';
import {reduxAction} from './reduxAction';
import requirementsAction from './requirementsAction';

export default composeActions(requirementsAction, reduxAction(() => ({}), dispatch => ({copy: n => dispatch(copy(n))})), {

    init: context => {
        context.initRequirements({
            retrievePrimaryNodeType: true,
            retrieveDisplayName: true,
            requiredPermission: 'jcr:removeNode'
        });
    },

    onClick: context => {
        const {copy, path, node: {uuid, name, displayName, primaryNodeType}} = context;
        copy([new Node(path, uuid, name, displayName, primaryNodeType, Node.PASTE_MODES.MOVE)]);
    }
});