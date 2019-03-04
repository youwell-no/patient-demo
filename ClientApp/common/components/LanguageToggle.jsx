import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withLocalize } from 'react-localize-redux';
import classnames from 'classnames';

import {
    IconButton,
} from '@material-ui/core';

import flags from '../icons/flags';

const styles = () => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        opacity: '0.8',
    },
    flagIcon: {
        width: 20,
    },
});

const LanguageToggle = ({
    languages, activeLanguage, setActiveLanguage, classes, className,
}) => (
    <div className={classnames(classes.root, className)}>
        {languages.map(lang => (
            <IconButton key={lang.code} onClick={() => setActiveLanguage(lang.code)} disabled={activeLanguage && lang.code === activeLanguage.code}>
                <img src={flags[lang.code]} alt={lang.name} className={classes.flagIcon} />
            </IconButton>
        ))}
    </div>
);

LanguageToggle.propTypes = {
    classes: PropTypes.object.isRequired,
    languages: PropTypes.array.isRequired,
    activeLanguage: PropTypes.object,
    setActiveLanguage: PropTypes.func.isRequired,
    className: PropTypes.string,
};

LanguageToggle.defaultProps = {
    activeLanguage: {},
    className: null,
};

export default withLocalize(withStyles(styles)(LanguageToggle));
