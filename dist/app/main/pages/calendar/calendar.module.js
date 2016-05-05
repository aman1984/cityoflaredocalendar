(function ()
{
    'use strict';

    angular
        .module('app.pages.calendar', [
            'ui.calendar',
            'slick'
        ])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pages_calendar', {
            url      : '/calendar',
            reloadOnSearch: false,
            views    : {
                 'main@'                       : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.pages_calendar': {
                    templateUrl: 'app/main/pages/calendar/calendar.html',
                    controller : 'CalendarController as vm'
                }
            },
            bodyClass: 'calendar'
        });
        // Navigation
        msNavigationServiceProvider.saveItem('pages_calendar', {
            title    : 'Calendar',
            icon     : 'icon-calendar',
            state    : 'app.pages_calendar',
            weight   : 1
        });
    }
})();