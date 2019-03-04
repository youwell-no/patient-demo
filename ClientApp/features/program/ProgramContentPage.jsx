import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import { Typography, Hidden } from '@material-ui/core';
import { HtmlContent } from '../../common/components';

const styles = theme => ({
    root: {
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column',
    },
    noContent: {
        padding: theme.spacing.unit * 4,
        margin: theme.spacing.unit * 2,
    },
    title: {
        padding: `0 ${theme.spacing.unit * 4}px`,
        margin: `${theme.spacing.unit * 2}px 0`,

        [theme.breakpoints.up('sm')]: {
            margin: `${theme.spacing.unit * 2}px 0`,
        },
    },
    content: {
        height: '100%', // Needed for IE
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${theme.borders.boxShadow1Width}px)`,
            boxShadow: theme.borders.boxShadow1,
        },
    },
    heading: {
        marginTop: theme.spacing.unit * 2,
    },
    pagecontent: {
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px`,
        [theme.breakpoints.up('sm')]: {
            padding: theme.spacing.unit * 4,
        },
    },
});

class ProgramContentPage extends React.Component {
    render() {
        const {
            classes, translate, programList, programDetails, match,
        } = this.props;

        if (programList === null || programDetails === null) {
            return null;
        }

        const programId = match.params.programId || programList[0].id;
        const program = programDetails[programId] && programDetails[programId].program;

        if (program === null) {
            return null;
        }

        const pageIndex = program && program.contentPages && program.contentPages.pages ? program.contentPages.pages.findIndex(d => d.key === match.params.key) : -1;
        const page = pageIndex > -1 ? program.contentPages.pages[pageIndex] : null;

        if (page === null) {
            return null;
        }

        return (
            <div className={classes.root}>

                <div className={classes.title}>
                    <Hidden implementation="css" smUp>
                        <Typography variant="h6" color="inherit">
                            {program.name}
                        </Typography>
                    </Hidden>
                    <Typography variant="subtitle1" color="inherit" className={classes.heading}>
                        {page.title || translate(page.key)}
                    </Typography>
                </div>

                <div className={classes.content}>
                    {!page.content ? (
                        <Typography align="center" color="textSecondary" className={classes.noContent}>
                            {translate('noContent')}
                        </Typography>
                    ) : (
                        <HtmlContent html={page.content} className={classnames('htmlcontent', classes.pagecontent)} />
                    )}
                </div>
            </div>
        );
    }
}

ProgramContentPage.propTypes = {
    classes: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            programId: PropTypes.string,
        }).isRequired,
    }).isRequired,
    programList: PropTypes.array,
    programDetails: PropTypes.object,
};

ProgramContentPage.defaultProps = {
    programList: null,
    programDetails: null,
};

const mapStateToProps = state => ({
    translate: getTranslate(state.localize),
    programList: state.programStore.list,
    programDetails: state.programStore.details && state.programStore.details,
});

export default connect(mapStateToProps)(withStyles(styles)(ProgramContentPage));
