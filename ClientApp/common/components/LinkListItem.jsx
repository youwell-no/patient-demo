import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { ListItem, ListItemText, ListItemIcon } from '@material-ui/core';

import { Link } from 'react-router-dom';

const styles = () => ({

    listItem: {
        borderWidth: '1px 0',
        marginBottom: 10,
    },
    listItemText: {
        paddingLeft: 0,
    },
    inactive: {
    },
    alert: {
    },
});

class LinkListItem extends React.Component {
    render() {
        const {
            classes,
            to,
            Icon,
            primary,
            secondary,
            inactive,
            alert,
        } = this.props;

        let classname = '';
        if (inactive) {
            classname = classes.inactive;
        } else if (alert) {
            classname = classes.alert;
        }

        return (
            <Link to={to}>
                <ListItem button className={classes.listItem}>
                    {Icon && (
                        <ListItemIcon className={classname}>
                            {Icon}
                        </ListItemIcon>
                    )}
                    <ListItemText
                        className={classes.listItemText}
                        primary={primary}
                        secondary={secondary}
                    />
                </ListItem>
            </Link>
        );
    }
}

LinkListItem.propTypes = {
    classes: PropTypes.object.isRequired,
    to: PropTypes.string.isRequired,
    primary: PropTypes.string.isRequired,
    secondary: PropTypes.string,
    Icon: PropTypes.element,
    inactive: PropTypes.bool,
    alert: PropTypes.bool,
};

LinkListItem.defaultProps = {
    secondary: null,
    Icon: null,
    inactive: false,
    alert: false,
};

export default withStyles(styles)(LinkListItem);
