import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';
import ResizingHandleIcon from './ResizingHandleIcon';

const styles = theme => ({
    root: {
        backgroundColor: 'transparent',
        cursor: 'col-resize',
        minHeight: '100%',
        height: '100%',
        position: 'absolute',
        right: '0px',
        width: '7px',
        zIndex: theme.zIndex.drawer
    },
    iconContainer: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100%',
        minWidth: '100%'
    }
});

const ResizingHandleBar = ({classes, onMouseDown}) => (
    <div className={classes.root} onMouseDown={onMouseDown}>
        <div className={classes.iconContainer}>
            <ResizingHandleIcon/>
        </div>
    </div>
);

ResizingHandleBar.propTypes = {
    classes: PropTypes.object.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default withStyles(styles)(ResizingHandleBar);
