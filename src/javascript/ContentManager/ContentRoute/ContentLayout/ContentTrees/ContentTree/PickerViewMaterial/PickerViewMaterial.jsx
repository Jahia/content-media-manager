import React from 'react';
import PropTypes from 'prop-types';
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    withStyles,
    withTheme
} from '@material-ui/core';
import {IconButton, Typography} from '@jahia/ds-mui-theme';
import {KeyboardArrowRight} from '@material-ui/icons';
import defaultIconRenderer from './iconRenderer';
import {isMarkedForDeletion} from '../../../../../ContentManager.utils';
import {compose} from 'react-apollo';
import UploadTransformComponent from '../../../UploadTransformComponent';
import classNames from 'classnames';
import {ContextualMenu, DisplayAction, iconButtonRenderer} from '@jahia/react-material';
import * as _ from 'lodash';

let styles = theme => ({
    root: {
        position: 'relative',
        padding: '0 !important',
        width: '100%'
    },
    loading: {
        opacity: 0.8
    },
    listItemSelected: {
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText + '!important'
    },
    listItem: {
        paddingLeft: theme.spacing.unit,
        height: theme.spacing.unit * 6,
        whiteSpace: 'nowrap',
        color: theme.palette.text.secondary
    },
    listItemDeleted: {
        color: theme.palette.text.disabled,
        textDecoration: 'line-through'
    },
    listItemNodeTypeIcon: {
        marginRight: '5px',
        color: 'inherit'
    },
    listItemActionIcon: {
        top: 0,
        position: 'absolute',
        color: 'inherit'
    },
    loadingContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 999
    },
    openedTreeEl: {
        transform: 'rotate(90deg)',
        color: 'inherit'
    },
    closedTreeEl: {
        color: 'inherit'
    },
    treeEntry: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer !important'
    },
    unpublishedEntryLabel: {
        fontStyle: 'italic'
    }
});

export class PickerViewMaterial extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false
        };
        this.hoverOn = this.hoverOn.bind(this);
        this.hoverOff = this.hoverOff.bind(this);
    }

    hoverOn(path) {
        this.setState({hover: path});
    }

    hoverOff() {
        this.setState({hover: false});
    }

    render() {
        let {classes, pickerEntries, onOpenItem, onSelectItem, rootLabel, iconRenderer, loading, dataCmRole, container, mode} = this.props;
        // Sorts entries that are folder types
        let sortedEntries = this.sortFoldersAlphabetical(pickerEntries);

        return (
            <div className={classes.root}>
                {loading &&
                    <div className={classes.loadingContainer}/>
                }
                <List disablePadding classes={{root: classNames(classes.root, {[classes.loading]: loading})}}>
                    {
                        sortedEntries.map(entry => {
                            let contextualMenu = React.createRef();

                            let itemClass = classNames(classes.listItem, {
                                [classes.listItemDeleted]: isMarkedForDeletion(entry.node),
                                [classes.listItemSelected]: entry.selected
                            });
                            return (
                                <React.Fragment key={entry.path}>
                                    <ContextualMenu
                                        ref={contextualMenu}
                                        actionKey="contentMenu"
                                        context={{
                                            path: entry.node.path,
                                            menuFilter: value => {
                                                return !_.includes(['preview'], value.key);
                                            }
                                        }}
                                    />
                                    <UploadTransformComponent
                                        data-jrm-role="picker-item"
                                        data-cm-role={dataCmRole}
                                        className={itemClass}
                                        uploadPath={entry.path}
                                        mode={mode}
                                        uploadTargetComponent={ListItem}
                                        onClick={() => this.hoverOn(entry.path)}
                                        onDoubleClick={() => onOpenItem(entry.path, !entry.open)}
                                        onMouseEnter={() => this.hoverOn(entry.path)}
                                        onMouseLeave={this.hoverOff}
                                        onContextMenu={event => contextualMenu.current.open(event)}
                                    >
                                        <div
                                            style={{
                                                paddingLeft: ((entry.depth > 0) ? ((entry.depth) * 16) : 0),
                                                opacity: (entry.openable && entry.hasChildren ? 1 : 0)
                                            }}
                                        >
                                            <IconButton
                                                icon={<KeyboardArrowRight/>}
                                                className={entry.open ? classes.openedTreeEl : classes.closedTreeEl}
                                                disabled={!(entry.openable && entry.hasChildren)}
                                                data-jrm-role="picker-item-toggle"
                                                data-jrm-state={entry.open ? 'open' : 'closed'}
                                                onClick={event => {
                                                    onOpenItem(entry.path, !entry.open);
                                                    event.stopPropagation();
                                                }}
                                            />
                                        </div>
                                        <span
                                            className={classes.treeEntry}
                                            onClick={() => entry.selectable ? onSelectItem(entry.path, !entry.selected) : null}
                                        >
                                            <ListItemIcon className={classes.listItemNodeTypeIcon}>
                                                {iconRenderer(entry)}
                                            </ListItemIcon>
                                            <ListItemText
                                                disableTypography
                                                inset
                                                className={entry.node.primaryNodeType.name === 'jnt:page' && entry.node.publicationStatus && entry.node.publicationStatus.publicationStatus === 'UNPUBLISHED' ? classes.unpublishedEntryLabel : null}
                                                primary={
                                                    <React.Fragment>
                                                        <Typography color="inherit">
                                                            {entry.depth > 0 ? entry.node.displayName : rootLabel}
                                                        </Typography>
                                                    </React.Fragment>
                                                }
                                                data-jrm-role="picker-item-text"
                                            />
                                        </span>
                                        {this.state.hover === entry.path && entry.depth > 0 &&
                                            <ListItemIcon
                                                className={classes.listItemActionIcon}
                                                style={container.current ? {left: (container.current.clientWidth - 48 + container.current.scrollLeft)} : {}}
                                            >
                                                <DisplayAction
                                                    actionKey="contentMenu"
                                                    context={{path: entry.node.path}}
                                                    render={iconButtonRenderer({
                                                        color: 'inherit',
                                                        'data-cm-role': 'picker-item-menu'
                                                    })}
                                                />
                                            </ListItemIcon>
                                        }
                                    </UploadTransformComponent>
                                </React.Fragment>
                            );
                        })
                    }
                </List>
            </div>
        );
    }

    sortFoldersAlphabetical(pickerEntries) {
        if (pickerEntries.length !== 0 && pickerEntries[0] && (pickerEntries[0].node.primaryNodeType.name === 'jnt:contentFolder' || pickerEntries[0].node.primaryNodeType.name === 'jnt:folder')) {
            const rootNode = this.reconstructNodeHierarchy(JSON.parse(JSON.stringify(pickerEntries)));
            return this.sortAndFlatten(rootNode);
        }
        return pickerEntries;
    }

    reconstructNodeHierarchy(pickerEntriesSortedByPath) {
        const hierarchyStack = [];

        // Add root node to stack
        hierarchyStack.push(pickerEntriesSortedByPath.splice(0, 1)[0]);

        while (pickerEntriesSortedByPath.length !== 0 && hierarchyStack.length !== 0) {
            const currentPickerEntry = pickerEntriesSortedByPath[0];
            const top = hierarchyStack[hierarchyStack.length - 1];

            // Add children to top of the stack if current entry is child of top
            if (currentPickerEntry.path.indexOf(top.path) !== -1 && currentPickerEntry.path.replace(top.path, '')[0] === '/') {
                if (!top.children) {
                    top.children = [];
                }
                top.children.push(currentPickerEntry);
                hierarchyStack.push(currentPickerEntry);
                pickerEntriesSortedByPath.splice(0, 1);
            } else {
                hierarchyStack.pop();
            }
        }

        return hierarchyStack[0];
    }

    sortAndFlatten(rootNode) {
        const flatArray = [];

        dfs(rootNode);

        function dfs(node) {
            flatArray.push(node);
            if (node.children) {
                node.children.sort(function (a, b) {
                    const A = a.node.displayName.toLocaleLowerCase();
                    const B = b.node.displayName.toLocaleLowerCase();
                    if (A < B) {
                        return -1;
                    }
                    if (A > B) {
                        return 1;
                    }
                    return 0;
                });

                for (let i = 0; i < node.children.length; i++) {
                    dfs(node.children[i]);
                }
            }
        }

        return flatArray;
    }
}

PickerViewMaterial.propTypes = {
    classes: PropTypes.object.isRequired,
    container: PropTypes.object.isRequired,
    dataCmRole: PropTypes.string.isRequired,
    iconRenderer: PropTypes.func,
    loading: PropTypes.bool.isRequired,
    mode: PropTypes.string.isRequired,
    onOpenItem: PropTypes.func,
    onSelectItem: PropTypes.func,
    pickerEntries: PropTypes.array.isRequired,
    rootLabel: PropTypes.string.isRequired
};

PickerViewMaterial.defaultProps = {
    iconRenderer: defaultIconRenderer,
    onSelectItem: () => {},
    onOpenItem: () => {}
};

export default compose(
    withTheme(),
    withStyles(styles, {name: 'DxPickerViewMaterial'})
)(PickerViewMaterial);