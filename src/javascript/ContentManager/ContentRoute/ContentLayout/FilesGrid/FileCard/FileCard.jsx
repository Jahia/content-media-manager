import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Card, CardContent, CardMedia, withStyles} from '@material-ui/core';
import {Typography} from '@jahia/ds-mui-theme';
import {compose} from 'react-apollo';
import {ContextualMenu} from '@jahia/react-material';
import {translate} from 'react-i18next';
import PublicationStatus from '../../PublicationStatus';
import Moment from 'react-moment';
import 'moment-timezone';
import {isBrowserImage} from '../FilesGrid.utils';
import FileIcon from '../FileIcon';
import {cmGoto, cmOpenPaths, CM_DRAWER_STATES} from '../../../../ContentManager.redux-actions';
import {connect} from 'react-redux';
import {allowDoubleClickNavigation} from '../../../../ContentManager.utils';
import classNames from 'classnames';
import FileName from './FileName';
import Actions from './Actions';
import {Folder} from 'mdi-material-ui';
import {extractPaths} from '../../../../ContentManager.utils';
import {cmSetPreviewSelection} from '../../../../preview.redux-actions';

const styles = theme => ({
    defaultCard: {
        display: 'flex',
        flexDirection: 'row',
        cursor: 'pointer',
        position: 'relative',
        marginLeft: 0,
        marginRight: 0,
        padding: 0,
        minHeight: 200,
        maxHeight: 200,
        backgroundColor: theme.palette.background.paper,
        '& $mediaCardContentContainer': {
            width: 'calc(100% - 200px)'
        },
        '& $fileCardContentContainer': {
            width: 'calc(100% - 160px)'
        }
    },
    extraSmallCard: {
        minHeight: 150,
        maxHeight: 150,
        '& $mediaCardContentContainer': {
            width: 'calc(100% - 75px)'
        },
        '& $fileCardContentContainer': {
            width: 'calc(100% - 112px)'
        }
    },
    smallCard: {
        minHeight: 150,
        maxHeight: 150,
        '& $mediaCardContentContainer': {
            width: 'calc(100% - 125px)'
        },
        '& $fileCardContentContainer': {
            width: 'calc(100% - 112px)'
        }
    },
    largeCard: {
        '& $mediaCardContentContainer': {
            width: 'calc(100% - 300px)'
        },
        '& $fileCardContentContainer': {
            width: 'calc(100% - 160px)'
        }
    },
    verticalCard: {
        flexDirection: 'column',
        minHeight: 252,
        maxHeight: 252,
        '& $defaultFileCover': {
            height: 150
        },
        '& $mediaCardContentContainer': {
            width: '100%'
        },
        '& $fileCardContentContainer': {
            width: '100%'
        }
    },
    defaultFileCover: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    largeFileCoverIcon: {
        fontSize: '160px'
    },
    smallFileCoverIcon: {
        fontSize: '112px'
    },
    extraSmallCover: {
        minWidth: 75,
        maxWidth: 75,
        height: 100
    },
    smallCover: {
        minWidth: 125,
        maxWidth: 125,
        height: 150
    },
    defaultCover: {
        minWidth: 200,
        maxWidth: 200,
        height: 200
    },
    largeCover: {
        minWidth: 300,
        maxWidth: 300,
        height: 300
    },
    verticalCover: {
        height: 150
    },
    mediaCardContentContainer: {
        position: 'relative',
        width: '100%'
    },
    fileCardContentContainer: {
        position: 'relative',
        width: '100%'
    },
    cardContent: {
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingTop: theme.spacing.unit * 3,
        '& div': {
            marginBottom: theme.spacing.unit * 2
        }
    },
    selectedCard: {
        boxShadow: '1px 0px 15px 4px ' + theme.palette.primary.main
    }
});

export class FileCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isHovered: false
        };
    }

    render() {
        const {cardType, classes, t, node, dxContext, uiLang, setPath, previewSelection, onPreviewSelect, previewState, siteKey, mode} = this.props;
        const {isHovered} = this.state;

        let contextualMenu = React.createRef();

        const isImage = isBrowserImage(node.path);
        const isPreviewOpened = previewState === CM_DRAWER_STATES.SHOW;
        const isPreviewSelected = (previewSelection && previewSelection === node.path) && isPreviewOpened;

        let isExtraSmallCard = false;
        let isSmallCard = false;
        let isDefaultCard = false;
        let isLargeCard = false;
        let isVerticalCard = false;
        let maxLengthLabels;
        switch (cardType) {
            case 2:
                isVerticalCard = true;
                maxLengthLabels = 18;
                break;
            case 3:
                isExtraSmallCard = true;
                maxLengthLabels = 16;
                break;
            case 4:
                isSmallCard = true;
                maxLengthLabels = 16;
                break;
            case 6:
                isDefaultCard = true;
                maxLengthLabels = 28;
                break;
            default:
                isLargeCard = true;
                maxLengthLabels = 28;
        }

        let fileIconClasses = {root: isLargeCard || isDefaultCard ? classes.largeFileCoverIcon : classes.smallFileCoverIcon};

        return (
            <React.Fragment>
                <ContextualMenu ref={contextualMenu} actionKey="contentMenu" context={{path: node.path}}/>

                <Card
                    className={classNames(
                        classes.defaultCard,
                        isExtraSmallCard && classes.extraSmallCard,
                        isSmallCard && classes.smallCard,
                        isLargeCard && classes.largeCard,
                        isVerticalCard && classes.verticalCard,
                        isPreviewSelected && classes.selectedCard
                    )}
                    data-cm-role="grid-content-list-card"
                    onContextMenu={event => {
                        event.stopPropagation();
                        contextualMenu.current.open(event);
                    }}
                    onClick={() => {
                        if (!node.notSelectableForPreview) {
                            onPreviewSelect(node.path);
                        }
                    }}
                    onDoubleClick={allowDoubleClickNavigation(node.primaryNodeType.name, null, () => setPath(siteKey, node.path, mode))}
                    onMouseEnter={event => this.onHoverEnter(event)}
                    onMouseLeave={event => this.onHoverExit(event)}
                >
                    {!isVerticalCard &&
                        <PublicationStatus node={node}/>
                    }

                    {isImage ?
                        <CardMedia
                            className={classNames(
                                isDefaultCard && classes.defaultCover,
                                isExtraSmallCard && classes.extraSmallCover,
                                isSmallCard && classes.smallCover,
                                isLargeCard && classes.largeCover,
                                isVerticalCard && classes.verticalCover
                            )}
                            image={`${dxContext.contextPath}/files/default/${node.path}?lastModified=${node.lastModified.value}&t=thumbnail2`}
                            title={node.name}
                        /> :
                        <div className={classes.defaultFileCover}>
                            {node.primaryNodeType.name === 'jnt:folder' ?
                                <Folder color="action" classes={fileIconClasses}/> :
                                <FileIcon filename={node.path} color="disabled" classes={fileIconClasses}/>
                            }
                        </div>
                    }

                    <div className={isImage ? classes.mediaCardContentContainer : classes.fileCardContentContainer}>
                        {isVerticalCard &&
                            <PublicationStatus node={node}/>
                        }

                        <Actions node={node} isHovered={isHovered}/>

                        <CardContent classes={{root: classes.cardContent}}>
                            <div>
                                <Typography variant="caption" component="p">
                                    {t('label.contentManager.filesGrid.name')}
                                </Typography>
                                <FileName maxLength={maxLengthLabels} node={node}/>
                            </div>
                            {!isVerticalCard &&
                                <div>
                                    <Typography variant="caption" component="p">
                                        {t('label.contentManager.filesGrid.createdBy')}
                                    </Typography>
                                    <Typography variant="iota" component="p">
                                        {t('label.contentManager.filesGrid.author', {author: node.createdBy ? node.createdBy.value : ''})}
                                        &nbsp;
                                        <Moment format="LLL" locale={uiLang}>
                                            {node.created.value}
                                        </Moment>
                                    </Typography>
                                </div>
                            }
                            {(isDefaultCard || isLargeCard) && node.width && node.height &&
                                <div>
                                    <Typography variant="caption" component="p">
                                        {t('label.contentManager.filesGrid.fileInfo')}
                                    </Typography>
                                    <Typography variant="iota" component="p">
                                        {`${node.width.value} x ${node.height.value}`}
                                    </Typography>
                                </div>
                            }
                        </CardContent>
                    </div>
                </Card>
            </React.Fragment>
        );
    }

    onHoverEnter() {
        this.setState({isHovered: true});
    }

    onHoverExit() {
        this.setState({isHovered: false});
    }
}

const mapStateToProps = state => ({
    uiLang: state.uiLang,
    previewSelection: state.previewSelection,
    previewState: state.previewState,
    mode: state.mode,
    siteKey: state.site
});

const mapDispatchToProps = dispatch => ({
    onPreviewSelect: previewSelection => dispatch(cmSetPreviewSelection(previewSelection)),
    setPath: (siteKey, path, mode) => {
        dispatch(cmOpenPaths(extractPaths(siteKey, path, mode)));
        dispatch(cmGoto({path: path}));
    }
});

FileCard.propTypes = {
    cardType: PropTypes.number.isRequired,
    classes: PropTypes.object.isRequired,
    dxContext: PropTypes.object.isRequired,
    mode: PropTypes.string.isRequired,
    node: PropTypes.object.isRequired,
    onPreviewSelect: PropTypes.func.isRequired,
    previewSelection: PropTypes.string,
    previewState: PropTypes.number.isRequired,
    setPath: PropTypes.func.isRequired,
    siteKey: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    uiLang: PropTypes.string.isRequired
};

FileCard.defaultProps = {
    previewSelection: null
};

export default compose(
    withStyles(styles),
    translate(),
    connect(mapStateToProps, mapDispatchToProps)
)(FileCard);