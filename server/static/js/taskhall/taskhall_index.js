Vue.component('taskhall-index', {
    template: '#index-template',
    data: function() { return {
        questionCount: 2723,
        selectedTab  : 'question',
    }},
    ready: function() {
        $('#taskhall-index-sticky').sticky({
            offset: 60,
        });
    },
});
