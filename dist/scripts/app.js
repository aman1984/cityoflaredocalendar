(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
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
(function ()
{
    'use strict';

    CalendarTextSearchDialogController.$inject = ["$mdDialog", "$scope", "event"];
    angular.module('app.pages.calendar')
        .controller('CalendarTextSearchDialogController', CalendarTextSearchDialogController);

    /** @ngInject */
    function CalendarTextSearchDialogController($mdDialog, $scope, event)
    {
        var vm = this;
        vm.closeDialog = closeDialog;
        function closeDialog()
        {
            
            $mdDialog.cancel();
        }
        $scope.clearValue = function() {
        $scope.myModel = undefined;
      };
      $scope.save = function() {
        $mdDialog.hide(vm.keyword);
      };

        
    }
})();

(function ()
{
    'use strict';

    CalendarSearchDialogController.$inject = ["$mdDialog", "$scope", "event"];
    angular.module('app.pages.calendar')
        .controller('CalendarSearchDialogController', CalendarSearchDialogController);

    /** @ngInject */
    function CalendarSearchDialogController($mdDialog, $scope, event)
    {
        var vm = this;
        vm.closeDialog = closeDialog;
        vm.categories = ['Social events', 'Sports', 'Entertainment/Music', 'Arts', 'Religious events', 'Fundraiser', 'City events', 'Government events', 'Cultural', 'Education', 'Environmental'];
        $scope.selected = [];
        function closeDialog()
        {
            
            $mdDialog.cancel();
        }
        $scope.clearValue = function() {
        $scope.myModel = undefined;
      };
      $scope.save = function() {
        var selected_categories = $scope.selected.join();
        $mdDialog.hide(selected_categories);
      };

      $scope.splitItem = function(item){
        var str = item.split(',')[0].replace(/[ \/]/g, '');
        return str+'Cat';
      }

      $scope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);
        else list.push(item);

      };
      $scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
      };
        
    }
})();

(function ()
{
    'use strict';

    EventFormDialog1Controller.$inject = ["$mdDialog", "dialogData"];
    angular.module('app.pages.calendar')
        .controller('EventFormDialog1Controller', EventFormDialog1Controller);

    /** @ngInject */
    function EventFormDialog1Controller($mdDialog, dialogData)
    {
        var vm = this;

        // Data
        vm.dialogData = dialogData;
        vm.notifications = ['15 minutes before', '30 minutes before', '1 hour before'];

        // Methods
        vm.saveEvent = saveEvent;
        vm.closeDialog = closeDialog;

        init();

        //////////

        /**
         * Initialize
         */
        function init()
        {
            vm.dialogTitle = (vm.dialogData.type === 'add' ? 'Add Event' : 'Edit Event');

            // Edit
            if ( vm.dialogData.calendarEvent )
            {
                // Clone the calendarEvent object before doing anything
                // to make sure we are not going to brake the Full Calendar
                vm.calendarEvent = angular.copy(vm.dialogData.calendarEvent);

                // Convert moment.js dates to javascript date object
                if ( moment.isMoment(vm.calendarEvent.start) )
                {
                    vm.calendarEvent.start = vm.calendarEvent.start.toDate();
                }

                if ( moment.isMoment(vm.calendarEvent.end) )
                {
                    vm.calendarEvent.end = vm.calendarEvent.end.toDate();
                }
            }
            // Add
            else
            {
                // Convert moment.js dates to javascript date object
                if ( moment.isMoment(vm.dialogData.start) )
                {
                    vm.dialogData.start = vm.dialogData.start.toDate();
                }

                if ( moment.isMoment(vm.dialogData.end) )
                {
                    vm.dialogData.end = vm.dialogData.end.toDate();
                }

                vm.calendarEvent = {
                    start        : vm.dialogData.start,
                    end          : vm.dialogData.end,
                    notifications: []
                };
            }
        }

        function saveEvent()
        {
            var response = {
                type         : vm.dialogData.type,
                calendarEvent: vm.calendarEvent
            };

            $mdDialog.hide(response);
        }

        /**
         * Close the dialog
         */
        function closeDialog()
        {
            $mdDialog.cancel();
        }
    }
})();

(function ()
{
    'use strict';

    CalendarEventDetailDialogController.$inject = ["$mdDialog", "calendarEvent", "showEventFormDialog", "event_preselected", "event", "$scope", "$q", "$mdToast", "$location"];
    angular.module('app.pages.calendar')
        .controller('CalendarEventDetailDialogController', CalendarEventDetailDialogController);

    /** @ngInject */
    function CalendarEventDetailDialogController($mdDialog, calendarEvent, showEventFormDialog, event_preselected, event, $scope, $q, $mdToast, $location)
    {
        var vm = this;
        vm.attachments = [];
        vm.current_url = $location.protocol()+'://'+$location.host()+$location.url();
        vm.days_of_week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        vm.days_of_week_value = ['0', '1', '2', '3', '4', '5', '6'];
        var image_count = 0;
        // Data
        vm.calendarEvent = calendarEvent;
        
        if(event_preselected==false){
            vm.start_date = vm.calendarEvent.start.format('MMMM Do YYYY, h:mm a');
            vm.end_date = vm.calendarEvent.end.format('MMMM Do YYYY, h:mm a');
        }else{
            vm.start_date = moment(vm.calendarEvent.start).format('MMMM Do YYYY, h:mm a');
            vm.end_date = moment(vm.calendarEvent.end).format('MMMM Do YYYY, h:mm a');
        }

        var image_extensions = ['jpg', 'png', 'jpeg', 'PNG', 'JPG', 'JPEG'];
        var pintrest_text = 'Event in '+vm.calendarEvent.location+' |  \r\n';   
        pintrest_text+= 'Location: '+vm.calendarEvent.location+' |  \r\n';   
        if(vm.calendarEvent.contact_name!==''){
            pintrest_text+= 'Contact name: '+vm.calendarEvent.contact_name+' |  \r\n';   
        }
        if(vm.calendarEvent.contact_number!==''){
            pintrest_text+= 'Contact number: '+vm.calendarEvent.contact_number+' |  \r\n';   
        }
        if(event_preselected==false){
            pintrest_text+= 'Date: '+vm.calendarEvent.start.format('MMMM Do YYYY, h:mm a')+' : '+vm.calendarEvent.end.format('MMMM Do YYYY, h:mm a')+' |  ';
        }else{
            pintrest_text+= 'Date: '+moment(vm.calendarEvent.start).format('MMMM Do YYYY, h:mm a')+' : '+moment(vm.calendarEvent.end).format('MMMM Do YYYY, h:mm a')+' |  ';
        }
        vm.twitter_text = 'via @nimitwalia1%0A';
        var files_attachments = JSON.parse(calendarEvent.attachments);
                for(var i=0, j=files_attachments.length; i<j; i++){
                    image_count++;
                    var obj = {};
                    obj.name = files_attachments[i].name;
                    obj.temp_id = image_count;
                    obj.size = files_attachments[i].size;
                    obj.filepath = files_attachments[i].filepath;
                    obj.uploading = false;
                    obj.extension = files_attachments[i].extension;
                    if(image_extensions.indexOf(files_attachments[i].extension)>-1){
                    obj.isImage = true;
                    }else{
                    obj.isImage = false;
                    }                    

                    vm.attachments.push(obj);
                }
        // Methods
        vm.editEvent = editEvent;
        vm.closeDialog = closeDialog;

        function closeDialog()
        {
            
            $mdDialog.cancel();
        }

        function editEvent(calendarEvent)
        {
            showEventFormDialog('edit', calendarEvent, false, false, event);
        }

        $scope.getdays = function(days){
            var days_array = days.split(',');
            var days_name = '';
            for(var i=0, j=days_array.length; i<j; i++){
                days_name+= vm.days_of_week[days_array[i]]+', ';
            }
            days_name = days_name.replace(/,\s*$/, "");
            return days_name; 
        }

        vm.fbshare = function(){
        var message = 'Event in '+vm.calendarEvent.location+'\r\n \r\n';   
        message+= 'Title: '+vm.calendarEvent.title+'\r\n ';   
        message+= 'Location: '+vm.calendarEvent.location+'\r\n ';   
        message+= 'Description: '+vm.calendarEvent.description+'\r\n ';   
        message+= 'Categories: '+vm.calendarEvent.categories+'\r\n ';   
        message+= 'Contact name: '+vm.calendarEvent.contact_name+'\r\n ';   
        message+= 'Contact number: '+vm.calendarEvent.contact_number+'\r\n ';   
        if(event_preselected==false){
            message+= 'Date: '+vm.calendarEvent.start.format('MMMM Do YYYY, h:mm a')+' To '+vm.calendarEvent.end.format('MMMM Do YYYY, h:mm a')+'\r\n ';   
        }else{
            message+= 'Date: '+moment(vm.calendarEvent.start).format('MMMM Do YYYY, h:mm a')+' To '+moment(vm.calendarEvent.end).format('MMMM Do YYYY, h:mm a')+'\r\n ';   
        }
          window.fbAsyncInit = function() {
            FB.init({
              appId      : '997083573709423',
              xfbml      : true,
              version    : 'v2.5'
            }); 
                FB.login(function(){
            FB.api('/me/feed', 'post',
            {
                message: message,
                link: vm.calendarEvent.link
            },
                function(response){
                    if (response && !response.error) {
                       $mdToast.show($mdToast.simple().textContent('Posted successfully').position('top right'));
                    }
                });
            }, {scope: 'publish_actions'});   
          };
        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }

    vm.pintrestPost = function(){
        var gotImage = false;
        var imageIndex = 0;
        for(var i=0, j=vm.attachments.length; i<j; i++){
            if(vm.attachments[i].isImage==true){
                gotImage = true;
                imageIndex = i;
                break;
            }
        }
        if(gotImage==true){
            window.open('http://pinterest.com/pin/create/button/?url='+vm.current_url+'&link='+vm.current_url+'&media='+vm.attachments[i].filepath+'&description='+pintrest_text, '_blank');
        }else{
            $mdToast.show($mdToast.simple().textContent('This event do not have any image to post. You need an image to post to Pintrest.').position('top right'));
        }
    }

        angular.element('.slick').slick({
            dots: true,
            infinite:true,
            speed: 300,
            slidesToShow: 3,
            slidesToScroll: 1,
            arrows: true
          });


    }
})();

(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
    angular
        .module('app.dashboard', ['mdPickers'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.dashboard', {
                url    : '/dashboard',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/dashboard/dashboard.html',
                        controller : 'dashboardController as vm'
                    }
                }
            });

        // Translation

        // Navigation
        /*msNavigationServiceProvider.saveItem('fuse', {
            title : 'dashboard',
            group : true,
            weight: 1
        });*/

        msNavigationServiceProvider.saveItem('dashboard', {
            title    : 'Dashboard',
            icon     : 'icon-tile-four',
            state    : 'app.dashboard',
            /*stateParams: {
                'param1': 'page'
             },*/
            weight   : 1
        });
    }
})();
(function ()
{
    'use strict';

    EventFormDialogShowUserController.$inject = ["$mdDialog", "dialogData", "$scope", "$mdToast", "DashboardService"];
    angular.module('app.dashboard')
        .controller('EventFormDialogShowUserController', EventFormDialogShowUserController);

    /** @ngInject */
    function EventFormDialogShowUserController($mdDialog, dialogData, $scope, $mdToast, DashboardService)
    {
        var vm = this;
        vm.categories = ['Social events', 'Sports', 'Entertainment/Music', 'Arts', 'Religious events', 'Fundraiser', 'City events', 'Government events', 'Cultural', 'Education', 'Environmental'];
        vm.days_of_week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        vm.days_of_week_value = ['0', '1', '2', '3', '4', '5', '6'];
        vm.hours = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
        vm.minutes = [];
        vm.dates = [];
        for(var i=1; i<=31; i++){
            vm.dates.push(i.toString());
        }

        $scope.selected = [];
        $scope.selectedDays = [];
        vm.attachments = [];
        vm.uploaded_file = [];
        var image_count = 0;
        // Data
        vm.dialogData = dialogData;
        vm.notifications = ['15 minutes before', '30 minutes before', '1 hour before'];

        // Methods
        vm.saveEvent = saveEvent;
        vm.closeDialog = closeDialog;

        init();

        //////////

        /**
         * Initialize
         */
        function init()
        {
            vm.dialogTitle = (vm.dialogData.type === 'add' ? 'Add Event' : 'Edit Event');

            // Edit
            if ( vm.dialogData.calendarEvent )
            {
                // Clone the calendarEvent object before doing anything
                // to make sure we are not going to brake the Full Calendar
                vm.calendarEvent = angular.copy(vm.dialogData.calendarEvent);

                // Convert moment.js dates to javascript date object
                if ( moment.isMoment(vm.calendarEvent.start) )
                {
                    vm.calendarEvent.start = vm.calendarEvent.start.toDate();
                }

                if ( moment.isMoment(vm.calendarEvent.end) )
                {
                    vm.calendarEvent.end = vm.calendarEvent.end.toDate();
                }
                 vm.calendarEvent = {
                    start        : vm.dialogData.start,
                    end          : vm.dialogData.end,
                    title: vm.dialogData.obj.title,
                    description: vm.dialogData.obj.description
                };
                var categories_array = vm.dialogData.obj.categories.split(',');
                $scope.selected = categories_array; 
            }
            // Add
            else
            {
                // Convert moment.js dates to javascript date object
                if ( moment.isMoment(vm.dialogData.start) )
                {
                    vm.dialogData.start = vm.dialogData.start.toDate();
                }

                if ( moment.isMoment(vm.dialogData.end) )
                {
                    vm.dialogData.end = vm.dialogData.end.toDate();
                }

                vm.calendarEvent = {
                    start        : vm.dialogData.start,
                    end          : vm.dialogData.end,
                    description          : '',
                    recurring          : 'no-repeat',
                    start_time_minutes          : '00',
                    end_time_minutes          : '59',
                    start_time_hours          : '01',
                    end_time_hours          : '23',
                    month_recurring_type : '',
                    by_date_recurring : '',
                    by_day_recurring : '',
                    by_day_week : '',
                    link : '',
                    contact_name : '',
                    contact_number : '',
                    notifications: []
                };
            }
            for(var i=0; i<60; i++){
            i = i.toString();
            if(i<10){
                i = '0'+i;
            }
            vm.minutes.push(i);
            }
        }

        function saveEvent()
        {
            var month_recurring = {};
            month_recurring.month_recurring_type = vm.calendarEvent.month_recurring_type;
            month_recurring.by_date_recurring = vm.calendarEvent.by_date_recurring;
            month_recurring.by_day_recurring = vm.calendarEvent.by_day_recurring;
            month_recurring.by_day_week = vm.calendarEvent.by_day_week;
            
            var month_recurring_final = JSON.stringify(month_recurring);

            vm.calendarEvent.categories = $scope.selected.join();
            vm.calendarEvent.recurring_days = $scope.selectedDays.join();
            vm.calendarEvent.attachments = vm.uploaded_file;
            vm.calendarEvent.month_recurring = month_recurring_final;
            var response = {
                type         : vm.dialogData.type,
                calendarEvent: vm.calendarEvent
            };

            $mdDialog.hide(response);
        }

        $scope.attachFile = function(){
            document.getElementById('attach_file').click();
        }

         $scope.handleFileSelect = function(evt){
            image_count++;
            var files = evt.files; // FileList object
            console.log(files);
            var obj = {};
            obj.name = files[0].name;
            obj.size = Math.ceil(files[0].size/1024);
            obj.uploading = true;
            obj.filepath = '';
            obj.temp_id = image_count;
            vm.attachments.push(obj);

            var formData = new FormData();
            var file = document.getElementById('attach_file').files[0];
            formData.append('attachment', file);
            $scope.uploadingFile = true;
            $mdToast.show($mdToast.simple().textContent('Uploading!').position('top right'));
            DashboardService.uploadFile(formData, function(data, status){
                console.log(data);
                $scope.uploadingFile = false;
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Uploaded successfully!').position('top right'));
                    var tempObj = {};
                    tempObj.name = files[0].name;
                    tempObj.size = Math.ceil(files[0].size/1024);
                    tempObj.filepath = data.filepath;
                    tempObj.extension = data.extension;
                    vm.uploaded_file.push(tempObj);

                    //vm.uploaded_file.push(data.filepath);
                    for(var i=0, j=vm.attachments.length; i<j; i++){
                        if(vm.attachments[i].temp_id==obj.temp_id){
                            vm.attachments[i].uploading = false;
                            vm.attachments[i].filepath = data.filepath;
                        }
                    }
                }else{
                    $mdToast.show($mdToast.simple().textContent('Not able to upload!').position('top right'));
                }
            });
          }

          $scope.deleteFile = function(id, filename){
            for(var i=0, j=vm.attachments.length; i<j; i++){
                if(vm.attachments[i].temp_id==id){
                    vm.attachments.splice(i, 1);
                }
            }
            for(var i=0, j=vm.uploaded_file.length; i<j; i++){
                if(vm.uploaded_file[i].filepath==filename){
                    vm.uploaded_file.splice(i, 1);
                }
            }
            $mdToast.show($mdToast.simple().textContent('Attachment deleted!').position('top right'));
          }

        /**
         * Close the dialog
         */
        function closeDialog()
        {
            $mdDialog.cancel();
        }

        
      $scope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);
        else list.push(item);

      };
      $scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
      };

      $scope.toggleDays = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);
        else list.push(item);

      };
      $scope.existsDays = function (item, list) {
        return list.indexOf(item) > -1;
      };


    }
})();

(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
    angular
        .module('app.show_users', ['mdPickers'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.show_users', {
                url    : '/show_users',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/show_users/show_users.html',
                        controller : 'showUsersController as vm'
                    }
                }
            });

        // Translation

        // Navigation
      /*  msNavigationServiceProvider.saveItem('fuse', {
            title : 'show_users',
            group : true,
            weight: 1
        });*/

        msNavigationServiceProvider.saveItem('show_users', {
            title    : 'Show users',
            icon     : 'icon-tile-four',
            state    : 'app.show_users',
            /*stateParams: {
                'param1': 'page'
             },*/
            weight   : 1
        });
    }
})();
(function ()
{
    'use strict';

    UserEditFormDialogController.$inject = ["$mdDialog", "dialogData", "$scope", "$mdToast", "DashboardService"];
    angular.module('app.show_users')
        .controller('UserEditFormDialogController', UserEditFormDialogController);

    /** @ngInject */
    function UserEditFormDialogController($mdDialog, dialogData, $scope, $mdToast, DashboardService)
    {
        var vm = this;
        // Data
        vm.dialogData = dialogData;
        console.log(vm.dialogData);
        // Methods
        vm.saveEvent = saveEvent;
        vm.closeDialog = closeDialog;

        init();

        //////////

        /**
         * Initialize
         */
        function init()
        {
            vm.dialogTitle = 'Edit User';

            // Edit
            if ( vm.dialogData.calendarEvent )
            {
                vm.calendarEvent = angular.copy(vm.dialogData.calendarEvent);

                 vm.calendarEvent = {
                    email        : vm.dialogData.obj.email,
                    name          : vm.dialogData.obj.name,
                    last_name          : vm.dialogData.obj.last_name,
                    middle_name          : vm.dialogData.obj.middle_name,
                    title          : vm.dialogData.obj.title,
                    organization          : vm.dialogData.obj.organization,
                    phone          : vm.dialogData.obj.phone
                };

            }
            console.log(vm.calendarEvent);
        };

        function saveEvent()
        {
            
            var response = {
                calendarEvent: vm.calendarEvent
            };

            $mdDialog.hide(response);
        }

        /**
         * Close the dialog
         */
        function closeDialog()
        {
            $mdDialog.cancel();
        }

    }
})();

(function ()
{
    'use strict';

    UserChangePasswordDialogController.$inject = ["$mdDialog", "$scope", "$mdToast"];
    angular.module('app.show_users')
        .controller('UserChangePasswordDialogController', UserChangePasswordDialogController);

    /** @ngInject */
    function UserChangePasswordDialogController($mdDialog, $scope, $mdToast)
    {
        var vm = this;
        // Data
        // Methods
        vm.saveEvent = saveEvent;
        vm.closeDialog = closeDialog;

        init();

        //////////

        /**
         * Initialize
         */
        function init()
        {
            vm.dialogTitle = 'Edit User';

            // Edit
            
                 vm.calendarEvent = {
                    password : '',
                    confirm_password : ''
                };

            
        };

        function saveEvent()
        {
            
            var response = {
                calendarEvent: vm.calendarEvent
            };

            $mdDialog.hide(response);
        }

        /**
         * Close the dialog
         */
        function closeDialog()
        {
            $mdDialog.cancel();
        }

    }
})();

(function ()
{
    'use strict';

    AdminEditFormDialogController.$inject = ["$mdDialog", "dialogData", "$scope", "$mdToast", "DashboardService"];
    angular.module('app.dashboard')
        .controller('AdminEditFormDialogController', AdminEditFormDialogController);

    /** @ngInject */
    function AdminEditFormDialogController($mdDialog, dialogData, $scope, $mdToast, DashboardService)
    {
        var vm = this;
        // Data
        vm.dialogData = dialogData;
        console.log(vm.dialogData);
        // Methods
        vm.saveEvent = saveEvent;
        vm.closeDialog = closeDialog;

        init();

        //////////

        /**
         * Initialize
         */
        function init()
        {
            vm.dialogTitle = 'Edit Admin';

            // Edit
            if ( vm.dialogData.calendarEvent )
            {
                vm.calendarEvent = angular.copy(vm.dialogData.calendarEvent);

                 vm.calendarEvent = {
                    email        : vm.dialogData.obj.email,
                    fullname          : vm.dialogData.obj.fullname
                };

            }
            console.log(vm.calendarEvent);
        };

        function saveEvent()
        {
            
            var response = {
                calendarEvent: vm.calendarEvent
            };

            $mdDialog.hide(response);
        }

        /**
         * Close the dialog
         */
        function closeDialog()
        {
            $mdDialog.cancel();
        }

    }
})();

(function ()
{
    'use strict';

    AdminChangeAdminPasswordDialogController.$inject = ["$mdDialog", "$scope", "$mdToast"];
    angular.module('app.show_users')
        .controller('AdminChangeAdminPasswordDialogController', AdminChangeAdminPasswordDialogController);

    /** @ngInject */
    function AdminChangeAdminPasswordDialogController($mdDialog, $scope, $mdToast)
    {
        var vm = this;
        // Data
        // Methods
        vm.saveEvent = saveEvent;
        vm.closeDialog = closeDialog;

        init();

        //////////

        /**
         * Initialize
         */
        function init()
        {
            vm.dialogTitle = 'Edit User';

            // Edit
            
                 vm.calendarEvent = {
                    password : '',
                    confirm_password : ''
                };

            
        };

        function saveEvent()
        {
            
            var response = {
                calendarEvent: vm.calendarEvent
            };

            $mdDialog.hide(response);
        }

        /**
         * Close the dialog
         */
        function closeDialog()
        {
            $mdDialog.cancel();
        }

    }
})();

(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
    angular
        .module('app.pages.auth.reset_password_master', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pages_auth_reset_password_master', {
            url      : '/auth/reset-password-master',
            views    : {
                'main@'                                : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.pages_auth_reset_password_master': {
                    templateUrl: 'app/main/pages/auth/reset_password_master/reset_password_master.html',
                    controller : 'ResetPasswordMasterController as vm'
                }
            },
            bodyClass: 'reset_password_master'
        });
    }

})();
(function ()
{
    'use strict';

	ResetPassMasterService.$inject = ["$http", "$rootScope"];
    angular
        .module('app.pages.auth.reset_password_master')
        .factory('ResetPassMasterService', ResetPassMasterService);

    /** @ngInject */
    
    function ResetPassMasterService($http, $rootScope)
    {
    return {
      requestPassword: function (password, token, time, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'recoverPassword/resetAdminPassword',
				data: 'password='+password+'&token='+token+'&time='+time,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	}
    }
	}
})();
(function ()
{
    'use strict';

    ResetPasswordMasterController.$inject = ["$scope", "ResetPassMasterService", "$location", "$state"];
    angular
        .module('app.pages.auth.reset_password_master')
        .controller('ResetPasswordMasterController', ResetPasswordMasterController);

    /** @ngInject */
    function ResetPasswordMasterController($scope, ResetPassMasterService, $location, $state)
    {
        var vm = this;
        var token = $location.search().id;
        var time = $location.search().v;
        $scope.resetPassword = function(){
            if(token!==undefined){
            ResetPassMasterService.requestPassword(vm.form.password, token, time, function(data, status){
                console.log(data);
                if(data.success==true){
                    alert('Password is changed');
                    $state.go('app.pages_auth_master_login');
                }else{
                    alert(data.message);
                }
            });
        }else{
            alert('Cant change password. Please follow the link in your email.');
        }
            //alert($location.absUrl());
        }
    }
})();
(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
    angular
        .module('app.pages.auth.reset_password_admin', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pages_auth_reset_password_admin', {
            url      : '/auth/reset-password-admin',
            views    : {
                'main@'                                : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.pages_auth_reset_password_admin': {
                    templateUrl: 'app/main/pages/auth/reset_password_admin/reset_password_admin.html',
                    controller : 'ResetPasswordAdminController as vm'
                }
            },
            bodyClass: 'reset_password_admin'
        });

        // Translation

        // Navigation
        /*msNavigationServiceProvider.saveItem('pages.auth.reset-password', {
            title : 'Reset Password',
            state : 'app.pages_auth_reset-password',
            weight: 6
        });*/
    }

})();
(function ()
{
    'use strict';

	ResetPassAdminService.$inject = ["$http", "$rootScope"];
    angular
        .module('app.pages.auth.reset_password_admin')
        .factory('ResetPassAdminService', ResetPassAdminService);

    /** @ngInject */
    
    function ResetPassAdminService($http, $rootScope)
    {
    return {
      requestPassword: function (password, token, time, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'recoverPassword/resetAdminPassword',
				data: 'password='+password+'&token='+token+'&time='+time,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	}
    }
	}
})();
(function ()
{
    'use strict';

    ResetPasswordAdminController.$inject = ["$scope", "ResetPassAdminService", "$location", "$state"];
    angular
        .module('app.pages.auth.reset_password_admin')
        .controller('ResetPasswordAdminController', ResetPasswordAdminController);

    /** @ngInject */
    function ResetPasswordAdminController($scope, ResetPassAdminService, $location, $state)
    {
        var vm = this;
        var token = $location.search().id;
        var time = $location.search().v;
        $scope.resetPassword = function(){
            if(token!==undefined){
            ResetPassAdminService.requestPassword(vm.form.password, token, time, function(data, status){
                console.log(data);
                if(data.success==true){
                    alert('Password is changed');
                    $state.go('app.pages_auth_admin_login');
                }else{
                    alert(data.message);
                }
            });
        }else{
            alert('Cant change password. Please follow the link in your email.');
        }
            //alert($location.absUrl());
        }
    }
})();
(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
    angular
        .module('app.pages.auth.reset-password', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pages_auth_reset-password', {
            url      : '/auth/reset-password',
            views    : {
                'main@'                                : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.pages_auth_reset-password': {
                    templateUrl: 'app/main/pages/auth/reset-password/reset-password.html',
                    controller : 'ResetPasswordController as vm'
                }
            },
            bodyClass: 'reset-password'
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/auth/reset-password');

        // Navigation
        /*msNavigationServiceProvider.saveItem('pages.auth.reset-password', {
            title : 'Reset Password',
            state : 'app.pages_auth_reset-password',
            weight: 6
        });*/
    }

})();
(function ()
{
    'use strict';

	ResetPassService.$inject = ["$http", "$rootScope"];
    angular
        .module('app.pages.auth.reset-password')
        .factory('ResetPassService', ResetPassService);

    /** @ngInject */
    
    function ResetPassService($http, $rootScope)
    {
    return {
      requestPassword: function (password, token, time, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'recoverPassword/resetPassword',
				data: 'password='+password+'&token='+token+'&time='+time,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	}
    }
	}
})();
(function ()
{
    'use strict';

    ResetPasswordController.$inject = ["$scope", "ResetPassService", "$location", "$state", "$mdToast"];
    angular
        .module('app.pages.auth.reset-password')
        .controller('ResetPasswordController', ResetPasswordController);

    /** @ngInject */
    function ResetPasswordController($scope, ResetPassService, $location, $state, $mdToast)
    {
        var vm = this;
        var token = $location.search().id;
        var time = $location.search().v;
        $scope.resetPassword = function(){
            if(token!==undefined){
            ResetPassService.requestPassword(vm.form.password, token,time, function(data, status){
                console.log(data);
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Password is changed!').position('top right'));
                    $state.go('app.pages_auth_login');
                }else{
                    $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                }
            });
        }else{
            $mdToast.show($mdToast.simple().textContent('Cant change password. Please follow the link in your email!').position('top right'));
        }
            //alert($location.absUrl());
        }
    }
})();
(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
    angular
        .module('app.pages.auth.register', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pages_auth_register', {
            url      : '/auth/register',
            views    : {
                'main@'                          : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.pages_auth_register': {
                    templateUrl: 'app/main/pages/auth/register/register.html',
                    controller : 'RegisterController as vm'
                }
            },
            bodyClass: 'register'
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/auth/register');

        // Navigation
        /* msNavigationServiceProvider.saveItem('pages.auth.register', {
            title : 'Register',
            state : 'app.pages_auth_register',
            weight: 3
        });*/
    }

})();
(function ()
{
    'use strict';

	RegisterService.$inject = ["$http", "$rootScope"];
    angular
        .module('app.pages.auth.register')
        .factory('RegisterService', RegisterService);

    /** @ngInject */
    
    function RegisterService($http, $rootScope)
    {
    return {
      registerUser: function (formdata, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'register/registerUser',
				data: 'email='+formdata.email+'&password='+formdata.password+'&name='+formdata.name+'&last_name='+formdata.last_name+'&middle_name='+formdata.middle_name+'&title='+formdata.title+'&organization='+formdata.organization+'&phone='+formdata.phone,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	notifyAdminRegister: function (user_id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/notifyAdminRegister',
				data:'user_id='+user_id,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	}
    }
	}
})();
(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.register')
        .directive('compareTo', compareToDirective)
        .directive('complexPassword', complexPasswordDirective);

    /** @ngInject */
    function compareToDirective()
    {
        return {
          require: "ngModel",
          scope: {
            otherModelValue: "=compareTo"
          },
          link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
              return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
              ngModel.$validate();
            });
          }
        };
    }

    function complexPasswordDirective() {
    return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(password) {
        var hasUpperCase = /[A-Z]/.test(password);
        var hasLowerCase = /[a-z]/.test(password);
        var hasNumbers = /[0-9]/.test(password);
        var hasNonalphas = /\W/.test(password);
        var characterGroupCount = hasUpperCase + hasLowerCase + hasNumbers + hasNonalphas;

        if ((password.length >= 8) && (characterGroupCount >= 4)) {
          ctrl.$setValidity('complexity', true);
          return password;
        }
        else {
          ctrl.$setValidity('complexity', false);
          return undefined;
        }

      });
      }
    }
    }

})();
(function ()
{
    'use strict';

    RegisterController.$inject = ["RegisterService", "$scope", "$state", "$mdToast"];
    angular
        .module('app.pages.auth.register')
        .controller('RegisterController', RegisterController);

    /** @ngInject */
    function RegisterController(RegisterService, $scope, $state, $mdToast)
    {
        var vm = this;
        $scope.register = function(){
            RegisterService.registerUser(vm.form, function(data, status){
                console.log(data);
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));

                    RegisterService.notifyAdminRegister(data.user_id, function(data, status){
                        
                    });

                    $state.go('app.pages_auth_login');
                }else{
                    $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                }
            });
        }

    }
})();
(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
    angular
        .module('app.pages.auth.master_login', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pages_auth_master_login', {
            url      : '/auth/master/login',
            views    : {
                'main@'                       : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.pages_auth_master_login': {
                    templateUrl: 'app/main/pages/auth/master_login/master_login.html',
                    controller : 'MasterLoginController as vm'
                }
            },
            bodyClass: 'master_login'
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/auth/master_login');

        // Navigation
        /*msNavigationServiceProvider.saveItem('pages.auth', {
            title : 'Authentication',
            icon  : 'icon-lock',
            weight: 1
        });

        msNavigationServiceProvider.saveItem('pages.auth.login', {
            title : 'Login',
            state : 'app.pages_auth_login',
            weight: 1
        });*/
    }

})();
(function ()
{
    'use strict';

	MasterLoginService.$inject = ["$http", "$rootScope"];
    angular
        .module('app.pages.auth.master_login')
        .factory('MasterLoginService', MasterLoginService);

    /** @ngInject */
    
    function MasterLoginService($http, $rootScope)
    {
    return {
      Masterlogin: function (email, password, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/loginAdmin',
				data: 'email='+email+'&password='+password,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	}
    }
	}
})();
(function ()
{
    'use strict';
    MasterLoginController.$inject = ["$scope", "MasterLoginService", "$rootScope", "$state", "msNavigationService", "$mdToast", "$mdDialog"];
    angular
        .module('app.pages.auth.master_login')
        .controller('MasterLoginController', MasterLoginController);
    /** @ngInject */
    function MasterLoginController($scope, MasterLoginService, $rootScope, $state, msNavigationService, $mdToast, $mdDialog)
    {
        var vm = this;
        vm.logging_in = false;
        $rootScope.globals = {};
        $scope.login = function(ev){
            vm.logging_in = true;
            MasterLoginService.Masterlogin(vm.form.email, vm.form.password, function(data, status){
                console.log(data);
                vm.logging_in = false;
                if(data.success==true){
                    var responseData = data.data;
                    $rootScope.globals.user_data = responseData;
                    var final_data = JSON.stringify(responseData);
                    try {
                    localStorage.setItem('userData', final_data);
                    }catch(e){
                        console.log(e);
                        $mdDialog.show(
                          $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Browser storage blocked')
                            .textContent('This website needs to store data in your browser. Kindly enable cookies to use this feature.')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('Got it!')
                            .targetEvent(ev)
                        );
                        return;
                    }
                    $state.go('app.dashboard_admin');
                }else{
                    $mdToast.show($mdToast.simple().textContent('Invalid credentials!').position('top right'));
                }
            });
        }
    }
})();
(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
    angular
        .module('app.pages.auth.login', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pages_auth_login', {
            url      : '/auth/login',
            views    : {
                'main@'                       : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.pages_auth_login': {
                    templateUrl: 'app/main/pages/auth/login/login.html',
                    controller : 'LoginController as vm'
                }
            },
            bodyClass: 'login'
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/auth/login');

        // Navigation
        /*msNavigationServiceProvider.saveItem('pages.auth', {
            title : 'Authentication',
            icon  : 'icon-lock',
            weight: 1
        });

        msNavigationServiceProvider.saveItem('pages.auth.login', {
            title : 'Login',
            state : 'app.pages_auth_login',
            weight: 1
        });*/
    }

})();
(function ()
{
    'use strict';

	LoginService.$inject = ["$http", "$rootScope"];
    angular
        .module('app.pages.auth.login')
        .factory('LoginService', LoginService);

    /** @ngInject */
    
    function LoginService($http, $rootScope)
    {
    return {
      Userlogin: function (email, password, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/loginUser',
				data: 'email='+email+'&password='+password,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	}
    }
	}
})();
(function ()
{
    'use strict';
    LoginController.$inject = ["$scope", "LoginService", "$rootScope", "$state", "msNavigationService", "$mdToast", "$mdDialog"];
    angular
        .module('app.pages.auth.login')
        .controller('LoginController', LoginController);
    /** @ngInject */
    function LoginController($scope, LoginService, $rootScope, $state, msNavigationService, $mdToast, $mdDialog)
    {
        var vm = this;
        vm.logging_in = false;
        $rootScope.globals = {};
        $scope.login = function(ev){
            vm.logging_in = true;
            LoginService.Userlogin(vm.form.email, vm.form.password, function(data, status){
                console.log(data);
                vm.logging_in = false;
                if(data.success==true){
                    var responseData = data.data;
                    $rootScope.globals.user_data = responseData;
                    var final_data = JSON.stringify(responseData);
                    try {
                    localStorage.setItem('userData', final_data);
                    }catch(e){
                        console.log(e);
                        $mdDialog.show(
                          $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Browser storage blocked')
                            .textContent('This website needs to store data in your browser. Kindly enable cookies to use this feature.')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('Got it!')
                            .targetEvent(ev)
                        );
                        return;
                    }
                    $state.go('app.dashboard');
                }else{
                    $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                }
            });
        }
    }
})();
(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
    angular
        .module('app.pages.auth.forgot_password_master', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pages_auth_forgot_password_master', {
            url      : '/auth/forgot-password-master',
            views    : {
                'main@'                                 : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.pages_auth_forgot_password_master': {
                    templateUrl: 'app/main/pages/auth/forgot_password_master/forgot_password_master.html',
                    controller : 'ForgotPasswordMasterController as vm'
                }
            },
            bodyClass: 'forgot_password_master'
        });

        // Translation

        // Navigation
        /*msNavigationServiceProvider.saveItem('pages.auth.forgot-password', {
            title : 'Forgot Password',
            state : 'app.pages_auth_forgot-password',
            weight: 5
        });*/
    }

})();
(function ()
{
    'use strict';

	ForgotPassMasterService.$inject = ["$http", "$rootScope"];
    angular
        .module('app.pages.auth.forgot_password_master')
        .factory('ForgotPassMasterService', ForgotPassMasterService);

    /** @ngInject */
    
    function ForgotPassMasterService($http, $rootScope)
    {
    return {
      masterRequestPassword: function (email, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'forgotPassword/masterRequestPassword',
				data: 'email='+email,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	}
    }
	}
})();
(function ()
{
    'use strict';

    ForgotPasswordMasterController.$inject = ["ForgotPassMasterService", "$scope", "$location", "$mdToast"];
    angular
        .module('app.pages.auth.forgot_password_master')
        .controller('ForgotPasswordMasterController', ForgotPasswordMasterController);

    /** @ngInject */
    function ForgotPasswordMasterController(ForgotPassMasterService, $scope, $location, $mdToast)
    {
        var vm = this;
        $scope.requestPassword = function(){
            ForgotPassMasterService.masterRequestPassword(vm.form.email, function(data, status){
                console.log(data);
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Password has been sent to your email').position('top right'));
                }else{
                    $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                }
            });
        }

    }
})();
(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
    angular
        .module('app.pages.auth.forgot_password_admin', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pages_auth_forgot_password_admin', {
            url      : '/auth/forgot-password-admin',
            views    : {
                'main@'                                 : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.pages_auth_forgot_password_admin': {
                    templateUrl: 'app/main/pages/auth/forgot_password_admin/forgot_password_admin.html',
                    controller : 'ForgotPasswordAdminController as vm'
                }
            },
            bodyClass: 'forgot_password_admin'
        });

        // Translation

        // Navigation
        /*msNavigationServiceProvider.saveItem('pages.auth.forgot-password', {
            title : 'Forgot Password',
            state : 'app.pages_auth_forgot-password',
            weight: 5
        });*/
    }

})();
(function ()
{
    'use strict';

	ForgotPassAdminService.$inject = ["$http", "$rootScope"];
    angular
        .module('app.pages.auth.forgot_password_admin')
        .factory('ForgotPassAdminService', ForgotPassAdminService);

    /** @ngInject */
    
    function ForgotPassAdminService($http, $rootScope)
    {
    return {
      requestPassword: function (email, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'forgotPassword/adminRequestPassword',
				data: 'email='+email,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	}
    }
	}
})();
(function ()
{
    'use strict';

    ForgotPasswordAdminController.$inject = ["ForgotPassAdminService", "$scope", "$location", "$mdToast"];
    angular
        .module('app.pages.auth.forgot_password_admin')
        .controller('ForgotPasswordAdminController', ForgotPasswordAdminController);

    /** @ngInject */
    function ForgotPasswordAdminController(ForgotPassAdminService, $scope, $location, $mdToast)
    {
        var vm = this;
        $scope.requestPassword = function(){
            ForgotPassAdminService.requestPassword(vm.form.email, function(data, status){
                console.log(data);
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Password has been sent to your email').position('top right'));
                }else{
                    $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                }
            });
        }

    }
})();
(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
    angular
        .module('app.pages.auth.forgot-password', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pages_auth_forgot-password', {
            url      : '/auth/forgot-password',
            views    : {
                'main@'                                 : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.pages_auth_forgot-password': {
                    templateUrl: 'app/main/pages/auth/forgot-password/forgot-password.html',
                    controller : 'ForgotPasswordController as vm'
                }
            },
            bodyClass: 'forgot-password'
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/auth/forgot-password');

        // Navigation
        /*msNavigationServiceProvider.saveItem('pages.auth.forgot-password', {
            title : 'Forgot Password',
            state : 'app.pages_auth_forgot-password',
            weight: 5
        });*/
    }

})();
(function ()
{
    'use strict';

	ForgotPassService.$inject = ["$http", "$rootScope"];
    angular
        .module('app.pages.auth.forgot-password')
        .factory('ForgotPassService', ForgotPassService);

    /** @ngInject */
    
    function ForgotPassService($http, $rootScope)
    {
    return {
      requestPassword: function (email, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'forgotPassword/sendMail',
				data: 'email='+email,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	}
    }
	}
})();
(function ()
{
    'use strict';

    ForgotPasswordController.$inject = ["ForgotPassService", "$scope", "$location", "$mdToast"];
    angular
        .module('app.pages.auth.forgot-password')
        .controller('ForgotPasswordController', ForgotPasswordController);

    /** @ngInject */
    function ForgotPasswordController(ForgotPassService, $scope, $location, $mdToast)
    {
        var vm = this;
        $scope.requestPassword = function(){
            ForgotPassService.requestPassword(vm.form.email, function(data, status){
                console.log(data);
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Password has been sent to your email!').position('top right'));
                }else{
                    $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                }
            });
        }

    }
})();
(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
    angular
        .module('app.pages.auth.admin_login', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pages_auth_admin_login', {
            url      : '/auth/admin/login',
            views    : {
                'main@'                       : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.pages_auth_admin_login': {
                    templateUrl: 'app/main/pages/auth/admin_login/admin_login.html',
                    controller : 'AdminLoginController as vm'
                }
            },
            bodyClass: 'admin_login'
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/auth/admin_login');

        // Navigation
        /*msNavigationServiceProvider.saveItem('pages.auth', {
            title : 'Authentication',
            icon  : 'icon-lock',
            weight: 1
        });

        msNavigationServiceProvider.saveItem('pages.auth.login', {
            title : 'Login',
            state : 'app.pages_auth_login',
            weight: 1
        });*/
    }

})();
(function ()
{
    'use strict';

	AdminLoginService.$inject = ["$http", "$rootScope"];
    angular
        .module('app.pages.auth.admin_login')
        .factory('AdminLoginService', AdminLoginService);

    /** @ngInject */
    
    function AdminLoginService($http, $rootScope)
    {
    return {
      subAdminlogin: function (email, password, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/loginSubAdmin',
				data: 'email='+email+'&password='+password,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	}
    }
	}
})();
(function ()
{
    'use strict';
    AdminLoginController.$inject = ["$scope", "AdminLoginService", "$rootScope", "$state", "$mdToast", "$mdDialog"];
    angular
        .module('app.pages.auth.admin_login')
        .controller('AdminLoginController', AdminLoginController);
    /** @ngInject */
    function AdminLoginController($scope, AdminLoginService, $rootScope, $state, $mdToast, $mdDialog)
    {
        var vm = this;
        vm.logging_in = false;
        $rootScope.globals = {};
        $scope.login = function(ev){
            vm.logging_in = true;
            AdminLoginService.subAdminlogin(vm.form.email, vm.form.password, function(data, status){
                console.log(data);
                vm.logging_in = false;
                if(data.success==true){
                    var responseData = data.data;
                    $rootScope.globals.user_data = responseData;
                    var final_data = JSON.stringify(responseData);
                    try {
                    localStorage.setItem('userData', final_data);
                    }catch(e){
                        console.log(e);
                        $mdDialog.show(
                          $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Browser storage blocked')
                            .textContent('This website needs to store data in your browser. Kindly enable cookies to use this feature.')
                            .ariaLabel('Alert Dialog Demo')
                            .ok('Got it!')
                            .targetEvent(ev)
                        );
                        return;
                    }
                    $state.go('app.dashboard_admin');
                }else{
                    $mdToast.show($mdToast.simple().textContent('Invalid credentials!').position('top right'));
                }
            });
        }
    }
})();
(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
    angular
        .module('app.dashboard_admin', ['slick', 'mdPickers'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.dashboard_admin', {
                url    : '/dashboard_admin',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/dashboard_admin/dashboard_admin.html',
                        controller : 'dashboard_adminController as vm'
                    }
                }
            });

        // Translation

        // Navigation
        /*msNavigationServiceProvider.saveItem('fuse', {
            title : 'dashboard_admin',
            group : true,
            weight: 1
        });*/

        msNavigationServiceProvider.saveItem('dashboard_admin', {
            title    : 'Dashboard',
            icon     : 'icon-tile-four',
            state    : 'app.dashboard_admin',
            /*stateParams: {
                'param1': 'page'
             },*/
            weight   : 1
        });
    }
})();
(function ()
{
    'use strict';

    AdminEventFormDialogController.$inject = ["$mdDialog", "dialogData", "$scope", "$mdToast", "DashboardService"];
    angular.module('app.dashboard_admin')
        .controller('AdminEventFormDialogController', AdminEventFormDialogController);

    /** @ngInject */
    function AdminEventFormDialogController($mdDialog, dialogData, $scope, $mdToast, DashboardService)
    {
        var vm = this;
        vm.categories = ['Social events', 'Sports', 'Entertainment/Music', 'Arts', 'Religious events', 'Fundraiser', 'City events', 'Government events', 'Cultural', 'Education', 'Environmental'];
        vm.days_of_week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        vm.days_of_week_value = ['0', '1', '2', '3', '4', '5', '6'];
        vm.hours = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
        vm.minutes = [];
        vm.dates = [];
        for(var i=1; i<=31; i++){
            vm.dates.push(i.toString());
        }

        $scope.selected = [];
        $scope.selectedDays = [];
        vm.attachments = [];
        vm.uploaded_file = [];
        var image_count = 0;
        $scope.uploadingFile = false;
        $scope.showDays = false;
        // Data
        vm.dialogData = dialogData;
        vm.notifications = ['15 minutes before', '30 minutes before', '1 hour before'];

        // Methods
        vm.saveEvent = saveEvent;
        vm.closeDialog = closeDialog;

        init();

        //////////

        /**
         * Initialize
         */
        function init()
        {
            vm.dialogTitle = (vm.dialogData.type === 'add' ? 'Add Event' : 'Edit Event');

            // Edit
            if ( vm.dialogData.calendarEvent )
            {
                // Clone the calendarEvent object before doing anything
                // to make sure we are not going to brake the Full Calendar
                vm.calendarEvent = angular.copy(vm.dialogData.calendarEvent);

                // Convert moment.js dates to javascript date object
                if ( moment.isMoment(vm.calendarEvent.start) )
                {
                    vm.calendarEvent.start = vm.calendarEvent.start.toDate();
                }

                if ( moment.isMoment(vm.calendarEvent.end) )
                {
                    vm.calendarEvent.end = vm.calendarEvent.end.toDate();
                }
                 vm.calendarEvent = {
                    start        : vm.dialogData.start,
                    end          : vm.dialogData.end,
                    title: vm.dialogData.obj.title,
                    location: vm.dialogData.obj.location,
                    description: vm.dialogData.obj.description,
                    status: vm.dialogData.obj.status,
                    recurring: vm.dialogData.obj.recurring_type,
                    start_time_minutes: vm.dialogData.obj.start_time_minutes,
                    start_time_hours: vm.dialogData.obj.start_time_hours,
                    end_time_hours: vm.dialogData.obj.end_time_hours,
                    end_time_minutes: vm.dialogData.obj.end_time_minutes,
                    month_recurring_type : '',
                    by_date_recurring : '',
                    by_day_recurring : '',
                    by_day_week : '',
                    link : vm.dialogData.obj.link,
                    contact_name : vm.dialogData.obj.contact_name,
                    contact_number : vm.dialogData.obj.contact_number,
                };
                var files_attachments = JSON.parse(vm.dialogData.obj.attachments);
                for(var i=0, j=files_attachments.length; i<j; i++){
                    image_count++;
                    var obj = {};
                    var tempObj = {};
                    obj.name = files_attachments[i].name;
                    tempObj.name = files_attachments[i].name;
                    obj.temp_id = image_count;
                    tempObj.size = files_attachments[i].size;
                    obj.size = files_attachments[i].size;
                    obj.filepath = files_attachments[i].filepath;
                    obj.extension = files_attachments[i].extension;
                    tempObj.extension = files_attachments[i].extension;
                    tempObj.filepath = files_attachments[i].filepath;
                    obj.uploading = false;
                    vm.attachments.push(obj);
                    vm.uploaded_file.push(tempObj);
                }
                //vm.uploaded_file = vm.dialogData.attachments.split(',');
                var categories_array = vm.dialogData.obj.categories.split(',');
                $scope.selected = categories_array; 
                console.log(vm.dialogData.obj.recurring_days);
                if(vm.dialogData.obj.recurring_days!=''){
                var recurring_days_array = vm.dialogData.obj.recurring_days.split(',');
                $scope.selectedDays = recurring_days_array;
                }

                var month_recurring = vm.dialogData.obj.month_recurring;
                console.log(month_recurring);
                if(month_recurring!==''){
                    month_recurring = JSON.parse(month_recurring);
                    vm.calendarEvent.month_recurring_type = month_recurring.month_recurring_type;
                    vm.calendarEvent.by_day_recurring = month_recurring.by_day_recurring;
                    vm.calendarEvent.by_date_recurring = month_recurring.by_date_recurring;
                    vm.calendarEvent.by_day_week = month_recurring.by_day_week;
                }
            }
            // Add
            else
            {
                // Convert moment.js dates to javascript date object
                if ( moment.isMoment(vm.dialogData.start) )
                {
                    vm.dialogData.start = vm.dialogData.start.toDate();
                }

                if ( moment.isMoment(vm.dialogData.end) )
                {
                    vm.dialogData.end = vm.dialogData.end.toDate();
                }

                vm.calendarEvent = {
                    start        : vm.dialogData.start,
                    end          : vm.dialogData.end,
                    description          : '',
                    recurring          : 'no-repeat',
                    start_time_minutes          : '00',
                    end_time_minutes          : '59',
                    start_time_hours          : '01',
                    end_time_hours          : '23',
                    month_recurring_type : '',
                    by_date_recurring : '',
                    by_day_recurring : '',
                    by_day_week : '',
                    link : '',
                    contact_name : '',
                    contact_number : '',
                    notifications: []
                };
            }

            for(var i=0; i<60; i++){
            i = i.toString();
            if(i<10){
                i = '0'+i;
            }
            vm.minutes.push(i);
            }
        }



        function saveEvent()
        {
            var month_recurring = {};
            month_recurring.month_recurring_type = vm.calendarEvent.month_recurring_type;
            month_recurring.by_date_recurring = vm.calendarEvent.by_date_recurring;
            month_recurring.by_day_recurring = vm.calendarEvent.by_day_recurring;
            month_recurring.by_day_week = vm.calendarEvent.by_day_week;
            var month_recurring_final = JSON.stringify(month_recurring);
            vm.calendarEvent.categories = $scope.selected.join();
            vm.calendarEvent.recurring_days = $scope.selectedDays.join();
            vm.calendarEvent.attachments = vm.uploaded_file;
            vm.calendarEvent.month_recurring = month_recurring_final;
            var response = {
                type         : vm.dialogData.type,
                calendarEvent: vm.calendarEvent
            };

            $mdDialog.hide(response);
        }

        $scope.attachFile = function(){
            document.getElementById('attach_file').click();
        }

         $scope.handleFileSelect = function(evt){
            image_count++;
            var files = evt.files; // FileList object
            console.log(files);
            var obj = {};
            obj.name = files[0].name;
            obj.size = Math.ceil(files[0].size/1024);
            obj.uploading = true;
            obj.filepath = '';
            obj.temp_id = image_count;
            vm.attachments.push(obj);

            var formData = new FormData();
            var file = document.getElementById('attach_file').files[0];
            formData.append('attachment', file);
            $scope.uploadingFile = true;
            $mdToast.show($mdToast.simple().textContent('Uploading!').position('top right'));
            DashboardService.uploadFile(formData, function(data, status){
                console.log(data);
                $scope.uploadingFile = false;
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Uploaded successfully!').position('top right'));
                    var tempObj = {};
                    tempObj.name = files[0].name;
                    tempObj.size = Math.ceil(files[0].size/1024);
                    tempObj.filepath = data.filepath;
                    tempObj.extension = data.extension;
                    vm.uploaded_file.push(tempObj);

                    //vm.uploaded_file.push(data.filepath);
                    for(var i=0, j=vm.attachments.length; i<j; i++){
                        if(vm.attachments[i].temp_id==obj.temp_id){
                            vm.attachments[i].uploading = false;
                            vm.attachments[i].filepath = data.filepath;
                        }
                    }
                }else{
                    $mdToast.show($mdToast.simple().textContent('Not able to upload!').position('top right'));
                }
            });
          }

          $scope.deleteFile = function(id, filename){
            for(var i=0, j=vm.attachments.length; i<j; i++){
                if(vm.attachments[i].temp_id==id){
                    vm.attachments.splice(i, 1);
                }
            }
            for(var i=0, j=vm.uploaded_file.length; i<j; i++){
                if(vm.uploaded_file[i].filepath==filename){
                    vm.uploaded_file.splice(i, 1);
                }
            }
            $mdToast.show($mdToast.simple().textContent('Attachment deleted!').position('top right'));
          }

        /**
         * Close the dialog
         */
        function closeDialog()
        {
            $mdDialog.cancel();
        }


        
      $scope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);
        else list.push(item);

      };
      $scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
      };

      $scope.toggleDays = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);
        else list.push(item);

      };
      $scope.existsDays = function (item, list) {
        return list.indexOf(item) > -1;
      };
    }
})();

(function ()
{
    'use strict';

    AdminEventDetailDialogController.$inject = ["$mdDialog", "calendarEvent", "showEventFormDialog", "event", "$scope"];
    angular.module('app.dashboard_admin')
        .controller('AdminEventDetailDialogController', AdminEventDetailDialogController);

    /** @ngInject */
    function AdminEventDetailDialogController($mdDialog, calendarEvent, showEventFormDialog, event, $scope)
    {
        var vm = this;
        vm.attachments = [];
        vm.days_of_week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        vm.days_of_week_value = ['0', '1', '2', '3', '4', '5', '6'];
        var image_count = 0;
        // Data
        vm.calendarEvent = calendarEvent;
        var image_extensions = ['jpg', 'png', 'jpeg', 'PNG', 'JPG', 'JPEG'];
        var files_attachments = JSON.parse(calendarEvent.attachments);
                for(var i=0, j=files_attachments.length; i<j; i++){
                    image_count++;
                    var obj = {};
                    obj.name = files_attachments[i].name;
                    obj.temp_id = image_count;
                    obj.size = files_attachments[i].size;
                    obj.filepath = files_attachments[i].filepath;
                    obj.extension = files_attachments[i].extension;
                    if(image_extensions.indexOf(files_attachments[i].extension)>-1){
                    obj.isImage = true;
                    }else{
                    obj.isImage = false;
                    }   
                    obj.uploading = false;
                    vm.attachments.push(obj);
                }
        // Methods
        vm.editEvent = editEvent;
        vm.closeDialog = closeDialog;

        //////////
        function closeDialog()
        {
            
            $mdDialog.cancel();
        }

        function editEvent(calendarEvent)
        {
            showEventFormDialog('edit', calendarEvent, false, false, event);
        }
        $scope.getdays = function(days){
            var days_array = days.split(',');
            var days_name = '';
            for(var i=0, j=days_array.length; i<j; i++){
                days_name+= vm.days_of_week[days_array[i]]+', ';
            }
            days_name = days_name.replace(/,\s*$/, "");
            return days_name; 
        }
    }
})();

(function ()
{
    'use strict';

	DashboardEventEditService.$inject = ["$http", "$rootScope"];
    angular
        .module('app.dashboard')
        .factory('DashboardEventEditService', DashboardEventEditService);

    /** @ngInject */
    
    function DashboardEventEditService($http, $rootScope)
    {
    return {
      getEventsAttachments: function (event_id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/showEventAttachments',
				data: 'event_id='+event_id,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	deleteEvent: function (user_id, id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/deleteEvent',
				data: 'user_id='+user_id+'&event_id='+id,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	}
    }
	}
})();
(function ()
{
    'use strict';

    EventFormDialogController.$inject = ["$mdDialog", "dialogData", "$scope", "DashboardService", "$mdToast"];
    angular.module('app.dashboard')
        .controller('EventFormDialogController', EventFormDialogController);

    /** @ngInject */
    function EventFormDialogController($mdDialog, dialogData, $scope, DashboardService, $mdToast)
    {
        var vm = this;
        vm.categories = ['Social events', 'Sports', 'Entertainment/Music', 'Arts', 'Religious events', 'Fundraiser', 'City events', 'Government events', 'Cultural', 'Education', 'Environmental'];
        vm.days_of_week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        vm.days_of_week_value = ['0', '1', '2', '3', '4', '5', '6'];
        vm.hours = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
        vm.minutes = [];
        vm.dates = [];
        for(var i=1; i<=31; i++){
            vm.dates.push(i.toString());
        }

        $scope.selected = [];
        $scope.selectedDays = [];
        vm.attachments = [];
        vm.uploaded_file = [];
        var image_count = 0;
        $scope.uploadingFile = false;
        $scope.showDays = false;
        // Data
        vm.dialogData = dialogData;
        vm.notifications = ['15 minutes before', '30 minutes before', '1 hour before'];

        // Methods
        vm.saveEvent = saveEvent;
        vm.closeDialog = closeDialog;
        init();

        //////////

        /**
         * Initialize
         */
        function init()
        {
            vm.dialogTitle = (vm.dialogData.type === 'add' ? 'Add Event' : 'Edit Event');

            // Edit
            if ( vm.dialogData.calendarEvent )
            {
                // Clone the calendarEvent object before doing anything
                // to make sure we are not going to brake the Full Calendar
                vm.calendarEvent = angular.copy(vm.dialogData.calendarEvent);

                // Convert moment.js dates to javascript date object
                if ( moment.isMoment(vm.calendarEvent.start) )
                {
                    vm.calendarEvent.start = vm.calendarEvent.start.toDate();
                }

                if ( moment.isMoment(vm.calendarEvent.end) )
                {
                    vm.calendarEvent.end = vm.calendarEvent.end.toDate();
                }
                 vm.calendarEvent = {
                    start        : vm.dialogData.start,
                    end          : vm.dialogData.end,
                    title: vm.dialogData.obj.title,
                    location: vm.dialogData.obj.location,
                    description: vm.dialogData.obj.description,
                    status: vm.dialogData.obj.status,
                    recurring: vm.dialogData.obj.recurring_type,
                    start_time_minutes: vm.dialogData.obj.start_time_minutes,
                    start_time_hours: vm.dialogData.obj.start_time_hours,
                    end_time_hours: vm.dialogData.obj.end_time_hours,
                    end_time_minutes: vm.dialogData.obj.end_time_minutes,
                    month_recurring_type : '',
                    by_date_recurring : '',
                    by_day_recurring : '',
                    by_day_week : '',
                    link : vm.dialogData.obj.link,
                    contact_name : vm.dialogData.obj.contact_name,
                    contact_number : vm.dialogData.obj.contact_number
                };
                var files_attachments = JSON.parse(vm.dialogData.obj.attachments);
                for(var i=0, j=files_attachments.length; i<j; i++){
                    image_count++;
                    var obj = {};
                    var tempObj = {};
                    obj.name = files_attachments[i].name;
                    tempObj.name = files_attachments[i].name;
                    obj.temp_id = image_count;
                    tempObj.size = files_attachments[i].size;
                    obj.size = files_attachments[i].size;
                    obj.filepath = files_attachments[i].filepath;
                    obj.extension = files_attachments[i].extension;
                    tempObj.extension = files_attachments[i].extension;
                    tempObj.filepath = files_attachments[i].filepath;
                    obj.uploading = false;
                    vm.attachments.push(obj);
                    vm.uploaded_file.push(tempObj);
                }
                //vm.uploaded_file = vm.dialogData.attachments.split(',');
                var categories_array = vm.dialogData.obj.categories.split(',');
                $scope.selected = categories_array; 
                console.log(vm.dialogData.obj.recurring_days);
                if(vm.dialogData.obj.recurring_days!=''){
                var recurring_days_array = vm.dialogData.obj.recurring_days.split(',');
                $scope.selectedDays = recurring_days_array;
                }

                var month_recurring = vm.dialogData.obj.month_recurring;
                console.log(month_recurring);
                if(month_recurring!==''){
                    month_recurring = JSON.parse(month_recurring);
                    vm.calendarEvent.month_recurring_type = month_recurring.month_recurring_type;
                    vm.calendarEvent.by_day_recurring = month_recurring.by_day_recurring;
                    vm.calendarEvent.by_date_recurring = month_recurring.by_date_recurring;
                    vm.calendarEvent.by_day_week = month_recurring.by_day_week;
                }
            }
            // Add
            else
            {
                // Convert moment.js dates to javascript date object
                if ( moment.isMoment(vm.dialogData.start) )
                {
                    vm.dialogData.start = vm.dialogData.start.toDate();
                }

                if ( moment.isMoment(vm.dialogData.end) )
                {
                    vm.dialogData.end = vm.dialogData.end.toDate();
                }

                vm.calendarEvent = {
                    start        : vm.dialogData.start,
                    end          : vm.dialogData.end,
                    description          : '',
                    recurring          : 'no-repeat',
                    start_time_minutes          : '00',
                    end_time_minutes          : '59',
                    start_time_hours          : '01',
                    end_time_hours          : '23',
                    month_recurring_type : '',
                    by_date_recurring : '',
                    by_day_recurring : '',
                    by_day_week : '',
                    link : '',
                    contact_name : '',
                    contact_number : '',
                    notifications: []
                };


            }

            for(var i=0; i<60; i++){
            i = i.toString();
            if(i<10){
                i = '0'+i;
            }
            vm.minutes.push(i);
            }
        }

        function saveEvent()
        {
            var month_recurring = {};
            month_recurring.month_recurring_type = vm.calendarEvent.month_recurring_type;
            month_recurring.by_date_recurring = vm.calendarEvent.by_date_recurring;
            month_recurring.by_day_recurring = vm.calendarEvent.by_day_recurring;
            month_recurring.by_day_week = vm.calendarEvent.by_day_week;
            var month_recurring_final = JSON.stringify(month_recurring);
            
            vm.calendarEvent.categories = $scope.selected.join();
            vm.calendarEvent.recurring_days = $scope.selectedDays.join();
            vm.calendarEvent.attachments = vm.uploaded_file;
            vm.calendarEvent.month_recurring = month_recurring_final;
            var response = {
                type         : vm.dialogData.type,
                calendarEvent: vm.calendarEvent
            };

            $mdDialog.hide(response);
        }

        $scope.attachFile = function(){
            document.getElementById('attach_file').click();
        }

         $scope.handleFileSelect = function(evt){
            image_count++;
            var files = evt.files; // FileList object
            console.log(files);
            var obj = {};
            obj.name = files[0].name;
            obj.size = Math.ceil(files[0].size/1024);
            obj.uploading = true;
            obj.filepath = '';
            obj.temp_id = image_count;
            vm.attachments.push(obj);

            var formData = new FormData();
            var file = document.getElementById('attach_file').files[0];
            formData.append('attachment', file);
            $scope.uploadingFile = true;
            $mdToast.show($mdToast.simple().textContent('Uploading!').position('top right'));
            DashboardService.uploadFile(formData, function(data, status){
                console.log(data);
                $scope.uploadingFile = false;
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Uploaded successfully!').position('top right'));
                    var tempObj = {};
                    tempObj.name = files[0].name;
                    tempObj.size = Math.ceil(files[0].size/1024);
                    tempObj.filepath = data.filepath;
                    tempObj.extension = data.extension;
                    vm.uploaded_file.push(tempObj);

                    //vm.uploaded_file.push(data.filepath);
                    for(var i=0, j=vm.attachments.length; i<j; i++){
                        if(vm.attachments[i].temp_id==obj.temp_id){
                            vm.attachments[i].uploading = false;
                            vm.attachments[i].filepath = data.filepath;
                        }
                    }
                }else{
                    $mdToast.show($mdToast.simple().textContent('Not able to upload!').position('top right'));
                }
            });
          }

          $scope.deleteFile = function(id, filename){
            for(var i=0, j=vm.attachments.length; i<j; i++){
                if(vm.attachments[i].temp_id==id){
                    vm.attachments.splice(i, 1);
                }
            }
            for(var i=0, j=vm.uploaded_file.length; i<j; i++){
                if(vm.uploaded_file[i].filepath==filename){
                    vm.uploaded_file.splice(i, 1);
                }
            }
            $mdToast.show($mdToast.simple().textContent('Attachment deleted!').position('top right'));
          }

        /**
         * Close the dialog
         */
        function closeDialog()
        {
            $mdDialog.cancel();
        }


        
      $scope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);
        else list.push(item);

      };
      $scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
      };

      $scope.toggleDays = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);
        else list.push(item);

      };
      $scope.existsDays = function (item, list) {
        return list.indexOf(item) > -1;
      };


    }
})();

(function ()
{
    'use strict';

    EventDetailDialogController.$inject = ["$mdDialog", "calendarEvent", "showEventFormDialog", "event"];
    angular.module('app.dashboard')
        .controller('EventDetailDialogController', EventDetailDialogController);

    /** @ngInject */
    function EventDetailDialogController($mdDialog, calendarEvent, showEventFormDialog, event)
    {
        var vm = this;

        // Data
        vm.calendarEvent = calendarEvent;

        // Methods
        vm.editEvent = editEvent;
        vm.closeDialog = closeDialog;

        //////////

        function closeDialog()
        {
            $mdDialog.hide();
        }

        function editEvent(calendarEvent)
        {
            showEventFormDialog('edit', calendarEvent, false, false, event);
        }
    }
})();

(function ()
{
    'use strict';

    config.$inject = ["$translatePartialLoaderProvider"];
    angular
        .module('app.quick-panel', [])
        .config(config);

    /** @ngInject */
    function config($translatePartialLoaderProvider)
    {
        $translatePartialLoaderProvider.addPart('app/quick-panel');
    }
})();

(function ()
{
    'use strict';

    ChatTabController.$inject = ["api", "$timeout"];
    angular
        .module('app.quick-panel')
        .controller('ChatTabController', ChatTabController);

    /** @ngInject */
    function ChatTabController(api, $timeout)
    {
        var vm = this;

        // Data
        vm.chat = {};
        vm.chatActive = false;
        vm.replyMessage = '';

        api.quickPanel.contacts.get({}, function (response)
        {
            vm.contacts = response.data;
        });

        // Methods
        vm.toggleChat = toggleChat;
        vm.reply = reply;

        //////////

        function toggleChat(contact)
        {
            vm.chatActive = !vm.chatActive;

            if ( vm.chatActive )
            {
                vm.replyMessage = '';
                vm.chat.contact = contact;
                scrollToBottomOfChat(0);
            }
        }

        function reply()
        {
            if ( vm.replyMessage === '' )
            {
                return;
            }

            if ( !vm.chat.contact.dialog )
            {
                vm.chat.contact.dialog = [];
            }

            vm.chat.contact.dialog.push({
                who    : 'user',
                message: vm.replyMessage,
                time   : 'Just now'
            });

            vm.replyMessage = '';

            scrollToBottomOfChat(400);
        }

        function scrollToBottomOfChat(speed)
        {
            var chatDialog = angular.element('#chat-dialog');

            $timeout(function ()
            {
                chatDialog.animate({
                    scrollTop: chatDialog[0].scrollHeight
                }, speed);
            }, 0);

        }
    }

})();
(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
    angular
        .module('app.user.dashboard', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.user_dashboard', {
            url      : '/dashboard',
            views    : {
                'content@app.user_dashboard': {
                    templateUrl: 'app/main/user/dashboard/dashboard.html',
                    controller : 'DashboardController as vm'
                }
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('user.dashboard', {
            title : 'Dashboard',
            icon  : 'icon-tile-four',
            weight: 1,
            state    : 'app.user_dashboard'
        });
    }

})();
(function ()
{
    'use strict';

    angular
        .module('app.user.dashboard')
        .controller('DashboardController', DashboardController);

    /** @ngInject */
    function DashboardController()
    {
        alert('asd');
        // Data

        // Methods

        //////////
    }
})();
(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
    angular
        .module('app.pages.terms_and_condition', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pages_terms_and_condition', {
            url      : '/terms_and_condition',
            views    : {
                'main@'                       : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.pages_terms_and_condition': {
                    templateUrl: 'app/main/pages/terms_and_condition/terms_and_condition.html',
                    controller : 'TermsController as vm'
                }
            },
            bodyClass: 'terms_and_condition'
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/terms_and_condition');

        // Navigation
        /*msNavigationServiceProvider.saveItem('pages.auth', {
            title : 'Authentication',
            icon  : 'icon-lock',
            weight: 1
        });

        msNavigationServiceProvider.saveItem('pages.auth.landing', {
            title : 'landing',
            state : 'app.pages_auth_landing',
            weight: 1
        });*/
    }

})();
(function ()
{
    'use strict';

	TermsService.$inject = ["$http", "$rootScope"];
    angular
        .module('app.pages.terms_and_condition')
        .factory('TermsService', TermsService);

    /** @ngInject */
    
    function TermsService($http, $rootScope)
    {
    return {
      getTermsText: function (callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/getTermsText',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	}
    }
	}
})();
(function ()
{
    'use strict';

    TermsController.$inject = ["$scope", "$http", "TermsService"];
    angular
        .module('app.pages.terms_and_condition')
        .controller('TermsController', TermsController);

    /** @ngInject */
    function TermsController($scope, $http, TermsService)
    {
        // Data
            TermsService.getTermsText(function(data, status){
            console.log(data);
            if(data.success==true){
                $scope.termsText = data.data;
            }else{
                $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
            }
        });
    }
})();
(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
    angular
        .module('app.pages.privacy_policy', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pages_privacy_policy', {
            url      : '/privacy-policy',
            views    : {
                'main@'                       : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.pages_privacy_policy': {
                    templateUrl: 'app/main/pages/privacy_policy/privacy_policy.html',
                    controller : 'PricavyPolicyController as vm'
                }
            },
            bodyClass: 'privacy_policy'
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pages/privacy_policy');

    }

})();
(function ()
{
    'use strict';

	PrivacyPolicyService.$inject = ["$http", "$rootScope"];
    angular
        .module('app.pages.privacy_policy')
        .factory('PrivacyPolicyService', PrivacyPolicyService);

    /** @ngInject */
    
    function PrivacyPolicyService($http, $rootScope)
    {
    return {
      getTermsText: function (callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/getTermsText',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	}
    }
	}
})();
(function ()
{
    'use strict';

    PricavyPolicyController.$inject = ["$scope", "$http", "PrivacyPolicyService"];
    angular
        .module('app.pages.privacy_policy')
        .controller('PricavyPolicyController', PricavyPolicyController);

    /** @ngInject */
    function PricavyPolicyController($scope, $http, PrivacyPolicyService)
    {
        // Data
            PrivacyPolicyService.getTermsText(function(data, status){
            console.log(data);
            if(data.success==true){
                $scope.termsText = data.data;
            }else{
                $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
            }
        });
    }
})();
(function ()
{
    'use strict';

    PricavyPolicyController.$inject = ["$scope", "$http", "editPrivacyPolicyService"];
    angular
        .module('app.pages.privacy_policy')
        .controller('PricavyPolicyController', PricavyPolicyController);

    /** @ngInject */
    function PricavyPolicyController($scope, $http, editPrivacyPolicyService)
    {
        // Data
            editPrivacyPolicyService.getPrivacyPolicyText(function(data, status){
            console.log(data);
            if(data.success==true){
                $scope.privacyText = data.data;
            }else{
                $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
            }
        });
    }
})();
(function ()
{
    'use strict';

	CalendarService.$inject = ["$http", "$rootScope"];
    angular
        .module('app.pages.calendar')
        .factory('CalendarService', CalendarService);

    /** @ngInject */
    
    function CalendarService($http, $rootScope)
    {
    return {
      showApprovedEvents: function (user_id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/showApprovedEvents',
				data: 'user_id='+user_id,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	searchApprovedEvents: function (category, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/searchApprovedEvents',
				data: 'category='+category,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	textSearchApprovedEvents: function (keyword, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/textSearchApprovedEvents',
				data: 'keyword='+keyword,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	getBannerImages: function (callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/getBannerImages',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	}
    }
	}
})();
(function ()
{
    'use strict';

    CalendarController.$inject = ["$mdDialog", "$document", "CalendarService", "$mdToast", "$filter", "$state", "$interval", "$location"];
    angular
        .module('app.pages.calendar')
        .controller('CalendarController', CalendarController);

    /** @ngInject */
    function CalendarController($mdDialog, $document, CalendarService, $mdToast, $filter, $state, $interval, $location)
    {
        var vm = this;
        vm.selected_event = $location.search().event_details;
        // Data
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        var eventsData = [];
        vm.events = [];
        vm.background_image = '';
        var imageCounter = 0;
        CalendarService.getBannerImages(function(data, status){
                    if(data.success==true){
                    vm.banner_images = [];
                    var image_count = 0;
                    var files_attachments = JSON.parse(data.data.images);
                    for(var i=0, j=files_attachments.length; i<j; i++){
                        image_count++;
                        var obj = {};
                        obj.name = files_attachments[i].name;
                        obj.temp_id = image_count;
                        obj.size = files_attachments[i].size;
                        obj.filepath = files_attachments[i].filepath;
                        obj.extension = files_attachments[i].extension;
                        obj.uploading = false;
                        vm.banner_images.push(obj);
                    }
                    vm.background_image = vm.banner_images[0].filepath;
                }
        });

        $interval(function(){
            if(vm.background_image!==''){
                if((imageCounter+1) > vm.banner_images.length){
                    imageCounter = 0;
                }
                vm.background_image = vm.banner_images[imageCounter].filepath;
                imageCounter++;
            } 
        }, 5000);

        CalendarService.showApprovedEvents('', function(data, status){
            console.log(data);
            if(data.success==true){
                var events = data.data;
                putEventsOnCalendar(data);
                    console.log('selected');
                    for(var i=0, j=eventsData.length; i<j; i++){
                        if(eventsData[i].id==vm.selected_event){
                            showEventDetailDialog(eventsData[i], '', true);
                            break;
                        }
                    }
            }else{
                $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
            }
        });

        function putEventsOnCalendar(data){
            for(var i=0, j=data.data.length; i<j; i++){
                    var obj = {};
                    var new_start_date = convertDate(data.data[i].start_date, data.data[i].start_time);
                    var new_end_date = convertDate(data.data[i].end_date, data.data[i].end_time);
                    obj.id = data.data[i].event_id;
                    obj.title = data.data[i].title;
                    obj.description = data.data[i].description;
                    obj.location = data.data[i].location;
                    obj.attachments = data.data[i].attachments;
                    obj.categories = data.data[i].categories;
                    obj.recurring = data.data[i].recurring_type;
                    obj.recurring_days = data.data[i].recurring_days;
                    obj.link = data.data[i].link;
                    obj.contact_name = data.data[i].contact_name;
                    obj.contact_number = data.data[i].contact_number;
                    //obj.start = new Date(data.data[i].start_date+':'+data.data[i].start_time);
                    obj.start = new_start_date;
                    //obj.end = new Date(data.data[i].end_date+':'+data.data[i].end_time);
                    obj.end = new_end_date;
                    obj.className = [data.data[i].categories.split(',')[0].replace(/[ \/]/g, '')];
                    var timeDiff = Math.abs(obj.end.getTime() - obj.start.getTime());
                    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
                    
                    //var start_date = new Date(data.data[i].start_date+':'+data.data[i].start_time);
                    var start_date = obj.start;
                    //var end_date = new Date(data.data[i].end_date+':'+data.data[i].end_time);
                    var end_date = obj.end;
                    if(diffDays>1){
                        if(obj.recurring=='weekly'){

                            var dow = [];
                            dow = obj.recurring_days.split(',');
                            // loop through dates and find the day and display it.
                            while (start_date < end_date) {
                                var obj2 = {};
                                var dateDay = start_date.getDay();
                                dateDay = dateDay.toString();
                               // var new_end_date = new Date(end_y, end_m, end_d, end_time_array[0], end_time_array[1]);
                                var new_end_date = convertDateWeeklyMonthly(start_date, data.data[i].end_time);
                               // var new_start_date = new Date(start_y, start_m, start_d, start_time_array[0], start_time_array[1]);
                                var new_start_date = convertDateWeeklyMonthly(start_date, data.data[i].start_time);
                                if(dow.indexOf(dateDay)>-1){
                                    obj2.id = data.data[i].event_id;
                                    obj2.title = data.data[i].title;
                                    obj2.description = data.data[i].description;
                                    obj2.location = data.data[i].location;
                                    obj2.attachments = data.data[i].attachments;
                                    obj2.categories = data.data[i].categories;
                                    obj2.recurring = data.data[i].recurring_type;
                                    obj2.recurring_days = data.data[i].recurring_days;
                                    obj2.link = data.data[i].link;
                                    obj2.contact_name = data.data[i].contact_name;
                                    obj2.contact_number = data.data[i].contact_number;
                                    obj2.start = new_start_date;
                                    obj2.end = new_end_date;
                                    obj2.allDay = false;
                                    obj2.className = [data.data[i].categories.split(',')[0].replace(/[ \/]/g, '')];
                                    eventsData.push(obj2); 
                                }
                                start_date = new Date(start_date.setDate(start_date.getDate() + 1));
                              }

                        
                        }else if(obj.recurring=='monthly'){
                            // loop through dates and find the day and display it.
                            var monthly_recurring = JSON.parse(data.data[i].month_recurring);
                            var monthly_recurring_type = monthly_recurring.month_recurring_type;
                            while (start_date < end_date) {
                                var obj2 = {};
                                var dateDay = start_date.getDay();
                                var by_day_date;
                                var by_day_week;
                                dateDay = dateDay.toString();
                                // var new_end_date = new Date(end_y, end_m, end_d, end_time_array[0], end_time_array[1]);
                                var new_end_date = convertDateWeeklyMonthly(start_date, data.data[i].end_time);
                               // var new_start_date = new Date(start_y, start_m, start_d, start_time_array[0], start_time_array[1]);
                                var new_start_date = convertDateWeeklyMonthly(start_date, data.data[i].start_time);

                                if(monthly_recurring_type=='by_day'){
                                    by_day_date = monthly_recurring.by_day_recurring;
                                    by_day_week = monthly_recurring.by_day_week;
                                    var getDayDate = start_date.getDate();
                                    if(dateDay==by_day_date){
                                     var getWeek = Math.ceil(parseInt(getDayDate)/7);
                                    if(getWeek==by_day_week){
                                    obj2.id = data.data[i].event_id;
                                    obj2.title = data.data[i].title;
                                    obj2.description = data.data[i].description;
                                    obj2.location = data.data[i].location;
                                    obj2.attachments = data.data[i].attachments;
                                    obj2.categories = data.data[i].categories;
                                    obj2.recurring = data.data[i].recurring_type;
                                    obj2.recurring_days = data.data[i].recurring_days;
                                    obj2.link = data.data[i].link;
                                    obj2.contact_name = data.data[i].contact_name;
                                    obj2.contact_number = data.data[i].contact_number;
                                    obj2.start = new_start_date;
                                    obj2.end = new_end_date;
                                    obj2.allDay = false;
                                    obj2.className = [data.data[i].categories.split(',')[0].replace(/[ \/]/g, '')];
                                    eventsData.push(obj2);
                                    }
                                    }
                                }else{
                                    var compare_date = monthly_recurring.by_date_recurring;
                                    var getDate = new_start_date.getDate();
                                    if(getDate==compare_date){
                                        obj2.id = data.data[i].event_id;
                                        obj2.title = data.data[i].title;
                                        obj2.description = data.data[i].description;
                                        obj2.location = data.data[i].location;
                                        obj2.attachments = data.data[i].attachments;
                                        obj2.categories = data.data[i].categories;
                                        obj2.recurring = data.data[i].recurring_type;
                                        obj2.recurring_days = data.data[i].recurring_days;
                                        obj2.link = data.data[i].link;
                                        obj2.contact_name = data.data[i].contact_name;
                                        obj2.contact_number = data.data[i].contact_number;
                                        obj2.start = new_start_date;
                                        obj2.end = new_end_date;
                                        obj2.allDay = false;
                                        obj2.className = [data.data[i].categories.split(',')[0].replace(/[ \/]/g, '')];
                                        eventsData.push(obj2);
                                    }
                                }
                                
                                start_date = new Date(start_date.setDate(start_date.getDate() + 1));
                              }
                        }else{
                        obj.allDay = false;
                        eventsData.push(obj);
                        }
                    }else{
                        obj.allDay = false;
                        eventsData.push(obj);
                    }
                }
                vm.events.push(eventsData);
        }

        function convertDate(date, time){
            var start_date_test = new Date(date);
            var start_d = start_date_test.getDate();
            var start_m = start_date_test.getMonth();
            var start_y = start_date_test.getFullYear();

            var start_time_array = time.split(':');

            return new Date(start_y, start_m, start_d, start_time_array[0], start_time_array[1]);
        }

        function convertDateWeeklyMonthly(date, time){
            var start_d = date.getDate();
            var start_m = date.getMonth();
            var start_y = date.getFullYear();

            var start_time_array = time.split(':');

            return new Date(start_y, start_m, start_d, start_time_array[0], start_time_array[1]);
        }

        

        vm.calendarUiConfig = {
            calendar: {
                editable          : false,
                eventLimit        : true,
                header            : '',
                handleWindowResize: false,
                aspectRatio       : 1,
                dayNames          : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                dayNamesShort     : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                viewRender        : function (view)
                {
                    vm.calendarView = view;
                    vm.calendar = vm.calendarView.calendar;
                    vm.currentMonthShort = vm.calendar.getDate().format('MMM');
                },
                columnFormat      : {
                    month: 'ddd',
                    week : 'ddd D',
                    day  : 'ddd M'
                },
                eventClick        : eventDetail,
                selectable        : true,
                selectHelper      : true,
                select            : select
            }
        };

        // Methods
        vm.addEvent = addEvent;
        vm.next = next;
        vm.prev = prev;

        //////////

        /**
         * Go to next on current view (week, month etc.)
         */
        function next()
        {
            vm.calendarView.calendar.next();
        }

        /**
         * Go to previous on current view (week, month etc.)
         */
        function prev()
        {
            vm.calendarView.calendar.prev();
        }

        /**
         * Show event detail
         *
         * @param calendarEvent
         * @param e
         */
        function eventDetail(calendarEvent, e)
        {
            $location.search('event_details', calendarEvent.id);
            showEventDetailDialog(calendarEvent, e, false);
        }

        /**
         * Add new event in between selected dates
         *
         * @param start
         * @param end
         * @param e
         */
        function select(start, end, e)
        {
            showEventFormDialog('add', false, start, end, e);
        }

        /**
         * Add event
         *
         * @param e
         */
        function addEvent(e)
        {
            var start = new Date(),
                end = new Date();

            showEventFormDialog('add', false, start, end, e);
        }

        vm.searchPopup = function(e)
        {
            $mdDialog.show({
                controller         : 'CalendarSearchDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/pages/calendar/dialogs/search/search-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : e,
                clickOutsideToClose: true,
                locals             : {
                    event              : e
                }
            }).then(function (response)
            {
                $mdToast.show($mdToast.simple().textContent('Getting events. Please wait!').position('top right'));
                vm.events.splice(0, 1);
            CalendarService.searchApprovedEvents(response, function(data, status){
            console.log(data);
            eventsData = [];
            if(data.success==true){
                if(data.data.length>0){
                    var toastText = '';
                    if(data.data.length==1){
                        toastText = 'Found 1 event!';
                    }else{
                        toastText = 'Found '+data.data.length+' events!';
                    }
                    $mdToast.show($mdToast.simple().textContent(toastText).position('top right'));
                    var events = data.data;
                    putEventsOnCalendar(data);
                    if(events.length>0){
                        vm.calendarView.calendar.gotoDate(convertDate(events[0].start_date, events[0].start_time));
                    }
                }else{
                    $mdToast.show($mdToast.simple().textContent('No event found!').position('top right'));
                }
                       
            }else{
                $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
            }
        });
            });
        }


        vm.textSearchPopup = function(e)
        {
            $mdDialog.show({
                controller         : 'CalendarTextSearchDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/pages/calendar/dialogs/text_search/text-search-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : e,
                clickOutsideToClose: true,
                locals             : {
                    event              : e
                }
            }).then(function (response)
            {
                $mdToast.show($mdToast.simple().textContent('Getting events. Please wait!').position('top right'));
                vm.events.splice(0, 1);
            CalendarService.textSearchApprovedEvents(response, function(data, status){
            console.log(data);
            eventsData = [];
            if(data.success==true){
                if(data.data.length>0){
                    var toastText = '';
                    if(data.data.length==1){
                        toastText = 'Found 1 event!';
                    }else{
                        toastText = 'Found '+data.data.length+' events!';
                    }
                    $mdToast.show($mdToast.simple().textContent(toastText).position('top right'));
                    var events = data.data;
                    putEventsOnCalendar(data);
                    if(events.length>0){
                        vm.calendarView.calendar.gotoDate(convertDate(events[0].start_date, events[0].start_time));
                    }
                }else{
                    $mdToast.show($mdToast.simple().textContent('No event found!').position('top right'));
                }
                       
            }else{
                $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
            }
        });
            });
        }

        /**
         * Show event detail dialog
         * @param calendarEvent
         * @param e
         */
        function showEventDetailDialog(calendarEvent, e, event_preselected)
        {
            $mdDialog.show({
                controller         : 'CalendarEventDetailDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/pages/calendar/dialogs/event-detail/event-detail-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : e,
                clickOutsideToClose: true,
                locals             : {
                    calendarEvent      : calendarEvent,
                    showEventFormDialog: showEventFormDialog,
                    event_preselected: event_preselected,
                    event              : e
                }
            }).then(function(answer) {

            }, function() {
              $location.search('event_details', null);
            });
        }

        /**
         * Show event add/edit form dialog
         *
         * @param type
         * @param calendarEvent
         * @param start
         * @param end
         * @param e
         */
        function showEventFormDialog(type, calendarEvent, start, end, e)
        {
            return;
            var dialogData = {
                type         : type,
                calendarEvent: calendarEvent,
                start        : start,
                end          : end
            };

            $mdDialog.show({
                controller         : 'EventFormDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/pages/calendar/dialogs/event-form/event-form-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : e,
                clickOutsideToClose: true,
                locals             : {
                    dialogData: dialogData
                }
            }).then(function (response)
            {
                if ( response.type === 'add' )
                {
                    // Add new
                    vm.events[0].push({
                        id   : vm.events[0].length + 20,
                        title: response.calendarEvent.title,
                        start: response.calendarEvent.start,
                        end  : response.calendarEvent.end
                    });
                }
                else
                {
                    for ( var i = 0; i < vm.events[0].length; i++ )
                    {
                        // Update
                        if ( vm.events[0][i].id === response.calendarEvent.id )
                        {
                            vm.events[0][i] = {
                                title: response.calendarEvent.title,
                                start: response.calendarEvent.start,
                                end  : response.calendarEvent.end
                            };

                            break;
                        }
                    }
                }
            });
        }

        vm.redirectLogin = function(){
            $state.go('app.pages_auth_login');
        }

    }

})();
(function ()
{
    'use strict';

    angular
        .module('app.core',
            [
                'ngAnimate',
                'ngAria',
                'ngCookies',
                'ngMessages',
                'ngResource',
                'ngSanitize',
                'ngMaterial',
                'angular-chartist',
                'chart.js',
                'datatables',
                'gridshore.c3js.chart',
                'nvd3',
                'pascalprecht.translate',
                'timer',
                'ui.router',
                'uiGmapgoogle-maps',
                'textAngular',
                'ui.sortable',
                'ng-sortable',
                'xeditable',
                'moment-picker'
            ]);
})();
(function ()
{
    'use strict';

    MsWidgetController.$inject = ["$scope", "$element"];
    angular
        .module('app.core')
        .controller('MsWidgetController', MsWidgetController)
        .directive('msWidget', msWidgetDirective)
        .directive('msWidgetFront', msWidgetFrontDirective)
        .directive('msWidgetBack', msWidgetBackDirective);

    /** @ngInject */
    function MsWidgetController($scope, $element)
    {
        var vm = this;

        // Data
        vm.flipped = false;

        // Methods
        vm.flip = flip;

        //////////

        /**
         * Flip the widget
         */
        function flip()
        {
            if ( !isFlippable() )
            {
                return;
            }

            // Toggle flipped status
            vm.flipped = !vm.flipped;

            // Toggle the 'flipped' class
            $element.toggleClass('flipped', vm.flipped);
        }

        /**
         * Check if widget is flippable
         *
         * @returns {boolean}
         */
        function isFlippable()
        {
            return (angular.isDefined($scope.flippable) && $scope.flippable === true);
        }
    }

    /** @ngInject */
    function msWidgetDirective()
    {
        return {
            restrict  : 'E',
            scope     : {
                flippable: '=?'
            },
            controller: 'MsWidgetController',
            transclude: true,
            compile   : function (tElement)
            {
                tElement.addClass('ms-widget');

                return function postLink(scope, iElement, iAttrs, MsWidgetCtrl, transcludeFn)
                {
                    // Custom transclusion
                    transcludeFn(function (clone)
                    {
                        iElement.empty();
                        iElement.append(clone);
                    });

                    //////////
                };
            }
        };
    }

    /** @ngInject */
    function msWidgetFrontDirective()
    {
        return {
            restrict  : 'E',
            require   : '^msWidget',
            transclude: true,
            compile   : function (tElement)
            {
                tElement.addClass('ms-widget-front');

                return function postLink(scope, iElement, iAttrs, MsWidgetCtrl, transcludeFn)
                {
                    // Custom transclusion
                    transcludeFn(function (clone)
                    {
                        iElement.empty();
                        iElement.append(clone);
                    });

                    // Methods
                    scope.flipWidget = MsWidgetCtrl.flip;
                };
            }
        };
    }

    /** @ngInject */
    function msWidgetBackDirective()
    {
        return {
            restrict  : 'E',
            require   : '^msWidget',
            transclude: true,
            compile   : function (tElement)
            {
                tElement.addClass('ms-widget-back');

                return function postLink(scope, iElement, iAttrs, MsWidgetCtrl, transcludeFn)
                {
                    // Custom transclusion
                    transcludeFn(function (clone)
                    {
                        iElement.empty();
                        iElement.append(clone);
                    });

                    // Methods
                    scope.flipWidget = MsWidgetCtrl.flip;
                };
            }
        };
    }

})();
(function ()
{
    'use strict';

    msTimelineItemDirective.$inject = ["$timeout", "$q"];
    angular
        .module('app.core')
        .controller('MsTimelineController', MsTimelineController)
        .directive('msTimeline', msTimelineDirective)
        .directive('msTimelineItem', msTimelineItemDirective);

    /** @ngInject */
    function MsTimelineController()
    {
        var vm = this;

        // Data
        vm.scrollEl = undefined;

        // Methods
        vm.setScrollEl = setScrollEl;
        vm.getScrollEl = getScrollEl;

        //////////

        /**
         * Set scroll element
         *
         * @param scrollEl
         */
        function setScrollEl(scrollEl)
        {
            vm.scrollEl = scrollEl;
        }

        /**
         * Get scroll element
         *
         * @returns {undefined|*}
         */
        function getScrollEl()
        {
            return vm.scrollEl;
        }
    }

    /** @ngInject */
    function msTimelineDirective()
    {
        return {
            scope     : {
                loadMore: '&?msTimelineLoadMore'
            },
            controller: 'MsTimelineController',
            compile   : function (tElement)
            {
                tElement.addClass('ms-timeline');

                return function postLink(scope, iElement, iAttrs, MsTimelineCtrl)
                {
                    // Create an element for triggering the load more action and append it
                    var loadMoreEl = angular.element('<div class="ms-timeline-loader md-accent-bg md-whiteframe-4dp"><span class="spinner animate-rotate"></span></div>');
                    iElement.append(loadMoreEl);

                    // Grab the scrollable element and store it in the controller for general use
                    var scrollEl = angular.element('#content');
                    MsTimelineCtrl.setScrollEl(scrollEl);

                    // Threshold
                    var threshold = 144;

                    // Register onScroll event for the first time
                    registerOnScroll();

                    /**
                     * onScroll Event
                     */
                    function onScroll()
                    {
                        if ( scrollEl.scrollTop() + scrollEl.height() + threshold > loadMoreEl.position().top )
                        {
                            // Show the loader
                            loadMoreEl.addClass('show');

                            // Unregister scroll event to prevent triggering the function over and over again
                            unregisterOnScroll();

                            // Trigger load more event
                            scope.loadMore().then(
                                // Success
                                function ()
                                {
                                    // Hide the loader
                                    loadMoreEl.removeClass('show');

                                    // Register the onScroll event again
                                    registerOnScroll();
                                },

                                // Error
                                function ()
                                {
                                    // Remove the loader completely
                                    loadMoreEl.remove();
                                }
                            );
                        }
                    }

                    /**
                     * onScroll event registerer
                     */
                    function registerOnScroll()
                    {
                        scrollEl.on('scroll', onScroll);
                    }

                    /**
                     * onScroll event unregisterer
                     */
                    function unregisterOnScroll()
                    {
                        scrollEl.off('scroll', onScroll);
                    }

                    // Cleanup
                    scope.$on('$destroy', function ()
                    {
                        unregisterOnScroll();
                    });
                };
            }
        };
    }

    /** @ngInject */
    function msTimelineItemDirective($timeout, $q)
    {
        return {
            scope  : true,
            require: '^msTimeline',
            compile: function (tElement)
            {
                tElement.addClass('ms-timeline-item').addClass('hidden');

                return function postLink(scope, iElement, iAttrs, MsTimelineCtrl)
                {
                    var threshold = 72,
                        itemLoaded = false,
                        itemInViewport = false,
                        scrollEl = MsTimelineCtrl.getScrollEl();

                    //////////

                    init();

                    /**
                     * Initialize
                     */
                    function init()
                    {
                        // Check if the timeline item has ms-card
                        if ( iElement.find('ms-card') )
                        {
                            // If the ms-card template loaded...
                            scope.$on('msCard::cardTemplateLoaded', function (event, args)
                            {
                                var cardEl = angular.element(args[0]);

                                // Test the card to see if there is any image on it
                                testForImage(cardEl).then(function ()
                                {
                                    $timeout(function ()
                                    {
                                        itemLoaded = true;
                                    });
                                });
                            });
                        }
                        else
                        {
                            // Test the element to see if there is any image on it
                            testForImage(iElement).then(function ()
                            {
                                $timeout(function ()
                                {
                                    itemLoaded = true;
                                });
                            });
                        }

                        // Check if the loaded element also in the viewport
                        scrollEl.on('scroll', testForVisibility);

                        // Test for visibility for the first time without waiting for the scroll event
                        testForVisibility();
                    }

                    // Item ready watcher
                    var itemReadyWatcher = scope.$watch(
                        function ()
                        {
                            return itemLoaded && itemInViewport;
                        },
                        function (current, old)
                        {
                            if ( angular.equals(current, old) )
                            {
                                return;
                            }

                            if ( current )
                            {
                                iElement.removeClass('hidden').addClass('animate');

                                // Unbind itemReadyWatcher
                                itemReadyWatcher();
                            }
                        }, true);

                    /**
                     * Test the given element for image
                     *
                     * @param element
                     * @returns promise
                     */
                    function testForImage(element)
                    {
                        var deferred = $q.defer(),
                            imgEl = element.find('img');

                        if ( imgEl.length > 0 )
                        {
                            imgEl.on('load', function ()
                            {
                                deferred.resolve('Image is loaded');
                            });
                        }
                        else
                        {
                            deferred.resolve('No images');
                        }

                        return deferred.promise;
                    }

                    /**
                     * Test the element for visibility
                     */
                    function testForVisibility()
                    {
                        if ( scrollEl.scrollTop() + scrollEl.height() > iElement.position().top + threshold )
                        {
                            $timeout(function ()
                            {
                                itemInViewport = true;
                            });

                            // Unbind the scroll event
                            scrollEl.off('scroll', testForVisibility);
                        }
                    }
                };
            }
        };
    }
})();
(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('msSidenavHelper', msSidenavHelperDirective);

    /** @ngInject */
    function msSidenavHelperDirective()
    {
        return {
            restrict: 'A',
            require : '^mdSidenav',
            link    : function (scope, iElement, iAttrs, MdSidenavCtrl)
            {
                // Watch md-sidenav open & locked open statuses
                // and add class to the ".page-layout" if only
                // the sidenav open and NOT locked open
                scope.$watch(function ()
                {
                    return MdSidenavCtrl.isOpen() && !MdSidenavCtrl.isLockedOpen();
                }, function (current)
                {
                    if ( angular.isUndefined(current) )
                    {
                        return;
                    }

                    iElement.parent().toggleClass('full-height', current);
                    angular.element('html').toggleClass('sidenav-open', current);
                });
            }
        };
    }
})();
(function ()
{
    'use strict';

    msSplashScreenDirective.$inject = ["$animate"];
    angular
        .module('app.core')
        .directive('msSplashScreen', msSplashScreenDirective);

    /** @ngInject */
    function msSplashScreenDirective($animate)
    {
        return {
            restrict: 'E',
            link    : function (scope, iElement)
            {
                var splashScreenRemoveEvent = scope.$on('msSplashScreen::remove', function ()
                {
                    $animate.leave(iElement).then(function ()
                    {
                        // De-register scope event
                        splashScreenRemoveEvent();

                        // Null-ify everything else
                        scope = iElement = null;
                    });
                });
            }
        };
    }
})();
(function ()
{
    'use strict';

    msSearchBarDirective.$inject = ["$document"];
    angular
        .module('app.core')
        .directive('msSearchBar', msSearchBarDirective);

    /** @ngInject */
    function msSearchBarDirective($document)
    {
        return {
            restrict   : 'E',
            scope      : true,
            templateUrl: 'app/core/directives/ms-search-bar/ms-search-bar.html',
            compile    : function (tElement)
            {
                // Add class
                tElement.addClass('ms-search-bar');

                return function postLink(scope, iElement)
                {
                    var expanderEl,
                        collapserEl;

                    // Initialize
                    init();

                    function init()
                    {
                        expanderEl = iElement.find('#ms-search-bar-expander');
                        collapserEl = iElement.find('#ms-search-bar-collapser');

                        expanderEl.on('click', expand);
                        collapserEl.on('click', collapse);
                    }

                    /**
                     * Expand
                     */
                    function expand()
                    {
                        iElement.addClass('expanded');

                        // Esc key event
                        $document.on('keyup', escKeyEvent);
                    }

                    /**
                     * Collapse
                     */
                    function collapse()
                    {
                        iElement.removeClass('expanded');
                    }

                    /**
                     * Escape key event
                     *
                     * @param e
                     */
                    function escKeyEvent(e)
                    {
                        if ( e.keyCode === 27 )
                        {
                            collapse();
                            $document.off('keyup', escKeyEvent);
                        }
                    }
                };
            }
        };
    }
})();
(function ()
{
    'use strict';

    msScrollDirective.$inject = ["$timeout", "msScrollConfig", "msUtils", "fuseConfig"];
    angular
        .module('app.core')
        .provider('msScrollConfig', msScrollConfigProvider)
        .directive('msScroll', msScrollDirective);

    /** @ngInject */
    function msScrollConfigProvider()
    {
        // Default configuration
        var defaultConfiguration = {
            wheelSpeed            : 1,
            wheelPropagation      : false,
            swipePropagation      : true,
            minScrollbarLength    : null,
            maxScrollbarLength    : null,
            useBothWheelAxes      : false,
            useKeyboard           : true,
            suppressScrollX       : false,
            suppressScrollY       : false,
            scrollXMarginOffset   : 0,
            scrollYMarginOffset   : 0,
            stopPropagationOnClick: true
        };

        // Methods
        this.config = config;

        //////////

        /**
         * Extend default configuration with the given one
         *
         * @param configuration
         */
        function config(configuration)
        {
            defaultConfiguration = angular.extend({}, defaultConfiguration, configuration);
        }

        /**
         * Service
         */
        this.$get = function ()
        {
            var service = {
                getConfig: getConfig
            };

            return service;

            //////////

            /**
             * Return the config
             */
            function getConfig()
            {
                return defaultConfiguration;
            }
        };
    }

    /** @ngInject */
    function msScrollDirective($timeout, msScrollConfig, msUtils, fuseConfig)
    {
        return {
            restrict: 'AE',
            compile : function (tElement)
            {
                // Do not replace scrollbars if
                // 'disableCustomScrollbars' config enabled
                if ( fuseConfig.getConfig('disableCustomScrollbars') )
                {
                    return;
                }

                // Do not replace scrollbars on mobile devices
                // if 'disableCustomScrollbarsOnMobile' config enabled
                if ( fuseConfig.getConfig('disableCustomScrollbarsOnMobile') && msUtils.isMobile() )
                {
                    return;
                }

                // Add class
                tElement.addClass('ms-scroll');

                return function postLink(scope, iElement, iAttrs)
                {
                    var options = {};

                    // If options supplied, evaluate the given
                    // value. This is because we don't want to
                    // have an isolated scope but still be able
                    // to use scope variables.
                    // We don't want an isolated scope because
                    // we should be able to use this everywhere
                    // especially with other directives
                    if ( iAttrs.msScroll )
                    {
                        options = scope.$eval(iAttrs.msScroll);
                    }

                    // Extend the given config with the ones from provider
                    options = angular.extend({}, msScrollConfig.getConfig(), options);

                    // Initialize the scrollbar
                    $timeout(function ()
                    {
                        PerfectScrollbar.initialize(iElement[0], options);
                    }, 0);

                    // Update the scrollbar on element mouseenter
                    iElement.on('mouseenter', updateScrollbar);

                    // Watch scrollHeight and update
                    // the scrollbar if it changes
                    scope.$watch(function ()
                    {
                        return iElement.prop('scrollHeight');
                    }, function (current, old)
                    {
                        if ( angular.isUndefined(current) || angular.equals(current, old) )
                        {
                            return;
                        }

                        updateScrollbar();
                    });

                    // Watch scrollWidth and update
                    // the scrollbar if it changes
                    scope.$watch(function ()
                    {
                        return iElement.prop('scrollWidth');
                    }, function (current, old)
                    {
                        if ( angular.isUndefined(current) || angular.equals(current, old) )
                        {
                            return;
                        }

                        updateScrollbar();
                    });

                    /**
                     * Update the scrollbar
                     */
                    function updateScrollbar()
                    {
                        PerfectScrollbar.update(iElement[0]);
                    }

                    // Cleanup on destroy
                    scope.$on('$destroy', function ()
                    {
                        iElement.off('mouseenter');
                        PerfectScrollbar.destroy(iElement[0]);
                    });
                };
            }
        };
    }
})();
(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('msResponsiveTable', msResponsiveTableDirective);

    /** @ngInject */
    function msResponsiveTableDirective()
    {
        return {
            restrict: 'A',
            link    : function (scope, iElement)
            {
                // Wrap the table
                var wrapper = angular.element('<div class="ms-responsive-table-wrapper"></div>');
                iElement.after(wrapper);
                wrapper.append(iElement);

                //////////
            }
        };
    }
})();
(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('msRandomClass', msRandomClassDirective);

    /** @ngInject */
    function msRandomClassDirective()
    {
        return {
            restrict: 'A',
            scope   : {
                msRandomClass: '='
            },
            link    : function (scope, iElement)
            {
                var randomClass = scope.msRandomClass[Math.floor(Math.random() * (scope.msRandomClass.length))];
                iElement.addClass(randomClass);
            }
        };
    }
})();
(function ()
{
    'use strict';

    MsNavigationController.$inject = ["$scope", "msNavigationService"];
    msNavigationDirective.$inject = ["$rootScope", "$timeout", "$mdSidenav", "msNavigationService"];
    MsNavigationNodeController.$inject = ["$scope", "$element", "$rootScope", "$animate", "$state", "msNavigationService"];
    msNavigationHorizontalDirective.$inject = ["msNavigationService"];
    MsNavigationHorizontalNodeController.$inject = ["$scope", "$element", "$rootScope", "$state", "msNavigationService"];
    msNavigationHorizontalItemDirective.$inject = ["$mdMedia"];
    angular
        .module('app.core')
        .provider('msNavigationService', msNavigationServiceProvider)
        .controller('MsNavigationController', MsNavigationController)
        // Vertical
        .directive('msNavigation', msNavigationDirective)
        .controller('MsNavigationNodeController', MsNavigationNodeController)
        .directive('msNavigationNode', msNavigationNodeDirective)
        .directive('msNavigationItem', msNavigationItemDirective)
        //Horizontal
        .directive('msNavigationHorizontal', msNavigationHorizontalDirective)
        .controller('MsNavigationHorizontalNodeController', MsNavigationHorizontalNodeController)
        .directive('msNavigationHorizontalNode', msNavigationHorizontalNodeDirective)
        .directive('msNavigationHorizontalItem', msNavigationHorizontalItemDirective);

    /** @ngInject */
    function msNavigationServiceProvider()
    {
        // Inject $log service
        var $log = angular.injector(['ng']).get('$log');

        // Navigation array
        var navigation = [];

        var service = this;

        // Methods
        service.saveItem = saveItem;
        service.deleteItem = deleteItem;
        service.sortByWeight = sortByWeight;

        //////////

        /**
         * Create or update the navigation item
         *
         * @param path
         * @param item
         */
        function saveItem(path, item)
        {
            if ( !angular.isString(path) )
            {
                $log.error('path must be a string (eg. `dashboard.project`)');
                return;
            }

            var parts = path.split('.');

            // Generate the object id from the parts
            var id = parts[parts.length - 1];

            // Get the parent item from the parts
            var parent = _findOrCreateParent(parts);

            // Decide if we are going to update or create
            var updateItem = false;

            for ( var i = 0; i < parent.length; i++ )
            {
                if ( parent[i]._id === id )
                {
                    updateItem = parent[i];

                    break;
                }
            }

            // Update
            if ( updateItem )
            {
                angular.extend(updateItem, item);

                // Add proper ui-sref
                updateItem.uisref = _getUiSref(updateItem);
            }
            // Create
            else
            {
                // Create an empty children array in the item
                item.children = [];

                // Add the default weight if not provided or if it's not a number
                if ( angular.isUndefined(item.weight) || !angular.isNumber(item.weight) )
                {
                    item.weight = 1;
                }

                // Add the item id
                item._id = id;

                // Add the item path
                item._path = path;

                // Add proper ui-sref
                item.uisref = _getUiSref(item);

                // Push the item into the array
                parent.push(item);
            }
        }

        /**
         * Delete navigation item
         *
         * @param path
         */
        function deleteItem(path)
        {
            if ( !angular.isString(path) )
            {
                $log.error('path must be a string (eg. `dashboard.project`)');
                return;
            }

            // Locate the item by using given path
            var item = navigation,
                parts = path.split('.');

            for ( var p = 0; p < parts.length; p++ )
            {
                var id = parts[p];

                for ( var i = 0; i < item.length; i++ )
                {
                    if ( item[i]._id === id )
                    {
                        // If we have a matching path,
                        // we have found our object:
                        // remove it.
                        if ( item[i]._path === path )
                        {
                            item.splice(i, 1);
                            return true;
                        }

                        // Otherwise grab the children of
                        // the current item and continue
                        item = item[i].children;
                        break;
                    }
                }
            }

            return false;
        }

        /**
         * Sort the navigation items by their weights
         *
         * @param parent
         */
        function sortByWeight(parent)
        {
            // If parent not provided, sort the root items
            if ( !parent )
            {
                parent = navigation;
                parent.sort(_byWeight);
            }

            // Sort the children
            for ( var i = 0; i < parent.length; i++ )
            {
                var children = parent[i].children;

                if ( children.length > 1 )
                {
                    children.sort(_byWeight);
                }

                if ( children.length > 0 )
                {
                    sortByWeight(children);
                }
            }
        }

        /* ----------------- */
        /* Private Functions */
        /* ----------------- */

        /**
         * Find or create parent
         *
         * @param parts
         * @returns {Array|Boolean}
         * @private
         */
        function _findOrCreateParent(parts)
        {
            // Store the main navigation
            var parent = navigation;

            // If it's going to be a root item
            // return the navigation itself
            if ( parts.length === 1 )
            {
                return parent;
            }

            // Remove the last element from the parts as
            // we don't need that to figure out the parent
            parts.pop();

            // Find and return the parent
            for ( var i = 0; i < parts.length; i++ )
            {
                var _id = parts[i],
                    createParent = true;

                for ( var p = 0; p < parent.length; p++ )
                {
                    if ( parent[p]._id === _id )
                    {
                        parent = parent[p].children;
                        createParent = false;

                        break;
                    }
                }

                // If there is no parent found, create one, push
                // it into the current parent and assign it as a
                // new parent
                if ( createParent )
                {
                    var item = {
                        _id     : _id,
                        _path   : parts.join('.'),
                        title   : _id,
                        weight  : 1,
                        children: []
                    };

                    parent.push(item);
                    parent = item.children;
                }
            }

            return parent;
        }

        /**
         * Sort by weight
         *
         * @param x
         * @param y
         * @returns {number}
         * @private
         */
        function _byWeight(x, y)
        {
            return parseInt(x.weight) - parseInt(y.weight);
        }

        /**
         * Setup the ui-sref using state & state parameters
         *
         * @param item
         * @returns {string}
         * @private
         */
        function _getUiSref(item)
        {
            var uisref = '';

            if ( angular.isDefined(item.state) )
            {
                uisref = item.state;

                if ( angular.isDefined(item.stateParams) && angular.isObject(item.stateParams) )
                {
                    uisref = uisref + '(' + angular.toString(item.stateParams) + ')';
                }
            }

            return uisref;
        }

        /* ----------------- */
        /* Service           */
        /* ----------------- */

        this.$get = function ()
        {
            var activeItem = null,
                navigationScope = null,
                folded = null,
                foldedOpen = null;

            var service = {
                saveItem           : saveItem,
                deleteItem         : deleteItem,
                sort               : sortByWeight,
                setActiveItem      : setActiveItem,
                getActiveItem      : getActiveItem,
                getNavigationObject: getNavigationObject,
                setNavigationScope : setNavigationScope,
                setFolded          : setFolded,
                getFolded          : getFolded,
                setFoldedOpen      : setFoldedOpen,
                getFoldedOpen      : getFoldedOpen,
                toggleFolded       : toggleFolded
            };

            return service;

            //////////

            /**
             * Set active item
             *
             * @param node
             * @param scope
             */
            function setActiveItem(node, scope)
            {
                activeItem = {
                    node : node,
                    scope: scope
                };
            }

            /**
             * Return active item
             */
            function getActiveItem()
            {
                return activeItem;
            }

            /**
             * Return navigation object
             *
             * @param root
             * @returns {Array}
             */
            function getNavigationObject(root)
            {
                if ( root )
                {
                    for ( var i = 0; i < navigation.length; i++ )
                    {
                        if ( navigation[i]._id === root )
                        {
                            return [navigation[i]];
                        }
                    }
                }

                return navigation;
            }

            /**
             * Store navigation's scope for later use
             *
             * @param scope
             */
            function setNavigationScope(scope)
            {
                navigationScope = scope;
            }

            /**
             * Set folded status
             *
             * @param status
             */
            function setFolded(status)
            {
                folded = status;
            }

            /**
             * Return folded status
             *
             * @returns {*}
             */
            function getFolded()
            {
                return folded;
            }

            /**
             * Set folded open status
             *
             * @param status
             */
            function setFoldedOpen(status)
            {
                foldedOpen = status;
            }

            /**
             * Return folded open status
             *
             * @returns {*}
             */
            function getFoldedOpen()
            {
                return foldedOpen;
            }


            /**
             * Toggle fold on stored navigation's scope
             */
            function toggleFolded()
            {
                navigationScope.toggleFolded();
            }
        };
    }

    /** @ngInject */
    function MsNavigationController($scope, msNavigationService)
    {
        var vm = this;

        // Data
        if ( $scope.root )
        {
            vm.navigation = msNavigationService.getNavigationObject($scope.root);
        }
        else
        {
            vm.navigation = msNavigationService.getNavigationObject();
        }

        // Methods
        vm.toggleHorizontalMobileMenu = toggleHorizontalMobileMenu;

        //////////

        init();

        /**
         * Initialize
         */
        function init()
        {
            // Sort the navigation before doing anything else
            msNavigationService.sort();
        }

        /**
         * Toggle horizontal mobile menu
         */
        function toggleHorizontalMobileMenu()
        {
            angular.element('body').toggleClass('ms-navigation-horizontal-mobile-menu-active');
        }
    }

    /** @ngInject */
    function msNavigationDirective($rootScope, $timeout, $mdSidenav, msNavigationService)
    {
        return {
            restrict   : 'E',
            scope      : {
                folded: '=',
                root  : '@'
            },
            controller : 'MsNavigationController as vm',
            templateUrl: 'app/core/directives/ms-navigation/templates/vertical.html',
            transclude : true,
            compile    : function (tElement)
            {
                tElement.addClass('ms-navigation');

                return function postLink(scope, iElement)
                {
                    var bodyEl = angular.element('body'),
                        foldExpanderEl = angular.element('<div id="ms-navigation-fold-expander"></div>'),
                        foldCollapserEl = angular.element('<div id="ms-navigation-fold-collapser"></div>'),
                        sidenav = $mdSidenav('navigation');

                    // Store the navigation in the service for public access
                    msNavigationService.setNavigationScope(scope);

                    // Initialize
                    init();

                    /**
                     * Initialize
                     */
                    function init()
                    {
                        // Set the folded status for the first time.
                        // First, we have to check if we have a folded
                        // status available in the service already. This
                        // will prevent navigation to act weird if we already
                        // set the fold status, remove the navigation and
                        // then re-initialize it, which happens if we
                        // change to a view without a navigation and then
                        // come back with history.back() function.

                        // If the service didn't initialize before, set
                        // the folded status from scope, otherwise we
                        // won't touch anything because the folded status
                        // already set in the service...
                        if ( msNavigationService.getFolded() === null )
                        {
                            msNavigationService.setFolded(scope.folded);
                        }

                        if ( msNavigationService.getFolded() )
                        {
                            // Collapse everything.
                            // This must be inside a $timeout because by the
                            // time we call this, the 'msNavigation::collapse'
                            // event listener is not registered yet. $timeout
                            // will ensure that it will be called after it is
                            // registered.
                            $timeout(function ()
                            {
                                $rootScope.$broadcast('msNavigation::collapse');
                            });

                            // Add class to the body
                            bodyEl.addClass('ms-navigation-folded');

                            // Set fold expander
                            setFoldExpander();
                        }
                    }

                    // Sidenav locked open status watcher
                    scope.$watch(function ()
                    {
                        return sidenav.isLockedOpen();
                    }, function (current, old)
                    {
                        if ( angular.isUndefined(current) || angular.equals(current, old) )
                        {
                            return;
                        }

                        var folded = msNavigationService.getFolded();

                        if ( folded )
                        {
                            if ( current )
                            {
                                // Collapse everything
                                $rootScope.$broadcast('msNavigation::collapse');
                            }
                            else
                            {
                                // Expand the active one and its parents
                                var activeItem = msNavigationService.getActiveItem();
                                if ( activeItem )
                                {
                                    activeItem.scope.$emit('msNavigation::stateMatched');
                                }
                            }
                        }
                    });

                    // Folded status watcher
                    scope.$watch('folded', function (current, old)
                    {
                        if ( angular.isUndefined(current) || angular.equals(current, old) )
                        {
                            return;
                        }

                        setFolded(current);
                    });

                    /**
                     * Set folded status
                     *
                     * @param folded
                     */
                    function setFolded(folded)
                    {
                        // Store folded status on the service for global access
                        msNavigationService.setFolded(folded);

                        if ( folded )
                        {
                            // Collapse everything
                            $rootScope.$broadcast('msNavigation::collapse');

                            // Add class to the body
                            bodyEl.addClass('ms-navigation-folded');

                            // Set fold expander
                            setFoldExpander();
                        }
                        else
                        {
                            // Expand the active one and its parents
                            var activeItem = msNavigationService.getActiveItem();
                            if ( activeItem )
                            {
                                activeItem.scope.$emit('msNavigation::stateMatched');
                            }

                            // Remove body class
                            bodyEl.removeClass('ms-navigation-folded ms-navigation-folded-open');

                            // Remove fold collapser
                            removeFoldCollapser();
                        }
                    }

                    /**
                     * Set fold expander
                     */
                    function setFoldExpander()
                    {
                        iElement.parent().append(foldExpanderEl);

                        // Let everything settle for a moment
                        // before registering the event listener
                        $timeout(function ()
                        {
                            foldExpanderEl.on('mouseenter touchstart', onFoldExpanderHover);
                        });
                    }

                    /**
                     * Set fold collapser
                     */
                    function setFoldCollapser()
                    {
                        bodyEl.find('#main').append(foldCollapserEl);
                        foldCollapserEl.on('mouseenter touchstart', onFoldCollapserHover);
                    }

                    /**
                     * Remove fold collapser
                     */
                    function removeFoldCollapser()
                    {
                        foldCollapserEl.remove();
                    }

                    /**
                     * onHover event of foldExpander
                     */
                    function onFoldExpanderHover(event)
                    {
                        if ( event )
                        {
                            event.preventDefault();
                        }

                        // Set folded open status
                        msNavigationService.setFoldedOpen(true);

                        // Expand the active one and its parents
                        var activeItem = msNavigationService.getActiveItem();
                        if ( activeItem )
                        {
                            activeItem.scope.$emit('msNavigation::stateMatched');
                        }

                        // Add class to the body
                        bodyEl.addClass('ms-navigation-folded-open');

                        // Remove the fold opener
                        foldExpanderEl.remove();

                        // Set fold collapser
                        setFoldCollapser();
                    }

                    /**
                     * onHover event of foldCollapser
                     */
                    function onFoldCollapserHover(event)
                    {
                        if ( event )
                        {
                            event.preventDefault();
                        }

                        // Set folded open status
                        msNavigationService.setFoldedOpen(false);

                        // Collapse everything
                        $rootScope.$broadcast('msNavigation::collapse');

                        // Remove body class
                        bodyEl.removeClass('ms-navigation-folded-open');

                        // Remove the fold collapser
                        foldCollapserEl.remove();

                        // Set fold expander
                        setFoldExpander();
                    }

                    /**
                     * Public access for toggling folded status externally
                     */
                    scope.toggleFolded = function ()
                    {
                        var folded = msNavigationService.getFolded();

                        setFolded(!folded);
                    };

                    /**
                     * On $stateChangeStart
                     */
                    scope.$on('$stateChangeStart', function ()
                    {
                        // Close the sidenav
                        sidenav.close();

                        // If navigation is folded open, close it
                        if ( msNavigationService.getFolded() )
                        {
                            onFoldCollapserHover();
                        }
                    });

                    // Cleanup
                    scope.$on('$destroy', function ()
                    {
                        foldCollapserEl.off('mouseenter touchstart');
                        foldExpanderEl.off('mouseenter touchstart');
                    });
                };
            }
        };
    }

    /** @ngInject */
    function MsNavigationNodeController($scope, $element, $rootScope, $animate, $state, msNavigationService)
    {
        var vm = this;

        // Data
        vm.element = $element;
        vm.node = $scope.node;
        vm.hasChildren = undefined;
        vm.collapsed = undefined;
        vm.collapsable = undefined;
        vm.group = undefined;
        vm.animateHeightClass = 'animate-height';

        // Methods
        vm.toggleCollapsed = toggleCollapsed;
        vm.collapse = collapse;
        vm.expand = expand;
        vm.getClass = getClass;

        //////////

        init();

        /**
         * Initialize
         */
        function init()
        {
            // Setup the initial values

            // Has children?
            vm.hasChildren = vm.node.children.length > 0;

            // Is group?
            vm.group = !!(angular.isDefined(vm.node.group) && vm.node.group === true);

            // Is collapsable?
            if ( !vm.hasChildren || vm.group )
            {
                vm.collapsable = false;
            }
            else
            {
                vm.collapsable = !!(angular.isUndefined(vm.node.collapsable) || typeof vm.node.collapsable !== 'boolean' || vm.node.collapsable === true);
            }

            // Is collapsed?
            if ( !vm.collapsable )
            {
                vm.collapsed = false;
            }
            else
            {
                vm.collapsed = !!(angular.isUndefined(vm.node.collapsed) || typeof vm.node.collapsed !== 'boolean' || vm.node.collapsed === true);
            }

            // Expand all parents if we have a matching state or
            // the current state is a child of the node's state
            if ( vm.node.state === $state.current.name || $state.includes(vm.node.state) )
            {
                // If state params are defined, make sure they are
                // equal, otherwise do not set the active item
                if ( angular.isDefined(vm.node.stateParams) && angular.isDefined($state.params) && !angular.equals(vm.node.stateParams, $state.params) )
                {
                    return;
                }

                $scope.$emit('msNavigation::stateMatched');

                // Also store the current active menu item
                msNavigationService.setActiveItem(vm.node, $scope);
            }

            $scope.$on('msNavigation::stateMatched', function ()
            {
                // Expand if the current scope is collapsable and is collapsed
                if ( vm.collapsable && vm.collapsed )
                {
                    $scope.$evalAsync(function ()
                    {
                        vm.collapsed = false;
                    });
                }
            });

            // Listen for collapse event
            $scope.$on('msNavigation::collapse', function (event, path)
            {
                if ( vm.collapsed || !vm.collapsable )
                {
                    return;
                }

                // If there is no path defined, collapse
                if ( angular.isUndefined(path) )
                {
                    vm.collapse();
                }
                // If there is a path defined, do not collapse
                // the items that are inside that path. This will
                // prevent parent items from collapsing
                else
                {
                    var givenPathParts = path.split('.'),
                        activePathParts = [];

                    var activeItem = msNavigationService.getActiveItem();
                    if ( activeItem )
                    {
                        activePathParts = activeItem.node._path.split('.');
                    }

                    // Test for given path
                    if ( givenPathParts.indexOf(vm.node._id) > -1 )
                    {
                        return;
                    }

                    // Test for active path
                    if ( activePathParts.indexOf(vm.node._id) > -1 )
                    {
                        return;
                    }

                    vm.collapse();
                }
            });

            // Listen for $stateChangeSuccess event
            $scope.$on('$stateChangeSuccess', function ()
            {
                if ( vm.node.state === $state.current.name )
                {
                    // If state params are defined, make sure they are
                    // equal, otherwise do not set the active item
                    if ( angular.isDefined(vm.node.stateParams) && angular.isDefined($state.params) && !angular.equals(vm.node.stateParams, $state.params) )
                    {
                        return;
                    }

                    // Update active item on state change
                    msNavigationService.setActiveItem(vm.node, $scope);

                    // Collapse everything except the one we're using
                    $rootScope.$broadcast('msNavigation::collapse', vm.node._path);
                }
            });
        }

        /**
         * Toggle collapsed
         */
        function toggleCollapsed()
        {
            if ( vm.collapsed )
            {
                vm.expand();
            }
            else
            {
                vm.collapse();
            }
        }

        /**
         * Collapse
         */
        function collapse()
        {
            // Grab the element that we are going to collapse
            var collapseEl = vm.element.children('ul');

            // Grab the height
            var height = collapseEl[0].offsetHeight;

            $scope.$evalAsync(function ()
            {
                // Set collapsed status
                vm.collapsed = true;

                // Add collapsing class to the node
                vm.element.addClass('collapsing');

                // Animate the height
                $animate.animate(collapseEl,
                    {
                        'display': 'block',
                        'height' : height + 'px'
                    },
                    {
                        'height': '0px'
                    },
                    vm.animateHeightClass
                ).then(
                    function ()
                    {
                        // Clear the inline styles after animation done
                        collapseEl.css({
                            'display': '',
                            'height' : ''
                        });

                        // Clear collapsing class from the node
                        vm.element.removeClass('collapsing');
                    }
                );

                // Broadcast the collapse event so child items can also be collapsed
                $scope.$broadcast('msNavigation::collapse');
            });
        }

        /**
         * Expand
         */
        function expand()
        {
            // Grab the element that we are going to expand
            var expandEl = vm.element.children('ul');

            // Move the element out of the dom flow and
            // make it block so we can get its height
            expandEl.css({
                'position'  : 'absolute',
                'visibility': 'hidden',
                'display'   : 'block',
                'height'    : 'auto'
            });

            // Grab the height
            var height = expandEl[0].offsetHeight;

            // Reset the style modifications
            expandEl.css({
                'position'  : '',
                'visibility': '',
                'display'   : '',
                'height'    : ''
            });

            $scope.$evalAsync(function ()
            {
                // Set collapsed status
                vm.collapsed = false;

                // Add expanding class to the node
                vm.element.addClass('expanding');

                // Animate the height
                $animate.animate(expandEl,
                    {
                        'display': 'block',
                        'height' : '0px'
                    },
                    {
                        'height': height + 'px'
                    },
                    vm.animateHeightClass
                ).then(
                    function ()
                    {
                        // Clear the inline styles after animation done
                        expandEl.css({
                            'height': ''
                        });

                        // Clear expanding class from the node
                        vm.element.removeClass('expanding');
                    }
                );

                // If item expanded, broadcast the collapse event from rootScope so that the other expanded items
                // can be collapsed. This is necessary for keeping only one parent expanded at any time
                $rootScope.$broadcast('msNavigation::collapse', vm.node._path);
            });
        }

        /**
         * Return the class
         *
         * @returns {*}
         */
        function getClass()
        {
            return vm.node.class;
        }
    }

    /** @ngInject */
    function msNavigationNodeDirective()
    {
        return {
            restrict        : 'A',
            bindToController: {
                node: '=msNavigationNode'
            },
            controller      : 'MsNavigationNodeController as vm',
            compile         : function (tElement)
            {
                tElement.addClass('ms-navigation-node');

                return function postLink(scope, iElement, iAttrs, MsNavigationNodeCtrl)
                {
                    // Add custom classes
                    iElement.addClass(MsNavigationNodeCtrl.getClass());

                    // Add group class if it's a group
                    if ( MsNavigationNodeCtrl.group )
                    {
                        iElement.addClass('group');
                    }
                };
            }
        };
    }

    /** @ngInject */
    function msNavigationItemDirective()
    {
        return {
            restrict: 'A',
            require : '^msNavigationNode',
            compile : function (tElement)
            {
                tElement.addClass('ms-navigation-item');

                return function postLink(scope, iElement, iAttrs, MsNavigationNodeCtrl)
                {
                    // If the item is collapsable...
                    if ( MsNavigationNodeCtrl.collapsable )
                    {
                        iElement.on('click', MsNavigationNodeCtrl.toggleCollapsed);
                    }

                    // Cleanup
                    scope.$on('$destroy', function ()
                    {
                        iElement.off('click');
                    });
                };
            }
        };
    }

    /** @ngInject */
    function msNavigationHorizontalDirective(msNavigationService)
    {
        return {
            restrict   : 'E',
            scope      : {
                root: '@'
            },
            controller : 'MsNavigationController as vm',
            templateUrl: 'app/core/directives/ms-navigation/templates/horizontal.html',
            transclude : true,
            compile    : function (tElement)
            {
                tElement.addClass('ms-navigation-horizontal');

                return function postLink(scope)
                {
                    // Store the navigation in the service for public access
                    msNavigationService.setNavigationScope(scope);
                };
            }
        };
    }

    /** @ngInject */
    function MsNavigationHorizontalNodeController($scope, $element, $rootScope, $state, msNavigationService)
    {
        var vm = this;

        // Data
        vm.element = $element;
        vm.node = $scope.node;
        vm.hasChildren = undefined;
        vm.group = undefined;

        // Methods
        vm.getClass = getClass;

        //////////

        init();

        /**
         * Initialize
         */
        function init()
        {
            // Setup the initial values

            // Is active
            vm.isActive = false;

            // Has children?
            vm.hasChildren = vm.node.children.length > 0;

            // Is group?
            vm.group = !!(angular.isDefined(vm.node.group) && vm.node.group === true);

            // Mark all parents as active if we have a matching state
            // or the current state is a child of the node's state
            if ( vm.node.state === $state.current.name || $state.includes(vm.node.state) )
            {
                // If state params are defined, make sure they are
                // equal, otherwise do not set the active item
                if ( angular.isDefined(vm.node.stateParams) && angular.isDefined($state.params) && !angular.equals(vm.node.stateParams, $state.params) )
                {
                    return;
                }

                $scope.$emit('msNavigation::stateMatched');

                // Also store the current active menu item
                msNavigationService.setActiveItem(vm.node, $scope);
            }

            $scope.$on('msNavigation::stateMatched', function ()
            {
                // Mark as active if has children
                if ( vm.hasChildren )
                {
                    $scope.$evalAsync(function ()
                    {
                        vm.isActive = true;
                    });
                }
            });

            // Listen for clearActive event
            $scope.$on('msNavigation::clearActive', function ()
            {
                if ( !vm.hasChildren )
                {
                    return;
                }

                var activePathParts = [];

                var activeItem = msNavigationService.getActiveItem();
                if ( activeItem )
                {
                    activePathParts = activeItem.node._path.split('.');
                }

                // Test for active path
                if ( activePathParts.indexOf(vm.node._id) > -1 )
                {
                    $scope.$evalAsync(function ()
                    {
                        vm.isActive = true;
                    });
                }
                else
                {
                    $scope.$evalAsync(function ()
                    {
                        vm.isActive = false;
                    });
                }

            });

            // Listen for $stateChangeSuccess event
            $scope.$on('$stateChangeSuccess', function ()
            {
                if ( vm.node.state === $state.current.name )
                {
                    // If state params are defined, make sure they are
                    // equal, otherwise do not set the active item
                    if ( angular.isDefined(vm.node.stateParams) && angular.isDefined($state.params) && !angular.equals(vm.node.stateParams, $state.params) )
                    {
                        return;
                    }

                    // Update active item on state change
                    msNavigationService.setActiveItem(vm.node, $scope);

                    // Clear all active states everything except the one we're using
                    $rootScope.$broadcast('msNavigation::clearActive');
                }
            });
        }

        /**
         * Return the class
         *
         * @returns {*}
         */
        function getClass()
        {
            return vm.node.class;
        }
    }

    /** @ngInject */
    function msNavigationHorizontalNodeDirective()
    {
        return {
            restrict        : 'A',
            bindToController: {
                node: '=msNavigationHorizontalNode'
            },
            controller      : 'MsNavigationHorizontalNodeController as vm',
            compile         : function (tElement)
            {
                tElement.addClass('ms-navigation-horizontal-node');

                return function postLink(scope, iElement, iAttrs, MsNavigationHorizontalNodeCtrl)
                {
                    // Add custom classes
                    iElement.addClass(MsNavigationHorizontalNodeCtrl.getClass());

                    // Add group class if it's a group
                    if ( MsNavigationHorizontalNodeCtrl.group )
                    {
                        iElement.addClass('group');
                    }
                };
            }
        };
    }

    /** @ngInject */
    function msNavigationHorizontalItemDirective($mdMedia)
    {
        return {
            restrict: 'A',
            require : '^msNavigationHorizontalNode',
            compile : function (tElement)
            {
                tElement.addClass('ms-navigation-horizontal-item');

                return function postLink(scope, iElement, iAttrs, MsNavigationHorizontalNodeCtrl)
                {
                    iElement.on('click', onClick);

                    function onClick()
                    {
                        if ( !MsNavigationHorizontalNodeCtrl.hasChildren || $mdMedia('gt-md') )
                        {
                            return;
                        }

                        iElement.toggleClass('expanded');
                    }

                    // Cleanup
                    scope.$on('$destroy', function ()
                    {
                        iElement.off('click');
                    });
                };
            }
        };
    }

})();
(function ()
{
    'use strict';

    msNavIsFoldedDirective.$inject = ["$document", "$rootScope", "msNavFoldService"];
    msNavDirective.$inject = ["$rootScope", "$mdComponentRegistry", "msNavFoldService"];
    msNavToggleDirective.$inject = ["$rootScope", "$q", "$animate", "$state"];
    angular
        .module('app.core')
        .factory('msNavFoldService', msNavFoldService)
        .directive('msNavIsFolded', msNavIsFoldedDirective)
        .controller('MsNavController', MsNavController)
        .directive('msNav', msNavDirective)
        .directive('msNavTitle', msNavTitleDirective)
        .directive('msNavButton', msNavButtonDirective)
        .directive('msNavToggle', msNavToggleDirective);

    /** @ngInject */
    function msNavFoldService()
    {
        var foldable = {};

        var service = {
            setFoldable    : setFoldable,
            isNavFoldedOpen: isNavFoldedOpen,
            toggleFold     : toggleFold,
            openFolded     : openFolded,
            closeFolded    : closeFolded
        };

        return service;

        //////////

        /**
         * Set the foldable
         *
         * @param scope
         * @param element
         */
        function setFoldable(scope, element)
        {
            foldable = {
                'scope'  : scope,
                'element': element
            };
        }

        /**
         * Is folded open
         */
        function isNavFoldedOpen()
        {
            return foldable.scope.isNavFoldedOpen();
        }

        /**
         * Toggle fold
         */
        function toggleFold()
        {
            foldable.scope.toggleFold();
        }

        /**
         * Open folded navigation
         */
        function openFolded()
        {
            foldable.scope.openFolded();
        }

        /**
         * Close folded navigation
         */
        function closeFolded()
        {
            foldable.scope.closeFolded();
        }
    }

    /** @ngInject */
    function msNavIsFoldedDirective($document, $rootScope, msNavFoldService)
    {
        return {
            restrict: 'A',
            link    : function (scope, iElement, iAttrs)
            {
                var isFolded = (iAttrs.msNavIsFolded === 'true'),
                    isFoldedOpen = false,
                    body = angular.element($document[0].body),
                    openOverlay = angular.element('<div id="ms-nav-fold-open-overlay"></div>'),
                    closeOverlay = angular.element('<div id="ms-nav-fold-close-overlay"></div>'),
                    sidenavEl = iElement.parent();

                // Initialize the service
                msNavFoldService.setFoldable(scope, iElement, isFolded);

                // Set the fold status for the first time
                if ( isFolded )
                {
                    fold();
                }
                else
                {
                    unfold();
                }

                /**
                 * Is nav folded open
                 */
                function isNavFoldedOpen()
                {
                    return isFoldedOpen;
                }

                /**
                 * Toggle fold
                 */
                function toggleFold()
                {
                    isFolded = !isFolded;

                    if ( isFolded )
                    {
                        fold();
                    }
                    else
                    {
                        unfold();
                    }
                }

                /**
                 * Fold the navigation
                 */
                function fold()
                {
                    // Add classes
                    body.addClass('ms-nav-folded');

                    // Collapse everything and scroll to the top
                    $rootScope.$broadcast('msNav::forceCollapse');
                    iElement.scrollTop(0);

                    // Append the openOverlay to the element
                    sidenavEl.append(openOverlay);

                    // Event listeners
                    openOverlay.on('mouseenter touchstart', function (event)
                    {
                        openFolded(event);
                        isFoldedOpen = true;
                    });
                }

                /**
                 * Open folded navigation
                 */
                function openFolded(event)
                {
                    if ( angular.isDefined(event) )
                    {
                        event.preventDefault();
                    }

                    body.addClass('ms-nav-folded-open');

                    // Update the location
                    $rootScope.$broadcast('msNav::expandMatchingToggles');

                    // Remove open overlay
                    sidenavEl.find(openOverlay).remove();

                    // Append close overlay and bind its events
                    sidenavEl.parent().append(closeOverlay);
                    closeOverlay.on('mouseenter touchstart', function (event)
                    {
                        closeFolded(event);
                        isFoldedOpen = false;
                    });
                }

                /**
                 * Close folded navigation
                 */
                function closeFolded(event)
                {
                    if ( angular.isDefined(event) )
                    {
                        event.preventDefault();
                    }

                    // Collapse everything and scroll to the top
                    $rootScope.$broadcast('msNav::forceCollapse');
                    iElement.scrollTop(0);

                    body.removeClass('ms-nav-folded-open');

                    // Remove close overlay
                    sidenavEl.parent().find(closeOverlay).remove();

                    // Append open overlay and bind its events
                    sidenavEl.append(openOverlay);
                    openOverlay.on('mouseenter touchstart', function (event)
                    {
                        openFolded(event);
                        isFoldedOpen = true;
                    });
                }

                /**
                 * Unfold the navigation
                 */
                function unfold()
                {
                    body.removeClass('ms-nav-folded ms-nav-folded-open');

                    // Update the location
                    $rootScope.$broadcast('msNav::expandMatchingToggles');

                    iElement.off('mouseenter mouseleave');
                }

                // Expose functions to the scope
                scope.toggleFold = toggleFold;
                scope.openFolded = openFolded;
                scope.closeFolded = closeFolded;
                scope.isNavFoldedOpen = isNavFoldedOpen;

                // Cleanup
                scope.$on('$destroy', function ()
                {
                    openOverlay.off('mouseenter touchstart');
                    closeOverlay.off('mouseenter touchstart');
                    iElement.off('mouseenter mouseleave');
                });
            }
        };
    }


    /** @ngInject */
    function MsNavController()
    {
        var vm = this,
            disabled = false,
            toggleItems = [],
            lockedItems = [];

        // Data

        // Methods
        vm.isDisabled = isDisabled;
        vm.enable = enable;
        vm.disable = disable;
        vm.setToggleItem = setToggleItem;
        vm.getLockedItems = getLockedItems;
        vm.setLockedItem = setLockedItem;
        vm.clearLockedItems = clearLockedItems;

        //////////

        /**
         * Is navigation disabled
         *
         * @returns {boolean}
         */
        function isDisabled()
        {
            return disabled;
        }

        /**
         * Disable the navigation
         */
        function disable()
        {
            disabled = true;
        }

        /**
         * Enable the navigation
         */
        function enable()
        {
            disabled = false;
        }

        /**
         * Set toggle item
         *
         * @param element
         * @param scope
         */
        function setToggleItem(element, scope)
        {
            toggleItems.push({
                'element': element,
                'scope'  : scope
            });
        }

        /**
         * Get locked items
         *
         * @returns {Array}
         */
        function getLockedItems()
        {
            return lockedItems;
        }

        /**
         * Set locked item
         *
         * @param element
         * @param scope
         */
        function setLockedItem(element, scope)
        {
            lockedItems.push({
                'element': element,
                'scope'  : scope
            });
        }

        /**
         * Clear locked items list
         */
        function clearLockedItems()
        {
            lockedItems = [];
        }
    }

    /** @ngInject */
    function msNavDirective($rootScope, $mdComponentRegistry, msNavFoldService)
    {
        return {
            restrict  : 'E',
            scope     : {},
            controller: 'MsNavController',
            compile   : function (tElement)
            {
                tElement.addClass('ms-nav');

                return function postLink(scope)
                {
                    // Update toggle status according to the ui-router current state
                    $rootScope.$broadcast('msNav::expandMatchingToggles');

                    // Update toggles on state changes
                    var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function ()
                    {
                        $rootScope.$broadcast('msNav::expandMatchingToggles');

                        // Close navigation sidenav on stateChangeSuccess
                        $mdComponentRegistry.when('navigation').then(function (navigation)
                        {
                            navigation.close();

                            if ( msNavFoldService.isNavFoldedOpen() )
                            {
                                msNavFoldService.closeFolded();
                            }
                        });
                    });

                    // Cleanup
                    scope.$on('$destroy', function ()
                    {
                        stateChangeSuccessEvent();
                    })
                };
            }
        };
    }

    /** @ngInject */
    function msNavTitleDirective()
    {
        return {
            restrict: 'A',
            compile : function (tElement)
            {
                tElement.addClass('ms-nav-title');

                return function postLink()
                {

                };
            }
        };
    }

    /** @ngInject */
    function msNavButtonDirective()
    {
        return {
            restrict: 'AE',
            compile : function (tElement)
            {
                tElement.addClass('ms-nav-button');

                return function postLink()
                {

                };
            }
        };
    }

    /** @ngInject */
    function msNavToggleDirective($rootScope, $q, $animate, $state)
    {
        return {
            restrict: 'A',
            require : '^msNav',
            scope   : true,
            compile : function (tElement, tAttrs)
            {
                tElement.addClass('ms-nav-toggle');

                // Add collapsed attr
                if ( angular.isUndefined(tAttrs.collapsed) )
                {
                    tAttrs.collapsed = true;
                }

                tElement.attr('collapsed', tAttrs.collapsed);

                return function postLink(scope, iElement, iAttrs, MsNavCtrl)
                {
                    var classes = {
                        expanded         : 'expanded',
                        expandAnimation  : 'expand-animation',
                        collapseAnimation: 'collapse-animation'
                    };

                    // Store all related states
                    var links = iElement.find('a');
                    var states = [];
                    var regExp = /\(.*\)/g;

                    angular.forEach(links, function (link)
                    {
                        var state = angular.element(link).attr('ui-sref');

                        if ( angular.isUndefined(state) )
                        {
                            return;
                        }

                        // Remove any parameter definition from the state name before storing it
                        state = state.replace(regExp, '');

                        states.push(state);
                    });

                    // Store toggle-able element and its scope in the main nav controller
                    MsNavCtrl.setToggleItem(iElement, scope);

                    // Click handler
                    iElement.children('.ms-nav-button').on('click', toggle);

                    // Toggle function
                    function toggle()
                    {
                        // If navigation is disabled, do nothing...
                        if ( MsNavCtrl.isDisabled() )
                        {
                            return;
                        }

                        // Disable the entire navigation to prevent spamming
                        MsNavCtrl.disable();

                        if ( isCollapsed() )
                        {
                            // Clear the locked items list
                            MsNavCtrl.clearLockedItems();

                            // Emit pushToLockedList event
                            scope.$emit('msNav::pushToLockedList');

                            // Collapse everything but locked items
                            $rootScope.$broadcast('msNav::collapse');

                            // Expand and then...
                            expand().then(function ()
                            {
                                // Enable the entire navigation after animations completed
                                MsNavCtrl.enable();
                            });
                        }
                        else
                        {
                            // Collapse with all children
                            scope.$broadcast('msNav::forceCollapse');
                        }
                    }

                    // Cleanup
                    scope.$on('$destroy', function ()
                    {
                        iElement.children('.ms-nav-button').off('click');
                    });

                    /*---------------------*/
                    /* Scope Events        */
                    /*---------------------*/

                    /**
                     * Collapse everything but locked items
                     */
                    scope.$on('msNav::collapse', function ()
                    {
                        // Only collapse toggles that are not locked
                        var lockedItems = MsNavCtrl.getLockedItems();
                        var locked = false;

                        angular.forEach(lockedItems, function (lockedItem)
                        {
                            if ( angular.equals(lockedItem.scope, scope) )
                            {
                                locked = true;
                            }
                        });

                        if ( locked )
                        {
                            return;
                        }

                        // Collapse and then...
                        collapse().then(function ()
                        {
                            // Enable the entire navigation after animations completed
                            MsNavCtrl.enable();
                        });
                    });

                    /**
                     * Collapse everything
                     */
                    scope.$on('msNav::forceCollapse', function ()
                    {
                        // Collapse and then...
                        collapse().then(function ()
                        {
                            // Enable the entire navigation after animations completed
                            MsNavCtrl.enable();
                        });
                    });

                    /**
                     * Expand toggles that match with the current states
                     */
                    scope.$on('msNav::expandMatchingToggles', function ()
                    {
                        var currentState = $state.current.name;
                        var shouldExpand = false;

                        angular.forEach(states, function (state)
                        {
                            if ( currentState === state )
                            {
                                shouldExpand = true;
                            }
                        });

                        if ( shouldExpand )
                        {
                            expand();
                        }
                        else
                        {
                            collapse();
                        }
                    });

                    /**
                     * Add toggle to the locked list
                     */
                    scope.$on('msNav::pushToLockedList', function ()
                    {
                        // Set expanded item on main nav controller
                        MsNavCtrl.setLockedItem(iElement, scope);
                    });

                    /*---------------------*/
                    /* Internal functions  */
                    /*---------------------*/

                    /**
                     * Is element collapsed
                     *
                     * @returns {bool}
                     */
                    function isCollapsed()
                    {
                        return iElement.attr('collapsed') === 'true';
                    }

                    /**
                     * Is element expanded
                     *
                     * @returns {bool}
                     */
                    function isExpanded()
                    {
                        return !isCollapsed();
                    }

                    /**
                     * Expand the toggle
                     *
                     * @returns $promise
                     */
                    function expand()
                    {
                        // Create a new deferred object
                        var deferred = $q.defer();

                        // If the menu item is already expanded, do nothing..
                        if ( isExpanded() )
                        {
                            // Reject the deferred object
                            deferred.reject({'error': true});

                            // Return the promise
                            return deferred.promise;
                        }

                        // Set element attr
                        iElement.attr('collapsed', false);

                        // Grab the element to expand
                        var elementToExpand = angular.element(iElement.find('ms-nav-toggle-items')[0]);

                        // Move the element out of the dom flow and
                        // make it block so we can get its height
                        elementToExpand.css({
                            'position'  : 'absolute',
                            'visibility': 'hidden',
                            'display'   : 'block',
                            'height'    : 'auto'
                        });

                        // Grab the height
                        var height = elementToExpand[0].offsetHeight;

                        // Reset the style modifications
                        elementToExpand.css({
                            'position'  : '',
                            'visibility': '',
                            'display'   : '',
                            'height'    : ''
                        });

                        // Animate the height
                        scope.$evalAsync(function ()
                        {
                            $animate.animate(elementToExpand,
                                {
                                    'display': 'block',
                                    'height' : '0px'
                                },
                                {
                                    'height': height + 'px'
                                },
                                classes.expandAnimation
                            ).then(
                                function ()
                                {
                                    // Add expanded class
                                    elementToExpand.addClass(classes.expanded);

                                    // Clear the inline styles after animation done
                                    elementToExpand.css({'height': ''});

                                    // Resolve the deferred object
                                    deferred.resolve({'success': true});
                                }
                            );
                        });

                        // Return the promise
                        return deferred.promise;
                    }

                    /**
                     * Collapse the toggle
                     *
                     * @returns $promise
                     */
                    function collapse()
                    {
                        // Create a new deferred object
                        var deferred = $q.defer();

                        // If the menu item is already collapsed, do nothing..
                        if ( isCollapsed() )
                        {
                            // Reject the deferred object
                            deferred.reject({'error': true});

                            // Return the promise
                            return deferred.promise;
                        }

                        // Set element attr
                        iElement.attr('collapsed', true);

                        // Grab the element to collapse
                        var elementToCollapse = angular.element(iElement.find('ms-nav-toggle-items')[0]);

                        // Grab the height
                        var height = elementToCollapse[0].offsetHeight;

                        // Animate the height
                        scope.$evalAsync(function ()
                        {
                            $animate.animate(elementToCollapse,
                                {
                                    'height': height + 'px'
                                },
                                {
                                    'height': '0px'
                                },
                                classes.collapseAnimation
                            ).then(
                                function ()
                                {
                                    // Remove expanded class
                                    elementToCollapse.removeClass(classes.expanded);

                                    // Clear the inline styles after animation done
                                    elementToCollapse.css({
                                        'display': '',
                                        'height' : ''
                                    });

                                    // Resolve the deferred object
                                    deferred.resolve({'success': true});
                                }
                            );
                        });

                        // Return the promise
                        return deferred.promise;
                    }
                };
            }
        };
    }
})();
(function ()
{
    'use strict';

    angular
        .module('app.core')
        .controller('MsFormWizardController', MsFormWizardController)
        .directive('msFormWizard', msFormWizardDirective)
        .directive('msFormWizardForm', msFormWizardFormDirective);

    /** @ngInject */
    function MsFormWizardController()
    {
        var vm = this;

        // Data
        vm.forms = [];
        vm.selectedIndex = 0;

        // Methods
        vm.registerForm = registerForm;

        vm.previousStep = previousStep;
        vm.nextStep = nextStep;
        vm.isFirstStep = isFirstStep;
        vm.isLastStep = isLastStep;

        vm.currentStepInvalid = currentStepInvalid;
        vm.formsIncomplete = formsIncomplete;
        vm.resetForm = resetForm;

        //////////

        /**
         * Register form
         *
         * @param form
         */
        function registerForm(form)
        {
            vm.forms.push(form);
        }

        /**
         * Go to previous step
         */
        function previousStep()
        {
            vm.selectedIndex--;
        }

        /**
         * Go to next step
         */
        function nextStep()
        {
            vm.selectedIndex++;
        }

        /**
         * Is first step?
         *
         * @returns {boolean}
         */
        function isFirstStep()
        {
            return vm.selectedIndex === 0;
        }

        /**
         * Is last step?
         *
         * @returns {boolean}
         */
        function isLastStep()
        {
            return vm.selectedIndex === vm.forms.length - 1;
        }

        /**
         * Is current step invalid?
         *
         * @returns {boolean|*}
         */
        function currentStepInvalid()
        {
            return angular.isDefined(vm.forms[vm.selectedIndex]) && vm.forms[vm.selectedIndex].$invalid;
        }

        /**
         * Check if there is any incomplete forms
         *
         * @returns {boolean}
         */
        function formsIncomplete()
        {
            for ( var x = 0; x < vm.forms.length; x++ )
            {
                if ( vm.forms[x].$invalid )
                {
                    return true;
                }
            }

            return false;
        }

        /**
         * Reset form
         */
        function resetForm()
        {
            // Go back to first step
            vm.selectedIndex = 0;

            // Make sure all the forms are back in the $pristine & $untouched status
            for ( var x = 0; x < vm.forms.length; x++ )
            {
                vm.forms[x].$setPristine();
                vm.forms[x].$setUntouched();
            }
        }
    }

    /** @ngInject */
    function msFormWizardDirective()
    {
        return {
            restrict  : 'E',
            scope     : true,
            controller: 'MsFormWizardController as msWizard',
            compile   : function (tElement)
            {
                tElement.addClass('ms-form-wizard');

                return function postLink()
                {

                };
            }
        }

    }

    /** @ngInject */
    function msFormWizardFormDirective()
    {
        return {
            restrict: 'A',
            require : ['form', '^msFormWizard'],
            compile : function (tElement)
            {
                tElement.addClass('ms-form-wizard-form');

                return function postLink(scope, iElement, iAttrs, ctrls)
                {
                    var formCtrl = ctrls[0],
                        MsFormWizardCtrl = ctrls[1];

                    MsFormWizardCtrl.registerForm(formCtrl);
                }
            }
        }
    }

})();
(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('msCard', msCardDirective);

    /** @ngInject */
    function msCardDirective()
    {
        return {
            restrict: 'E',
            scope   : {
                templatePath: '=template',
                card        : '=ngModel'
            },
            template: '<div class="ms-card-content-wrapper" ng-include="templatePath" onload="cardTemplateLoaded()"></div>',
            compile : function (tElement)
            {
                // Add class
                tElement.addClass('ms-card');

                return function postLink(scope, iElement)
                {
                    // Methods
                    scope.cardTemplateLoaded = cardTemplateLoaded;

                    //////////

                    /**
                     * Emit cardTemplateLoaded event
                     */
                    function cardTemplateLoaded()
                    {
                        scope.$emit('msCard::cardTemplateLoaded', iElement);
                    }
                };
            }
        };
    }
})();
(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
    angular
        .module('app.test', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.test', {
                url    : '/test',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/test/test.html',
                        controller : 'testController as vm'
                    }
                }
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/test');

        // Navigation
        msNavigationServiceProvider.saveItem('fuse', {
            title : 'test',
            group : true,
            weight: 1
        });

        msNavigationServiceProvider.saveItem('fuse.test', {
            title    : 'test',
            icon     : 'icon-tile-four',
            state    : 'app.test',
            /*stateParams: {
                'param1': 'page'
             },*/
            weight   : 1
        });
    }
})();
(function ()
{
    'use strict';

    angular
        .module('app.test')
        .controller('testController', testController);

    /** @ngInject */
    function testController()
    {
        var vm = this;

    }
})();

(function ()
{
    'use strict';

	showUsersService.$inject = ["$http", "$rootScope"];
    angular
        .module('app.show_users')
        .factory('showUsersService', showUsersService);

    /** @ngInject */
    
    function showUsersService($http, $rootScope)
    {
    return {
      getAllUsers: function (user_id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/showAllUsers',
				data: 'user_id='+user_id,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	addEvent: function (user_id, start_date, end_date, title, description, categories, location, attachments, recurring, recurring_days, start_time, end_time, month_recurring, link, contact_name, contact_number, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/addEvent',
				data: 'user_id='+user_id+'&start_date='+start_date+'&end_date='+end_date+'&title='+title+'&description='+description+'&categories='+categories+'&location='+location+'&attachments='+attachments+'&recurring_type='+recurring+'&recurring_days='+recurring_days+'&start_time='+start_time+'&end_time='+end_time+'&month_recurring='+month_recurring+'&link='+link+'&contact_name='+contact_name+'&contact_number='+contact_number,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	deleteUser: function (user_id, email, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/deleteUser',
				data: 'user_id='+user_id+'&email='+email,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	activateUser: function (user_id, email, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/activateUser',
				data: 'user_id='+user_id+'&email='+email,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	deactivateUser: function (user_id, email, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/deactivateUser',
				data: 'user_id='+user_id+'&email='+email,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	editUser: function (user_id, email, name, last_name, middle_name, organization, title, phone, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/editUser',
				data: 'user_id='+user_id+'&email='+email+'&name='+name+'&last_name='+last_name+'&middle_name='+middle_name+'&organization='+organization+'&title='+title+'&phone='+phone,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	adminChangeUserPassword: function (user_id, password, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/adminChangeUserPassword',
				data: 'user_id='+user_id+'&password='+password,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	}
    }
	}
})();
(function ()
{
    'use strict';

    showUsersController.$inject = ["$scope", "showUsersService", "$rootScope", "$mdDialog", "$document", "$filter", "$mdToast"];
    angular
        .module('app.show_users')
        .controller('showUsersController', showUsersController);

    /** @ngInject */
    function showUsersController($scope, showUsersService, $rootScope, $mdDialog, $document, $filter, $mdToast)
    {
        var vm = this;
        $scope.current_user_id = '';
        showUsersService.getAllUsers($rootScope.globals.user_data.user_id, function(data, status){
            console.log(data);
            if(data.success==true){
                vm.userData = data.data;
            }else{
                $mdToast.show($mdToast.simple().textContent('No data found!').position('top right'));
            }
        });

        vm.dtOptions = {
            dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple',
            autoWidth : false,
            responsive: true
        };

        $scope.addEvent = function(e, user_id)
        {
            var start = new Date(),
                end = new Date(),
                obj = {};
                $scope.current_user_id = user_id;
            showEventFormDialog('add', false, start, end, e, obj);
        }

        function showEventFormDialog(type, calendarEvent, start, end, e, obj)
        {
            var dialogData = {
                type         : type,
                calendarEvent: calendarEvent,
                start        : start,
                end          : end,
                obj          : obj
            };

            $mdDialog.show({
                controller         : 'EventFormDialogShowUserController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/show_users/dialogs/event-form/event-form-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : e,
                clickOutsideToClose: false,
                locals             : {
                    dialogData: dialogData
                }
            }).then(function (response)
            {
                if ( response.type === 'add' )
                {
                    console.log(response.calendarEvent);
                //    $scope.currentYear = $filter('date')($scope.currentDate, "yyyy");
                    // Add new
                    if($scope.current_user_id!==''){
                    var start_date = $filter('date')(response.calendarEvent.start, "yyyy-MM-dd");
                    var end_date = $filter('date')(response.calendarEvent.end, "yyyy-MM-dd");
                    showUsersService.addEvent($scope.current_user_id, start_date, end_date, response.calendarEvent.title, response.calendarEvent.description, response.calendarEvent.categories, response.calendarEvent.location, JSON.stringify(response.calendarEvent.attachments), response.calendarEvent.recurring, response.calendarEvent.recurring_days, response.calendarEvent.start_time_hours+':'+response.calendarEvent.start_time_minutes, response.calendarEvent.end_time_hours+':'+response.calendarEvent.end_time_minutes, response.calendarEvent.month_recurring, response.calendarEvent.link, response.calendarEvent.contact_name, response.calendarEvent.contact_number, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $scope.current_user_id = '';
                            $mdToast.show($mdToast.simple().textContent('Event Created!').position('top right'));

                        }
                    });
                    }
                }
                else
                {
                    console.log(response);
                    
                }
            });
        }

         $scope.editUser = function(e, user_id)
        {
            var start = new Date(),
                end = new Date(),
                obj = {};
                $scope.current_user_id = user_id;
                for(var i=0, j=vm.userData.length; i<j; i++){
                    if(vm.userData[i].user_id==user_id){
                        obj.email = vm.userData[i].email;
                        obj.name = vm.userData[i].name;
                        obj.last_name = vm.userData[i].last_name;
                        obj.middle_name = vm.userData[i].middle_name;
                        obj.organization = vm.userData[i].organization;
                        obj.phone = vm.userData[i].phone;
                        obj.title = vm.userData[i].title;
                    }
                }
            showEditFormDialog('edit', true, start, end, e, obj);
        }

        function showEditFormDialog(type, calendarEvent, start, end, e, obj)
        {
            var dialogData = {
                type         : type,
                calendarEvent: calendarEvent,
                start        : start,
                end          : end,
                obj          : obj
            };

            $mdDialog.show({
                controller         : 'UserEditFormDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/show_users/dialogs/edit-form/edit-form-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : e,
                clickOutsideToClose: false,
                locals             : {
                    dialogData: dialogData
                }
            }).then(function (response)
            {   
                console.log(response);
                    showUsersService.editUser($scope.current_user_id, response.calendarEvent.email, response.calendarEvent.name, response.calendarEvent.last_name, response.calendarEvent.middle_name, response.calendarEvent.organization, response.calendarEvent.title, response.calendarEvent.phone, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('Updated!').position('top right'));
                            for(var i=0, j=vm.userData.length; i<j; i++){
                                if(vm.userData[i].user_id==$scope.current_user_id){
                                    vm.userData[i].name = response.calendarEvent.name;
                                    vm.userData[i].last_name = response.calendarEvent.last_name;
                                    vm.userData[i].middle_name = response.calendarEvent.middle_name;
                                    vm.userData[i].organization = response.calendarEvent.organization;
                                    vm.userData[i].title = response.calendarEvent.title;
                                    vm.userData[i].phone = response.calendarEvent.phone;
                                    vm.userData[i].email = response.calendarEvent.email;
                                    console.log(vm.userData);
                                    break;
                                }
                            }
                        }
                    });
            });
        }

        $scope.changePassword = function(ev, user_id) {
            // Appending dialog to document.body to cover sidenav in docs app
            $mdDialog.show({
                controller         : 'UserChangePasswordDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/show_users/dialogs/change_password/change-password-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : ev,
                clickOutsideToClose: true
            }).then(function (response){
                console.log(response);
                showUsersService.adminChangeUserPassword(user_id, response.calendarEvent.password, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('Password changed!').position('top right'));
                        }
                    });
            });
        };

        $scope.showConfirm = function(ev, id, email) {
            // Appending dialog to document.body to cover sidenav in docs app
            
            var confirm = $mdDialog.confirm()
                  .title('Are you sure?')
                  .textContent('This user will be deleted permanentaly.')
                  .targetEvent(ev)
                  .ok('Delete')
                  .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
              showUsersService.deleteUser(id, email, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('User deleted!').position('top right'));
                            for(var i=0, j=vm.userData.length; i<j; i++){
                                if(vm.userData[i].user_id==id){
                                    vm.userData.splice(i, 1);
                                    break;
                                }
                            }
                        }
                    });
            }, function() {
              
            });
          };

          $scope.activateUser = function(user_id, email){
            showUsersService.activateUser(user_id, email, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('User activated!').position('top right'));
                            for(var i=0, j=vm.userData.length; i<j; i++){
                                if(vm.userData[i].user_id==user_id){
                                    vm.userData[i].account_status = 'active';
                                    break;
                                }
                            }
                        }else{
                            $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                        }
            });
          }

          $scope.deactivateUser = function(user_id, email){
            showUsersService.deactivateUser(user_id, email, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('User deactivated!').position('top right'));
                            for(var i=0, j=vm.userData.length; i<j; i++){
                                if(vm.userData[i].user_id==user_id){
                                    vm.userData[i].account_status = 'inactive';
                                    break;
                                }
                            }
                        }else{
                            $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                        }
            });
          }

       

    }
})();

(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
    angular
        .module('app.show_admins', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.show_admins', {
                url    : '/show_admins',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/show_admins/show_admins.html',
                        controller : 'showAdminsController as vm'
                    }
                }
            });

        // Translation

        // Navigation
        /*msNavigationServiceProvider.saveItem('fuse', {
            title : 'show_admins',
            group : true,
            weight: 1
        });*/
        msNavigationServiceProvider.saveItem('show_admins', {
            title    : 'Show admins',
            icon     : 'icon-tile-four',
            state    : 'app.show_admins',
            /*stateParams: {
                'param1': 'page'
             },*/
            weight   : 1
        });
    }
})();
(function ()
{
    'use strict';

	showAdminsService.$inject = ["$http", "$rootScope"];
    angular
        .module('app.show_admins')
        .factory('showAdminsService', showAdminsService);

    /** @ngInject */
    
    function showAdminsService($http, $rootScope)
    {
    return {
      getAllAdmins: function (user_id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/showAllAdmins',
				data: 'user_id='+user_id,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	deleteAdmin	: function (user_id, email, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/deleteAdmin',
				data: 'user_id='+user_id+'&email='+email,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	editAdmin	: function (user_id, email, fullname, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/editAdmin',
				data: 'user_id='+user_id+'&email='+email+'&fullname='+fullname,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	adminChangeAdminPassword: function (user_id, password, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/adminChangeAdminPassword',
				data: 'user_id='+user_id+'&password='+password,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	}
    }
	}
})();
(function ()
{
    'use strict';

    showAdminsController.$inject = ["$scope", "showAdminsService", "$rootScope", "$mdDialog", "$document", "$filter", "$mdToast"];
    angular
        .module('app.show_admins')
        .controller('showAdminsController', showAdminsController);

    /** @ngInject */
    function showAdminsController($scope, showAdminsService, $rootScope, $mdDialog, $document, $filter, $mdToast)
    {
        var vm = this;
        showAdminsService.getAllAdmins($rootScope.globals.user_data.user_id, function(data, status){
            console.log(data);
            if(data.success==true){
                vm.userData = data.data;
            }else{
                $mdToast.show($mdToast.simple().textContent('No data found!').position('top right'));
            }
        });

        vm.dtOptions = {
            dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple',
            autoWidth : false,
            responsive: true
        };

        $scope.editAdmin = function(e, admin_id)
        {
            var start = new Date(),
                end = new Date(),
                obj = {};
                $scope.current_admin_id = admin_id;
                for(var i=0, j=vm.userData.length; i<j; i++){
                    if(vm.userData[i].user_id==admin_id){
                        obj.email = vm.userData[i].email;
                        obj.fullname = vm.userData[i].fullname;
                    }
                }
            showEditFormDialog('edit', true, start, end, e, obj);
        }

        function showEditFormDialog(type, calendarEvent, start, end, e, obj)
        {
            var dialogData = {
                type         : type,
                calendarEvent: calendarEvent,
                start        : start,
                end          : end,
                obj          : obj
            };

            $mdDialog.show({
                controller         : 'AdminEditFormDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/show_admins/dialogs/edit-form/edit-form-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : e,
                clickOutsideToClose: true,
                locals             : {
                    dialogData: dialogData
                }
            }).then(function (response)
            {   
                console.log(response);
                    showAdminsService.editAdmin($scope.current_admin_id, response.calendarEvent.email, response.calendarEvent.fullname, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('Updated!').position('top right'));
                            for(var i=0, j=vm.userData.length; i<j; i++){
                                if(vm.userData[i].user_id==$scope.current_admin_id){
                                    vm.userData[i].fullname = response.calendarEvent.fullname;
                                    vm.userData[i].email = response.calendarEvent.email;
                                    break;
                                }
                            }
                        }
                    });
            });
        }

        $scope.changePassword = function(ev, admin_id) {
            // Appending dialog to document.body to cover sidenav in docs app
            $mdDialog.show({
                controller         : 'AdminChangeAdminPasswordDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/show_admins/dialogs/change_password/change-password-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : ev,
                clickOutsideToClose: true
            }).then(function (response){
                showAdminsService.adminChangeAdminPassword(admin_id, response.calendarEvent.password, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('Password changed!').position('top right'));
                        }
                    });
            });
        };

        $scope.showConfirm = function(ev, id, email) {
            // Appending dialog to document.body to cover sidenav in docs app
            
            var confirm = $mdDialog.confirm()
                  .title('Are you sure?')
                  .textContent('This admin will be deleted permanentaly.')
                  .targetEvent(ev)
                  .ok('Delete')
                  .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
              showAdminsService.deleteAdmin(id, email, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('Admin deleted!').position('top right'));
                            for(var i=0, j=vm.userData.length; i<j; i++){
                                if(vm.userData[i].admin_id==id){
                                    vm.userData.splice(i, 1);
                                    break;
                                }
                            }
                        }
                    });
            }, function() {
              
            });
          };

       

    }
})();

(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
    angular
        .module('app.sample', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.sample', {
                url    : '/sample',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/sample/sample.html',
                        controller : 'SampleController as vm'
                    }
                },
                resolve: {
                    SampleData: ["apiResolver", function (apiResolver)
                    {
                        return apiResolver.resolve('sample@get');
                    }]
                }
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/sample');

        // Navigation
        msNavigationServiceProvider.saveItem('fuse', {
            title : 'SAMPLE',
            group : true,
            weight: 1
        });

        msNavigationServiceProvider.saveItem('fuse.sample', {
            title    : 'Sample',
            icon     : 'icon-tile-four',
            state    : 'app.sample',
            /*stateParams: {
                'param1': 'page'
             },*/
            translate: 'SAMPLE.SAMPLE_NAV',
            weight   : 1
        });
    }
})();
(function ()
{
    'use strict';

    SampleController.$inject = ["SampleData"];
    angular
        .module('app.sample')
        .controller('SampleController', SampleController);

    /** @ngInject */
    function SampleController(SampleData)
    {
        var vm = this;

        // Data
        vm.helloText = SampleData.data.helloText;

        // Methods

        //////////
    }
})();

(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
    angular
        .module('app.edit_terms', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.edit_terms', {
                url    : '/edit_terms',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/edit_terms/edit_terms.html',
                        controller : 'editTermsController as vm'
                    }
                }
            });

        // Translation

        // Navigation
       /* msNavigationServiceProvider.saveItem('fuse', {
            title : 'create_user',
            group : true,
            weight: 1
        });*/

        msNavigationServiceProvider.saveItem('edit_terms', {
            title    : 'Edit terms',
            icon     : 'icon-keyboard-variant',
            state    : 'app.edit_terms',
            /*stateParams: {
                'param1': 'page'
             },*/
            weight   : 1
        });
    }
})();
(function ()
{
    'use strict';

	editTermsService.$inject = ["$http", "$rootScope"];
    angular
        .module('app.edit_terms')
        .factory('editTermsService', editTermsService);

    /** @ngInject */
    
    function editTermsService($http, $rootScope)
    {
    return {
    	getTermsText: function (callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/getTermsText',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	updateTermsText: function (formdata, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/updateTermsText',
				data: 'text='+encodeURIComponent(formdata.message),
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	notifyUsersTerms: function (callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/notifyUsersTerms',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	}
    }
	}
})();
(function ()
{
    'use strict';

    editTermsController.$inject = ["$scope", "editTermsService", "$mdToast", "$rootScope"];
    angular
        .module('app.edit_terms')
        .controller('editTermsController', editTermsController);

    /** @ngInject */
    function editTermsController($scope, editTermsService, $mdToast, $rootScope)
    {
        var vm = this;
        vm.basicForm = {};

        editTermsService.getTermsText(function(data, status){
            console.log(data);
            if(data.success==true){
                vm.basicForm.message = data.data;
                
            }else{
                $mdToast.show($mdToast.simple().textContent('Something is not right!').position('top right'));
            }
        });

        $scope.editTerms = function($valid){
            editTermsService.updateTermsText(vm.basicForm, function(data, status){
                console.log(data);
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Terms and condition have been updated').position('top right'));
                    editTermsService.notifyUsersTerms(function(data, status){
                   
                    });
                }else{
                    $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                }
            });
        }
    }
})();

(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
    angular
        .module('app.edit_profile_user', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.edit_profile_user', {
                url    : '/user/edit_profile',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/edit_profile_user/edit_profile_user.html',
                        controller : 'editProfileUserController as vm'
                    }
                }
            });


        /*msNavigationServiceProvider.saveItem('edit_profile_user', {
            title    : 'Edit profile',
            icon     : 'icon-border-color',
            state    : 'app.edit_profile_user',
            weight   : 1
        });*/
    }
})();
(function ()
{
    'use strict';

	editProfileUserService.$inject = ["$http", "$rootScope"];
    angular
        .module('app.edit_profile_user')
        .factory('editProfileUserService', editProfileUserService);

    /** @ngInject */
    
    function editProfileUserService($http, $rootScope)
    {
    return {
      getUserDate: function (user_id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/getUserDate',
				data: 'user_id='+user_id,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	editUserProfile: function (formdata, user_id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/editUserProfile',
				data: 'email='+formdata.email+'&name='+formdata.name+'&last_name='+formdata.last_name+'&middle_name='+formdata.middle_name+'&title='+formdata.title+'&organization='+formdata.organization+'&phone='+formdata.phone+'&user_id='+user_id,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	uploadFile: function (attachment, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/uploadUserProfilePic',
				data: attachment,
				transformRequest: angular.identity,
            	headers: {'Content-Type': undefined}
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	}
    }
	}
})();
(function ()
{
    'use strict';

    editProfileUserController.$inject = ["$scope", "editProfileUserService", "$mdToast", "$rootScope"];
    angular
        .module('app.edit_profile_user')
        .controller('editProfileUserController', editProfileUserController);

    /** @ngInject */
    function editProfileUserController($scope, editProfileUserService, $mdToast, $rootScope)
    {
        var vm = this;
        vm.basicForm = {};
        editProfileUserService.getUserDate($scope.globals.user_data.user_id, function(data, status){
            console.log(data);
            if(data.success==true){
                vm.userData = data.data;
                vm.basicForm.middle_name = data.data.middle_name;
                vm.basicForm.name = data.data.name;
                vm.basicForm.last_name = data.data.last_name;
                vm.basicForm.email = data.data.email;
                vm.basicForm.title = data.data.title;
                vm.basicForm.organization = data.data.organization;
                vm.basicForm.phone = data.data.phone;
                vm.basicForm.profile_pic = data.data.profile_pic;
            }else{
                $mdToast.show($mdToast.simple().textContent('Something is not right!').position('top right'));
            }
        });

        $scope.editUserProfile = function($valid){
            console.log(vm.basicForm);
            editProfileUserService.editUserProfile(vm.basicForm, $rootScope.globals.user_data.user_id, function(data, status){
                console.log(data);
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Updated!').position('top right'));
                    $rootScope.globals.user_data.fullname = vm.basicForm.name+' '+vm.basicForm.last_name;
                    $rootScope.globals.user_data.email = vm.basicForm.email;
                    var final_data = JSON.stringify($rootScope.globals.user_data);
                    localStorage.setItem('userData', final_data);
                }else{
                    $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                }
            });
        }

        $scope.addImage = function(){
            document.getElementById('add_image').click();
        }

        $scope.handleFileSelect = function(evt){
            var files = evt.files; // FileList object
            console.log(files);
            var formData = new FormData();
            var file = document.getElementById('add_image').files[0];
            formData.append('profile_pic', file);
            formData.append('user_id', $rootScope.globals.user_data.user_id);
            $scope.uploadingFile = true;
            $mdToast.show($mdToast.simple().textContent('Uploading!').position('top right'));
            editProfileUserService.uploadFile(formData, function(data, status){
                console.log(data);
                $scope.uploadingFile = false;
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Profile pic changed!').position('top right'));
                    vm.basicForm.profile_pic = data.filepath;
                    $rootScope.globals.user_data.profile_pic = data.filepath;
                    var final_data = JSON.stringify($rootScope.globals.user_data);
                    localStorage.setItem('userData', final_data);
                }else{
                    $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                }
            });
          }

    }
})();

(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
    angular
        .module('app.edit_profile_admin', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.edit_profile_admin', {
                url    : '/admin/edit_profile',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/edit_profile_admin/edit_profile_admin.html',
                        controller : 'editProfileAdminController as vm'
                    }
                }
            });


        /*msNavigationServiceProvider.saveItem('edit_profile_user', {
            title    : 'Edit profile',
            icon     : 'icon-border-color',
            state    : 'app.edit_profile_user',
            weight   : 1
        });*/
    }
})();
(function ()
{
    'use strict';

	editProfileAdminService.$inject = ["$http", "$rootScope"];
    angular
        .module('app.edit_profile_admin')
        .factory('editProfileAdminService', editProfileAdminService);

    /** @ngInject */
    
    function editProfileAdminService($http, $rootScope)
    {
    return {
      getAdminData: function (admin_id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/getAdminData',
				data: 'admin_id='+admin_id,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	editAdminProfile: function (formdata, admin_id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/editAdminProfile',
				data: 'email='+formdata.email+'&fullname='+formdata.fullname+'&user_id='+admin_id,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	uploadFile: function (attachment, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/uploadAdminProfilePic',
				data: attachment,
				transformRequest: angular.identity,
            	headers: {'Content-Type': undefined}
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	}
    }
	}
})();
(function ()
{
    'use strict';

    editProfileAdminController.$inject = ["$scope", "editProfileAdminService", "$mdToast", "$rootScope"];
    angular
        .module('app.edit_profile_admin')
        .controller('editProfileAdminController', editProfileAdminController);

    /** @ngInject */
    function editProfileAdminController($scope, editProfileAdminService, $mdToast, $rootScope)
    {
        var vm = this;
        vm.basicForm = {};
        editProfileAdminService.getAdminData($scope.globals.user_data.admin_id, function(data, status){
            console.log(data);
            if(data.success==true){
                vm.userData = data.data;
                vm.basicForm.email = data.data.email;
                vm.basicForm.fullname = data.data.fullname;
                vm.basicForm.profile_pic = data.data.profile_pic;
            }else{
                $mdToast.show($mdToast.simple().textContent('Something is not right!').position('top right'));
            }
        });

        $scope.editAdminProfile = function($valid){
            console.log(vm.basicForm);
            editProfileAdminService.editAdminProfile(vm.basicForm, $rootScope.globals.user_data.admin_id, function(data, status){
                console.log(data);
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Updated!').position('top right'));
                    $rootScope.globals.user_data.fullname = vm.basicForm.fullname;
                    $rootScope.globals.user_data.email = vm.basicForm.email;
                    var final_data = JSON.stringify($rootScope.globals.user_data);
                    localStorage.setItem('userData', final_data);
                }else{
                    $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                }
            });
        }

        $scope.addImage = function(){
            document.getElementById('add_image').click();
        }

        $scope.handleFileSelect = function(evt){
            var files = evt.files; // FileList object
            console.log(files);
            var formData = new FormData();
            var file = document.getElementById('add_image').files[0];
            formData.append('profile_pic', file);
            formData.append('admin_id', $rootScope.globals.user_data.admin_id);
            $scope.uploadingFile = true;
            $mdToast.show($mdToast.simple().textContent('Uploading!').position('top right'));
            editProfileAdminService.uploadFile(formData, function(data, status){
                console.log(data);
                $scope.uploadingFile = false;
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Profile pic changed!').position('top right'));
                    vm.basicForm.profile_pic = data.filepath;
                    $rootScope.globals.user_data.profile_pic = data.filepath;
                    var final_data = JSON.stringify($rootScope.globals.user_data);
                    localStorage.setItem('userData', final_data);
                }else{
                    $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                }
            });
          }

    }
})();

(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
    angular
        .module('app.edit_privacy_policy', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.edit_privacy_policy', {
                url    : '/edit_privacy_policy',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/edit_privacy_policy/edit_privacy_policy.html',
                        controller : 'editPrivacyPolicyController as vm'
                    }
                }
            });

        // Translation

        // Navigation
       /* msNavigationServiceProvider.saveItem('fuse', {
            title : 'create_user',
            group : true,
            weight: 1
        });*/

        msNavigationServiceProvider.saveItem('edit_privacy_policy', {
            title    : 'Edit Privacy',
            icon     : 'icon-keyboard-variant',
            state    : 'app.edit_privacy_policy',
            /*stateParams: {
                'param1': 'page'
             },*/
            weight   : 1
        });
    }
})();
(function ()
{
    'use strict';

	editPrivacyPolicyService.$inject = ["$http", "$rootScope"];
    angular
        .module('app.edit_privacy_policy')
        .factory('editPrivacyPolicyService', editPrivacyPolicyService);

    /** @ngInject */
    
    function editPrivacyPolicyService($http, $rootScope)
    {
    return {
    	getPrivacyPolicyText: function (callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/getPrivacyPolicyText',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	updatePrivacyText: function (formdata, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/updatePrivacyText',
				data: 'text='+encodeURIComponent(formdata.message),
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	notifyUsersPrivacy: function (callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/notifyUsersPrivacy',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	}
    }
	}
})();
(function ()
{
    'use strict';

    editPrivacyPolicyController.$inject = ["$scope", "editPrivacyPolicyService", "$mdToast", "$rootScope"];
    angular
        .module('app.edit_privacy_policy')
        .controller('editPrivacyPolicyController', editPrivacyPolicyController);

    /** @ngInject */
    function editPrivacyPolicyController($scope, editPrivacyPolicyService, $mdToast, $rootScope)
    {
        var vm = this;
        vm.basicForm = {};

        editPrivacyPolicyService.getPrivacyPolicyText(function(data, status){
            console.log(data);
            if(data.success==true){
                vm.basicForm.message = data.data;
                
            }else{
                $mdToast.show($mdToast.simple().textContent('Something is not right!').position('top right'));
            }
        });

        $scope.editText = function($valid){
            editPrivacyPolicyService.updatePrivacyText(vm.basicForm, function(data, status){
                console.log(data);
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Privacy Policy have been updated').position('top right'));
                    /*editPrivacyPolicyService.notifyUsersTerms(function(data, status){
                   
                    });*/
                }else{
                    $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                }
            });
        }
    }
})();

(function ()
{
    'use strict';

	DashboardAdminService.$inject = ["$http", "$rootScope"];
    angular
        .module('app.dashboard_admin')
        .factory('DashboardAdminService', DashboardAdminService);

    /** @ngInject */
    
    function DashboardAdminService($http, $rootScope)
    {
    return {
      getAllEvents: function (user_id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/showAllEvents',
				data: 'user_id='+user_id,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	addEventAdmin: function (admin_id, start_date, end_date, title, description, categories, location, attachments, recurring, recurring_days, start_time, end_time, month_recurring, link, contact_name, contact_number, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/addEventAdmin',
				data: 'user_id='+admin_id+'&start_date='+start_date+'&end_date='+end_date+'&title='+title+'&description='+description+'&categories='+categories+'&location='+location+'&attachments='+attachments+'&recurring_type='+recurring+'&recurring_days='+recurring_days+'&start_time='+start_time+'&end_time='+end_time+'&month_recurring='+month_recurring+'&link='+link+'&contact_name='+contact_name+'&contact_number='+contact_number,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	approveEvent: function (id, event_status, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/approveEvent',
				data: 'event_id='+id+'&status='+event_status,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	declineEvent: function (id,event_status, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/declineEvent',
				data: 'event_id='+id+'&status='+event_status,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	deleteEvent: function (id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/deleteEvent',
				data: 'event_id='+id,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	uploadFile: function (attachment, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/uploadFile',
				data: attachment,
				transformRequest: angular.identity,
            	headers: {'Content-Type': undefined}
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	adminEditEvent: function (start_date, end_date, title, description, categories, location, attachments, event_id, recurring, recurring_days, start_time, end_time, month_recurring, link, contact_name, contact_number, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/adminEditEvent',
				data: 'start_date='+start_date+'&end_date='+end_date+'&title='+title+'&description='+description+'&categories='+categories+'&location='+location+'&event_id='+event_id+'&attachments='+attachments+'&recurring_type='+recurring+'&recurring_days='+recurring_days+'&start_time='+start_time+'&end_time='+end_time+'&month_recurring='+month_recurring+'&link='+link+'&contact_name='+contact_name+'&contact_number='+contact_number,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	}
    }
	}
})();
(function ()
{
    'use strict';

    dashboard_adminController.$inject = ["$scope", "DashboardAdminService", "$rootScope", "$mdDialog", "$document", "$filter", "$mdToast"];
    angular
        .module('app.dashboard_admin')
        .controller('dashboard_adminController', dashboard_adminController);

    /** @ngInject */
    function dashboard_adminController($scope, DashboardAdminService, $rootScope, $mdDialog, $document, $filter, $mdToast)
    {
        var vm = this;
        DashboardAdminService.getAllEvents($rootScope.globals.user_data.user_id, function(data, status){
            console.log(data);
            if(data.success==true){
                vm.eventData = data.data;
            }else{
                $mdToast.show($mdToast.simple().textContent('No data found!').position('top right'));
            }
        });

        vm.dtOptions = {
            dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple',
            autoWidth : false,
            responsive: true
        };

        $scope.approveEvent = function(id, event_status){
            DashboardAdminService.approveEvent(id, event_status, function(data, status){
            console.log(data);
            if(data.success==true){
                $mdToast.show($mdToast.simple().textContent('Event approved!').position('top right'));
                var events = angular.copy(vm.eventData)
                for(var i=0, j=events.length; i<j; i++){
                if(events[i].event_id==id && events[i].status=='pending' && event_status=='pending'){
                    events[i].status = 'approved';
                }else if(event_status=='modified'){
                    if(events[i].event_id==id && events[i].status=='approved'){
                        // random status to remove from approved list
                        events[i].status = 'remove';
                    }
                    if(events[i].event_id==id && events[i].status=='modified'){
                        events[i].status = 'approved';
                    }
                }
                }
                vm.eventData = events;
            }else{
                $mdToast.show($mdToast.simple().textContent('No data found!').position('top right'));
            }
            });
        }

         function declineEvent(id, event_status){
            DashboardAdminService.declineEvent(id, event_status,  function(data, status){
            console.log(data);
            if(data.success==true){
                $mdToast.show($mdToast.simple().textContent('Event declined!').position('top right'));
                var events = angular.copy(vm.eventData)
                for(var i=0, j=events.length; i<j; i++){
                if(events[i].event_id==id && events[i].status=='pending' && event_status=='pending'){
                    events[i].status = 'declined';
                }else if(events[i].event_id==id && events[i].status=='modified' && event_status=='modified'){
                    events[i].status = 'rejected';
                }
                }
                vm.eventData = events;
            }else{
                $mdToast.show($mdToast.simple().textContent('No data found!').position('top right'));
            }
            });
        }

        function deleteEvent(id){
            DashboardAdminService.deleteEvent(id,  function(data, status){
            console.log(data);
            if(data.success==true){
                $mdToast.show($mdToast.simple().textContent('Event deleted!').position('top right'));
                var events = angular.copy(vm.eventData)
                for(var i=0, j=events.length; i<j; i++){
                if(events[i].event_id==id){
                    events.splice(i, 1);
                    break;
                }
                }
                vm.eventData = events;
            }else{
                $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
            }
            });
        }

        $scope.viewEvent = function(e, data)
        {
            var start = new Date(),
                end = new Date(),
                obj = {};
                obj.start = new Date(data.start_date);
                obj.end = new Date(data.end_date);
                obj.title = data.title;
                obj.description = data.description;
                obj.categories = data.categories;
                obj.location = data.location;
                obj.attachments = data.attachments;
                obj.recurring = data.recurring_type;
                obj.recurring_days = data.recurring_days;
                obj.month_recurring = data.month_recurring;
                obj.link = data.link;
                obj.contact_name = data.contact_name;
                obj.contact_number = data.contact_number;
            showEventDetailDialog(obj, e);
        }

        $scope.addEvent = function(e)
        {
            var start = new Date(),
                end = new Date(),
                obj = {};

            showEventFormDialog('add', false, start, end, e, obj);
        }

        $scope.editEvent = function(e, id)
        {
            var start = '',
                end = '',
                obj = {};
            $scope.current_event_id = id;
            for(var i=0, j=vm.eventData.length; i<j; i++){
                if(vm.eventData[i].event_id==id){
                    var start_time = vm.eventData[i].start_time;
                    var end_time = vm.eventData[i].end_time;
                    var start_time_array = start_time.split(':');
                    var end_time_array = end_time.split(':');
                    start = new Date(vm.eventData[i].start_date);
                    console.log(start);
                    end = new Date(vm.eventData[i].end_date);
                    obj.title = vm.eventData[i].title;
                    obj.description = vm.eventData[i].description;
                    obj.status = vm.eventData[i].status;
                    obj.categories = vm.eventData[i].categories;
                    obj.location = vm.eventData[i].location;
                    obj.attachments = vm.eventData[i].attachments;
                    obj.recurring_type = vm.eventData[i].recurring_type;
                    obj.recurring_days = vm.eventData[i].recurring_days;
                    obj.month_recurring = vm.eventData[i].month_recurring;
                    obj.link = vm.eventData[i].link;
                    obj.contact_name = vm.eventData[i].contact_name;
                    obj.contact_number = vm.eventData[i].contact_number;
                    obj.start_time_minutes = start_time_array[1];
                    obj.start_time_hours = start_time_array[0];
                    obj.end_time_hours = end_time_array[0];
                    obj.end_time_minutes = end_time_array[0];
                    obj.event_id = id;
                    break;
                }
            }
            console.log(obj);
            showEventFormDialog('edit', true, start, end, e, obj);
        }

        function showEventDetailDialog(calendarEvent, e)
        {
            $mdDialog.show({
                controller         : 'AdminEventDetailDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/dashboard_admin/dialogs/event-detail/event-detail-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : e,
                clickOutsideToClose: false,
                locals             : {
                    calendarEvent      : calendarEvent,
                    showEventFormDialog: showEventFormDialog,
                    event              : e
                }
            });
        }

        function showEventFormDialog(type, calendarEvent, start, end, e, obj)
        {
            var dialogData = {
                type         : type,
                calendarEvent: calendarEvent,
                start        : start,
                end          : end,
                obj          : obj
            };

            $mdDialog.show({
                controller         : 'AdminEventFormDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/dashboard_admin/dialogs/event-form/event-form-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : e,
                clickOutsideToClose: false,
                locals             : {
                    dialogData: dialogData
                }
            }).then(function (response)
            {
                if ( response.type === 'add' )
                {
                    console.log(response.calendarEvent);
                //    $scope.currentYear = $filter('date')($scope.currentDate, "yyyy");
                    // Add new
                    var start_date = $filter('date')(response.calendarEvent.start, "yyyy-MM-dd");
                    var end_date = $filter('date')(response.calendarEvent.end, "yyyy-MM-dd");
                    DashboardAdminService.addEventAdmin($rootScope.globals.user_data.admin_id, start_date, end_date, response.calendarEvent.title, response.calendarEvent.description, response.calendarEvent.categories, response.calendarEvent.location, JSON.stringify(response.calendarEvent.attachments), response.calendarEvent.recurring, response.calendarEvent.recurring_days, response.calendarEvent.start_time_hours+':'+response.calendarEvent.start_time_minutes, response.calendarEvent.end_time_hours+':'+response.calendarEvent.end_time_minutes, response.calendarEvent.month_recurring, response.calendarEvent.link, response.calendarEvent.contact_name, response.calendarEvent.contact_number, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            var obj = {};
                            obj.start_date = start_date;
                            obj.end_date = end_date;
                            obj.title = response.calendarEvent.title;
                            obj.description = response.calendarEvent.description;
                            obj.event_id = data.event_id;
                            obj.status = 'approved';
                            obj.location = response.calendarEvent.location;
                            obj.categories = response.calendarEvent.categories;
                            obj.attachments = JSON.stringify(response.calendarEvent.attachments);
                            obj.recurring_type = response.calendarEvent.recurring;
                            obj.recurring_days = response.calendarEvent.recurring_days;
                            vm.eventData.push(obj);
                            console.log(vm.eventData);
                        }
                    });
                }
                else
                {
                    var start_date = $filter('date')(response.calendarEvent.start, "yyyy-MM-dd");
                    var end_date = $filter('date')(response.calendarEvent.end, "yyyy-MM-dd");
                    DashboardAdminService.adminEditEvent(start_date, end_date, response.calendarEvent.title, response.calendarEvent.description, response.calendarEvent.categories, response.calendarEvent.location, JSON.stringify(response.calendarEvent.attachments), $scope.current_event_id, response.calendarEvent.recurring, response.calendarEvent.recurring_days, response.calendarEvent.start_time_hours+':'+response.calendarEvent.start_time_minutes, response.calendarEvent.end_time_hours+':'+response.calendarEvent.end_time_minutes, response.calendarEvent.month_recurring, response.calendarEvent.link, response.calendarEvent.contact_name, response.calendarEvent.contact_number, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('Event Updated!').position('top right'));
                            for(var i=0, j=vm.eventData.length; i<j; i++){
                                if(vm.eventData[i].event_id==$scope.current_event_id){
                                    vm.eventData[i].start_date = start_date;
                                    vm.eventData[i].end_date = end_date;
                                    vm.eventData[i].title = response.calendarEvent.title;
                                    vm.eventData[i].description = response.calendarEvent.description;
                                    vm.eventData[i].location = response.calendarEvent.location;
                                    vm.eventData[i].categories = response.calendarEvent.categories;
                                    vm.eventData[i].attachments = JSON.stringify(response.calendarEvent.attachments);
                                    vm.eventData[i].recurring = response.calendarEvent.recurring;
                                    vm.eventData[i].recurring_days = response.calendarEvent.recurring_days;
                                }
                            }
                        }
                    });
                
                    
                }
            });
        }

        $scope.showConfirm = function(ev, id, status) {
            var confirm = $mdDialog.confirm()
                  .title('Are you sure?')
                  .textContent('Event will be declined.')
                  .targetEvent(ev)
                  .ok('Decline')
                  .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                declineEvent(id, status);
            }, function() {
              
            });
          };

          $scope.showConfirmDeleteEvent = function(ev, id) {
            var confirm = $mdDialog.confirm()
                  .title('Are you sure?')
                  .textContent('Event will be deleted.')
                  .targetEvent(ev)
                  .ok('Delete')
                  .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                deleteEvent(id);
            }, function() {
              
            });
          };

          $scope.pendingFilter = function (item) { 
              if (item.status === 'pending' || item.status === 'modified') {
                return item;
             }
            };

    }
})();

(function ()
{
    'use strict';

	DashboardService.$inject = ["$http", "$rootScope"];
    angular
        .module('app.dashboard')
        .factory('DashboardService', DashboardService);

    /** @ngInject */
    
    function DashboardService($http, $rootScope)
    {
    return {
      getUserEvents: function (user_id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/showUserEvents',
				data: 'user_id='+user_id,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	addEvent: function (user_id, start_date, end_date, title, description, categories, location, attachments, recurring, recurring_days, start_time, end_time, month_recurring, link, contact_name, contact_number, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/addEvent',
				data: 'user_id='+user_id+'&start_date='+start_date+'&end_date='+end_date+'&title='+title+'&description='+description+'&categories='+categories+'&location='+location+'&attachments='+attachments+'&recurring_type='+recurring+'&recurring_days='+recurring_days+'&start_time='+start_time+'&end_time='+end_time+'&month_recurring='+month_recurring+'&link='+link+'&contact_name='+contact_name+'&contact_number='+contact_number,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	deleteEvent: function (user_id, id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/deleteEvent',
				data: 'user_id='+user_id+'&event_id='+id,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	userEditPendingEvent: function (user_id, start_date, end_date, title, description, categories, location, attachments, event_id, recurring, recurring_days, start_time, end_time, month_recurring, link, contact_name, contact_number, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/userEditPendingEvent',
				data: 'user_id='+user_id+'&start_date='+start_date+'&end_date='+end_date+'&title='+title+'&description='+description+'&categories='+categories+'&location='+location+'&event_id='+event_id+'&attachments='+attachments+'&recurring_type='+recurring+'&recurring_days='+recurring_days+'&start_time='+start_time+'&end_time='+end_time+'&month_recurring='+month_recurring+'&link='+link+'&contact_name='+contact_name+'&contact_number='+contact_number,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	userEditApprovedEvent: function (user_id, start_date, end_date, title, description, categories, location, attachments, event_id, recurring, recurring_days, start_time, end_time, month_recurring, link, contact_name, contact_number, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/userEditApprovedEvent',
				data: 'user_id='+user_id+'&start_date='+start_date+'&end_date='+end_date+'&title='+title+'&description='+description+'&categories='+categories+'&location='+location+'&event_id='+event_id+'&status=modified&attachments='+attachments+'&recurring_type='+recurring+'&recurring_days='+recurring_days+'&start_time='+start_time+'&end_time='+end_time+'&month_recurring='+month_recurring+'&link='+link+'&contact_name='+contact_name+'&contact_number='+contact_number,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	uploadFile: function (attachment, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/uploadFile',
				data: attachment,
				transformRequest: angular.identity,
            	headers: {'Content-Type': undefined}
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	notifyAdminEvent: function (event_id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/notifyAdminEvent',
				data: 'event_id='+event_id,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	notifyAdminEventModify: function (event_id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/notifyAdminEventModify',
				data: 'event_id='+event_id,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	}
    }
	}
})();
(function ()
{
    'use strict';

    dashboardController.$inject = ["$scope", "DashboardService", "$rootScope", "$mdDialog", "$document", "$filter", "$mdToast"];
    angular
        .module('app.dashboard')
        .controller('dashboardController', dashboardController);

    /** @ngInject */
    function dashboardController($scope, DashboardService, $rootScope, $mdDialog, $document, $filter, $mdToast)
    {
        var vm = this;
        $scope.current_event_id = '';
        DashboardService.getUserEvents($rootScope.globals.user_data.user_id, function(data, status){
            console.log(data);
            if(data.success==true){
                vm.eventData = data.data;
            }else{
                $mdToast.show($mdToast.simple().textContent('No data found!').position('top right'));
            }
        });

        vm.dtOptions = {
            dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple',
            autoWidth : false,
            responsive: true
        };

        $scope.addEvent = function(e)
        {
            var start = new Date(),
                end = new Date(),
                obj = {};

            showEventFormDialog('add', false, start, end, e, obj);
        }

        $scope.editEvent = function(e, id, status)
        {
            var start = '',
                end = '',
                obj = {};
            $scope.current_event_id = id;
            for(var i=0, j=vm.eventData.length; i<j; i++){
                if(vm.eventData[i].event_id==id){
                    var start_time = vm.eventData[i].start_time;
                    var end_time = vm.eventData[i].end_time;
                    var start_time_array = start_time.split(':');
                    var end_time_array = end_time.split(':');
                    start = new Date(vm.eventData[i].start_date);
                    console.log(start);
                    end = new Date(vm.eventData[i].end_date);
                    obj.title = vm.eventData[i].title;
                    obj.description = vm.eventData[i].description;
                    obj.status = vm.eventData[i].status;
                    obj.categories = vm.eventData[i].categories;
                    obj.location = vm.eventData[i].location;
                    obj.attachments = vm.eventData[i].attachments;
                    obj.recurring_type = vm.eventData[i].recurring_type;
                    obj.recurring_days = vm.eventData[i].recurring_days;
                    obj.month_recurring = vm.eventData[i].month_recurring;
                    obj.link = vm.eventData[i].link;
                    obj.contact_name = vm.eventData[i].contact_name;
                    obj.contact_number = vm.eventData[i].contact_number;
                    obj.start_time_minutes = start_time_array[1];
                    obj.start_time_hours = start_time_array[0];
                    obj.end_time_hours = end_time_array[0];
                    obj.end_time_minutes = end_time_array[0];
                    obj.event_id = id;
                }
            }
            showEventFormDialog('edit', true, start, end, e, obj);
        }

        $scope.editApprovedEvent = function(e, id)
        {
            var start = '',
                end = '',
                obj = {};
            $scope.current_event_id = id;
            for(var i=0, j=vm.eventData.length; i<j; i++){
                if(vm.eventData[i].event_id==id){
                    var start_time = vm.eventData[i].start_time;
                    var end_time = vm.eventData[i].end_time;
                    var start_time_array = start_time.split(':');
                    var end_time_array = end_time.split(':');
                    start = new Date(vm.eventData[i].start_date);
                    console.log(start);
                    end = new Date(vm.eventData[i].end_date);
                    obj.title = vm.eventData[i].title;
                    obj.description = vm.eventData[i].description;
                    obj.status = vm.eventData[i].status;
                    obj.categories = vm.eventData[i].categories;
                    obj.location = vm.eventData[i].location;
                    obj.attachments = vm.eventData[i].attachments;
                    obj.recurring_type = vm.eventData[i].recurring_type;
                    obj.recurring_days = vm.eventData[i].recurring_days;
                    obj.month_recurring = vm.eventData[i].month_recurring;
                    obj.link = vm.eventData[i].link;
                    obj.contact_name = vm.eventData[i].contact_name;
                    obj.contact_number = vm.eventData[i].contact_number;
                    obj.start_time_minutes = start_time_array[1];
                    obj.start_time_hours = start_time_array[0];
                    obj.end_time_hours = end_time_array[0];
                    obj.end_time_minutes = end_time_array[0];
                    obj.event_id = id;
                }
            }

            showEventFormDialog('edit_approved', true, start, end, e, obj);
        }

        function showEventDetailDialog(calendarEvent, e)
        {
            $mdDialog.show({
                controller         : 'EventDetailDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/dashboard/dialogs/event-detail/event-detail-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : e,
                clickOutsideToClose: true,
                locals             : {
                    calendarEvent      : calendarEvent,
                    showEventFormDialog: showEventFormDialog,
                    event              : e
                }
            });
        }

        function showEventFormDialog(type, calendarEvent, start, end, e, obj)
        {
            var dialogData = {
                type         : type,
                calendarEvent: calendarEvent,
                start        : start,
                end          : end,
                obj          : obj
            };

            $mdDialog.show({
                controller         : 'EventFormDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/dashboard/dialogs/event-form/event-form-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : e,
                clickOutsideToClose: true,
                locals             : {
                    dialogData: dialogData
                }
            }).then(function (response)
            {
                if ( response.type === 'add' )
                {
                    console.log(response.calendarEvent);
                //    $scope.currentYear = $filter('date')($scope.currentDate, "yyyy");
                    // Add new
                    var start_date = $filter('date')(response.calendarEvent.start, "yyyy-MM-dd");
                    var end_date = $filter('date')(response.calendarEvent.end, "yyyy-MM-dd");
                    console.log(response.calendarEvent.attachments);
                    DashboardService.addEvent($rootScope.globals.user_data.user_id, start_date, end_date, response.calendarEvent.title, response.calendarEvent.description, response.calendarEvent.categories, response.calendarEvent.location, JSON.stringify(response.calendarEvent.attachments), response.calendarEvent.recurring, response.calendarEvent.recurring_days, response.calendarEvent.start_time_hours+':'+response.calendarEvent.start_time_minutes, response.calendarEvent.end_time_hours+':'+response.calendarEvent.end_time_minutes, response.calendarEvent.month_recurring, response.calendarEvent.link, response.calendarEvent.contact_name, response.calendarEvent.contact_number, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('Event Created!').position('top right'));
                            var obj = {};
                            obj.start_date = start_date;
                            obj.end_date = end_date;
                            obj.title = response.calendarEvent.title;
                            obj.description = response.calendarEvent.description;
                            obj.event_id = data.event_id;
                            obj.status = 'pending';
                            obj.location = response.calendarEvent.location;
                            obj.categories = response.calendarEvent.categories;
                            obj.attachments = JSON.stringify(response.calendarEvent.attachments);
                            obj.recurring_type = response.calendarEvent.recurring;
                            obj.recurring_days = response.calendarEvent.recurring_days;
                            vm.eventData.push(obj);
                            console.log(vm.eventData);

                            DashboardService.notifyAdminEvent(data.event_id, function(data, status){
                        
                             });
                        }
                    });
                }
                else if(response.type=='edit')
                {
                    console.log(response);
                    var start_date = $filter('date')(response.calendarEvent.start, "yyyy-MM-dd");
                    var end_date = $filter('date')(response.calendarEvent.end, "yyyy-MM-dd");
                    if(response.calendarEvent.status=='pending'){
                    DashboardService.userEditPendingEvent($rootScope.globals.user_data.user_id, start_date, end_date, response.calendarEvent.title, response.calendarEvent.description, response.calendarEvent.categories, response.calendarEvent.location, JSON.stringify(response.calendarEvent.attachments), $scope.current_event_id, response.calendarEvent.recurring, response.calendarEvent.recurring_days, response.calendarEvent.start_time_hours+':'+response.calendarEvent.start_time_minutes, response.calendarEvent.end_time_hours+':'+response.calendarEvent.end_time_minutes, response.calendarEvent.month_recurring, response.calendarEvent.link, response.calendarEvent.contact_name, response.calendarEvent.contact_number, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('Event Updated!').position('top right'));
                            for(var i=0, j=vm.eventData.length; i<j; i++){
                                if(vm.eventData[i].event_id==$scope.current_event_id){
                                    vm.eventData[i].start_date = start_date;
                                    vm.eventData[i].end_date = end_date;
                                    vm.eventData[i].title = response.calendarEvent.title;
                                    vm.eventData[i].description = response.calendarEvent.description;
                                    vm.eventData[i].location = response.calendarEvent.location;
                                    vm.eventData[i].categories = response.calendarEvent.categories;
                                    vm.eventData[i].attachments = JSON.stringify(response.calendarEvent.attachments);
                                    vm.eventData[i].recurring = response.calendarEvent.recurring;
                                    vm.eventData[i].recurring_days = response.calendarEvent.recurring_days;
                                }
                            }
                        }
                    });
                }else if(response.calendarEvent.status=='modified'){
                    DashboardService.userEditApprovedEvent($rootScope.globals.user_data.user_id, start_date, end_date, response.calendarEvent.title, response.calendarEvent.description, response.calendarEvent.categories, response.calendarEvent.location, JSON.stringify(response.calendarEvent.attachments), $scope.current_event_id, response.calendarEvent.recurring, response.calendarEvent.recurring_days, response.calendarEvent.start_time_hours+':'+response.calendarEvent.start_time_minutes, response.calendarEvent.end_time_hours+':'+response.calendarEvent.end_time_minutes, response.calendarEvent.month_recurring, response.calendarEvent.link, response.calendarEvent.contact_name, response.calendarEvent.contact_number, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('Event sent for approval! Updated details will show after admin approval.').position('top right'));
                            var checkExists = false;
                            for(var i=0, j=vm.eventData.length; i<j; i++){
                                if(vm.eventData[i].event_id==$scope.current_event_id && vm.eventData[i].status=='modified'){
                                    vm.eventData[i].start_date = start_date;
                                    vm.eventData[i].end_date = end_date;
                                    vm.eventData[i].title = response.calendarEvent.title;
                                    vm.eventData[i].description = response.calendarEvent.description;
                                    vm.eventData[i].location = response.calendarEvent.location;
                                    vm.eventData[i].categories = response.calendarEvent.categories;
                                    vm.eventData[i].attachments = JSON.stringify(response.calendarEvent.attachments);
                                    vm.eventData[i].recurring = response.calendarEvent.recurring;
                                    vm.eventData[i].recurring_days = response.calendarEvent.recurring_days;
                                checkExists = true;
                                }
                            }
                            if(checkExists==false){
                            var obj = {};
                            obj.start_date = start_date;
                            obj.end_date = end_date;
                            obj.title = response.calendarEvent.title;
                            obj.description = response.calendarEvent.description;
                            obj.event_id = $scope.current_event_id;
                            obj.status = 'modified';
                            vm.eventData.push(obj);
                            }
                            DashboardService.notifyAdminEventModify($scope.current_event_id, function(data, status){
                        
                             });
                        }
                    });
                }
                    
                }else if(response.type=='edit_approved')
                {
                    console.log(response);
                    var start_date = $filter('date')(response.calendarEvent.start, "yyyy-MM-dd");
                    var end_date = $filter('date')(response.calendarEvent.end, "yyyy-MM-dd");
                    DashboardService.userEditApprovedEvent($rootScope.globals.user_data.user_id, start_date, end_date, response.calendarEvent.title, response.calendarEvent.description, response.calendarEvent.categories, response.calendarEvent.location, JSON.stringify(response.calendarEvent.attachments), $scope.current_event_id, response.calendarEvent.recurring, response.calendarEvent.recurring_days, response.calendarEvent.start_time_hours+':'+response.calendarEvent.start_time_minutes, response.calendarEvent.end_time_hours+':'+response.calendarEvent.end_time_minutes, response.calendarEvent.month_recurring, response.calendarEvent.link, response.calendarEvent.contact_name, response.calendarEvent.contact_number, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('Event sent for approval! Updated details will show after admin approval.').position('top right'));
                            var checkExists = false;
                            for(var i=0, j=vm.eventData.length; i<j; i++){
                                if(vm.eventData[i].event_id==$scope.current_event_id && vm.eventData[i].status=='modified'){
                                    vm.eventData[i].start_date = start_date;
                                    vm.eventData[i].end_date = end_date;
                                    vm.eventData[i].title = response.calendarEvent.title;
                                    vm.eventData[i].description = response.calendarEvent.description;
                                    vm.eventData[i].location = response.calendarEvent.location;
                                checkExists = true;
                                }
                            }
                            if(checkExists==false){
                            var obj = {};
                            obj.start_date = start_date;
                            obj.end_date = end_date;
                            obj.title = response.calendarEvent.title;
                            obj.description = response.calendarEvent.description;
                            obj.event_id = $scope.current_event_id;
                            obj.status = 'modified';
                            vm.eventData.push(obj);
                            }
                            DashboardService.notifyAdminEventModify($scope.current_event_id, function(data, status){
                        
                            });
                        }
                    });
                    
                }
            });
        }


        $scope.showConfirm = function(ev, id) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Are you sure?')
                  .textContent('Event will be deleted.')
                  .targetEvent(ev)
                  .ok('Delete')
                  .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
              DashboardService.deleteEvent($rootScope.globals.user_data.user_id, id, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('Event deleted!').position('top right'));
                            for(var i=0, j=vm.eventData.length; i<j; i++){
                                if(vm.eventData[i].event_id==id){
                                    vm.eventData.splice(i, 1);
                                    break;
                                }
                            }
                        }
                    });
            }, function() {
              
            });
          };

          $scope.pendingFilter = function (item) { 
              if (item.status === 'pending' || item.status === 'modified') {
                return item;
             }
            };

    }
})();

(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
    angular
        .module('app.create_user', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.create_user', {
                url    : '/create_user',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/create_user/create_user.html',
                        controller : 'createUserController as vm'
                    }
                }
            });

        // Translation

        // Navigation
       /* msNavigationServiceProvider.saveItem('fuse', {
            title : 'create_user',
            group : true,
            weight: 1
        });*/

        msNavigationServiceProvider.saveItem('create_user', {
            title    : 'Create User',
            icon     : 'icon-tile-four',
            state    : 'app.create_user',
            /*stateParams: {
                'param1': 'page'
             },*/
            weight   : 1
        });
    }
})();
(function ()
{
    'use strict';

	createUserService.$inject = ["$http", "$rootScope"];
    angular
        .module('app.create_user')
        .factory('createUserService', createUserService);

    /** @ngInject */
    
    function createUserService($http, $rootScope)
    {
    return {
      createUser: function (formdata, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'register/createUser',
				data: 'email='+formdata.email+'&password='+formdata.password+'&name='+formdata.name+'&last_name='+formdata.last_name+'&middle_name='+formdata.middle_name+'&title='+formdata.title+'&organization='+formdata.organization+'&phone='+formdata.phone+'&account_status=active',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	}
    }
	}
})();
(function ()
{
    'use strict';

    createUserController.$inject = ["$scope", "createUserService", "$mdToast"];
    angular
        .module('app.create_user')
        .controller('createUserController', createUserController);

    /** @ngInject */
    function createUserController($scope, createUserService, $mdToast)
    {
        var vm = this;

        $scope.createAdmin = function($valid){
            console.log(vm.basicForm);
            createUserService.createUser(vm.basicForm, function(data, status){
                console.log(data);
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Created!').position('top right'));
                    vm.basicForm = {};
                    $scope.basicForm.$setValidity();
                    $scope.basicForm.$setPristine();
                    $scope.basicForm.$setUntouched();
                }else{
                    $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                }
            });
        }
    }
})();

(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
    angular
        .module('app.create_admin', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.create_admin', {
                url    : '/create_admin',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/create_admin/create_admin.html',
                        controller : 'createAdminController as vm'
                    }
                }
            });

        // Translation

        // Navigation
        /*msNavigationServiceProvider.saveItem('fuse', {
            title : 'create_admin',
            group : true,
            weight: 1
        });*/

        msNavigationServiceProvider.saveItem('create_admin', {
            title    : 'Create admin',
            icon     : 'icon-tile-four',
            state    : 'app.create_admin',
            /*stateParams: {
                'param1': 'page'
             },*/
            weight   : 1
        });
    }
})();
(function ()
{
    'use strict';

	createAdminService.$inject = ["$http", "$rootScope"];
    angular
        .module('app.create_admin')
        .factory('createAdminService', createAdminService);

    /** @ngInject */
    
    function createAdminService($http, $rootScope)
    {
    return {
      createAdmin: function (obj, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'register/registerAdmin',
				data: 'fullname='+obj.fullname+'&email='+obj.email+'&password='+obj.password,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	}
    }
	}
})();
(function ()
{
    'use strict';

    createAdminController.$inject = ["$scope", "createAdminService", "$mdToast"];
    angular
        .module('app.create_admin')
        .controller('createAdminController', createAdminController);

    /** @ngInject */
    function createAdminController($scope, createAdminService, $mdToast)
    {
        var vm = this;

        $scope.createAdmin = function($valid){
            console.log(vm.basicForm);
            createAdminService.createAdmin(vm.basicForm, function(data, status){
                console.log(data);
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Created!').position('top right'));
                    vm.basicForm = {};
                    $scope.basicForm.$setValidity();
                    $scope.basicForm.$setPristine();
                    $scope.basicForm.$setUntouched();
                }else{
                    alert(data.message);
                }
            });
        }
        // Data

        // Methods

        //////////
    }
})();

(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
    angular
        .module('app.change_password', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.change_password', {
                url    : '/user/change_password',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/change_password/change_password.html',
                        controller : 'changePasswordController as vm'
                    }
                }
            });

        // Translation

        // Navigation
       /* msNavigationServiceProvider.saveItem('fuse', {
            title : 'create_user',
            group : true,
            weight: 1
        });*/

        /*msNavigationServiceProvider.saveItem('change_password', {
            title    : 'Change password',
            icon     : 'icon-key-variant',
            state    : 'app.change_password',
            weight   : 1
        });*/
    }
})();
(function ()
{
    'use strict';

	changeAdminPasswordService.$inject = ["$http", "$rootScope"];
    angular
        .module('app.change_password')
        .factory('changeAdminPasswordService', changeAdminPasswordService);

    /** @ngInject */
    
    function changeAdminPasswordService($http, $rootScope)
    {
    return {
    	changeAdminPassword: function (formdata, admin_id, type, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/changeAdminPassword',
				data: 'old_password='+formdata.old_password+'&new_password='+formdata.new_password+'&admin_id='+admin_id+'&type='+type,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	}
    }
	}
})();
(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
    angular
        .module('app.change_password_admin', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.change_password_admin', {
                url    : '/admin/change_password',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/change_password_admin/change_password_admin.html',
                        controller : 'changePasswordAdminController as vm'
                    }
                }
            });

        /*msNavigationServiceProvider.saveItem('change_password_admin', {
            title    : 'Change password',
            icon     : 'icon-key-variant',
            state    : 'app.change_password_admin',
            weight   : 1
        });*/
    }
})();
(function ()
{
    'use strict';

    changePasswordAdminController.$inject = ["$scope", "changeAdminPasswordService", "$mdToast", "$rootScope"];
    angular
        .module('app.change_password_admin')
        .controller('changePasswordAdminController', changePasswordAdminController);

    /** @ngInject */
    function changePasswordAdminController($scope, changeAdminPasswordService, $mdToast, $rootScope)
    {
        var vm = this;
        vm.basicForm = {};
        

        $scope.changePassword = function($valid){
            changeAdminPasswordService.changeAdminPassword(vm.basicForm, $rootScope.globals.user_data.admin_id, $rootScope.globals.user_data.type, function(data, status){
                console.log(data);
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Password has been changed!').position('top right'));
                    vm.basicForm = {};
                    $scope.basicForm.$setValidity();
                    $scope.basicForm.$setPristine();
                    $scope.basicForm.$setUntouched();
                }else{
                    $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                }
            });
        }
    }
})();

(function ()
{
    'use strict';

	changeUserPasswordService.$inject = ["$http", "$rootScope"];
    angular
        .module('app.change_password')
        .factory('changeUserPasswordService', changeUserPasswordService);

    /** @ngInject */
    
    function changeUserPasswordService($http, $rootScope)
    {
    return {
    	changeUserPassword: function (formdata, user_id, type, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/changeUserPassword',
				data: 'old_password='+formdata.old_password+'&new_password='+formdata.new_password+'&user_id='+user_id+'&type='+type,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	}
    }
	}
})();
(function ()
{
    'use strict';

    changePasswordController.$inject = ["$scope", "changeUserPasswordService", "$mdToast", "$rootScope"];
    angular
        .module('app.change_password')
        .controller('changePasswordController', changePasswordController);

    /** @ngInject */
    function changePasswordController($scope, changeUserPasswordService, $mdToast, $rootScope)
    {
        var vm = this;
        vm.basicForm = {};
        

        $scope.changePassword = function($valid){
            changeUserPasswordService.changeUserPassword(vm.basicForm, $rootScope.globals.user_data.user_id, $rootScope.globals.user_data.type, function(data, status){
                console.log(data);
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Password has been changed!').position('top right'));
                    vm.basicForm = {};
                    $scope.basicForm.$setValidity();
                    $scope.basicForm.$setPristine();
                    $scope.basicForm.$setUntouched();
                }else{
                    $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                }
            });
        }
    }
})();

(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
    angular
        .module('app.banner_images', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.banner_images', {
                url    : '/banner_images',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/banner_images/banner_images.html',
                        controller : 'bannerImagesController as vm'
                    }
                }
            });

        // Translation

        // Navigation
       /* msNavigationServiceProvider.saveItem('fuse', {
            title : 'create_user',
            group : true,
            weight: 1
        });*/

        msNavigationServiceProvider.saveItem('banner_images', {
            title    : 'Banner images',
            icon     : 'icon-image-area',
            state    : 'app.banner_images',
            /*stateParams: {
                'param1': 'page'
             },*/
            weight   : 1
        });
    }
})();
(function ()
{
    'use strict';

	bannerImagesService.$inject = ["$http", "$rootScope"];
    angular
        .module('app.banner_images')
        .factory('bannerImagesService', bannerImagesService);

    /** @ngInject */
    
    function bannerImagesService($http, $rootScope)
    {
    return {
    	getBannerImage: function (callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/getBannerImages',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	deleteEvent: function (user_id, id, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/deleteEvent',
				data: 'user_id='+user_id+'&event_id='+id,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	uploadFile: function (attachment, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/uploadBannerImage',
				data: attachment,
				transformRequest: angular.identity,
            	headers: {'Content-Type': undefined}
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	},
    	saveBannerImages: function (images, callback){
	      $http({
				method: 'POST',
				url: $rootScope.Main_Url+'web_services/saveBannerImages',
				data: 'images='+images,
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success(function(data, status, headers, config){
				callback(data, status);
			}).error(function(data, status, headers, config){
				callback(data, status);
			});
    	}
    }
	}
})();
(function ()
{
    'use strict';

    bannerImagesController.$inject = ["$scope", "bannerImagesService", "$mdToast", "$rootScope"];
    angular
        .module('app.banner_images')
        .controller('bannerImagesController', bannerImagesController);

    /** @ngInject */
    function bannerImagesController($scope, bannerImagesService, $mdToast, $rootScope)
    {
        var vm = this;
        $scope.addImage = function(){
            document.getElementById('add_image').click();
        }
        vm.attachments = [];
        vm.uploaded_file = [];
        var image_count = 0;
        $scope.uploadingFile = false;
        $scope.deletingFile = false;

        bannerImagesService.getBannerImage(function(data, status){
            console.log(data);
            if(data.success==true){
                var files_attachments = JSON.parse(data.data.images);
                for(var i=0, j=files_attachments.length; i<j; i++){
                    image_count++;
                    var obj = {};
                    var tempObj = {};
                    obj.name = files_attachments[i].name;
                    tempObj.name = files_attachments[i].name;
                    obj.temp_id = image_count;
                    tempObj.size = files_attachments[i].size;
                    obj.size = files_attachments[i].size;
                    obj.filepath = files_attachments[i].filepath;
                    obj.extension = files_attachments[i].extension;
                    tempObj.extension = files_attachments[i].extension;
                    tempObj.filepath = files_attachments[i].filepath;
                    obj.uploading = false;
                    vm.attachments.push(obj);
                    vm.uploaded_file.push(tempObj);
                    console.log(vm.attachments);
                }
            }else{
                $mdToast.show($mdToast.simple().textContent('No data found!').position('top right'));
            }
        });

         $scope.handleFileSelect = function(evt){
            image_count++;
            var files = evt.files; // FileList object
            console.log(files);
            var obj = {};
            obj.name = files[0].name;
            obj.size = Math.ceil(files[0].size/1024);
            obj.uploading = true;
            obj.filepath = '';
            obj.temp_id = image_count;
            vm.attachments.push(obj);

            var formData = new FormData();
            var file = document.getElementById('add_image').files[0];
            formData.append('attachment', file);
            $scope.uploadingFile = true;
            $mdToast.show($mdToast.simple().textContent('Uploading!').position('top right'));
            bannerImagesService.uploadFile(formData, function(data, status){
                console.log(data);
                $scope.uploadingFile = false;
                if(data.success==true){
                    $mdToast.show($mdToast.simple().textContent('Uploaded successfully!').position('top right'));
                    var tempObj = {};
                    tempObj.name = files[0].name;
                    tempObj.size = Math.ceil(files[0].size/1024);
                    tempObj.filepath = data.filepath;
                    tempObj.extension = data.extension;
                    vm.uploaded_file.push(tempObj);
                    var uploadData = JSON.stringify(vm.uploaded_file);
                    //vm.uploaded_file.push(data.filepath);
                    for(var i=0, j=vm.attachments.length; i<j; i++){
                        if(vm.attachments[i].temp_id==obj.temp_id){
                            vm.attachments[i].uploading = false;
                            vm.attachments[i].filepath = data.filepath;
                        }
                    }
                    bannerImagesService.saveBannerImages(uploadData, function(data, status){
                        console.log(data);
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('Banner images list updated!').position('top right'));
                        }else{
                            $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                        }
                    });
                }else{
                    $mdToast.show($mdToast.simple().textContent('Not able to upload!').position('top right'));
                }
            });
          }

          $scope.deleteFile = function(id, filename){
            $scope.deletingFile = true;
            for(var i=0, j=vm.attachments.length; i<j; i++){
                if(vm.attachments[i].temp_id==id){
                    vm.attachments.splice(i, 1);
                    break;
                }
            }
            for(var i=0, j=vm.uploaded_file.length; i<j; i++){
                if(vm.uploaded_file[i].filepath==filename){
                    vm.uploaded_file.splice(i, 1);
                    break;
                }
            }
            var uploadData = JSON.stringify(vm.uploaded_file);
            $mdToast.show($mdToast.simple().textContent('Please wait!').position('top right'));
            bannerImagesService.saveBannerImages(uploadData, function(data, status){
                        console.log(data);
                        $scope.deletingFile = false;
                        if(data.success==true){
                            $mdToast.show($mdToast.simple().textContent('Image deleted!').position('top right'));
                        }else{
                            $mdToast.show($mdToast.simple().textContent(data.message).position('top right'));
                        }
            });
            
          }
    }
})();

(function ()
{
    'use strict';

    angular
        .module('app.core')
        .provider('fuseTheming', fuseThemingProvider);

    /** @ngInject */
    function fuseThemingProvider()
    {
        // Inject Cookies Service
        var $cookies;

        angular.injector(['ngCookies']).invoke([
            '$cookies', function (_$cookies)
            {
                $cookies = _$cookies;
            }
        ]);

        // Inject $log service
        var $log = angular.injector(['ng']).get('$log');

        var registeredPalettes,
            registeredThemes;

        // Methods
        this.setRegisteredPalettes = setRegisteredPalettes;
        this.setRegisteredThemes = setRegisteredThemes;

        //////////

        /**
         * Set registered palettes
         *
         * @param _registeredPalettes
         */
        function setRegisteredPalettes(_registeredPalettes)
        {
            registeredPalettes = _registeredPalettes;
        }

        /**
         * Set registered themes
         *
         * @param _registeredThemes
         */
        function setRegisteredThemes(_registeredThemes)
        {
            registeredThemes = _registeredThemes;
        }

        /**
         * Service
         */
        this.$get = function ()
        {
            var service = {
                getRegisteredPalettes: getRegisteredPalettes,
                getRegisteredThemes  : getRegisteredThemes,
                setActiveTheme       : setActiveTheme,
                setThemesList        : setThemesList,
                themes               : {
                    list  : {},
                    active: {
                        'name' : '',
                        'theme': {}
                    }
                }
            };

            return service;

            //////////

            /**
             * Get registered palettes
             *
             * @returns {*}
             */
            function getRegisteredPalettes()
            {
                return registeredPalettes;
            }

            /**
             * Get registered themes
             *
             * @returns {*}
             */
            function getRegisteredThemes()
            {
                return registeredThemes;
            }

            /**
             * Set active theme
             *
             * @param themeName
             */
            function setActiveTheme(themeName)
            {
                // If theme does not exist, fallback to the default theme
                if ( angular.isUndefined(service.themes.list[themeName]) )
                {
                    // If there is no theme called "default"...
                    if ( angular.isUndefined(service.themes.list.default) )
                    {
                        $log.error('You must have at least one theme named "default"');
                        return;
                    }

                    $log.warn('The theme "' + themeName + '" does not exist! Falling back to the "default" theme.');

                    // Otherwise set theme to default theme
                    service.themes.active.name = 'default';
                    service.themes.active.theme = service.themes.list.default;
                    $cookies.put('selectedTheme', service.themes.active.name);

                    return;
                }

                service.themes.active.name = themeName;
                service.themes.active.theme = service.themes.list[themeName];
                $cookies.put('selectedTheme', themeName);
            }

            /**
             * Set available themes list
             *
             * @param themeList
             */
            function setThemesList(themeList)
            {
                service.themes.list = themeList;
            }
        };
    }
})();

(function ()
{
    'use strict';

    config.$inject = ["$mdThemingProvider", "fusePalettes", "fuseThemes", "fuseThemingProvider"];
    angular
        .module('app.core')
        .config(config);

    /** @ngInject */
    function config($mdThemingProvider, fusePalettes, fuseThemes, fuseThemingProvider)
    {
        // Inject Cookies Service
        var $cookies;
        angular.injector(['ngCookies']).invoke([
            '$cookies', function (_$cookies)
            {
                $cookies = _$cookies;
            }
        ]);

        // Check if custom theme exist in cookies
        var customTheme = $cookies.getObject('customTheme');
        if ( customTheme )
        {
            fuseThemes['custom'] = customTheme;
        }

        $mdThemingProvider.alwaysWatchTheme(true);

        // Define custom palettes
        angular.forEach(fusePalettes, function (palette)
        {
            $mdThemingProvider.definePalette(palette.name, palette.options);
        });

        // Register custom themes
        angular.forEach(fuseThemes, function (theme, themeName)
        {
            $mdThemingProvider.theme(themeName)
                .primaryPalette(theme.primary.name, theme.primary.hues)
                .accentPalette(theme.accent.name, theme.accent.hues)
                .warnPalette(theme.warn.name, theme.warn.hues)
                .backgroundPalette(theme.background.name, theme.background.hues);
        });

        // Store generated PALETTES and THEMES objects from $mdThemingProvider
        // in our custom provider, so we can inject them into other areas
        fuseThemingProvider.setRegisteredPalettes($mdThemingProvider._PALETTES);
        fuseThemingProvider.setRegisteredThemes($mdThemingProvider._THEMES);
    }

})();
(function ()
{
    'use strict';

    var fuseThemes = {
        'default'  : {
            primary   : {
                name: 'fuse-pale-blue',
                hues: {
                    'default': '700',
                    'hue-1'  : '500',
                    'hue-2'  : '600',
                    'hue-3'  : '400'
                }
            },
            accent    : {
                name: 'light-blue',
                hues: {
                    'default': '600',
                    'hue-1'  : '400',
                    'hue-2'  : '700',
                    'hue-3'  : 'A100'
                }
            },
            warn      : {name: 'red'},
            background: {
                name: 'grey',
                hues: {
                    'default': 'A100',
                    'hue-1'  : '100',
                    'hue-2'  : '50',
                    'hue-3'  : '300'
                }
            }
        },
        'pink': {
            primary   : {
                name: 'blue-grey',
                hues: {
                    'default': '800',
                    'hue-1'  : '600',
                    'hue-2'  : '400',
                    'hue-3'  : 'A100'
                }
            },
            accent    : {
                name: 'pink',
                hues: {
                    'default': '400',
                    'hue-1'  : '300',
                    'hue-2'  : '600',
                    'hue-3'  : 'A100'
                }
            },
            warn      : {name: 'blue'},
            background: {
                name: 'grey',
                hues: {
                    'default': 'A100',
                    'hue-1'  : '100',
                    'hue-2'  : '50',
                    'hue-3'  : '300'
                }
            }
        },
        'teal'     : {
            primary   : {
                name: 'fuse-blue',
                hues: {
                    'default': '900',
                    'hue-1'  : '600',
                    'hue-2'  : '500',
                    'hue-3'  : 'A100'
                }
            },
            accent    : {
                name: 'teal',
                hues: {
                    'default': '500',
                    'hue-1'  : '400',
                    'hue-2'  : '600',
                    'hue-3'  : 'A100'
                }
            },
            warn      : {name: 'deep-orange'},
            background: {
                name: 'grey',
                hues: {
                    'default': 'A100',
                    'hue-1'  : '100',
                    'hue-2'  : '50',
                    'hue-3'  : '300'
                }
            }
        }
    };

    angular
        .module('app.core')
        .constant('fuseThemes', fuseThemes);
})();
(function () {
    'use strict';

    var fusePalettes = [
        {
            name: 'fuse-blue',
            options: {
                '50': '#ebf1fa',
                '100': '#c2d4ef',
                '200': '#9ab8e5',
                '300': '#78a0dc',
                '400': '#5688d3',
                '500': '#3470ca',
                '600': '#2e62b1',
                '700': '#275498',
                '800': '#21467e',
                '900': '#1a3865',
                'A100': '#c2d4ef',
                'A200': '#9ab8e5',
                'A400': '#5688d3',
                'A700': '#275498',
                'contrastDefaultColor': 'light',
                'contrastDarkColors': '50 100 200 A100',
                'contrastStrongLightColors': '300 400'
            }
        },
        {
            name: 'fuse-pale-blue',
            options: {
                '50': '#ececee',
                '100': '#c5c6cb',
                '200': '#9ea1a9',
                '300': '#7d818c',
                '400': '#5c616f',
                '500': '#3c4252',
                '600': '#353a48',
                '700': '#2d323e',
                '800': '#262933',
                '900': '#1e2129',
                'A100': '#c5c6cb',
                'A200': '#9ea1a9',
                'A400': '#5c616f',
                'A700': '#2d323e',
                'contrastDefaultColor': 'light',
                'contrastDarkColors': '50 100 200 A100',
                'contrastStrongLightColors': '300 400'
            }
        }
    ];

    angular
        .module('app.core')
        .constant('fusePalettes', fusePalettes);
})();
(function ()
{
    'use strict';

    fuseGeneratorService.$inject = ["$cookies", "$log", "fuseTheming"];
    angular
        .module('app.core')
        .factory('fuseGenerator', fuseGeneratorService);

    /** @ngInject */
    function fuseGeneratorService($cookies, $log, fuseTheming)
    {
        // Storage for simplified themes object
        var themes = {};

        var service = {
            generate: generate,
            rgba    : rgba
        };

        return service;

        //////////

        /**
         * Generate less variables for each theme from theme's
         * palette by using material color naming conventions
         */
        function generate()
        {
            var registeredThemes = fuseTheming.getRegisteredThemes();
            var registeredPalettes = fuseTheming.getRegisteredPalettes();

            // First, create a simplified object that stores
            // all registered themes and their colors

            // Iterate through registered themes
            angular.forEach(registeredThemes, function (registeredTheme)
            {
                themes[registeredTheme.name] = {};

                // Iterate through color types (primary, accent, warn & background)
                angular.forEach(registeredTheme.colors, function (colorType, colorTypeName)
                {
                    themes[registeredTheme.name][colorTypeName] = {
                        'name'  : colorType.name,
                        'levels': {
                            'default': {
                                'color'    : rgba(registeredPalettes[colorType.name][colorType.hues.default].value),
                                'contrast1': rgba(registeredPalettes[colorType.name][colorType.hues.default].contrast, 1),
                                'contrast2': rgba(registeredPalettes[colorType.name][colorType.hues.default].contrast, 2),
                                'contrast3': rgba(registeredPalettes[colorType.name][colorType.hues.default].contrast, 3),
                                'contrast4': rgba(registeredPalettes[colorType.name][colorType.hues.default].contrast, 4)
                            },
                            'hue1'   : {
                                'color'    : rgba(registeredPalettes[colorType.name][colorType.hues['hue-1']].value),
                                'contrast1': rgba(registeredPalettes[colorType.name][colorType.hues['hue-1']].contrast, 1),
                                'contrast2': rgba(registeredPalettes[colorType.name][colorType.hues['hue-1']].contrast, 2),
                                'contrast3': rgba(registeredPalettes[colorType.name][colorType.hues['hue-1']].contrast, 3),
                                'contrast4': rgba(registeredPalettes[colorType.name][colorType.hues['hue-1']].contrast, 4)
                            },
                            'hue2'   : {
                                'color'    : rgba(registeredPalettes[colorType.name][colorType.hues['hue-2']].value),
                                'contrast1': rgba(registeredPalettes[colorType.name][colorType.hues['hue-2']].contrast, 1),
                                'contrast2': rgba(registeredPalettes[colorType.name][colorType.hues['hue-2']].contrast, 2),
                                'contrast3': rgba(registeredPalettes[colorType.name][colorType.hues['hue-2']].contrast, 3),
                                'contrast4': rgba(registeredPalettes[colorType.name][colorType.hues['hue-2']].contrast, 4)
                            },
                            'hue3'   : {
                                'color'    : rgba(registeredPalettes[colorType.name][colorType.hues['hue-3']].value),
                                'contrast1': rgba(registeredPalettes[colorType.name][colorType.hues['hue-3']].contrast, 1),
                                'contrast2': rgba(registeredPalettes[colorType.name][colorType.hues['hue-3']].contrast, 2),
                                'contrast3': rgba(registeredPalettes[colorType.name][colorType.hues['hue-3']].contrast, 3),
                                'contrast4': rgba(registeredPalettes[colorType.name][colorType.hues['hue-3']].contrast, 4)
                            }
                        }
                    };
                });
            });

            // Process themes one more time and then store them in the service for external use
            processAndStoreThemes(themes);

            // Iterate through simplified themes
            // object and create style variables
            var styleVars = {};

            // Iterate through registered themes
            angular.forEach(themes, function (theme, themeName)
            {
                styleVars = {};
                styleVars['@themeName'] = themeName;

                // Iterate through color types (primary, accent, warn & background)
                angular.forEach(theme, function (colorTypes, colorTypeName)
                {
                    // Iterate through color levels (default, hue1, hue2 & hue3)
                    angular.forEach(colorTypes.levels, function (colors, colorLevelName)
                    {
                        // Iterate through color name (color, contrast1, contrast2, contrast3 & contrast4)
                        angular.forEach(colors, function (color, colorName)
                        {
                            styleVars['@' + colorTypeName + ucfirst(colorLevelName) + ucfirst(colorName)] = color;
                        });
                    });
                });

                // Render styles
                render(styleVars);
            });
        }

        // ---------------------------
        //  INTERNAL HELPER FUNCTIONS
        // ---------------------------

        /**
         * Process and store themes for global use
         *
         * @param _themes
         */
        function processAndStoreThemes(_themes)
        {
            // Here we will go through every registered theme one more time
            // and try to simplify their objects as much as possible for
            // easier access to their properties.
            var themes = angular.copy(_themes);

            // Iterate through themes
            angular.forEach(themes, function (theme)
            {
                // Iterate through color types (primary, accent, warn & background)
                angular.forEach(theme, function (colorType, colorTypeName)
                {
                    theme[colorTypeName] = colorType.levels;
                    theme[colorTypeName].color = colorType.levels.default.color;
                    theme[colorTypeName].contrast1 = colorType.levels.default.contrast1;
                    theme[colorTypeName].contrast2 = colorType.levels.default.contrast2;
                    theme[colorTypeName].contrast3 = colorType.levels.default.contrast3;
                    theme[colorTypeName].contrast4 = colorType.levels.default.contrast4;
                    delete theme[colorTypeName].default;
                });
            });

            // Store themes and set selected theme for the first time
            fuseTheming.setThemesList(themes);

            // Remember selected theme.
            var selectedTheme = $cookies.get('selectedTheme');

            if ( selectedTheme )
            {
                fuseTheming.setActiveTheme(selectedTheme);
            }
            else
            {
                fuseTheming.setActiveTheme('default');
            }
        }


        /**
         * Render css files
         *
         * @param styleVars
         */
        function render(styleVars)
        {
            var cssTemplate = '[md-theme="@themeName"] a {\n    color: @accentDefaultColor;\n}\n\n[md-theme="@themeName"] .secondary-text,\n[md-theme="@themeName"] .icon {\n    color: @backgroundDefaultContrast2;\n}\n\n[md-theme="@themeName"] .hint-text,\n[md-theme="@themeName"] .disabled-text {\n    color: @backgroundDefaultContrast3;\n}\n\n[md-theme="@themeName"] .fade-text,\n[md-theme="@themeName"] .divider {\n    color: @backgroundDefaultContrast4;\n}\n\n/* Primary */\n[md-theme="@themeName"] .md-primary-bg {\n    background-color: @primaryDefaultColor;\n    color: @primaryDefaultContrast1;\n}\n\n[md-theme="@themeName"] .md-primary-bg .secondary-text,\n[md-theme="@themeName"] .md-primary-bg .icon {\n    color: @primaryDefaultContrast2;\n}\n\n[md-theme="@themeName"] .md-primary-bg .hint-text,\n[md-theme="@themeName"] .md-primary-bg .disabled-text {\n    color: @primaryDefaultContrast3;\n}\n\n[md-theme="@themeName"] .md-primary-bg .fade-text,\n[md-theme="@themeName"] .md-primary-bg .divider {\n    color: @primaryDefaultContrast4;\n}\n\n/* Primary, Hue-1 */\n[md-theme="@themeName"] .md-primary-bg.md-hue-1 {\n    background-color: @primaryHue1Color;\n    color: @primaryHue1Contrast1;\n}\n\n[md-theme="@themeName"] .md-primary-bg.md-hue-1 .secondary-text,\n[md-theme="@themeName"] .md-primary-bg.md-hue-1 .icon {\n    color: @primaryHue1Contrast2;\n}\n\n[md-theme="@themeName"] .md-primary-bg.md-hue-1 .hint-text,\n[md-theme="@themeName"] .md-primary-bg.md-hue-1 .disabled-text {\n    color: @primaryHue1Contrast3;\n}\n\n[md-theme="@themeName"] .md-primary-bg.md-hue-1 .fade-text,\n[md-theme="@themeName"] .md-primary-bg.md-hue-1 .divider {\n    color: @primaryHue1Contrast4;\n}\n\n/* Primary, Hue-2 */\n[md-theme="@themeName"] .md-primary-bg.md-hue-2 {\n    background-color: @primaryHue2Color;\n    color: @primaryHue2Contrast1;\n}\n\n[md-theme="@themeName"] .md-primary-bg.md-hue-2 .secondary-text,\n[md-theme="@themeName"] .md-primary-bg.md-hue-2 .icon {\n    color: @primaryHue2Contrast2;\n}\n\n[md-theme="@themeName"] .md-primary-bg.md-hue-2 .hint-text,\n[md-theme="@themeName"] .md-primary-bg.md-hue-2 .disabled-text {\n    color: @primaryHue2Contrast3;\n}\n\n[md-theme="@themeName"] .md-primary-bg.md-hue-2 .fade-text,\n[md-theme="@themeName"] .md-primary-bg.md-hue-2 .divider {\n    color: @primaryHue2Contrast4;\n}\n\n/* Primary, Hue-3 */\n[md-theme="@themeName"] .md-primary-bg.md-hue-3 {\n    background-color: @primaryHue3Color;\n    color: @primaryHue3Contrast1;\n}\n\n[md-theme="@themeName"] .md-primary-bg.md-hue-3 .secondary-text,\n[md-theme="@themeName"] .md-primary-bg.md-hue-3 .icon {\n    color: @primaryHue3Contrast1;\n}\n\n[md-theme="@themeName"] .md-primary-bg.md-hue-3 .hint-text,\n[md-theme="@themeName"] .md-primary-bg.md-hue-3 .disabled-text {\n    color: @primaryHue3Contrast3;\n}\n\n[md-theme="@themeName"] .md-primary-bg.md-hue-3 .fade-text,\n[md-theme="@themeName"] .md-primary-bg.md-hue-3 .divider {\n    color: @primaryHue3Contrast4;\n}\n\n/* Primary foreground */\n[md-theme="@themeName"] .md-primary-fg {\n    color: @primaryDefaultColor !important;\n}\n\n/* Primary foreground, Hue-1 */\n[md-theme="@themeName"] .md-primary-fg.md-hue-1 {\n    color: @primaryHue1Color !important;\n}\n\n/* Primary foreground, Hue-2 */\n[md-theme="@themeName"] .md-primary-fg.md-hue-2 {\n    color: @primaryHue2Color !important;\n}\n\n/* Primary foreground, Hue-3 */\n[md-theme="@themeName"] .md-primary-fg.md-hue-3 {\n    color: @primaryHue3Color !important;\n}\n\n\n/* Accent */\n[md-theme="@themeName"] .md-accent-bg {\n    background-color: @accentDefaultColor;\n    color: @accentDefaultContrast1;\n}\n\n[md-theme="@themeName"] .md-accent-bg .secondary-text,\n[md-theme="@themeName"] .md-accent-bg .icon {\n    color: @accentDefaultContrast2;\n}\n\n[md-theme="@themeName"] .md-accent-bg .hint-text,\n[md-theme="@themeName"] .md-accent-bg .disabled-text {\n    color: @accentDefaultContrast3;\n}\n\n[md-theme="@themeName"] .md-accent-bg .fade-text,\n[md-theme="@themeName"] .md-accent-bg .divider {\n    color: @accentDefaultContrast4;\n}\n\n/* Accent, Hue-1 */\n[md-theme="@themeName"] .md-accent-bg.md-hue-1 {\n    background-color: @accentHue1Color;\n    color: @accentHue1Contrast1;\n}\n\n[md-theme="@themeName"] .md-accent-bg.md-hue-1 .secondary-text,\n[md-theme="@themeName"] .md-accent-bg.md-hue-1 .icon {\n    color: @accentHue1Contrast2;\n}\n\n[md-theme="@themeName"] .md-accent-bg.md-hue-1 .hint-text,\n[md-theme="@themeName"] .md-accent-bg.md-hue-1 .disabled-text {\n    color: @accentHue1Contrast3;\n}\n\n[md-theme="@themeName"] .md-accent-bg.md-hue-1 .fade-text,\n[md-theme="@themeName"] .md-accent-bg.md-hue-1 .divider {\n    color: @accentHue1Contrast4;\n}\n\n/* Accent, Hue-2 */\n[md-theme="@themeName"] .md-accent-bg.md-hue-2 {\n    background-color: @accentHue2Color;\n    color: @accentHue2Contrast1;\n}\n\n[md-theme="@themeName"] .md-accent-bg.md-hue-2 .secondary-text,\n[md-theme="@themeName"] .md-accent-bg.md-hue-2 .icon {\n    color: @accentHue2Contrast2;\n}\n\n[md-theme="@themeName"] .md-accent-bg.md-hue-2 .hint-text,\n[md-theme="@themeName"] .md-accent-bg.md-hue-2 .disabled-text {\n    color: @accentHue2Contrast3;\n}\n\n[md-theme="@themeName"] .md-accent-bg.md-hue-2 .fade-text,\n[md-theme="@themeName"] .md-accent-bg.md-hue-2 .divider {\n    color: @accentHue2Contrast4;\n}\n\n/* Accent, Hue-3 */\n[md-theme="@themeName"] .md-accent-bg.md-hue-3 {\n    background-color: @accentHue3Color;\n    color: @accentHue3Contrast1;\n}\n\n[md-theme="@themeName"] .md-accent-bg.md-hue-3 .secondary-text,\n[md-theme="@themeName"] .md-accent-bg.md-hue-3 .icon {\n    color: @accentHue3Contrast1;\n}\n\n[md-theme="@themeName"] .md-accent-bg.md-hue-3 .hint-text,\n[md-theme="@themeName"] .md-accent-bg.md-hue-3 .disabled-text {\n    color: @accentHue3Contrast3;\n}\n\n[md-theme="@themeName"] .md-accent-bg.md-hue-3 .fade-text,\n[md-theme="@themeName"] .md-accent-bg.md-hue-3 .divider {\n    color: @accentHue3Contrast4;\n}\n\n/* Accent foreground */\n[md-theme="@themeName"] .md-accent-fg {\n    color: @accentDefaultColor !important;\n}\n\n/* Accent foreground, Hue-1 */\n[md-theme="@themeName"] .md-accent-fg.md-hue-1 {\n    color: @accentHue1Color !important;\n}\n\n/* Accent foreground, Hue-2 */\n[md-theme="@themeName"] .md-accent-fg.md-hue-2 {\n    color: @accentHue2Color !important;\n}\n\n/* Accent foreground, Hue-3 */\n[md-theme="@themeName"] .md-accent-fg.md-hue-3 {\n    color: @accentHue3Color !important;\n}\n\n\n/* Warn */\n[md-theme="@themeName"] .md-warn-bg {\n    background-color: @warnDefaultColor;\n    color: @warnDefaultContrast1;\n}\n\n[md-theme="@themeName"] .md-warn-bg .secondary-text,\n[md-theme="@themeName"] .md-warn-bg .icon {\n    color: @warnDefaultContrast2;\n}\n\n[md-theme="@themeName"] .md-warn-bg .hint-text,\n[md-theme="@themeName"] .md-warn-bg .disabled-text {\n    color: @warnDefaultContrast3;\n}\n\n[md-theme="@themeName"] .md-warn-bg .fade-text,\n[md-theme="@themeName"] .md-warn-bg .divider {\n    color: @warnDefaultContrast4;\n}\n\n/* Warn, Hue-1 */\n[md-theme="@themeName"] .md-warn-bg.md-hue-1 {\n    background-color: @warnHue1Color;\n    color: @warnHue1Contrast1;\n}\n\n[md-theme="@themeName"] .md-warn-bg.md-hue-1 .secondary-text,\n[md-theme="@themeName"] .md-warn-bg.md-hue-1 .icon {\n    color: @warnHue1Contrast2;\n}\n\n[md-theme="@themeName"] .md-warn-bg.md-hue-1 .hint-text,\n[md-theme="@themeName"] .md-warn-bg.md-hue-1 .disabled-text {\n    color: @warnHue1Contrast3;\n}\n\n[md-theme="@themeName"] .md-warn-bg.md-hue-1 .fade-text,\n[md-theme="@themeName"] .md-warn-bg.md-hue-1 .divider {\n    color: @warnHue1Contrast4;\n}\n\n/* Warn, Hue-2 */\n[md-theme="@themeName"] .md-warn-bg.md-hue-2 {\n    background-color: @warnHue2Color;\n    color: @warnHue2Contrast1;\n}\n\n[md-theme="@themeName"] .md-warn-bg.md-hue-2 .secondary-text,\n[md-theme="@themeName"] .md-warn-bg.md-hue-2 .icon {\n    color: @warnHue2Contrast2;\n}\n\n[md-theme="@themeName"] .md-warn-bg.md-hue-2 .hint-text,\n[md-theme="@themeName"] .md-warn-bg.md-hue-2 .disabled-text {\n    color: @warnHue2Contrast3;\n}\n\n[md-theme="@themeName"] .md-warn-bg.md-hue-2 .fade-text,\n[md-theme="@themeName"] .md-warn-bg.md-hue-2 .divider {\n    color: @warnHue2Contrast4;\n}\n\n/* Warn, Hue-3 */\n[md-theme="@themeName"] .md-warn-bg.md-hue-3 {\n    background-color: @warnHue3Color;\n    color: @warnHue3Contrast1;\n}\n\n[md-theme="@themeName"] .md-warn-bg.md-hue-3 .secondary-text,\n[md-theme="@themeName"] .md-warn-bg.md-hue-3 .icon {\n    color: @warnHue3Contrast1;\n}\n\n[md-theme="@themeName"] .md-warn-bg.md-hue-3 .hint-text,\n[md-theme="@themeName"] .md-warn-bg.md-hue-3 .disabled-text {\n    color: @warnHue3Contrast3;\n}\n\n[md-theme="@themeName"] .md-warn-bg.md-hue-3 .fade-text,\n[md-theme="@themeName"] .md-warn-bg.md-hue-3 .divider {\n    color: @warnHue3Contrast4;\n}\n\n/* Warn foreground */\n[md-theme="@themeName"] .md-warn-fg {\n    color: @warnDefaultColor !important;\n}\n\n/* Warn foreground, Hue-1 */\n[md-theme="@themeName"] .md-warn-fg.md-hue-1 {\n    color: @warnHue1Color !important;\n}\n\n/* Warn foreground, Hue-2 */\n[md-theme="@themeName"] .md-warn-fg.md-hue-2 {\n    color: @warnHue2Color !important;\n}\n\n/* Warn foreground, Hue-3 */\n[md-theme="@themeName"] .md-warn-fg.md-hue-3 {\n    color: @warnHue3Color !important;\n}\n\n/* Background */\n[md-theme="@themeName"] .md-background-bg {\n    background-color: @backgroundDefaultColor;\n    color: @backgroundDefaultContrast1;\n}\n\n[md-theme="@themeName"] .md-background-bg .secondary-text,\n[md-theme="@themeName"] .md-background-bg .icon {\n    color: @backgroundDefaultContrast2;\n}\n\n[md-theme="@themeName"] .md-background-bg .hint-text,\n[md-theme="@themeName"] .md-background-bg .disabled-text {\n    color: @backgroundDefaultContrast3;\n}\n\n[md-theme="@themeName"] .md-background-bg .fade-text,\n[md-theme="@themeName"] .md-background-bg .divider {\n    color: @backgroundDefaultContrast4;\n}\n\n/* Background, Hue-1 */\n[md-theme="@themeName"] .md-background-bg.md-hue-1 {\n    background-color: @backgroundHue1Color;\n    color: @backgroundHue1Contrast1;\n}\n\n[md-theme="@themeName"] .md-background-bg.md-hue-1 .secondary-text,\n[md-theme="@themeName"] .md-background-bg.md-hue-1 .icon {\n    color: @backgroundHue1Contrast2;\n}\n\n[md-theme="@themeName"] .md-background-bg.md-hue-1 .hint-text,\n[md-theme="@themeName"] .md-background-bg.md-hue-1 .disabled-text {\n    color: @backgroundHue1Contrast3;\n}\n\n[md-theme="@themeName"] .md-background-bg.md-hue-1 .fade-text,\n[md-theme="@themeName"] .md-background-bg.md-hue-1 .divider {\n    color: @backgroundHue1Contrast4;\n}\n\n/* Background, Hue-2 */\n[md-theme="@themeName"] .md-background-bg.md-hue-2 {\n    background-color: @backgroundHue2Color;\n    color: @backgroundHue2Contrast1;\n}\n\n[md-theme="@themeName"] .md-background-bg.md-hue-2 .secondary-text,\n[md-theme="@themeName"] .md-background-bg.md-hue-2 .icon {\n    color: @backgroundHue2Contrast2;\n}\n\n[md-theme="@themeName"] .md-background-bg.md-hue-2 .hint-text,\n[md-theme="@themeName"] .md-background-bg.md-hue-2 .disabled-text {\n    color: @backgroundHue2Contrast3;\n}\n\n[md-theme="@themeName"] .md-background-bg.md-hue-2 .fade-text,\n[md-theme="@themeName"] .md-background-bg.md-hue-2 .divider {\n    color: @backgroundHue2Contrast4;\n}\n\n/* Background, Hue-3 */\n[md-theme="@themeName"] .md-background-bg.md-hue-3 {\n    background-color: @backgroundHue3Color;\n    color: @backgroundHue3Contrast1;\n}\n\n[md-theme="@themeName"] .md-background-bg.md-hue-3 .secondary-text,\n[md-theme="@themeName"] .md-background-bg.md-hue-3 .icon {\n    color: @backgroundHue3Contrast1;\n}\n\n[md-theme="@themeName"] .md-background-bg.md-hue-3 .hint-text,\n[md-theme="@themeName"] .md-background-bg.md-hue-3 .disabled-text {\n    color: @backgroundHue3Contrast3;\n}\n\n[md-theme="@themeName"] .md-background-bg.md-hue-3 .fade-text,\n[md-theme="@themeName"] .md-background-bg.md-hue-3 .divider {\n    color: @backgroundHue3Contrast4;\n}\n\n/* Background foreground */\n[md-theme="@themeName"] .md-background-fg {\n    color: @backgroundDefaultColor !important;\n}\n\n/* Background foreground, Hue-1 */\n[md-theme="@themeName"] .md-background-fg.md-hue-1 {\n    color: @backgroundHue1Color !important;\n}\n\n/* Background foreground, Hue-2 */\n[md-theme="@themeName"] .md-background-fg.md-hue-2 {\n    color: @backgroundHue2Color !important;\n}\n\n/* Background foreground, Hue-3 */\n[md-theme="@themeName"] .md-background-fg.md-hue-3 {\n    color: @backgroundHue3Color !important;\n}';

            var regex = new RegExp(Object.keys(styleVars).join('|'), 'gi');
            var css = cssTemplate.replace(regex, function (matched)
            {
                return styleVars[matched];
            });

            var headEl = angular.element('head');
            var styleEl = angular.element('<style type="text/css"></style>');
            styleEl.html(css);
            headEl.append(styleEl);
        }

        /**
         * Convert color array to rgb/rgba
         * Also apply contrasts if needed
         *
         * @param color
         * @param _contrastLevel
         * @returns {string}
         */
        function rgba(color, _contrastLevel)
        {
            var contrastLevel = _contrastLevel || false;

            // Convert 255,255,255,0.XX to 255,255,255
            // According to Google's Material design specs, white primary
            // text must have opacity of 1 and we will fix that here
            // because Angular Material doesn't care about that spec
            if ( color.length === 4 && color[0] === 255 && color[1] === 255 && color[2] === 255 )
            {
                color.splice(3, 4);
            }

            // If contrast level provided, apply it to the current color
            if ( contrastLevel )
            {
                color = applyContrast(color, contrastLevel);
            }

            // Convert color array to color string (rgb/rgba)
            if ( color.length === 3 )
            {
                return 'rgb(' + color.join(',') + ')';
            }
            else if ( color.length === 4 )
            {
                return 'rgba(' + color.join(',') + ')';
            }
            else
            {
                $log.error('Invalid number of arguments supplied in the color array: ' + color.length + '\n' + 'The array must have 3 or 4 colors.');
            }
        }

        /**
         * Apply given contrast level to the given color
         *
         * @param color
         * @param contrastLevel
         */
        function applyContrast(color, contrastLevel)
        {
            var contrastLevels = {
                'white': {
                    '1': '1',
                    '2': '0.7',
                    '3': '0.3',
                    '4': '0.12'
                },
                'black': {
                    '1': '0.87',
                    '2': '0.54',
                    '3': '0.26',
                    '4': '0.12'
                }
            };

            // If white
            if ( color[0] === 255 && color[1] === 255 && color[2] === 255 )
            {
                color[3] = contrastLevels.white[contrastLevel];
            }
            // If black
            else if ( color[0] === 0 && color[1] === 0, color[2] === 0 )
            {
                color[3] = contrastLevels.black[contrastLevel];
            }

            return color;
        }

        /**
         * Uppercase first
         */
        function ucfirst(string)
        {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }

})();
(function ()
{
    'use strict';

    MsThemeOptionsController.$inject = ["$cookies", "fuseTheming"];
    angular
        .module('app.core')
        .controller('MsThemeOptionsController', MsThemeOptionsController)
        .directive('msThemeOptions', msThemeOptions);

    /** @ngInject */
    function MsThemeOptionsController($cookies, fuseTheming)
    {
        var vm = this;

        // Data
        vm.themes = fuseTheming.themes;
        vm.layoutMode = 'wide';
        vm.layoutStyle = $cookies.get('layoutStyle') || 'verticalNavigation';

        // Methods
        vm.setActiveTheme = setActiveTheme;
        vm.updateLayoutMode = updateLayoutMode;
        vm.updateLayoutStyle = updateLayoutStyle;

        //////////

        /**
         * Set active theme
         *
         * @param themeName
         */
        function setActiveTheme(themeName)
        {
            // Set active theme
            fuseTheming.setActiveTheme(themeName);
        }

        /**
         * Update layout mode
         */
        function updateLayoutMode()
        {
            var bodyEl = angular.element('body');

            // Update class on body element
            bodyEl.toggleClass('boxed', (vm.layoutMode === 'boxed'));
        }

        /**
         * Update layout style
         */
        function updateLayoutStyle()
        {
            // Update the cookie
            $cookies.put('layoutStyle', vm.layoutStyle);

            // Reload the page to apply the changes
            location.reload();
        }
    }

    /** @ngInject */
    function msThemeOptions()
    {
        return {
            restrict   : 'E',
            scope      : {
                panelOpen: '='
            },
            controller : 'MsThemeOptionsController as vm',
            templateUrl: 'app/core/theme-options/theme-options.html',
            compile    : function (tElement)
            {
                tElement.addClass('ms-theme-options');

                return function postLink(scope, iElement)
                {
                    var bodyEl = angular.element('body'),
                        backdropEl = angular.element('<div class="ms-theme-options-backdrop"></div>');

                    // Panel open status
                    scope.panelOpen = scope.panelOpen || false;

                    /**
                     * Toggle options panel
                     */
                    function toggleOptionsPanel()
                    {
                        if ( scope.panelOpen )
                        {
                            closeOptionsPanel();
                        }
                        else
                        {
                            openOptionsPanel();
                        }
                    }

                    function openOptionsPanel()
                    {
                        // Set panelOpen status
                        scope.panelOpen = true;

                        // Add open class
                        iElement.addClass('open');

                        // Append the backdrop
                        bodyEl.append(backdropEl);

                        // Register the event
                        backdropEl.on('click touch', closeOptionsPanel);
                    }

                    /**
                     * Close options panel
                     */
                    function closeOptionsPanel()
                    {
                        // Set panelOpen status
                        scope.panelOpen = false;

                        // Remove open class
                        iElement.removeClass('open');

                        // De-register the event
                        backdropEl.off('click touch', closeOptionsPanel);

                        // Remove the backdrop
                        backdropEl.remove();
                    }

                    // Expose the toggle function
                    scope.toggleOptionsPanel = toggleOptionsPanel;
                };
            }
        };
    }
})();
(function ()
{
    'use strict';

    msUtils.$inject = ["$window"];
    angular
        .module('app.core')
        .factory('msUtils', msUtils);

    /** @ngInject */
    function msUtils($window)
    {
        // Private variables
        var mobileDetect = new MobileDetect($window.navigator.userAgent),
            browserInfo = null;

        var service = {
            exists       : exists,
            detectBrowser: detectBrowser,
            guidGenerator: guidGenerator,
            isMobile     : isMobile,
            toggleInArray: toggleInArray
        };

        return service;

        //////////

        /**
         * Check if item exists in a list
         *
         * @param item
         * @param list
         * @returns {boolean}
         */
        function exists(item, list)
        {
            return list.indexOf(item) > -1;
        }

        /**
         * Returns browser information
         * from user agent data
         *
         * Found at http://www.quirksmode.org/js/detect.html
         * but modified and updated to fit for our needs
         */
        function detectBrowser()
        {
            // If we already tested, do not test again
            if ( browserInfo )
            {
                return browserInfo;
            }

            var browserData = [
                {
                    string       : $window.navigator.userAgent,
                    subString    : "Edge",
                    versionSearch: "Edge",
                    identity     : "Edge"
                },
                {
                    string   : $window.navigator.userAgent,
                    subString: "Chrome",
                    identity : "Chrome"
                },
                {
                    string       : $window.navigator.userAgent,
                    subString    : "OmniWeb",
                    versionSearch: "OmniWeb/",
                    identity     : "OmniWeb"
                },
                {
                    string       : $window.navigator.vendor,
                    subString    : "Apple",
                    versionSearch: "Version",
                    identity     : "Safari"
                },
                {
                    prop    : $window.opera,
                    identity: "Opera"
                },
                {
                    string   : $window.navigator.vendor,
                    subString: "iCab",
                    identity : "iCab"
                },
                {
                    string   : $window.navigator.vendor,
                    subString: "KDE",
                    identity : "Konqueror"
                },
                {
                    string   : $window.navigator.userAgent,
                    subString: "Firefox",
                    identity : "Firefox"
                },
                {
                    string   : $window.navigator.vendor,
                    subString: "Camino",
                    identity : "Camino"
                },
                {
                    string   : $window.navigator.userAgent,
                    subString: "Netscape",
                    identity : "Netscape"
                },
                {
                    string       : $window.navigator.userAgent,
                    subString    : "MSIE",
                    identity     : "Explorer",
                    versionSearch: "MSIE"
                },
                {
                    string       : $window.navigator.userAgent,
                    subString    : "Trident/7",
                    identity     : "Explorer",
                    versionSearch: "rv"
                },
                {
                    string       : $window.navigator.userAgent,
                    subString    : "Gecko",
                    identity     : "Mozilla",
                    versionSearch: "rv"
                },
                {
                    string       : $window.navigator.userAgent,
                    subString    : "Mozilla",
                    identity     : "Netscape",
                    versionSearch: "Mozilla"
                }
            ];

            var osData = [
                {
                    string   : $window.navigator.platform,
                    subString: "Win",
                    identity : "Windows"
                },
                {
                    string   : $window.navigator.platform,
                    subString: "Mac",
                    identity : "Mac"
                },
                {
                    string   : $window.navigator.platform,
                    subString: "Linux",
                    identity : "Linux"
                },
                {
                    string   : $window.navigator.platform,
                    subString: "iPhone",
                    identity : "iPhone"
                },
                {
                    string   : $window.navigator.platform,
                    subString: "iPod",
                    identity : "iPod"
                },
                {
                    string   : $window.navigator.platform,
                    subString: "iPad",
                    identity : "iPad"
                },
                {
                    string   : $window.navigator.platform,
                    subString: "Android",
                    identity : "Android"
                }
            ];

            var versionSearchString = '';

            function searchString(data)
            {
                for ( var i = 0; i < data.length; i++ )
                {
                    var dataString = data[i].string;
                    var dataProp = data[i].prop;

                    versionSearchString = data[i].versionSearch || data[i].identity;

                    if ( dataString )
                    {
                        if ( dataString.indexOf(data[i].subString) != -1 )
                        {
                            return data[i].identity;

                        }
                    }
                    else if ( dataProp )
                    {
                        return data[i].identity;
                    }
                }
            }

            function searchVersion(dataString)
            {
                var index = dataString.indexOf(versionSearchString);

                if ( index == -1 )
                {
                    return;
                }

                return parseInt(dataString.substring(index + versionSearchString.length + 1));
            }

            var browser = searchString(browserData) || "unknown-browser";
            var version = searchVersion($window.navigator.userAgent) || searchVersion($window.navigator.appVersion) || "unknown-version";
            var os = searchString(osData) || "unknown-os";

            // Prepare and store the object
            browser = browser.toLowerCase();
            version = browser + '-' + version;
            os = os.toLowerCase();

            browserInfo = {
                browser: browser,
                version: version,
                os     : os
            };

            return browserInfo;
        }

        /**
         * Generates a globally unique id
         *
         * @returns {*}
         */
        function guidGenerator()
        {
            var S4 = function ()
            {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };
            return (S4() + S4() + S4() + S4() + S4() + S4());
        }

        /**
         * Return if current device is a
         * mobile device or not
         */
        function isMobile()
        {
            return mobileDetect.mobile();
        }

        /**
         * Toggle in array (push or splice)
         *
         * @param item
         * @param array
         */
        function toggleInArray(item, array)
        {
            if ( array.indexOf(item) == -1 )
            {
                array.push(item);
            }
            else
            {
                array.splice(array.indexOf(item), 1);
            }
        }
    }
}());
(function ()
{
    'use strict';

    apiResolverService.$inject = ["$q", "$log", "api"];
    angular
        .module('app.core')
        .factory('apiResolver', apiResolverService);

    /** @ngInject */
    function apiResolverService($q, $log, api)
    {
        var service = {
            resolve: resolve
        };

        return service;

        //////////
        /**
         * Resolve api
         * @param action
         * @param parameters
         */
        function resolve(action, parameters)
        {
            var actionParts = action.split('@'),
                resource = actionParts[0],
                method = actionParts[1],
                params = parameters || {};

            if ( !resource || !method )
            {
                $log.error('apiResolver.resolve requires correct action parameter (ResourceName@methodName)');
                return false;
            }

            // Create a new deferred object
            var deferred = $q.defer();

            // Get the correct api object from api service
            var apiObject = getApiObject(resource);

            if ( !apiObject )
            {
                $log.error('Resource "' + resource + '" is not defined in the api service!');
                deferred.reject('Resource "' + resource + '" is not defined in the api service!');
            }
            else
            {
                apiObject[method](params,

                    // Success
                    function (response)
                    {
                        deferred.resolve(response);
                    },

                    // Error
                    function (response)
                    {
                        deferred.reject(response);
                    }
                );
            }

            // Return the promise
            return deferred.promise;
        }

        /**
         * Get correct api object
         *
         * @param resource
         * @returns {*}
         */
        function getApiObject(resource)
        {
            // Split the resource in case if we have a dot notated object
            var resourceParts = resource.split('.'),
                apiObject = api;

            // Loop through the resource parts and go all the way through
            // the api object and return the correct one
            for ( var l = 0; l < resourceParts.length; l++ )
            {
                if ( angular.isUndefined(apiObject[resourceParts[l]]) )
                {
                    $log.error('Resource part "' + resourceParts[l] + '" is not defined!');
                    apiObject = false;
                    break;
                }

                apiObject = apiObject[resourceParts[l]];
            }

            if ( !apiObject )
            {
                return false;
            }

            return apiObject;
        }
    }

})();
(function ()
{
    'use strict';

    angular
        .module('app.core')
        .filter('filterByTags', filterByTags)
        .filter('filterSingleByTags', filterSingleByTags);

    /** @ngInject */
    function filterByTags()
    {
        return function (items, tags)
        {
            if ( items.length === 0 || tags.length === 0 )
            {
                return items;
            }

            var filtered = [];

            items.forEach(function (item)
            {
                var match = tags.every(function (tag)
                {
                    var tagExists = false;

                    item.tags.forEach(function (itemTag)
                    {
                        if ( itemTag.name === tag.name )
                        {
                            tagExists = true;
                            return;
                        }
                    });

                    return tagExists;
                });

                if ( match )
                {
                    filtered.push(item);
                }
            });

            return filtered;
        };
    }

    /** @ngInject */
    function filterSingleByTags()
    {
        return function (itemTags, tags)
        {
            if ( itemTags.length === 0 || tags.length === 0 )
            {
                return;
            }

            if ( itemTags.length < tags.length )
            {
                return [];
            }

            var filtered = [];

            var match = tags.every(function (tag)
            {
                var tagExists = false;

                itemTags.forEach(function (itemTag)
                {
                    if ( itemTag.name === tag.name )
                    {
                        tagExists = true;
                        return;
                    }
                });

                return tagExists;
            });

            if ( match )
            {
                filtered.push(itemTags);
            }

            return filtered;
        };
    }

})();
(function ()
{
    'use strict';

    toTrustedFilter.$inject = ["$sce"];
    angular
        .module('app.core')
        .filter('toTrusted', toTrustedFilter)
        .filter('htmlToPlaintext', htmlToPlainTextFilter)
        .filter('nospace', nospaceFilter)
        .filter('humanizeDoc', humanizeDocFilter);

    /** @ngInject */
    function toTrustedFilter($sce)
    {
        return function (value)
        {
            return $sce.trustAsHtml(value);
        };
    }

    /** @ngInject */
    function htmlToPlainTextFilter()
    {
        return function (text)
        {
            return String(text).replace(/<[^>]+>/gm, '');
        };
    }

    /** @ngInject */
    function nospaceFilter()
    {
        return function (value)
        {
            return (!value) ? '' : value.replace(/ /g, '');
        };
    }

    /** @ngInject */
    function humanizeDocFilter()
    {
        return function (doc)
        {
            if ( !doc )
            {
                return;
            }
            if ( doc.type === 'directive' )
            {
                return doc.name.replace(/([A-Z])/g, function ($1)
                {
                    return '-' + $1.toLowerCase();
                });
            }
            return doc.label || doc.name;
        };
    }

})();
(function ()
{
    'use strict';

    hljsDirective.$inject = ["$timeout", "$q", "$interpolate"];
    angular
        .module('app.core')
        .directive('hljs', hljsDirective);

    /** @ngInject */
    function hljsDirective($timeout, $q, $interpolate)
    {
        return {
            restrict: 'EA',
            compile : function (tElement, tAttrs)
            {
                var code;
                //No attribute? code is the content
                if ( !tAttrs.code )
                {
                    code = tElement.html();
                    tElement.empty();
                }

                return function (scope, iElement, iAttrs)
                {
                    if ( iAttrs.code )
                    {
                        // Attribute? code is the evaluation
                        code = scope.$eval(iAttrs.code);
                    }
                    var shouldInterpolate = scope.$eval(iAttrs.shouldInterpolate);

                    $q.when(code).then(function (code)
                    {
                        if ( code )
                        {
                            if ( shouldInterpolate )
                            {
                                code = $interpolate(code)(scope);
                            }

                            var contentParent = angular.element(
                                '<pre><code class="highlight" ng-non-bindable></code></pre>'
                            );

                            iElement.append(contentParent);

                            // Defer highlighting 1-frame to prevent GA interference...
                            $timeout(function ()
                            {
                                render(code, contentParent);
                            }, 34, false);
                        }
                    });

                    function render(contents, parent)
                    {
                        var codeElement = parent.find('code');
                        var lines = contents.split('\n');

                        // Remove empty lines
                        lines = lines.filter(function (line)
                        {
                            return line.trim().length;
                        });

                        // Make it so each line starts at 0 whitespace
                        var firstLineWhitespace = lines[0].match(/^\s*/)[0];
                        var startingWhitespaceRegex = new RegExp('^' + firstLineWhitespace);

                        lines = lines.map(function (line)
                        {
                            return line
                                .replace(startingWhitespaceRegex, '')
                                .replace(/\s+$/, '');
                        });

                        var highlightedCode = hljs.highlight(iAttrs.language || iAttrs.lang, lines.join('\n'), true);
                        highlightedCode.value = highlightedCode.value
                            .replace(/=<span class="hljs-value">""<\/span>/gi, '')
                            .replace('<head>', '')
                            .replace('<head/>', '');
                        codeElement.append(highlightedCode.value).addClass('highlight');
                    }
                };
            }
        };
    }
})();
(function ()
{
    'use strict';

    angular
        .module('app.core')
        .provider('fuseConfig', fuseConfigProvider);

    /** @ngInject */
    function fuseConfigProvider()
    {
        // Default configuration
        var fuseConfiguration = {
            'disableCustomScrollbars'        : false,
            'disableMdInkRippleOnMobile'     : true,
            'disableCustomScrollbarsOnMobile': true
        };

        // Methods
        this.config = config;

        //////////

        /**
         * Extend default configuration with the given one
         *
         * @param configuration
         */
        function config(configuration)
        {
            fuseConfiguration = angular.extend({}, fuseConfiguration, configuration);
        }

        /**
         * Service
         */
        this.$get = function ()
        {
            var service = {
                getConfig: getConfig,
                setConfig: setConfig
            };

            return service;

            //////////

            /**
             * Returns a config value
             */
            function getConfig(configName)
            {
                if ( angular.isUndefined(fuseConfiguration[configName]) )
                {
                    return false;
                }

                return fuseConfiguration[configName];
            }

            /**
             * Creates or updates config object
             *
             * @param configName
             * @param configValue
             */
            function setConfig(configName, configValue)
            {
                fuseConfiguration[configName] = configValue;
            }
        };
    }

})();
(function ()
{
    'use strict';

    config.$inject = ["$translatePartialLoaderProvider"];
    angular
        .module('app.toolbar', [])
        .config(config);

    /** @ngInject */
    function config($translatePartialLoaderProvider)
    {
        $translatePartialLoaderProvider.addPart('app/toolbar');
    }
})();

(function ()
{
    'use strict';

    ToolbarController.$inject = ["$rootScope", "$mdSidenav", "$translate", "$mdToast", "$state"];
    angular
        .module('app.toolbar')
        .controller('ToolbarController', ToolbarController);

    /** @ngInject */
    function ToolbarController($rootScope, $mdSidenav, $translate, $mdToast, $state)
    {
        var vm = this;
        /*if($rootScope.globals===undefined){
            $rootScope.globals = {};
            $rootScope.globals.user_data = localStorage.getItem('userData') || {};
            vm.globals = JSON.parse($rootScope.globals.user_data);
            if ($rootScope.globals.user_data.type!==undefined) {
                vm.fullname = vm.globals.fullname;
            }else{
                vm.fullname = '';
            }
        }else{
            vm.globals = $rootScope.globals.user_data.fullname;
            vm.fullname = vm.globals.fullname;
            
        }*/
         vm.fullname = $rootScope.globals.user_data.fullname;
        // Data
        $rootScope.global = {
            search: ''
        };

        vm.bodyEl = angular.element('body');
        vm.userStatusOptions = [
            {
                'title': 'Online',
                'icon' : 'icon-checkbox-marked-circle',
                'color': '#4CAF50'
            },
            {
                'title': 'Away',
                'icon' : 'icon-clock',
                'color': '#FFC107'
            },
            {
                'title': 'Do not Disturb',
                'icon' : 'icon-minus-circle',
                'color': '#F44336'
            },
            {
                'title': 'Invisible',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#BDBDBD'
            },
            {
                'title': 'Offline',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#616161'
            }
        ];
        vm.languages = {
            en: {
                'title'      : 'English',
                'translation': 'TOOLBAR.ENGLISH',
                'code'       : 'en',
                'flag'       : 'us'
            },
            es: {
                'title'      : 'Spanish',
                'translation': 'TOOLBAR.SPANISH',
                'code'       : 'es',
                'flag'       : 'es'
            },
            tr: {
                'title'      : 'Turkish',
                'translation': 'TOOLBAR.TURKISH',
                'code'       : 'tr',
                'flag'       : 'tr'
            }
        };

        // Methods
        vm.toggleSidenav = toggleSidenav;
        vm.logout = logout;
        vm.changeLanguage = changeLanguage;
        vm.setUserStatus = setUserStatus;
        vm.toggleHorizontalMobileMenu = toggleHorizontalMobileMenu;

        //////////

        init();

        /**
         * Initialize
         */
        function init()
        {
            // Select the first status as a default
            vm.userStatus = vm.userStatusOptions[0];

            // Get the selected language directly from angular-translate module setting
            vm.selectedLanguage = vm.languages[$translate.preferredLanguage()];
        }


        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        function toggleSidenav(sidenavId)
        {
            $mdSidenav(sidenavId).toggle();
        }

        /**
         * Sets User Status
         * @param status
         */
        function setUserStatus(status)
        {
            vm.userStatus = status;
        }

        /**
         * Logout Function
         */
        function logout()
        {
            // Do logout here..
            var type = angular.copy($rootScope.globals.user_data.type);
            var follow_state = '';
            if(type=='user'){
                follow_state = 'app.pages_auth_login';
            }else if(type=='sub'){
                follow_state = 'app.pages_auth_admin_login';
            }else if(type=='master'){
                follow_state = 'app.pages_auth_master_login';
            }
            $rootScope.globals = {};
            localStorage.removeItem('userData');
            /*var $cookies;

                    angular.injector(['ngCookies']).invoke([
                        '$cookies', function (_$cookies)
                        {
                            $cookies = _$cookies;
                        }
                    ]);

            $cookies.remove('userData');*/
            $state.go(follow_state);
        }

        /**
         * Change Language
         */
        function changeLanguage(lang)
        {
            vm.selectedLanguage = lang;

            /**
             * Show temporary message if user selects a language other than English
             *
             * angular-translate module will try to load language specific json files
             * as soon as you change the language. And because we don't have them, there
             * will be a lot of errors in the page potentially breaking couple functions
             * of the template.
             *
             * To prevent that from happening, we added a simple "return;" statement at the
             * end of this if block. If you have all the translation files, remove this if
             * block and the translations should work without any problems.
             */
            if ( lang.code !== 'en' )
            {
                var message = 'Fuse supports translations through angular-translate module, but currently we do not have any translations other than English language. If you want to help us, send us a message through ThemeForest profile page.';

                $mdToast.show({
                    template : '<md-toast id="language-message" layout="column" layout-align="center start"><div class="md-toast-content">' + message + '</div></md-toast>',
                    hideDelay: 7000,
                    position : 'top right',
                    parent   : '#content'
                });

                return;
            }

            // Change the language
            $translate.use(lang.code);
        }

        /**
         * Toggle horizontal mobile menu
         */
        function toggleHorizontalMobileMenu()
        {
            vm.bodyEl.toggleClass('ms-navigation-horizontal-mobile-menu-active');
        }
    }

})();
(function ()
{
    'use strict';

    QuickPanelController.$inject = ["api"];
    angular
        .module('app.quick-panel')
        .controller('QuickPanelController', QuickPanelController);

    /** @ngInject */
    function QuickPanelController(api)
    {
        var vm = this;

        // Data
        vm.date = new Date();
        vm.settings = {
            notify: true,
            cloud : false,
            retro : true
        };

        api.quickPanel.activities.get({}, function (response)
        {
            vm.activities = response.data;
        });

        api.quickPanel.events.get({}, function (response)
        {
            vm.events = response.data;
        });

        api.quickPanel.notes.get({}, function (response)
        {
            vm.notes = response.data;
        });

        // Methods

        //////////
    }

})();
(function ()
{
    'use strict';

    angular
        .module('app.navigation', [])
        .config(config);

    /** @ngInject */
    function config()
    {
        
    }

})();
(function ()
{
    'use strict';

    NavigationController.$inject = ["$scope"];
    angular
        .module('app.navigation')
        .controller('NavigationController', NavigationController);

    /** @ngInject */
    function NavigationController($scope)
    {
        var vm = this;

        // Data
        vm.bodyEl = angular.element('body');
        vm.folded = false;
        vm.msScrollOptions = {
            suppressScrollX: true
        };

        // Methods
        vm.toggleMsNavigationFolded = toggleMsNavigationFolded;

        //////////

        /**
         * Toggle folded status
         */
        function toggleMsNavigationFolded()
        {
            vm.folded = !vm.folded;
        }

        // Close the mobile menu on $stateChangeSuccess
        $scope.$on('$stateChangeSuccess', function ()
        {
            vm.bodyEl.removeClass('ms-navigation-horizontal-mobile-menu-active')
        })
    }

})();
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
(function ()
{
    'use strict';

    MainController.$inject = ["$scope", "$rootScope"];
    angular
        .module('fuse')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($scope, $rootScope)
    {
        // Data

        //////////

        // Remove the splash screen
        $scope.$on('$viewContentAnimationEnded', function (event)
        {
            if ( event.targetScope.$id === $scope.$id )
            {
               $rootScope.$broadcast('msSplashScreen::remove');
            }
        });
    }
})();
(function ()
{
    'use strict';

    runBlock.$inject = ["msUtils", "fuseGenerator", "fuseConfig"];
    angular
        .module('app.core')
        .run(runBlock);

    /** @ngInject */
    function runBlock(msUtils, fuseGenerator, fuseConfig)
    {
        /**
         * Generate extra classes based on registered themes so we
         * can use same colors with non-angular-material elements
         */
        fuseGenerator.generate();

        /**
         * Disable md-ink-ripple effects on mobile
         * if 'disableMdInkRippleOnMobile' config enabled
         */
        if ( fuseConfig.getConfig('disableMdInkRippleOnMobile') && msUtils.isMobile() )
        {
            var bodyEl = angular.element('body');
            bodyEl.attr('md-no-ink', true);
        }

        /**
         * Put isMobile() to the html as a class
         */
        if ( msUtils.isMobile() )
        {
            angular.element('html').addClass('is-mobile');
        }

        /**
         * Put browser information to the html as a class
         */
        var browserInfo = msUtils.detectBrowser();
        if ( browserInfo )
        {
            var htmlClass = browserInfo.browser + ' ' + browserInfo.version + ' ' + browserInfo.os;
            angular.element('html').addClass(htmlClass);
        }
    }
})();
(function ()
{
    'use strict';

    config.$inject = ["$ariaProvider", "$logProvider", "msScrollConfigProvider", "uiGmapGoogleMapApiProvider", "$translateProvider", "$provide", "fuseConfigProvider"];
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
(function ()
{
    'use strict';

    runBlock.$inject = ["$rootScope", "$timeout", "$state", "msNavigationService"];
    angular
        .module('fuse')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $timeout, $state, msNavigationService)
    {
        //$rootScope.Main_Url = 'http://localhost/events_calendar/api/';
        $rootScope.Main_Url = 'http://www.cityoflaredocalendar.com/angular/api/';
        var guest_restricted_states = ['app.dashboard_admin', 'app.create_admin', 'app.create_user', 'app.show_admins', 'app.show_users', 'app.dashboard', 'app.edit_profile_user', 'app.change_password', 'app.change_password_admin', 'app.edit_terms', 'app.edit_privacy_policy', 'app.banner_images']; 
        var user_restricted_states = ['app.dashboard_admin', 'app.create_admin', 'app.create_user', 'app.show_admins', 'app.show_users', 'app.change_password_admin', 'app.edit_terms', 'app.edit_privacy_policy', 'app.banner_images']; 
        var admin_restricted_states = ['app.dashboard', 'app.edit_profile_user', 'app.create_admin', 'app.show_admins', 'app.change_password', 'app.banner_images']; 
        var master_restricted_states = ['app.dashboard', 'app.edit_profile_user', 'app.change_password']; 
        var login_states = ['app.pages_auth_login', 'app.pages_auth_master_login', 'app.pages_auth_admin_login']; 
        var user_dashboard = 'app.dashboard';
        var admin_dashboard = 'app.dashboard_admin';
        // Activate loading indicator
        var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams)
        {
            console.log('redirecting');
            $rootScope.loadingProgress = true;

            if($rootScope.globals===undefined){
                var $cookies;

                    angular.injector(['ngCookies']).invoke([
                        '$cookies', function (_$cookies)
                        {
                            $cookies = _$cookies;
                        }
                    ]);

                $rootScope.globals = {};
                $rootScope.globals.user_data = JSON.parse(localStorage.getItem('userData')) || {};
                //$rootScope.globals.user_data = JSON.parse( $cookies.get('userData')) || {};
                if($rootScope.globals.user_data.type!==undefined){
                    if(user_restricted_states.indexOf(toState.name)>-1 && $rootScope.globals.user_data.type=='user') {
                        console.log('user not allowed');
                        event.preventDefault();
                        $state.go('app.pages_calendar');
                    }else if(admin_restricted_states.indexOf(toState.name)>-1 && $rootScope.globals.user_data.type=='sub') {
                        console.log('user not allowed');
                        event.preventDefault();
                        $state.go('app.pages_calendar');
                    }else if(master_restricted_states.indexOf(toState.name)>-1 && $rootScope.globals.user_data.type=='master') {
                        console.log('user not allowed');
                        event.preventDefault();
                        $state.go('app.pages_calendar');
                    }
                    if(login_states.indexOf(toState.name)>-1){

                        if($rootScope.globals.user_data.type=='user'){
                            event.preventDefault();
                            $state.go(user_dashboard);
                        }else if($rootScope.globals.user_data.type=='sub' || $rootScope.globals.user_data.type=='master'){
                            event.preventDefault();

                            $state.go(admin_dashboard);
                        }
                    }
                    hideNavigations(toState);
                }else{
                    if(guest_restricted_states.indexOf(toState.name)>-1) {
                        console.log('user not allowed');
                        event.preventDefault();
                        $state.go('app.pages_calendar');
                    }
                }
            }else if($rootScope.globals.user_data!==undefined){
                if(user_restricted_states.indexOf(toState.name)>-1 && $rootScope.globals.user_data.type=='user') {
                        console.log('user not allowed');
                        event.preventDefault();
                        $state.go('app.pages_calendar');
                    }else if(admin_restricted_states.indexOf(toState.name)>-1 && $rootScope.globals.user_data.type=='sub') {
                        console.log('user not allowed');
                        event.preventDefault();
                        $state.go('app.pages_calendar');
                    }else if(master_restricted_states.indexOf(toState.name)>-1 && $rootScope.globals.user_data.type=='master') {
                        console.log('user not allowed');
                        event.preventDefault();
                        $state.go('app.pages_calendar');
                    }
                    if(login_states.indexOf(toState.name)>-1){

                        if($rootScope.globals.user_data.type=='user'){
                            event.preventDefault();
                            $state.go(user_dashboard);
                        }else if($rootScope.globals.user_data.type=='sub' || $rootScope.globals.user_data.type=='master'){
                            event.preventDefault();

                            $state.go(admin_dashboard);
                        }
                    }
                hideNavigations(toState);
            }
        });

        function checkRestrictions(){

        }

        function hideNavigations(toState){
            if($rootScope.globals.user_data.type=='user'){
                msNavigationService.deleteItem('create_admin');
                msNavigationService.deleteItem('create_user');
                msNavigationService.deleteItem('dashboard_admin');
                msNavigationService.deleteItem('show_admins');
                msNavigationService.deleteItem('show_users');
                msNavigationService.deleteItem('change_password_admin');
                msNavigationService.deleteItem('edit_terms');
                msNavigationService.deleteItem('edit_privacy_policy');
                msNavigationService.deleteItem('banner_images');
            }else if($rootScope.globals.user_data.type=='sub'){
                if(admin_restricted_states.indexOf(toState.name)>-1) {
                    console.log('admin not allowed');
                    $state.go('app.pages_calendar');
                }
                msNavigationService.deleteItem('create_admin');
                msNavigationService.deleteItem('show_admins');
                msNavigationService.deleteItem('dashboard');
                msNavigationService.deleteItem('banner_images');
            }else if($rootScope.globals.user_data.type=='master'){
                if(master_restricted_states.indexOf(toState.name)>-1) {
                    console.log('master not allowed');
                    $state.go('app.pages_calendar');
                }
                msNavigationService.deleteItem('dashboard');
            }
        }

        // De-activate loading indicator
        var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function ()
        {
            $timeout(function ()
            {
                $rootScope.loadingProgress = false;
            });
        });

        // Store state in the root scope for easy access
        $rootScope.state = $state;

        // Cleanup
        $rootScope.$on('$destroy', function ()
        {
            stateChangeStartEvent();
            stateChangeSuccessEvent();
        })
    }
})();
(function ()
{
    'use strict';

    routeConfig.$inject = ["$stateProvider", "$urlRouterProvider", "$locationProvider"];
    angular
        .module('fuse')
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider, $locationProvider)
    {
        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/calendar');

        /**
         * Layout Style Switcher
         *
         * This code is here for demonstration purposes.
         * If you don't need to switch between the layout
         * styles like in the demo, you can set one manually by
         * typing the template urls into the `State definitions`
         * area and remove this code
         */
        // Inject $cookies
        var $cookies;

        angular.injector(['ngCookies']).invoke([
            '$cookies', function (_$cookies)
            {
                $cookies = _$cookies;
            }
        ]);

        // Get active layout
        //var layoutStyle = $cookies.get('layoutStyle') || 'horizontalNavigation';
        var layoutStyle = 'horizontalNavigation';

        var layouts = {
            verticalNavigation  : {
                main      : 'app/core/layouts/vertical-navigation.html',
                toolbar   : 'app/toolbar/layouts/vertical-navigation/toolbar.html',
                navigation: 'app/navigation/layouts/vertical-navigation/navigation.html'
            },
            horizontalNavigation: {
                main      : 'app/core/layouts/horizontal-navigation.html',
                toolbar   : 'app/toolbar/layouts/horizontal-navigation/toolbar.html',
                navigation: 'app/navigation/layouts/horizontal-navigation/navigation.html'
            },
            contentOnly         : {
                main      : 'app/core/layouts/content-only.html',
                toolbar   : '',
                navigation: ''
            },
            contentWithToolbar  : {
                main      : 'app/core/layouts/content-with-toolbar.html',
                toolbar   : 'app/toolbar/layouts/content-with-toolbar/toolbar.html',
                navigation: ''
            }
        };
        // END - Layout Style Switcher

        // State definitions
        $stateProvider
            .state('app', {
                abstract: true,
                views   : {
                    'main@'         : {
                        templateUrl: layouts[layoutStyle].main,
                        controller : 'MainController as vm'
                    },
                    'toolbar@app'   : {
                        templateUrl: layouts[layoutStyle].toolbar,
                        controller : 'ToolbarController as vm'
                    },
                    'navigation@app': {
                        templateUrl: layouts[layoutStyle].navigation,
                        controller : 'NavigationController as vm'
                    }/*,
                    'quickPanel@app': {
                        templateUrl: 'app/quick-panel/quick-panel.html',
                        controller : 'QuickPanelController as vm'
                    }*/
                }
            });
    }

})();

(function ()
{
    'use strict';

    IndexController.$inject = ["fuseTheming"];
    angular
        .module('fuse')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming)
    {
        var vm = this;

        // Data
        vm.themes = fuseTheming.themes;

        //////////
    }
})();
(function ()
{
    'use strict';

    angular
        .module('fuse');
})();

(function ()
{
    'use strict';

    angular
        .module('fuse')
        .config(config);

    /** @ngInject */
    
    function config()
    {
        // Put your custom configurations here
       // $rootScope.Main_Url = 'http://localhost/events_calendar/api/';
    }

})();
(function ()
{
    'use strict';

    apiService.$inject = ["$resource"];
    angular
        .module('fuse')
        .factory('api', apiService);

    /** @ngInject */
    function apiService($resource)
    {
        /**
         * You can use this service to define your API urls. The "api" service
         * is designed to work in parallel with "apiResolver" service which you can
         * find in the "app/core/services/api-resolver.service.js" file.
         *
         * You can structure your API urls whatever the way you want to structure them.
         * You can either use very simple definitions, or you can use multi-dimensional
         * objects.
         *
         * Here's a very simple API url definition example:
         *
         *      api.getBlogList = $resource('http://api.example.com/getBlogList');
         *
         * While this is a perfectly valid $resource definition, most of the time you will
         * find yourself in a more complex situation where you want url parameters:
         *
         *      api.getBlogById = $resource('http://api.example.com/blog/:id', {id: '@id'});
         *
         * You can also define your custom methods. Custom method definitions allows you to
         * add hardcoded parameters to your API calls that you want them to be sent every
         * time you make that API call:
         *
         *      api.getBlogById = $resource('http://api.example.com/blog/:id', {id: '@id'}, {
         *         'getFromHomeCategory' : {method: 'GET', params: {blogCategory: 'home'}}
         *      });
         *
         * In addition to these definitions, you can also create multi-dimensional objects.
         * They are nothing to do with the $resource object, it's just a more convenient
         * way that we have created for you to packing your related API urls together:
         *
         *      api.blog = {
         *          list     : $resource('http://api.example.com/blog);
         *          getById  : $resource('http://api.example.com/blog/:id', {id: '@id'});
         *          getByDate: $resource('http://api.example.com/blog/:date', {id: '@date'},
         *              'get': {method: 'GET', params: {getByDate: true}}
         *          );
         *      }
         *
         * If you look at the last example from above, we overrode the 'get' method to put a
         * hardcoded parameter. Now every time we make the "getByDate" call, the {getByDate: true}
         * object will also be sent along with whatever data we are sending.
         *
         * All the above methods are using standard $resource service. You can learn more about
         * it at: https://docs.angularjs.org/api/ngResource/service/$resource
         *
         * -----
         *
         * After you defined your API urls, you can use them in Controllers, Services and even
         * in the UIRouter state definitions.
         *
         * If we use the last example from above, you can do an API call in your Controllers and
         * Services like this:
         *
         *      function MyController (api)
         *      {
         *          // Get the blog list
         *          api.blog.list.get({},
         *
         *              // Success
         *              function (response)
         *              {
         *                  console.log(response);
         *              },
         *
         *              // Error
         *              function (response)
         *              {
         *                  console.error(response);
         *              }
         *          );
         *
         *          // Get the blog with the id of 3
         *          var id = 3;
         *          api.blog.getById.get({'id': id},
         *
         *              // Success
         *              function (response)
         *              {
         *                  console.log(response);
         *              },
         *
         *              // Error
         *              function (response)
         *              {
         *                  console.error(response);
         *              }
         *          );
         *
         *          // Get the blog with the date by using custom defined method
         *          var date = 112314232132;
         *          api.blog.getByDate.get({'date': date},
         *
         *              // Success
         *              function (response)
         *              {
         *                  console.log(response);
         *              },
         *
         *              // Error
         *              function (response)
         *              {
         *                  console.error(response);
         *              }
         *          );
         *      }
         *
         * Because we are directly using $resource servive, all your API calls will return a
         * $promise object.
         *
         * --
         *
         * If you want to do the same calls in your UI Router state definitions, you need to use
         * "apiResolver" service we have prepared for you:
         *
         *      $stateProvider.state('app.blog', {
         *          url      : '/blog',
         *          views    : {
         *               'content@app': {
         *                   templateUrl: 'app/main/apps/blog/blog.html',
         *                   controller : 'BlogController as vm'
         *               }
         *          },
         *          resolve  : {
         *              Blog: function (apiResolver)
         *              {
         *                  return apiResolver.resolve('blog.list@get');
         *              }
         *          }
         *      });
         *
         *  You can even use parameters with apiResolver service:
         *
         *      $stateProvider.state('app.blog.show', {
         *          url      : '/blog/:id',
         *          views    : {
         *               'content@app': {
         *                   templateUrl: 'app/main/apps/blog/blog.html',
         *                   controller : 'BlogController as vm'
         *               }
         *          },
         *          resolve  : {
         *              Blog: function (apiResolver, $stateParams)
         *              {
         *                  return apiResolver.resolve('blog.getById@get', {'id': $stateParams.id);
         *              }
         *          }
         *      });
         *
         *  And the "Blog" object will be available in your BlogController:
         *
         *      function BlogController(Blog)
         *      {
         *          var vm = this;
         *
         *          // Data
         *          vm.blog = Blog;
         *
         *          ...
         *      }
         */

        var api = {};

        // Base Url
        api.baseUrl = 'app/data/';

        api.sample = $resource(api.baseUrl + 'sample/sample.json');

        api.quickPanel = {
            activities: $resource(api.baseUrl + 'quick-panel/activities.json'),
            contacts  : $resource(api.baseUrl + 'quick-panel/contacts.json'),
            events    : $resource(api.baseUrl + 'quick-panel/events.json'),
            notes     : $resource(api.baseUrl + 'quick-panel/notes.json')
        };

        return api;
    }

})();
(function ()
{
    'use strict';

    config.$inject = ["msNavigationServiceProvider"];
    angular
        .module('app.user', [
            'app.user.dashboard'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        // Navigation
        msNavigationServiceProvider.saveItem('user', {
            title : 'DASHBOARD',
            group : true,
            weight: 2
        });
    }
})();
(function ()
{
    'use strict';

    angular
        .module('app.pages', [
            'app.pages.auth.login',
            'app.pages.auth.admin_login',
            'app.pages.auth.master_login',
            'app.pages.auth.register',
            'app.pages.auth.forgot-password',
            'app.pages.auth.forgot_password_admin',
            'app.pages.auth.forgot_password_master',
            'app.pages.auth.reset-password',
            'app.pages.auth.reset_password_admin',
            'app.pages.auth.reset_password_master',
            'app.pages.terms_and_condition',
            'app.pages.privacy_policy',
            'app.pages.calendar'
        ])
      //  .config(config);

    /** @ngInject */
    /*function config(msNavigationServiceProvider)
    {
        // Navigation
        msNavigationServiceProvider.saveItem('pages', {
            title : 'PAGES',
            group : true,
            weight: 2
        });
    }*/
})();