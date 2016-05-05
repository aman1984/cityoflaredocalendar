(function ()
{
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('fuse', [

            // Core
            'app.core',

            // Navigation
            'app.navigation',

            // Toolbar
            'app.toolbar',

            // Quick panel
            //'app.quick-panel',

            // Sample
            'app.dashboard',
            'app.dashboard_admin',
            'app.create_admin',
            'app.show_admins',
            'app.create_user',
            'app.show_users',
            'app.edit_profile_user',
            'app.edit_profile_admin',
            'app.change_password',
            'app.change_password_admin',
            'app.banner_images',
            'app.edit_terms',
            'app.edit_privacy_policy',
            'app.pages'
        ]);
})();