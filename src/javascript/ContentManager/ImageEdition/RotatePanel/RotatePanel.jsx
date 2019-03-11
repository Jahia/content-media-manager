import React from 'react';
import PropTypes from 'prop-types';
import {Tooltip, withStyles} from '@material-ui/core';
import {ExpandMore, RotateLeft, RotateRight} from '@material-ui/icons';
import {
    Typography,
    IconButton,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary} from '@jahia/ds-mui-theme';
import {compose} from 'react-apollo';
import {translate} from 'react-i18next';
import ImageActions from '../ImageActions';
import {PANELS} from '../ImageEdition';

let styles = theme => ({
    rotatePanel: {
        display: 'flex',
        flexDirection: 'column'
    },
    icons: {
        paddingTop: theme.spacing.unit * 2
    }
});

export class RotatePanel extends React.Component {
    onChange(event, expanded) {
        let {onChangePanel} = this.props;
        if (expanded) {
            onChangePanel(PANELS.ROTATE);
        } else {
            onChangePanel(false);
        }
    }

    render() {
        let {classes, t, rotate, undoChanges, expanded, saveChanges, dirty, disabled} = this.props;
        return (
            <Tooltip title={disabled ? t('label.contentManager.editImage.tooltip') : ''}>
                <ExpansionPanel disabled={disabled}
                                expanded={expanded}
                                onChange={(event, expanded) => this.onChange(event, expanded)}
                >
                    <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                        <Typography variant="zeta" color="alpha">{t('label.contentManager.editImage.rotate')}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.rotatePanel}>
                        <Typography variant="zeta" color="beta">
                            {t('label.contentManager.editImage.rotateImage')}
                        </Typography>
                        <div className={classes.icons}>
                            <IconButton icon={<RotateLeft color="primary" fontSize="large"/>} onClick={() => rotate(-1)}/>
                            <IconButton icon={<RotateRight color="primary" fontSize="large"/>} onClick={() => rotate(1)}/>
                        </div>
                    </ExpansionPanelDetails>
                    <ImageActions dirty={dirty} undoChanges={undoChanges} saveChanges={saveChanges}/>
                </ExpansionPanel>
            </Tooltip>
        );
    }
}

RotatePanel.propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    dirty: PropTypes.bool.isRequired,
    saveChanges: PropTypes.func.isRequired,
    rotate: PropTypes.func.isRequired,
    undoChanges: PropTypes.func.isRequired,
    expanded: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
    onChangePanel: PropTypes.func.isRequired
};

export default compose(
    translate(),
    withStyles(styles)
)(RotatePanel);