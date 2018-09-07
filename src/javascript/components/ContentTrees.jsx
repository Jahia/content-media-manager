import React from "react";
import {Picker} from "@jahia/react-apollo";
import {PickerViewMaterial} from '@jahia/react-material';
import {List, ListItem, Button} from "@material-ui/core";
import CmRouter from "./CmRouter";
import gql from "graphql-tag";
import {getAbsoluteBrowsingPath} from "./utils.js";
import {translate} from 'react-i18next';
import Actions from "./Actions";
import CmIconButton from "./renderAction/CmIconButton";

class ContentTree extends React.Component {
    constructor(props) {
        super(props);
        this.picker = React.createRef();
    }

    render() {
        let {rootPath, path, handleSelect, lang, openableTypes, selectableTypes, rootLabel, filterTypes, recurTypes, user} = this.props;
        return (
            <Picker ref={this.picker}
                    rootPaths={[rootPath]}
                    defaultOpenPaths={[path]}
                    openableTypes={openableTypes}
                    selectableTypes={selectableTypes}
                    queryVariables={{lang: lang}}
                    selectedPaths={[path]}
                    openSelection={false}
                    onSelectItem={(path) => handleSelect(path)}>
                {({handleSelect, ...others}) => <PickerViewMaterial {...others} textRenderer={(entry) => {
                    return entry.depth > 0 ?
                        (<React.Fragment>
                            {entry.node.displayName}
                            <Actions menuId={"contentTreeActions"} context={{path: path, displayName: entry.node.displayName, lang: lang, user:user}}>
                                {(props) => <CmIconButton {...props} cmRole={'picker-item-menu'}/>}
                            </Actions>
                        </React.Fragment>)

                        : rootLabel
                }}/>}
            </Picker>
        )
    }
}

class ContentTrees extends React.Component {
    constructor(props) {
        super(props);
        this.componentsRefs = [];
    }

    openTrees(path) {
        _.each(this.componentsRefs, ref => {
            ref.current.picker.current.openPaths(path);
        });
    }

    render() {
        const {lang, rootPath, path, t, user, contentTreeConfigs} = this.props;

        return (<CmRouter render={({goto}) => (
                <List>
                    {
                        contentTreeConfigs.showAllContents ?
                            <ListItem>
                                <Button onClick={() => this.openTrees(path)}>{t("label.contentManager.showCurrentPath")}</Button>
                            </ListItem> : ""
                    }
                    {
                        _.map(contentTreeConfigs, (contentTreeConfig) => {
                            // create ref
                            let componentRef = React.createRef();
                            this.componentsRefs.push(componentRef);

                            return <ListItem data-cm-role={contentTreeConfig.key}  key={contentTreeConfig.key}>
                                <ContentTree
                                    ref={componentRef}
                                    path={path}
                                    rootPath={rootPath + contentTreeConfig.rootPath}
                                    selectableTypes= {contentTreeConfig.selectableTypes}
                                    lang={lang}
                                    user={user}
                                    handleSelect={path => goto(getAbsoluteBrowsingPath(contentTreeConfig.type, lang, path), {type: contentTreeConfig.type})}
                                    openableTypes={contentTreeConfig.openableTypes}
                                    rootLabel={t(contentTreeConfig.rootLabel)}
                                />
                            </ListItem>
                        })
                    }


                </List>
            )}/>
        )
    }
}

export default translate()(ContentTrees);