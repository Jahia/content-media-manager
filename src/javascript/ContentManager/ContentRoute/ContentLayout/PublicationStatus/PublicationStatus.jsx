import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';
import {Typography} from '@jahia/ds-mui-theme';
import {InfoOutlined} from '@material-ui/icons';
import {publicationStatusByName} from './publicationStatusRenderer';
import {translate} from 'react-i18next';
import classNames from 'classnames';

const styles = theme => ({
    root: {
        display: 'flex',
        minHeight: 48,
        height: '100%',
        position: 'absolute',
        zIndex: 1,
        bottom: 0,
        minWidth: 6
    },
    border: {
        width: 6,
        cursor: 'pointer',
        '&:hover ~ $publicationInfoWrapper': {
            width: '100%'
        },
        '&:hover ~ $publicationInfoWrapper > $publicationInfo': {
            visibility: 'visible',
            width: '100%',
            opacity: 1
        }
    },
    publicationInfoWrapper: {
        display: 'flex',
        width: 0,
        transitionDuration: '.2s',
        '&:hover': {
            width: '100%'
        },
        '&:hover > $publicationInfo': {
            visibility: 'visible',
            width: '100%',
            opacity: 1
        }
    },
    publicationInfo: {
        display: 'flex',
        alignItems: 'center',
        opacity: 0,
        width: 0,
        margin: '0 ' + (theme.spacing.unit * 2) + 'px',
        transition: 'width .3s ease 0s, visibility .3s ease 0s',
        visibility: 'hidden'
    },
    spacing: {
        marginRight: theme.spacing.unit
    },
    published: {
        backgroundColor: theme.palette.publicationStatus.published.main,
        color: theme.palette.getContrastText(theme.palette.publicationStatus.published.main)
    },
    modified: {
        backgroundColor: theme.palette.publicationStatus.modified.main,
        color: theme.palette.getContrastText(theme.palette.publicationStatus.modified.main)
    },
    notPublished: {
        backgroundColor: theme.palette.publicationStatus.notPublished.main,
        color: theme.palette.getContrastText(theme.palette.publicationStatus.notPublished.main)
    },
    unPublished: {
        backgroundColor: theme.palette.publicationStatus.unpublished.main,
        color: theme.palette.getContrastText(theme.palette.publicationStatus.unpublished.main)
    },
    markedForDeletion: {
        backgroundColor: theme.palette.publicationStatus.markedForDeletion.main,
        color: theme.palette.getContrastText(theme.palette.publicationStatus.markedForDeletion.main)
    },
    mandatoryLanguageUnpublishable: {
        backgroundColor: theme.palette.publicationStatus.mandatoryLanguageUnpublishable.main,
        color: theme.palette.getContrastText(theme.palette.publicationStatus.mandatoryLanguageUnpublishable.main)
    },
    mandatoryLanguageValid: {
        backgroundColor: theme.palette.publicationStatus.mandatoryLanguageValid.main,
        color: theme.palette.getContrastText(theme.palette.publicationStatus.mandatoryLanguageValid.main)
    },
    conflict: {
        backgroundColor: theme.palette.publicationStatus.conflict.main,
        color: theme.palette.getContrastText(theme.palette.publicationStatus.conflict.main)
    },
    unknown: {
        backgroundColor: theme.palette.publicationStatus.conflict.main,
        color: theme.palette.getContrastText(theme.palette.publicationStatus.conflict.main)
    },
    noStatus: {
        backgroundColor: '#cecece',
        color: theme.palette.getContrastText('#cecece')
    }
});

export class PublicationStatus extends Component {
    render() {
        const {classes, node, t, i18n} = this.props;
        const publicationStatus = publicationStatusByName.getStatus(node);
        const publicationStatusClass = publicationStatus.getContentClass(classes);

        return (
            <div className={classes.root}>
                <div className={classNames(classes.border, publicationStatusClass)}/>
                <div className={classNames(classes.publicationInfoWrapper, publicationStatusClass)}>
                    <div className={classes.publicationInfo}
                         data-cm-role="publication-info"
                         data-cm-value={node.aggregatedPublicationInfo.publicationStatus}
                    >
                        <InfoOutlined className={classes.spacing} fontSize="small"/>

                        <Typography color="inherit" variant="caption" classes={{root: classes.spacing}}>
                            {publicationStatus.geti18nDetailsMessage(node, t, i18n.language)}
                        </Typography>
                    </div>
                </div>
            </div>
        );
    }
}

PublicationStatus.propTypes = {
    node: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired
};

export default translate()(withStyles(styles)(PublicationStatus));