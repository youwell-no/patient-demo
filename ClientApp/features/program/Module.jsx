import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';

import { Link } from 'react-router-dom';
import {
    Typography, Grid, Hidden, Tooltip,
} from '@material-ui/core';

import { CompletedQuestionnaireIcon, QuestionnaireIcon } from '../../common/icons';
import * as ModalStore from '../../app/store/ModalStore';
import urls from '../../app/urls';
import ProgramBreadcrumb from './components/ProgramBreadcrumb';
import apiUrls from '../../youwell-common/apiUrls';
import LoadElementResponses from './components/LoadElementResponses';


const styles = theme => ({
    root: {
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column',
    },
    topContainer: {
        height: '100%',
    },
    imageContainer: {
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 4}px`,
        textAlign: 'center',
    },
    programNameContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        [theme.breakpoints.up('sm')]: {
            padding: `${theme.spacing.unit}px ${theme.spacing.unit * 4}px`,
        },
    },
    title: {
        flex: '1 1 auto',
    },
    taskSubheading: {
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 5}px`,
        display: 'flex',
        alignItems: 'center',

        [theme.breakpoints.up('sm')]: {
            marginTop: theme.spacing.unit * 2,
            padding: `${theme.spacing.unit}px ${theme.spacing.unit * 8}px`,
            background: theme.colors.blue4,
            color: theme.palette.common.white,
            width: `calc(100% - ${theme.borders.boxShadow1Width}px)`,
            boxShadow: theme.borders.boxShadow1Right,
        },
    },
    subHeadingTitle: {
        flex: '1 1 auto',
    },
    progress: {
        height: 12,
        [theme.breakpoints.up('sm')]: {
            marginTop: theme.spacing.unit * 2,
        },
    },
    programImage: {
        [theme.breakpoints.down('xs')]: {
            width: '70%',
        },
        [theme.breakpoints.up('sm')]: {
            width: '100%',
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

        [theme.breakpoints.up('sm')]: {
            margin: `0 ${theme.spacing.unit * 4}px`,
        },
    },
    startButton: {
        [theme.breakpoints.up('sm')]: {
            position: 'absolute',
            bottom: theme.spacing.unit,
            right: theme.spacing.unit,
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
    moduleTitleHeading: {
        flex: '1 1 auto',
    },
    iconGreen: {
        color: theme.colors.green,
        opacity: 0.5,
    },
    iconRed: {
        color: theme.colors.red,
        opacity: 0.7,
    },
    iconGray: {
        color: theme.colors.grey2,
        opacity: 0.7,
    },
});

class Module extends React.Component {
    showNotAvailable = (e) => {
        e.preventDefault();
        this.props.showModal({
            header: this.props.translate('taskNotAvailable'),
            message: this.props.translate('taskNotAvailableDescription'),
        });
    }

    render() {
        const {
            classes, translate, programDetails, match,
        } = this.props;
        const { group, elementIndex } = match.params;

        if (!programDetails || !programDetails.groupedElements || !programDetails.groupedElements[group] || !programDetails.groupedElements[group][elementIndex]) {
            return null;
        }

        const element = programDetails.groupedElements[group][elementIndex];
        const module = element.module;

        if (!module) {
            return (
                <React.Fragment>
                    <Typography variant="caption" align="center" color="primary" className={classes.notasks}>
                        {translate('noTasksAssigned')}
                    </Typography>
                </React.Fragment>
            );
        }

        let moduleImage = module.moduleImageId ? `${apiUrls.media}/${module.moduleImageId}` : null;
        if (!moduleImage && !!programDetails.program.frontImageId) {
            moduleImage = `${apiUrls.media}/${programDetails.program.frontImageId}`;
        }
        const nextTaskIndex = module.tasks ? module.tasks.findIndex(d => !d.visited) : 0;

        return (
            <div className={classes.root}>
                <ProgramBreadcrumb programDetails={programDetails} group={group} elementIndex={elementIndex} />
                <LoadElementResponses patientProgramId={programDetails.id} patientProgramElementId={element.id} />

                <Grid container className={classes.topContainer}>
                    <Grid item xs={12} sm={6} className={classes.imageContainer}>
                        {moduleImage && <img src={moduleImage} alt="" className={classes.programImage} />}
                    </Grid>
                    <Grid item sm={6} className={classes.programNameContainer}>
                        <Hidden implementation="css" xsDown className={classes.title}>
                            <Typography variant="h6">
                                {module.name}
                            </Typography>
                        </Hidden>
                    </Grid>
                </Grid>

                <div className={classes.taskSubheading}>
                    <Typography variant="subtitle1" color="inherit" className={classes.subHeadingTitle}>
                        <Hidden implementation="css" xsDown>
                            {translate('content')}
                        </Hidden>
                        <Hidden implementation="css" smUp>
                            {module.name}
                        </Hidden>
                    </Typography>
                </div>

                <div className={classes.modules}>
                    {module.tasks.map((task, i) => (
                        <Link
                            key={task.id}
                            className={classnames(classes.module)}
                            to={`${urls.inside.program.home}/${programDetails.id}/${group}/${elementIndex}/${i}`}
                        >
                            <div className={classes.moduleIndex}>
                                <Typography variant="subtitle1" color="inherit">
                                    {i + 1}
                                </Typography>
                            </div>
                            <div className={classnames(classes.moduleTitle, { [classes.current]: i === nextTaskIndex, [classes.completed]: task.visited })}>
                                <Typography variant="subtitle1" color="inherit" className={classes.moduleTitleHeading}>
                                    {task.name}
                                </Typography>
                                {task.hasQuestions && (
                                    <React.Fragment>
                                        {task.visited ? (
                                            <React.Fragment>
                                                {task.allQuestionsAnswered ? (
                                                    <Tooltip title={translate('module.tooltipCompletedQuestionnaire')}><CompletedQuestionnaireIcon className={classes.iconGreen} /></Tooltip>
                                                ) : (
                                                    <Tooltip title={translate('module.tooltipUnansweredQuestionnaire')}><QuestionnaireIcon className={classes.iconRed} /></Tooltip>
                                                )}
                                            </React.Fragment>
                                        ) : (
                                            <Tooltip title={translate('module.tooltipCommingQuestionnaire')}><QuestionnaireIcon className={classes.iconGray} /></Tooltip>
                                        )}
                                    </React.Fragment>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        );
    }
}

Module.propTypes = {
    classes: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            group: PropTypes.string.isRequired,
            elementIndex: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    programDetails: PropTypes.object,
};

Module.defaultProps = {
    programDetails: null,
};

const mapStateToProps = (state, ownProps) => ({
    translate: getTranslate(state.localize),
    programDetails: state.programStore.details && state.programStore.details[ownProps.match.params.programId],
});

const mapDispatchToProps = dispatch => ({
    ...bindActionCreators(ModalStore.actionCreators, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Module));
