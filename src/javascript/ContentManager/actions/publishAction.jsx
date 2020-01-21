import {composeActions} from '@jahia/react-material';
import {isMarkedForDeletion} from '../ContentManager.utils';
import requirementsAction from './requirementsAction';
import {withNodeName} from './withNodeName';
import {map} from 'rxjs/operators';

export default composeActions(requirementsAction, withNodeName, {
    init: context => {
        context.initRequirements({
            retrieveProperties: {retrievePropertiesNames: ['jcr:mixinTypes']},
            retrieveDisplayName: true,
            retrieveSiteLanguages: true,
            enabled: context => context.node.pipe(map(node =>
                (node.operationsSupport.publication) &&
                (context.checkForUnpublication ?
                    node.aggregatedPublicationInfo.publicationStatus !== 'NOT_PUBLISHED' && node.aggregatedPublicationInfo.publicationStatus !== 'MANDATORY_LANGUAGE_UNPUBLISHABLE' &&
                    node.aggregatedPublicationInfo.publicationStatus !== 'UNPUBLISHED' :
                    !isMarkedForDeletion(node)) &&
                (!context.checkIfLanguagesMoreThanOne || node.site.languages.length > 1)))
        });
        context.initLabelParams(context);
    },
    onClick: context => {
        if (context.node) {
            window.authoringApi.openPublicationWorkflow([context.node.uuid], context.allSubTree, context.allLanguages, context.checkForUnpublication);
        } else if (context.nodes) {
            window.authoringApi.openPublicationWorkflow(context.nodes.map(n => n.uuid), context.allSubTree, context.allLanguages, context.checkForUnpublication);
        }
    }
});
