import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import {
    Typography, Table, TableHead, TableBody, TableRow, TableCell, Input, Hidden,
} from '@material-ui/core';

const styles = theme => ({
    table: {
        margin: -theme.spacing.unit,
    },
    missingContent: {
        padding: theme.spacing.unit * 2,
    },
    mobileTable: {

    },
    mobileRow: {
        marginBottom: theme.spacing.unit * 2,
        border: theme.borders.normal,
        backgroundColor: theme.colors.grey0,
    },
    mobileRowHeader: {
        padding: theme.spacing.unit,
        backgroundColor: theme.colors.blue3,
        color: theme.palette.common.white,
    },
    mobileCell: {
        marginBottom: theme.spacing.unit * 2,
        padding: theme.spacing.unit,
    },
    tableRow: {
        height: theme.spacing.unit * 4,
    },
    tableHeaderRow: {
        backgroundColor: theme.palette.grey[300],
    },
    tableHeaderCell: {
        border: 0,
        fontSize: '1.1em',
        color: theme.palette.grey[900],
        padding: `0 ${theme.spacing.unit}px`,
    },
    tableCell: {
        padding: `0 ${theme.spacing.unit}px`,
        paddingTop: theme.spacing.unit,
        verticalAlign: 'top',
        borderRight: `1px solid ${theme.palette.grey[300]}`,

        '&:last-child': {
            padding: `0 ${theme.spacing.unit}px`,
            paddingTop: theme.spacing.unit,
            borderRight: 0,
        },
    },
});


class TableResponse extends React.Component {
    handleTableCellChange = (rowIndex, cellIndex) => (event) => {
        let prevResponse = this.props.response || [];
        if (rowIndex >= prevResponse.length) {
            prevResponse = [...prevResponse, this.props.tableConfig.columnHeaders.map(() => '')];
        }

        this.props.handleResponseUpdate(prevResponse.map((row, ri) => (
            ri === rowIndex ? row.map((cell, ci) => (
                ci === cellIndex ? event.target.value : cell
            )) : row
        )));
    }

    render() {
        const {
            classes, translate, tableConfig, response, disabled,
        } = this.props;

        if (tableConfig === null || !tableConfig.columnHeaders) {
            return (
                <Typography variant="caption" className={classes.missingContent}>
                    {translate('noContent')}
                </Typography>
            );
        }

        const tableResponses = [...response || [], tableConfig.columnHeaders.map(() => '')];

        return (
            <React.Fragment>
                <Hidden implementation="js" xsDown>
                    <Table className={classes.table}>
                        {(tableResponses && tableResponses.length > 1) && (
                            <TableHead className={classes.tableHeaderRow}>
                                <TableRow>
                                    {tableConfig.columnHeaders.map(item => (
                                        <TableCell key={item} padding="none" className={classes.tableHeaderCell}>
                                            {item}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                        )}
                        <TableBody>
                            {tableResponses && tableResponses.map((row, ri) => (
                                /* eslint-disable-line react/no-array-index-key */<TableRow key={ri} className={classes.tableRow}>
                                    {row.map((cell, ci) => (
                                        /* eslint-disable-line react/no-array-index-key */<TableCell key={ci} padding="none" className={classes.tableCell}>
                                            <Input
                                                disabled={disabled}
                                                id={`tableResponse${ri}${ci}`}
                                                placeholder={tableResponses && tableResponses.length === 1 ? tableConfig.columnHeaders[ci] : null}
                                                value={cell}
                                                onChange={this.handleTableCellChange(ri, ci)}
                                                disableUnderline
                                                multiline
                                                fullWidth
                                                rowsMax={10}
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Hidden>
                <Hidden implementation="js" smUp>
                    <div className={classes.mobileTable}>
                        {tableResponses && tableResponses.map((row, ri) => (
                            /* eslint-disable-line react/no-array-index-key */<div className={classes.mobileRow} key={ri}>
                                <div className={classes.mobileRowHeader}>
                                    <Typography variant="subtitle1" color="inherit">
                                        {`${ri + 1}.`}
                                    </Typography>
                                </div>
                                {row.map((cell, ci) => (
                                    /* eslint-disable-line react/no-array-index-key */ <div className={classes.mobileCell} key={ci}>
                                        <div className={classes.mobileCellHeader}>
                                            <Typography variant="subtitle2">
                                                {`${tableConfig.columnHeaders[ci]}:`}
                                            </Typography>
                                        </div>
                                        <Input
                                            id={`tableResponse${ri}${ci}`}
                                            disabled={disabled}
                                            value={cell}
                                            onChange={this.handleTableCellChange(ri, ci)}
                                            multiline
                                            rows={5}
                                            fullWidth
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </Hidden>
            </React.Fragment>
        );
    }
}

TableResponse.propTypes = {
    classes: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    handleResponseUpdate: PropTypes.func.isRequired,
    tableConfig: PropTypes.object.isRequired,
    response: PropTypes.array,
    disabled: PropTypes.bool,
};

TableResponse.defaultProps = {
    response: null,
    disabled: false,
};

const mapStateToProps = state => ({
    translate: getTranslate(state.localize),
});

export default connect(mapStateToProps)(withStyles(styles)(TableResponse));
