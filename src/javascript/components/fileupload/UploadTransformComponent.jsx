import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {batchActions} from "redux-batched-actions/lib/index";
import {fileAccepted, fileMatchSize, getDataTransferItems,
    isDragDataWithFiles, getMimeTypes, onFilesSelected } from './utils';
import {setPanelState, setOverlayTarget} from "./redux/actions";
import {panelStates} from "./constatnts";
import { withApollo } from "react-apollo";
import { UploadRequirementsQuery } from "./gqlQueries";
import _ from "lodash";

const ACCEPTING_NODE_TYPES = ["jnt:folder"];

class UploadTransformComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            allowDrop: false
        };
        this.dragTargets = [];
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    componentDidMount() {
        this.checkPermission();
    }

    render() {
        const { uploadTargetComponent: Component } = this.props;

        if (this.state.allowDrop) {
            return (
                <Component
                    onDragOver={ this.onDragOver }
                    onDragEnter={ this.onDragEnter }
                    onDragLeave={ this.onDragLeave }
                    onDrop={ this.onDrop }
                    { ...this.generatePropertiesForComponent() }
                />
            );
        }
        return (
            <Component { ...this.generatePropertiesForComponent() } />
        );
    }

    generatePropertiesForComponent() {
        const props = { ...this.props };
        delete props.uploadTargetComponent;
        delete props.uploadPath;
        delete props.uploadAcceptedFileTypes;
        delete props.uploadMinSize;
        delete props.uploadMaxSize;
        delete props.uploadDispatchBatch;
        delete props.uploadSetOverlayTarget;
        //Blurring functionality
        // if (this.state.isDragActive) {
        //     if (!props.style) {
        //         props.style = {};
        //     }
        //     props.style.filter = "blur(3px)";
        // }

        return props;
    }

    onDragEnter(evt) {
        evt.preventDefault();

        // Count the dropzone and any children that are entered.
        if (this.dragTargets.indexOf(evt.target) === -1) {
            this.dragTargets.push(evt.target);
            this.node = evt.target;
        }
        evt.persist();
        let boundingClientRect = evt.currentTarget.getBoundingClientRect();
        let position = this.getOverlayPosition(evt.currentTarget);
        this.props.uploadSetOverlayTarget({
            x: position.left,
            y: position.top,
            width: boundingClientRect.width,
            height: boundingClientRect.height
        });
        if (isDragDataWithFiles(evt)) {
            Promise.resolve(getDataTransferItems(evt)).then(draggedFiles => {
                if (evt.isPropagationStopped()) {
                    return
                }

                this.setState({
                    draggedFiles,
                    // Do not rely on files for the drag state. It doesn't work in Safari.
                    isDragActive: true
                });
            });
        }
    }

    onDragOver(evt) {
        // eslint-disable-line class-methods-use-this
        evt.preventDefault();
        evt.persist();
        return false;
    }

    onDragLeave(evt) {
        evt.preventDefault();
        evt.persist();

        this.dragTargets = this.dragTargets.filter(el => el !== evt.target && this.node.contains(el));
        if (this.dragTargets.length > 0) {
            return
        }

        this.setState({
            isDragActive: false,
            draggedFiles: []
        });
        this.props.uploadSetOverlayTarget(null);
    }

    onDrop(evt) {
        const { uploadAcceptedFileTypes, uploadMaxSize, uploadMinSize, uploadPath } = this.props;
        const accept = getMimeTypes(uploadAcceptedFileTypes);

        evt.preventDefault();
        evt.persist();
        this.dragTargets = [];

        // Reset drag state
        this.setState({
            isDragActive: false,
            draggedFiles: []
        });
        this.props.uploadSetOverlayTarget(null);
        if (isDragDataWithFiles(evt)) {
            Promise.resolve(getDataTransferItems(evt)).then(fileList => {
                const acceptedFiles = [];
                const rejectedFiles = [];

                if (evt.isPropagationStopped()) {
                    return
                }

                fileList.forEach(file => {
                    if (
                        fileAccepted(file, accept) &&
                        fileMatchSize(file, uploadMaxSize, uploadMinSize)
                    ) {
                        acceptedFiles.push(file)
                    } else {
                        rejectedFiles.push(file)
                    }
                });
                onFilesSelected(
                    acceptedFiles,
                    rejectedFiles,
                    this.props.uploadDispatchBatch,
                    { path: uploadPath },
                    [setPanelState(panelStates.VISIBLE)]
                );
            })
        }
    }

    async checkPermission() {
        try {
            const result = await this.props.client.query({
                variables: {
                    path: this.props.uploadPath,
                    permittedNodeTypes: ACCEPTING_NODE_TYPES,
                    permission: "jcr:addChildNodes",
                },
                query: UploadRequirementsQuery
            });

            if (result.data.jcr.results.hasPermission && result.data.jcr.results.acceptsFiles) {
                this.setState({
                    allowDrop: true
                })
            }
        }
        catch (e) {
            // console.log(this.props.uploadPath);
            console.error(e);
        }
    }

    // Calculates elements position when scrolled.
    // https://stackoverflow.com/questions/1236171/how-do-i-calculate-an-elements-position-in-a-scrolled-div
    getOverlayPosition(el) {
        let currentLeft = 0;
        let currentTop = 0;
        let currentXScroll = 0;
        let currentYScroll = 0;
        while(el && el.offsetParent)
        {
            currentYScroll = el.offsetParent.scrollTop || 0;
            currentXScroll = el.offsetParent.scrollLeft || 0;
            currentLeft += el.offsetLeft - currentXScroll;
            currentTop += el.offsetTop - currentYScroll;
            el = el.offsetParent;
        }
        return {top:currentTop, left: currentLeft};
    }
}

UploadTransformComponent.propTypes = {
    uploadTargetComponent: PropTypes.oneOfType([PropTypes.element.isRequired, PropTypes.func.isRequired]),
    uploadPath: PropTypes.string.isRequired,
    uploadAcceptedFileTypes: PropTypes.array,
    uploadMaxSize: PropTypes.number,
    uploadMinSize: PropTypes.number
};

UploadTransformComponent.defaultProps = {
    uploadMaxSize: Infinity,
    uploadMinSize: 0
};

const mapDispatchToProps = (dispatch) => {
    return {
        uploadDispatchBatch: (actions) => dispatch(batchActions(actions)),
        uploadSetOverlayTarget: (state) => dispatch(setOverlayTarget(state))
    }
};

export default _.flowRight(
    withApollo,
    connect(null, mapDispatchToProps))(UploadTransformComponent);