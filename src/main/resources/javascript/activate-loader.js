(function () {
    let count = 0;
    const retry = 10;
    if (window.location.href.indexOf('/cms/contentmanager') === -1) {
        return;
    }

    (function waitForFunction() {
        if (window.displayDXLoadingScreen) {
            window.displayDXLoadingScreen({
                en: 'Loading Content and Media Manager...',
                fr: 'Chargement du gestionnaire de contenu et média...',
                de: 'Content- und Medien-Manager wird geladen...'
            });
        } else {
            console.info('Waiting for 100ms for function window.displayDXLoadingScreen to become available');
            if (count++ < retry) {
                setTimeout(waitForFunction, 100);
            } else {
                console.info('Function window.displayDXLoadingScreen not available, give up after ' + retry + ' times');
            }
        }
    })();
})();