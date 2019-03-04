import * as React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { replaceEmbedContent, isEmptyHtml } from '../../youwell-common/htmlUtils';

class HtmlContent extends React.Component {
    render() {
        const {
            html, className,
        } = this.props;

        if (isEmptyHtml(html)) {
            return null;
        }

        return (
            /* eslint-disable react/no-danger */
            <div dangerouslySetInnerHTML={{ __html: replaceEmbedContent(html) }} className={classnames('htmlcontent', className)} />
            /* eslint-enable react/no-danger */
        );
    }
}


HtmlContent.propTypes = {
    html: PropTypes.string,
    className: PropTypes.string,
};

HtmlContent.defaultProps = {
    html: null,
    className: null,
};

export default HtmlContent;
