'use strict';

var Promise = require('es6-promise').Promise;
var loading = false;
var resolvers = [];

var debug = require('debug')('Fluxible:GoogleMapsPlugin');

function loadMaps(options) {
    if (typeof window === 'undefined') {
        debug('non-browser environment, aborting google maps SDK loading');
        return Promise.reject(new Error('Not in browser'));
    }

    if (window.google && window.google.maps) {
        debug('google maps SDK already loaded, resolving promise');
        return Promise.resolve(window.google);
    }

    return new Promise(function (resolve, reject) {
        debug('appending resolver');
        resolvers.push(resolve);
        loadIfNecessary(options);
    });
}

module.exports = loadMaps;

function loadIfNecessary(options) {
    if (!loading) {
        loading = true;
        load(options);
    }
}

function load(options) {
    debug('start loading google maps SDK');
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = options.url;
    window[options.callbackName] = onGoogleMapsLoaded;
    document.body.appendChild(script);
}

function onGoogleMapsLoaded() {
    debug('finished loading google maps, resolving all promises');
    resolvers.map(function (resolve) { resolve(window.google) });
    resolvers = [];
}
