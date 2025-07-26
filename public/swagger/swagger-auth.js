console.log('Custom Swagger script loaded!');

(function () {
  'use strict';
  console.log('[Swagger Auth] Script starting...');

  function waitForSwaggerUI(callback, maxAttempts = 50) {
    let attempts = 0;

    function check() {
      attempts++;
      if (window.ui && window.ui.getSystem) {
        console.log('[Swagger Auth] SwaggerUI found, initializing...');
        callback();
      } else if (attempts < maxAttempts) setTimeout(check, 100);
      else console.error('[Swagger Auth] SwaggerUI not found after maximum attempts');
    }

    check();
  }

  function setupAuthInterceptor() {
    if (!window.fetch) {
      console.error('[Swagger Auth] fetch not available');
      return;
    }

    const originalFetch = window.fetch;

    window.fetch = function (...args) {
      const [url] = args;

      return originalFetch.apply(this, args).then((response) => {
        if (!response.ok) return response;

        const urlString = String(url);

        if (urlString.includes('/employee/auth/login')) {
          const clonedResponse = response.clone();

          clonedResponse
            .json()
            .then((data) => {
              if (data?.data?.accessToken) {
                const bearerToken = `${data.data.accessToken}`;
                console.log('[Swagger Auth] Auto-setting token');

                try {
                  const authActions = window.ui.getSystem().authActions;
                  authActions.authorize({
                    bearer: {
                      name: 'Authorization',
                      schema: {
                        type: 'http',
                        in: 'header',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                      },
                      value: bearerToken,
                    },
                  });
                  console.log('[Swagger Auth] Token set successfully');
                } catch (error) {
                  console.error('[Swagger Auth] Error setting token:', error);
                }
              }
            })
            .catch((error) => {
              console.log('[Swagger Auth] Response not JSON:', error.message);
            });
        }

        return response;
      });
    };

    console.log('[Swagger Auth] Fetch interceptor installed');
  }

  waitForSwaggerUI(setupAuthInterceptor);
})();
