import React from 'react';
import {TreeView} from '@jahia/moonstone';
import PropTypes from 'prop-types';
import {getMediaIcon} from '../ContentLayout.utils';
import {useDispatch, useSelector} from 'react-redux';
import {cmClosePaths, cmOpenPaths, cmGoto} from '../../../JContent.redux';
import {findInTree, getParentPath} from '../../../ContentTree/ContentTree.utils';
import {displayName, useTreeEntries} from '@jahia/data-helper';
import {PickerItemsFragment} from '../../../ContentTree/ContentTree.gql-fragments';
import styles from './ContentStructuredList.scss';

function convertPathsToTree(treeEntries) {
    let tree = [];
    if (treeEntries.length === 0) {
        return tree;
    }

    treeEntries.forEach(treeEntry => {
        const parentPath = getParentPath(treeEntry.path);

        const element = {
            id: treeEntry.path,
            label: treeEntry.node.displayName,
            hasChildren: treeEntry.hasChildren,
            parent: parentPath,
            isClosable: treeEntry.depth > 0,
            iconStart: getMediaIcon(treeEntry.node, {icon: {verticalAlign: 'bottom', marginRight: '3px'}}),
            children: [],
            treeItemProps: {
                'data-sel-role': treeEntry.name
            }
        };
        const parent = findInTree(tree, parentPath);
        if (parent !== undefined && !findInTree(parent, element.id)) {
            parent.children.push(element);
        } else if (!findInTree(tree, element.id)) {
            tree.push(element);
        }
    });

    return tree;
}

export const ContentStructuredList = ({path}) => {
    let dispatch = useDispatch();
    const openPaths = useSelector(state => state.jcontent.openPaths);

    const {treeEntries} = useTreeEntries({
        fragments: [PickerItemsFragment.mixinTypes, PickerItemsFragment.primaryNodeTypeWithIcon, displayName],
        rootPaths: [path],
        openPaths: openPaths,
        selectedPaths: [path],
        openableTypes: ['jnt:content'],
        selectableTypes: ['jnt:content'],
        queryVariables: {language: 'en'},
        hideRoot: false
    });

    return (
        <TreeView data={convertPathsToTree(treeEntries)}
                  className={styles.tree}
                  openedItems={openPaths}
                  onOpenItem={object => dispatch(cmOpenPaths([object.id]))}
                  onCloseItem={object => dispatch(cmClosePaths([object.id]))}
                  onClickItem={object => object.hasChildren && dispatch(cmGoto({path: object.id, params: {sub: true}}))}
        />
    );
};

ContentStructuredList.propTypes = {
    path: PropTypes.string.isRequired
};

export default ContentStructuredList;
