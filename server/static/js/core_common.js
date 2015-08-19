Vue.config.delimiters = ['[[', ']]'];

var coreBody = Vue.extend({
    data: function() { return {
        user            : '',
        rightMenu       : [],
        currentView     : '',
        notifications   : 0,
    }},
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
        console.log('coreBody init done.')
    },
});

