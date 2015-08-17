Vue.config.delimiters = ['[[', ']]'];

var vueBody = new Vue({
    el: 'body',
    data: {
        user                : 'leasunhy',
        rightMenu           : ['design', 'modeling', 'experiment'],
        currentView         : 'database',
        notificationCount   : 2,
    },
    components: {
        database     : Vue.component('dashboard-database'),
        notifications: Vue.component('dashboard-notifications'),
    },
    ready: function() {
        $('#topbar-avatar').popup({
            inline: true,
            position: 'bottom right',
            hoverable: true,
            offset: "-1",
            on: "click",
        });
        $('#topbar-menu').click(function() {
            $('#main-switcher').modal('show');
        });
    },
});


