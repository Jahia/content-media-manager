# jContent

jContent for Jahia. This module provides the main authoring UI for Jahia.

## Getting Started

Note, please, the project is using resources (mainly @jahia/* packages), which have not yet been made available on public repositories. If you encounter any issues with the build, please, contact us at Jahia and we will take care of it.

Compile and deploy the module using:

    mvn clean install
    
By default the module compiles all the Javascript in production mode. If you want to compile in development mode 
(Javascript is not compressed) you can use the "dev" Maven
profile as in the following example:

    mvn clean install -P dev 

## Recompiling only React Javascript

    yarn build

## Watching React Javascript changes

    yarn watch

## Development notes

### Architecture overview

The application is packaged using Webpack and is composed of the following main blocks:

    - ReactJS, https://reactjs.org
    - Redux, https://redux.js.org
    - React Material, https://material-ui.com
    - Apollo GraphQL client, https://www.apollographql.com
    - i18next (for internationalization support), https://www.i18next.com

### Entry point 

The entry point to the React app is in 

    src/javascript/ContentManagerApp.jsx
    
### Redux

The application uses Redux to manage state, and synchronizes the state with the URL so that some parts of the state
are bookmarkeable.
        
### Main view routing

The main route contains the site key and the language of the content as well as the mode in which we are (pages, search,
apps). The routing is done in the `ContentManager` component.
