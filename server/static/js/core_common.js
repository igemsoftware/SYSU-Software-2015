Vue.config.delimiters = ['[[', ']]'];

Vue.component('v-topbar', {
    template: "#topbar-template",
    data: function() { return {
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
        $('#topbar-btn-menu').click(function() {
            $('#main-switcher').dimmer('show');
        });
        console.log('topbar init done.')
    },
});

var coreBody = Vue.extend({
    data: function() { return {
        currentView     : '',
    }},
    ready: function() {
        console.log('coreBody init done.')
    },
});

