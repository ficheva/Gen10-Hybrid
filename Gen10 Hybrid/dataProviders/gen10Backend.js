'use strict';

(function() {
    var provider = app.data.gen10Backend = new Everlive({
            offlineStorage: true,
            apiKey: 'ogus3aIrQzVmmZ9d',
            url: '//platform.telerik.com/bs-api/v1/',
            scheme: 'https'
        }),
        accessTokenCacheKey = "access_token",
        providerAuthentication = provider.authentication,
        providerLogin = provider.Users.login,
        authentication = {
            setCachedAccessToken: function(token) {
                if (localStorage) {
                    localStorage.setItem(accessTokenCacheKey, JSON.stringify(token));
                } else {
                    app[accessTokenCacheKey] = token;
                }
            },
            getCachedAccessToken: function() {
                if (localStorage) {
                    return JSON.parse(localStorage.getItem(accessTokenCacheKey));
                } else {
                    return app[accessTokenCacheKey];
                }
            },
            getCacheAccessTokenFn: function(callback) {
                return function cacheAccessToken(data) {
                    if (data && data.result) {
                        authentication.setCachedAccessToken(data.result);

                        callback(data);
                    }
                };
            },
            loadCachedAccessToken: function() {
                var token = authentication.getCachedAccessToken();

                if (token) {
                    providerAuthentication.setAuthorization(
                        token.access_token,
                        token.token_type,
                        token.principal_id);
                }
            }
        };

    authentication.loadCachedAccessToken();
    provider.Users.login = function cacheAccessTokenLogin(
        email, password, success, error) {
        providerLogin.call(this, email, password,
            authentication.getCacheAccessTokenFn(success), error);
    };

    document.addEventListener('online', function() {
        app.data.gen10Backend.offline(false);
        app.data.gen10Backend.sync();
    });

    document.addEventListener('offline', function() {
        app.data.gen10Backend.offline(true);
    });

}());

// START_CUSTOM_CODE_gen10Backend
// END_CUSTOM_CODE_gen10Backend