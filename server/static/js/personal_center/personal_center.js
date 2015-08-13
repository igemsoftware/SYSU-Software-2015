Vue.config.delimiters = ['[[', ']]'];

var vueBody = new Vue({
    el: 'body',
    data: {
        user            : 'leasunhy',
        rightMenu       : ['design', 'modeling', 'experiment'],
        currentView     : 'database',
        loader          : {active: false, text: 'Loading'},
    },
    components: {
        database: Vue.component('dashboard-database'),
        reminder: {
            template: '#reminder-template'
        },
    }
});


