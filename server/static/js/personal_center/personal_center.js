var vueBody = new coreBody({
    el: 'body',
    data: {
        user                : 'leasunhy',
        rightMenu           : ['design', 'modeling', 'experiment'],
        currentView         : 'dashboard-database',
        notificationCount   : 2,
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
