(function ()
{
    'use strict';

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
