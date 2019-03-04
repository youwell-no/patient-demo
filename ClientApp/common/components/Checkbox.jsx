import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Checkbox as CheckboxControl, FormControlLabel } from '@material-ui/core';


const styles = theme => ({

    checkbox: {
        margin: 0,
        marginTop: theme.spacing.unit,
    },
    checkboxInput: {
        width: 'auto',
        marginRight: theme.spacing.unit,
    },
});

class Checkbox extends React.Component {
    render() {
        const {
            classes, checked, onChange, label,
        } = this.props;

        return (
            <FormControlLabel
                className={classes.checkbox}
                control={(
                    <CheckboxControl
                        classes={{ default: classes.checkboxInput }}
                        checked={checked}
                        onChange={onChange}
                        inputProps={{
                            'aria-label': label,
                        }}
                    />
                )}
                label={label}
            />
        );
    }
}

Checkbox.propTypes = {
    classes: PropTypes.object.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
};

Checkbox.defaultProps = {
    label: null,
};


export default withStyles(styles)(Checkbox);
