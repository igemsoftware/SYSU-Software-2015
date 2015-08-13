Vue.config.delimiters = ['[[', ']]'];

var vueBody = new Vue({
    el: 'body',
    data: {
        user            : 'leasunhy',
        rightMenu       : ['design', 'modeling', 'experiment'],
        currentView     : 'database',
        loader          : {active: false, text: 'Loading'},
        notifications   : 2,
    },
    components: {
        database: Vue.component('dashboard-database'),
        reminder: {
            template: '#reminder-template'
        },
    },
    ready: function() {
        $('#topbar-avatar').popup({
            inline: true,
            position: 'bottom right',
            hoverable: true,
            offset: "-1",
            on: "click",
        });
    },
});


