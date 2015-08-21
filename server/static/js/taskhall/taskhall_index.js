Vue.component('taskhall-index', {
    template: '#index-template',
    data: function() { return {
        questionCount: 2723,
        selectedTab  : 'question',
        currentOrder : 'vote',
        orders       : ['vote', 'view', 'time'],
        page         : 1,
        tasks        : [],
    }},
    ready: function() {
        var store = this;
        $('#taskhall-index-sticky').sticky({
            offset: 60,
        });
        $('#taskhall-index-order-dropdown').dropdown();
        this.$eval('updateTasks(this, this.page, this.currentOrder)');
        this.$watch('page', function() {
            this.$eval('updateTasks(this, this.page, this.currentOrder)');
        });
        this.$watch('currentOrder', function() {
            this.page = 1;
            this.$eval('updateTasks(this, this.page, this.currentOrder)');
        });
        $('.taskhall-index.question.item > .question.main > .detail').ellipsis();
    },
    methods: {
        updateTasks : function(store, page, currentOrder) {
            $.get('/taskhall/list?page=' + page + '&keyword=' + currentOrder, function(data) {
                store.tasks = data.tasks;
                console.log(data);
            });
            $("html, body").animate({ scrollTop: 0 }, "slow");
        },
    },
});
