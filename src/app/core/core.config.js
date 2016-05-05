(function ()
{
    'use strict';

    angular
        .module('app.core')
        .config(config);

    /** @ngInject */
    function config($ariaProvider, $logProvider, msScrollConfigProvider, uiGmapGoogleMapApiProvider, $translateProvider, $provide, fuseConfigProvider)
    {
        // ng-aria configuration
        $ariaProvider.config({
            tabindex: false
        });

        // Enable debug logging
        $logProvider.debugEnabled(true);

        // msScroll configuration
        msScrollConfigProvider.config({
            wheelPropagation: true
        });

        // toastr configuration
        toastr.options.timeOut = 3000;
        toastr.options.positionClass = 'toast-top-right';
        toastr.options.preventDuplicates = true;
        toastr.options.progressBar = true;

        // uiGmapgoogle-maps configuration
        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            v        : '3.exp',
            libraries: 'weather,geometry,visualization'
        });

        // angular-translate configuration
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: '{part}/i18n/{lang}.json'
        });
        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy('sanitize');

        // Text Angular options
        $provide.decorator('taOptions', [
            '$delegate', function (taOptions)
            {
                taOptions.toolbar = [
                   ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
                      ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
                      ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
                      ['html','insertLink']
                ];

                taOptions.classes = {
                    focussed           : 'focussed',
                    toolbar            : 'ta-toolbar',
                    toolbarGroup       : 'ta-group',
                    toolbarButton      : 'md-button',
                    toolbarButtonActive: 'active',
                    disabled           : '',
                    textEditor         : 'form-control',
                    htmlEditor         : 'form-control'
                };

                return taOptions;
            }
        ]);

        // Text Angular tools
        $provide.decorator('taTools', [
            '$delegate', function (taTools)
            {
                taTools.bold.iconclass = 'icon-format-bold';
                taTools.italics.iconclass = 'icon-format-italic';
                taTools.underline.iconclass = 'icon-format-underline';
                taTools.ul.iconclass = 'icon-format-list-bulleted';
                taTools.ol.iconclass = 'icon-format-list-numbers';
                taTools.quote.iconclass = 'icon-format-quote';
                taTools.strikeThrough.iconclass = 'icon-format-strikethrough';
                taTools.redo.iconclass = 'icon-redo';
                taTools.undo.iconclass = 'icon-undo';
                taTools.clear.iconclass = 'icon-no';
                taTools.justifyLeft.iconclass = 'icon-format-align-left';
                taTools.justifyCenter.iconclass = 'icon-format-align-center';
                taTools.justifyRight.iconclass = 'icon-format-align-right';
                taTools.indent.iconclass = 'icon-format-float-left';
                taTools.outdent.iconclass = 'icon-format-float-right';
                taTools.html.iconclass = 'icon-xml';
                taTools.insertLink.iconclass = 'icon-link-variant';

                return taTools;
            }
        ]);

        // Fuse theme configurations
        fuseConfigProvider.config({
            'disableCustomScrollbars'        : false,
            'disableCustomScrollbarsOnMobile': true,
            'disableMdInkRippleOnMobile'     : true
        });
    }
})();