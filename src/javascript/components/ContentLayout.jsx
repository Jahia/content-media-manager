import React from 'react';
import {withApollo} from 'react-apollo';
import * as _ from "lodash";
import ContentListTable from "./list/ContentListTable";
import ContentPreview from "./preview/ContentPreview";
import PreviewDrawer from "./preview/PreviewDrawer";
import {Grid, Button, Paper, withStyles} from "@material-ui/core";
import {Add} from "@material-ui/icons";
import ContentTrees from "./ContentTrees";
import {withNotifications} from '@jahia/react-material';
import {translate} from "react-i18next";
import ContentBreadcrumbs from "./breadcrumb/ContentBreadcrumbs";
import {DxContext} from "./DxContext";
import Actions from "./Actions";
import CmButton from "./renderAction/CmButton";
import Upload from './fileupload/upload';
import {cmSetPreviewState, CM_PREVIEW_STATES} from "./redux/actions";
import FilesGrid from './filesGrid/FilesGrid';
import FilesGridSizeSelector from './filesGrid/FilesGridSizeSelector';
import FilesGridModeSelector from './filesGrid/FilesGridModeSelector';
import {valueToSizeTransformation} from './filesGrid/filesGridUtils';
import {ContentData} from "./ContentData";
import CMTopBar from "./CMTopBar";
import {cmGoto} from "./redux/actions";
import {connect} from "react-redux";

const styles = theme => ({
    topBar: {
        color: theme.palette.primary.contrastText
    },
    previewOn: {
        color: theme.palette.primary.contrastText
    },
    previewOff: {
        color: theme.palette.text.secondary
    },
    paper: {
        backgroundColor: theme.palette.primary.contrastText,
        height: 'calc(100vh - 136px)',
        maxHeight: 'calc(100vh - 136px)',
        marginLeft: -24
    },
    blockCore: {
        marginTop: -28,
        marginBottom: -2,
    },
    breadCrumbs: {
        marginLeft: -24
    },
    showTree: {
        textAlign: 'right',
    },
    showTreeButton: {
        color: 'pink'
    }
});

const GRID_SIZE = 12;
const GRID_PANEL_BUTTONS_SIZE = 3;
const TREE_SIZE = 3;

class ContentLayout extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            showTree: true,
            filesGridSizeValue: 4,
            showList: false,
            page: 0,
            rowsPerPage: 25
        };
    }

    handleShowTree = () => {
        this.setState((prevState, props) => {
            return {
                showTree: !prevState.showTree
            }
        })
    };

    //Force can be `show` or `hide`
    handleShowPreview = (selection, force) => {
        let {previewState, setPreviewState} = this.props;
        if (force !== undefined) {
            setPreviewState(force);
        } else if (!_.isEmpty(selection)) {
            switch (previewState) {
                case CM_PREVIEW_STATES.SHOW:
                    setPreviewState(CM_PREVIEW_STATES.HIDE);
                    break;
                case CM_PREVIEW_STATES.HIDE: {
                    setPreviewState(CM_PREVIEW_STATES.SHOW);
                    break;
                }
            }
        }
    };

    handleChangePage = newPage => {
        this.setState({page: newPage});
    };

    handleChangeRowsPerPage = value => {
        if (value != this.state.rowsPerPage) {
            this.setState({
                page: 0,
                rowsPerPage: value
            });
        }
    };

    isBrowsing() {
        let {contentSource} = this.props;
        return (contentSource === "browsing" || contentSource === "files")
    };

    isRootNode() {
        let {path, siteKey} = this.props;
        return (path === ("/sites/" + siteKey))
    };

    render() {

        const {showTree: showTree} = this.state;
        const {contentSource, contentTreeConfigs, mode, selection, classes, path, siteKey, previewState, t} = this.props;
        let computedTableSize = GRID_SIZE - (this.isBrowsing() && showTree ? TREE_SIZE : 0);

        return <DxContext.Consumer>{dxContext => {
            return <React.Fragment>

                <Grid container spacing={0}>
                    <Grid item xs={GRID_SIZE} className={classes.topBar}>
                        <CMTopBar dxContext={dxContext} mode={mode}/>
                    </Grid>
                    <Grid container item xs={GRID_SIZE} direction="row" alignItems="center"
                          className={classes.blockCore}>
                        <Grid item xs={GRID_SIZE - GRID_PANEL_BUTTONS_SIZE}>
                            <div className={classes.breadCrumbs}>
                                <ContentBreadcrumbs/>
                            </div>
                        </Grid>
                        <Grid item xs={GRID_PANEL_BUTTONS_SIZE} className={classes.showTree}>
                            {this.isBrowsing() && !this.isRootNode() &&
                                <Actions menuId={"createMenu"} context={{path: path}}>
                                    {(props) => <CmButton {...props}><Add/></CmButton>}
                                </Actions>
                            }
                            {this.isBrowsing() &&
                            <Button variant="text" className={classes.showTreeButton} onClick={this.handleShowTree}>{t("label.contentManager.tree." + (showTree ? "hide" : "show"))}</Button>
                            }
                            {contentSource === "files" &&
                                <FilesGridModeSelector showList={this.state.showList} onChange={() => this.setState({showList: !this.state.showList})}/>
                            }
                            {contentSource === "files" &&
                                <FilesGridSizeSelector initValue={4} onChange={(value) => this.setState({filesGridSizeValue: value})}/>
                            }
                        </Grid>
                    </Grid>
                </Grid>

                <Paper elevation={0} className={classes.paper}>
                    <Grid container spacing={0}>
                        {contentTreeConfigs && showTree &&
                            <Grid item xs={TREE_SIZE} className={classes.tree}>
                                <ContentTrees
                                    contentTreeConfigs={contentTreeConfigs}
                                    path={path}
                                    user={dxContext.userName}
                                />
                            </Grid>
                        }
                        <ContentData contentSource={contentSource} page={this.state.page} rowsPerPage={this.state.rowsPerPage}>
                            {({rows, totalCount, layoutQuery, layoutQueryParams}) => {
                                console.log("return data", totalCount, contentSource);
                                return <React.Fragment>
                                    <Grid item xs={computedTableSize}>
                                        {contentSource === "files" && !this.state.showList
                                            ? <FilesGrid
                                                size={valueToSizeTransformation(this.state.filesGridSizeValue)}
                                                totalCount={totalCount}
                                                rows={rows}
                                                pageSize={this.state.rowsPerPage}
                                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                                onChangePage={this.handleChangePage}
                                                page={this.state.page}
                                                handleShowPreview={() => this.handleShowPreview(selection, CM_PREVIEW_STATES.SHOW)}
                                            />
                                            : <ContentListTable
                                                totalCount={totalCount}
                                                rows={rows}
                                                pageSize={this.state.rowsPerPage}
                                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                                onChangePage={this.handleChangePage}
                                                page={this.state.page}
                                                handleShowPreview={() => this.handleShowPreview(selection, CM_PREVIEW_STATES.SHOW)}
                                            />
                                        }
                                    </Grid>
                                    <PreviewDrawer
                                        open={previewState === CM_PREVIEW_STATES.SHOW}
                                        onClose={() => this.handleShowPreview(selection, CM_PREVIEW_STATES.HIDE)}
                                    >
                                        {/*Always get row from query not from state to be up to date*/}
                                        <ContentPreview
                                            layoutQuery={layoutQuery}
                                            layoutQueryParams={layoutQueryParams}
                                            dxContext={dxContext}
                                        />
                                     </PreviewDrawer>
                                </React.Fragment>
                            }}
                        </ContentData>
                    </Grid>
                </Paper>

                <Upload/>

            </React.Fragment>
        }}</DxContext.Consumer>;
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        siteKey: state.site,
        path: state.path,
        selection: state.selection,
        previewState: state.previewState
    }
};
const mapDispatchToProps = (dispatch, ownProps) => ({
    setPath: (path, params) => dispatch(cmGoto(path, params)),
    setPreviewState: (state) => {
        dispatch(cmSetPreviewState(state));
    }
});

ContentLayout = _.flowRight(
    withNotifications(),
    translate(),
    withStyles(styles),
    withApollo,
    connect(mapStateToProps, mapDispatchToProps)
)(ContentLayout);

export {ContentLayout};