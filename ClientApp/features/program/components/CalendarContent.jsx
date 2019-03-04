import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import classnames from 'classnames';

import { Link } from 'react-router-dom';
import {
    Typography,
} from '@material-ui/core';

import urls from '../../../app/urls';

const styles = theme => ({
    root: {
    },
    heading: {
        padding: theme.spacing.unit,
        marginTop: theme.spacing.unit * 2,

        [theme.breakpoints.up('sm')]: {
            padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
            background: theme.colors.blue4,
            color: theme.palette.common.white,
            width: '100%',
        },
    },
    calendar: {
        padding: theme.spacing.unit,
        border: theme.borders.normal,
        backgroundColor: theme.palette.common.white,
        display: 'flex',
        flexWrap: 'wrap',

        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
            padding: 0,
            border: 0,
        },
    },
    day: {
        flex: 1,
        padding: theme.spacing.unit / 2,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 150,
        overflow: 'hidden',
        [theme.breakpoints.down('xs')]: {
            padding: 0,
            minHeight: 0,
        },
    },
    outOfDate: {
        [theme.breakpoints.down('xs')]: {
            opacity: 0.5,
        },
    },
    borderLeft: {
        borderLeft: theme.borders.normal,
        [theme.breakpoints.down('xs')]: {
            borderLeft: 0,
        },
    },
    dayHeader: {
        textTransform: 'uppercase',
        padding: `0 ${theme.spacing.unit / 2}px`,
        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing.unit,
            background: theme.colors.blue1,
            marginTop: theme.spacing.unit,
        },
    },
    taskList: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    current: {
        backgroundColor: theme.colors.blue1,
        [theme.breakpoints.down('xs')]: {
            backgroundColor: 'transparent',
        },
    },
    task: {
        userSelect: 'none',
        maxWidth: 150,
        display: 'inline-flex',
        alignItems: 'center',
        border: theme.borders.normal,
        padding: theme.spacing.unit,
        margin: theme.spacing.unit / 2,
        backgroundColor: theme.palette.common.white,

        [theme.breakpoints.down('xs')]: {
            maxWidth: '100%',
            margin: theme.spacing.unit,
        },
    },
    taskName: {
        flex: 1,
        marginLeft: theme.spacing.unit / 2,
        marginRight: theme.spacing.unit / 2,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    noContent: {
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
    },
});

class CalendarContent extends React.Component {
    render() {
        const {
            classes, translate, elements, programId, elementType,
        } = this.props;

        if (!elements || elements.length < 1) {
            return null;
        }

        const week = [
            { key: '1', elements: [] },
            { key: '2', elements: [] },
            { key: '3', elements: [] },
            { key: '4', elements: [] },
            { key: '5', elements: [] },
            { key: '6', elements: [] },
            { key: '0', elements: [] },
        ];

        if (elements) {
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].startDay > 0) {
                    week[elements[i].startDay - 1].elements.push({ ...elements[i], index: i });
                }
            }
        }

        const currentDay = new Date().getDay().toString();

        return (
            <div className={classes.root}>
                <div className={classes.heading}>
                    <Typography variant="subtitle1" color="inherit">
                        {translate('program.weekplan')}
                    </Typography>
                </div>

                <div className={classes.calendar}>
                    {week.map((day, dayIndex) => (
                        <div
                            key={day.key}
                            className={classnames(classes.day, {
                                [classes.borderLeft]: dayIndex > 0,
                                [classes.noContent]: day.elements.length < 1,
                                [classes.current]: day.key === currentDay,
                                [classes.outOfDate]: day.key < currentDay,
                            })}
                        >
                            <Typography variant="subtitle1" className={classes.dayHeader}>
                                {translate(`time.weekdays.${day.key}`)}
                            </Typography>
                            <div className={classnames(classes.taskList)}>
                                {day.elements.map(element => (
                                    <Link
                                        key={element.index}
                                        className={classes.task}
                                        to={`${urls.inside.program.home}/${programId}/${elementType}/${element.index}`}
                                    >
                                        <Typography className={classes.taskName}>
                                            {element.task.name}
                                        </Typography>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

CalendarContent.propTypes = {
    classes: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    programId: PropTypes.string.isRequired,
    elementType: PropTypes.string.isRequired,
    elements: PropTypes.array,
};

CalendarContent.defaultProps = {
    elements: null,
};

const mapStateToProps = state => ({
    translate: getTranslate(state.localize),
});

export default connect(mapStateToProps)(withStyles(styles)(CalendarContent));
