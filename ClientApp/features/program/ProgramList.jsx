import * as React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import { List } from '@material-ui/core';
import { datestamp } from '../../youwell-common/dateUtils';

import { LinkListItem, InfoMessage } from '../../common/components';
import urls from '../../app/urls';

const styles = theme => ({
    root: {

    },
    list: {
        marginTop: theme.spacing.unit * 3,
    },
    notificationIcon: {
        color: theme.palette.primary.main,
    },
});

const getSecondaryText = (item, translate) => {
    if (item.startDate && item.endDate) {
        return translate('program.period', { start: datestamp(item.startDate), end: datestamp(item.endDate) });
    }
    if (item.startDate) {
        return translate('program.starting', { start: datestamp(item.startDate) });
    }
    return null;
};

class ProgramList extends React.Component {
    render() {
        const {
            classes, translate, programList, match,
        } = this.props;

        if (programList === null) {
            return null;
        }
        if (programList.length > 0 && match.path === urls.inside.programredirect) {
            return (<Redirect to={{ pathname: `${urls.inside.program.home}/${programList[0].id}` }} />
            );
        }
        if (programList.length === 1) {
            return (<Redirect to={{ pathname: `${urls.inside.program.home}/${programList[0].id}` }} />
            );
        }

        return (
            <div className={classes.root}>
                {(programList.length === 0) && <InfoMessage message={translate('no_treatment_programs_found')} />}

                {(programList.length > 0) && (
                    <List>
                        {programList.map(item => (
                            <LinkListItem
                                key={item.id}
                                to={`${urls.inside.program.home}/${item.id}`}
                                primary={item.program ? item.program.name : ''}
                                secondary={getSecondaryText(item, translate)}
                            />
                        ))}
                    </List>
                )}

            </div>
        );
    }
}

ProgramList.propTypes = {
    classes: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    programList: PropTypes.array,
    match: PropTypes.shape({
        path: PropTypes.string.isRequired,
    }).isRequired,
};

ProgramList.defaultProps = {
    programList: null,
};

const mapStateToProps = state => ({
    translate: getTranslate(state.localize),
    programList: state.programStore.list,
});

export default connect(mapStateToProps)(withStyles(styles)(ProgramList));
