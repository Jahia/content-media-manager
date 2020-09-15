import React from 'react';
import {Table, TableFooter, TablePagination, TableRow, withStyles} from '@material-ui/core';
import {ChevronDoubleLeft, ChevronLeft, ChevronRight, ChevronDoubleRight, Button} from '@jahia/moonstone';
import PropTypes from 'prop-types';
import {useTranslation} from "react-i18next";

const actionsStyles = theme => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing.unit * 2.5
    }
});

const TablePaginationActionsCmp = ({classes, count, page, rowsPerPage, onChangePage}) => (
    <div className={classes.root}>
        <Button
            size="big"
            variant="ghost"
            icon={<ChevronDoubleLeft/>}
            disabled={page === 0}
            aria-label="First Page"
            data-jrm-role="table-pagination-button-first-page"
            onClick={() => onChangePage(0)}
        />
        <Button
            size="big"
            variant="ghost"
            icon={<ChevronLeft/>}
            disabled={page === 0}
            aria-label="Previous Page"
            onClick={() => onChangePage(page - 1)}
        />
        <Button
            size="big"
            variant="ghost"
            icon={<ChevronRight/>}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="Next Page"
            data-jrm-role="table-pagination-button-next-page"
            onClick={() => onChangePage(page + 1)}
        />
        <Button
            size="big"
            variant="ghost"
            icon={<ChevronDoubleRight/>}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="Last Page"
            onClick={() => onChangePage(Math.max(0, Math.ceil(count / rowsPerPage) - 1))}
        />
    </div>
);

TablePaginationActionsCmp.propTypes = {
    onChangePage: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    count: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired
};

const TablePaginationActions = withStyles(actionsStyles, {
    name: 'DxPaginationActions',
    withTheme: true
})(TablePaginationActionsCmp);

export const Pagination = ({totalCount, pageSize, currentPage, onChangeRowsPerPage, onChangePage}) => {
    const {t} = useTranslation();

    return (
        <Table>
            <TableFooter>
                <TableRow>
                    <TablePagination
                        count={totalCount}
                        rowsPerPage={pageSize}
                        page={currentPage}
                        ActionsComponent={TablePaginationActions}
                        labelRowsPerPage={t('jcontent:label.pagination.rowsPerPage')}
                        labelDisplayedRows={({from, to, count}) => `${from}-${to} ` + t('jcontent:label.pagination.of') + ` ${count}`}
                        data-jrm-role="table-pagination"
                        onChangePage={onChangePage}
                        onChangeRowsPerPage={event => onChangeRowsPerPage(event.target.value)}
                    />
                </TableRow>
            </TableFooter>
        </Table>
    );
};

Pagination.propTypes = {
    totalCount: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    onChangeRowsPerPage: PropTypes.func.isRequired,
    onChangePage: PropTypes.func.isRequired,
};
