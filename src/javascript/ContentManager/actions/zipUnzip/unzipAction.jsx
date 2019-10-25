import React from 'react';
import {componentRendererAction, composeActions, ProgressOverlay} from '@jahia/react-material';
import requirementsAction from '../requirementsAction';
import {withNotificationContextAction} from '../withNotificationContextAction';
import {map} from 'rxjs/operators';
import zipUnzipMutations from './zipUnzip.gql-mutations';
import {isMarkedForDeletion} from '../../ContentManager.utils';
import {refetchContentTreeAndListData} from '../../ContentManager.refetches';

export default composeActions(requirementsAction, withNotificationContextAction, componentRendererAction, {
    init: context => {
        context.initRequirements({
            retrieveProperties: {retrievePropertiesNames: ['jcr:mixinTypes']},
            requiredPermission: 'jcr:addChildNodes',
            retrieveMimeType: true,
            enabled: context => context.node.pipe(map(node => node.children.nodes.length !== 0 && node.children.nodes[0].mimeType.value === 'application/zip' && !isMarkedForDeletion(node)))
        });
    },
    onClick: context => {
        let handler = context.renderComponent(<ProgressOverlay/>);
        context.client.mutate({
            variables: {pathOrId: context.node.path, path: context.node.parent.path},
            mutation: zipUnzipMutations.unzip
        }).then(() => {
            refetchContentTreeAndListData();
            handler.destroy();
        }).catch((reason => {
            handler.destroy();
            context.notificationContext.notify(reason.toString(), ['closeButton', 'noAutomaticClose']);
        }));
    }
});
