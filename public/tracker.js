// Lightweight Analytics Tracker (~500 bytes minified)
(function () {
    'use strict';

    // Get script element and API key
    var script = document.currentScript || document.querySelector('script[data-api-key]');
    if (!script) return;

    var apiKey = script.getAttribute('data-api-key');
    if (!apiKey) return;

    // Get or create session ID
    var sessionKey = 'la_sid';
    var sessionId = sessionStorage.getItem(sessionKey);
    if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
        sessionStorage.setItem(sessionKey, sessionId);
    }

    // Get API URL from script src or use default
    var apiUrl = script.src.replace('/tracker.js', '/api/track');

    // Track function
    function track(type, name, data) {
        var payload = {
            apiKey: apiKey,
            type: type || 'pageview',
            name: name || null,
            page: window.location.pathname,
            referrer: document.referrer || null,
            sessionId: sessionId
        };

        // Merge additional data
        if (data && typeof data === 'object') {
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    payload[key] = data[key];
                }
            }
        }

        // Send using sendBeacon if available, otherwise fetch
        var body = JSON.stringify(payload);

        if (navigator.sendBeacon) {
            navigator.sendBeacon(apiUrl, body);
        } else {
            fetch(apiUrl, {
                method: 'POST',
                body: body,
                headers: { 'Content-Type': 'application/json' },
                keepalive: true
            }).catch(function () { });
        }
    }

    // Auto-track pageview on load
    if (document.readyState === 'complete') {
        track('pageview');
    } else {
        window.addEventListener('load', function () {
            track('pageview');
        });
    }

    // Expose global tracking function
    window.la = window.la || {};
    window.la.track = track;

    // Track page visibility changes (for SPA support)
    var lastPage = window.location.pathname;

    // History API support for SPAs
    var pushState = history.pushState;
    history.pushState = function () {
        pushState.apply(history, arguments);
        if (window.location.pathname !== lastPage) {
            lastPage = window.location.pathname;
            track('pageview');
        }
    };

    window.addEventListener('popstate', function () {
        if (window.location.pathname !== lastPage) {
            lastPage = window.location.pathname;
            track('pageview');
        }
    });
})();
