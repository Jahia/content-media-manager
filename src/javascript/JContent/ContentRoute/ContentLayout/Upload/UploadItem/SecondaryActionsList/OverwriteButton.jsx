import React from 'react';
import PropTypes from 'prop-types';
import {Button} from '@jahia/design-system-kit';

const OverwriteButton = ({t, classes, doUploadAndStatusUpdate}) => (
    <Button
        key="overwrite"
        className={classes.actionButton}
        component="a"
        variant="ghost"
        color="inverted"
        onClick={() => {
            doUploadAndStatusUpdate('replace');
        }}
    >
        {t('jcontent:label.contentManager.fileUpload.replace')}
    </Button>
);

OverwriteButton.propTypes = {
    t: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    doUploadAndStatusUpdate: PropTypes.func.isRequired
};

export default OverwriteButton;
