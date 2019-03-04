import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';

import { Link } from 'react-router-dom';
import {
    Typography,
} from '@material-ui/core';

import * as ModalStore from '../../../app/store/ModalStore';
import urls from '../../../app/urls';
import { getLocalDate, today, datestamp } from '../../../youwell-common/dateUtils';

const styles = theme => ({
    root: {
    },
    moduleSubheading: {
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 5}px`,
        marginTop: theme.spacing.unit * 2,

        [theme.breakpoints.up('sm')]: {
            padding: `${theme.spacing.unit}px ${theme.spacing.unit * 8}px`,
            background: theme.colors.blue4,
            color: theme.palette.common.white,
            width: `calc(100% - ${theme.borders.boxShadow1Width}px)`,
            boxShadow: theme.borders.boxShadow1Right,
        },
    },
    modules: {
        display: 'flex',
        flexDirection: 'column',
        borderTop: theme.borders.normal,
        borderTopColor: theme.colors.blue1,

        [theme.breakpoints.down('xs')]: {
            flex: '1 1 auto',
        },

        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${theme.borders.boxShadow1Width}px)`,
            boxShadow: theme.borders.boxShadow1,
        },
    },
    module: {
        display: 'flex',
    },
    moduleIndex: {
        background: theme.colors.blue1,
        borderBottom: theme.borders.normal,
        width: theme.spacing.unit * 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.common.white,

        [theme.breakpoints.up('sm')]: {
            width: theme.spacing.unit * 4,
        },
    },
    moduleTitle: {
        flex: '1 1 0px',
        margin: `0 ${theme.spacing.unit * 2}px`,
        padding: `${theme.spacing.unit * 2}px 0`,
        borderBottom: theme.borders.normal,
        color: theme.colors.grey2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',

        [theme.breakpoints.up('sm')]: {
            margin: `0 ${theme.spacing.unit * 4}px`,
        },
    },
    completed: {
        color: theme.palette.common.black,
    },
    current: {
        color: theme.palette.common.black,
        background: theme.colors.brown1,
        margin: '-1px 0 0',
        padding: `${theme.spacing.unit * 2}px`,

        [theme.breakpoints.up('sm')]: {
            padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px`,
        },
    },
});


// const isNextAvailable = (element, elementIndex, nextElementIndex) => {
//     if (element.endTime || element.startTime) {
//         return false;
//     }

//     if (nextElementIndex < 0 || (!element.startTime && elementIndex <= nextElementIndex)) {
//         return true;
//     }
//     return false;
// };

class ModuleContent extends React.Component {
    clickElement = element => (e) => {
        if (element.isHidden || element.isUnavailable) {
            e.preventDefault();
            this.props.showModal({
                header: this.props.translate('moduleNotAvailable'),
                message: this.props.translate(element.isHidden ? 'moduleIsHiddenDescription' : 'moduleNotAvailableDescription'),
            });
        }
    }

    render() {
        const {
            classes, translate, elements, programId, elementType,
        } = this.props;

        if (!elements || elements.length < 1) {
            return null;
        }

        const nextElementIndex = elements.findIndex(d => !d.completed && !d.isHidden);

        return (
            <div className={classes.root}>
                <div className={classes.moduleSubheading}>
                    <Typography variant="subtitle1" color="inherit">
                        {translate('modules')}
                    </Typography>
                </div>

                <div className={classes.modules}>
                    {elements.map((element, i) => (
                        <Link
                            key={element.module ? element.module.name : element.task && element.task.id}
                            className={classnames(classes.module)}
                            to={element.module ? `${urls.inside.program.home}/${programId}/${urls.inside.program.parts.module}/${elementType}/${i}`
                                : `${urls.inside.program.home}/${programId}/${elementType}/${i}`}
                            onClick={this.clickElement(element)}
                        >
                            <div className={classes.moduleIndex}>
                                <Typography variant="subtitle1" color="inherit">
                                    {i + 1}
                                </Typography>
                            </div>
                            <div className={classnames(classes.moduleTitle, { [classes.current]: i === nextElementIndex && !element.isUnavailable, [classes.completed]: element.completed && !element.isUnavailable })}>
                                <Typography variant="subtitle1" color="inherit">
                                    {element.module && element.module.name}
                                    {element.task && element.task.name}
                                </Typography>
                                {element.startTime && getLocalDate(element.startTime) > today() && (
                                    <Typography variant="caption" color="inherit">
                                        {datestamp(element.startTime)}
                                    </Typography>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        );
    }
}

ModuleContent.propTypes = {
    classes: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    programId: PropTypes.string.isRequired,
    elementType: PropTypes.string.isRequired,
    elements: PropTypes.array,
};

ModuleContent.defaultProps = {
    elements: null,
};

const mapStateToProps = state => ({
    translate: getTranslate(state.localize),
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(ModalStore.actionCreators, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ModuleContent));
