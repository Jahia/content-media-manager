import React from 'react';
import PropTypes from 'prop-types';
import {withStyles, Input} from '@material-ui/core';

const styles = theme => ({
    sql2Input: {
        margin: 0,
        padding: 0,
        width: 100,
        color: theme.palette.secondary.primary,
        backgroundColor: theme.palette.background.default,
        border: 0,
        boxShadow: 'none',
        fontFamily: 'monospace'
    }
});

export class Sql2Input extends React.Component {
    constructor(props) {
        super(props);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    onKeyDown(e) {
        if (e.key === 'Enter') {
            this.props.onSearch();
        }
    }

    render() {
        let {maxLength, size, value, onChange, classes, style, cmRole} = this.props;

        return (
            <Input
                inputProps={{maxLength: maxLength, size: size, 'data-cm-role': cmRole}}
                value={value}
                classes={{root: classes.sql2Input, input: classes.sql2Input}}
                style={style}
                onChange={onChange}
                onKeyDown={e => this.onKeyDown(e)}
            />
        );
    }
}

Sql2Input.propTypes = {
    classes: PropTypes.object.isRequired,
    cmRole: PropTypes.string.isRequired,
    maxLength: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    size: PropTypes.number,
    style: PropTypes.object,
    value: PropTypes.string.isRequired
};

export default withStyles(styles)(Sql2Input);
