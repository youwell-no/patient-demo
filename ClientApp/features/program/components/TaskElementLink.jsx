import * as React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import { Typography } from '@material-ui/core';
import { OpenInNewWindowIcon } from '../../../common/icons';

import { linkTypes } from '../../../youwell-common/constants';
import apiUrls from '../../../youwell-common/apiUrls';

const styles = theme => ({
    image: {
        width: '100%',
    },
    audio: {
        width: '100%',
    },
    link: {
        borderBottom: theme.borders.normal,
    },
    icon: {
        marginLeft: theme.spacing.unit,
    },
    missingContent: {
        background: theme.colors.grey0,
        padding: theme.spacing.unit * 2,
    },

    // fullWidth: {
    //     width: '100%',
    // },
    // small: {
    //     width: 200,
    // },
    // medium: {
    //     width: '50%',
    //     marginRight: theme.spacing.unit,
    //     [theme.breakpoints.down('xs')]: {
    //         width: '100%',
    //         margin: 0,
    //     },
    // },
    // large: {
    //     margin: `0 ${theme.spacing.unit * 4}px`,
    //     width: `calc(100% + ${theme.spacing.unit * 4 * 2}px)`,
    // },
});

class TaskElementLink extends React.Component {
    render() {
        const {
            classes, translate, link, className,
        } = this.props;

        if (!link) {
            return null;
        }

        if (!link.url) {
            return (
                <div className={className}>
                    <Typography color="error" className={classes.missingContent}>
                        {translate('fileIsMissing')}
                    </Typography>
                </div>
            );
        }
        return (
            <div className={className}>
                {link.linkType === linkTypes.image && (
                    <img
                        src={`${apiUrls.media}/${link.url}`}
                        alt=""
                        className={classnames(classes.image)}
                    />
                )}

                {link.linkType === linkTypes.audio && (
                    <audio controls className={classes.audio}>
                        <source src={`${apiUrls.media}/${link.url}`} type="audio/mp3" />
                        <track kind="captions" />
                    </audio>
                )}

                {link.linkType === linkTypes.file && (
                    <a href={`${apiUrls.media}/${link.url}`} target="_blank" rel="noopener noreferrer" className={classes.link}>
                        {link.name || translate('open')}
                    </a>
                )}

                {link.linkType === linkTypes.url && (
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className={classes.link}>
                        {link.name || translate('open')}
                        <OpenInNewWindowIcon className={classes.icon} />
                    </a>
                )}

                {link.linkType === linkTypes.video && (
                    <div className="videoContainer">
                        <video controls className="videoFrame">
                            <source src={`${apiUrls.media}/${link.url}`} type="video/mp4" />
                            <track kind="captions" />

                        Your browser does not support the video tag.
                        </video>
                    </div>
                )}

                {link.linkType === linkTypes.vimeo && (
                    <div className="videoContainer">
                        <iframe
                            id="vplayer"
                            title="Vimeo video"
                            type="text/html"
                            className="videoFrame"
                            src={`https://player.vimeo.com/video/${link.url}?title=0&byline=0&portrait=0`}
                            frameBorder="0"
                            allowFullScreen
                        />
                    </div>
                )}

                {link.linkType === linkTypes.youtube && (
                    <div className="videoContainer">
                        <iframe
                            id="ytplayer"
                            title="YouTube video"
                            type="text/html"
                            className="videoFrame"
                            src={`https://www.youtube.com/embed/${link.url}?controls=1&fs=0&rel=0&showinfo=0`}
                            frameBorder="0"
                            allowFullScreen
                        />
                    </div>
                )}
            </div>
        );
    }
}

TaskElementLink.propTypes = {
    classes: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    link: PropTypes.object,
    className: PropTypes.string,
};

TaskElementLink.defaultProps = {
    link: null,
    className: null,
};


const mapStateToProps = state => ({
    translate: getTranslate(state.localize),
});


export default connect(mapStateToProps)(withStyles(styles)(TaskElementLink));
