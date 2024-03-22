define(['postmonger'], function(Postmonger) {
    'use strict';

    const connection = new Postmonger.Session();
    let payload = {};

    function initialize() {
        connection.trigger('ready');

        connection.on('initActivity', function(data) {
            if (data) {
                payload = data;

            }
        });

        document.getElementById('saveButton').addEventListener('click', function() {
            payload['metaData'].isConfigured = true;
            connection.trigger('updateActivity', payload);
        });
    }

    return {
        initialize: initialize
    };
});
