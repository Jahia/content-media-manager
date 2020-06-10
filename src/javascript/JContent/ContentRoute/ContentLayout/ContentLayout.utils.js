import imageExtensions from 'image-extensions';
import {Folder} from 'mdi-material-ui';
import * as _ from 'lodash';
import {DocumentIcon, FileIcon, ImageIcon, ZipIcon} from './icons';
import React from 'react';

const imageExtensionSet = new Set(imageExtensions);

export const isBrowserImage = function (filename) {
    switch (filename.split('.').pop().toLowerCase()) {
        case 'png':
        case 'jpeg':
        case 'jpg':
        case 'gif':
        case 'img':
        case 'svg':
        case 'bmp':
            return true;
        default:
            return false;
    }
};

export const isImageFile = function (filename) {
    return imageExtensionSet.has(filename.split('.').pop().toLowerCase());
};

export const isPDF = function (filename) {
    return filename.split('.').pop().toLowerCase() === 'pdf';
};

export const getFileType = function (filename) {
    return filename.split('.').pop().toLowerCase();
};

export const addIconSuffix = icon => {
    return (icon.includes('.png') ? icon : icon + '.png');
};

export const getMediaIcon = (node, classes) => {
    switch (node.primaryNodeType.displayName) {
        case 'Folder':
            return <Folder className={classes.icon}/>;
        case 'File':
            if (node.mixinTypes.length !== 0 && !_.isEmpty(node.mixinTypes.filter(mixin => mixin.name === 'jmix:image'))) {
                return <ImageIcon className={classes.icon}/>;
            }

            if (node.name.match(/.zip$/g) || node.name.match(/.tar$/g) || node.name.match(/.rar$/g)) {
                return <ZipIcon className={classes.icon}/>;
            }

            if (node.mixinTypes.length !== 0 && !_.isEmpty(node.mixinTypes.filter(mixin => mixin.name === 'jmix:document'))) {
                return <DocumentIcon className={classes.icon}/>;
            }

            return <FileIcon className={classes.icon}/>;
        default:
            return <img src={addIconSuffix(node.primaryNodeType.icon)}/>;
    }
};
