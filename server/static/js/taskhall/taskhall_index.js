var vueBody = new coreBody({
    el: 'body',
    data : {
        user                : "leasunhy",
        notificationCount   : 2,
        questionCount       : 2723,
        selectedTab         : 'All Questions',
        currentOrder        : 'vote',
        orders              : ['vote', 'view', 'time'],
        page                : 1,
        tasks               : [],
        ckeInit             : false,
    },
    ready: function() {
        var store = this;
        $('#taskhall-index-sticky').sticky({
            offset: 60,
        });
        $('#taskhall-index-order-dropdown').dropdown();
        //this.$eval('fakeTasks(this)');
        this.$eval('updateTasks(this, this.page, this.currentOrder)');
        this.$watch('page', function() {
            this.$eval('updateTasks(this, this.page, this.currentOrder)');
        });
        this.$watch('currentOrder', function() {
            this.page = 1;
            this.$eval('updateTasks(this, this.page, this.currentOrder)');
        });
        this.$watch('tasks', function() {
            $('.question.author').popup({
                inline: true,
                position: 'right center',
                width: '300px',
            });
        });
    },
    methods: {
        showAskModal : function() {
            $('#taskhall-index-ask-modal').modal('show');
            if (!this.ckeInit) {
                this.ckeInit = true;
                CKEDITOR.replace('askcontent');
            }
        },
        updateTasks : function(store, page, currentOrder) {
            $.get('/taskhall/list?page=' + page + '&keyword=' + currentOrder, function(data) {
                store.tasks = data.tasks;
                console.log(data);
            });
            $('.taskhall-index.question.item > .question.main > .detail').ellipsis();
            $("html, body").animate({ scrollTop: 0 }, "slow");
        },
        fakeTasks : function(store) {
            store.tasks = [];
            $('.taskhall-index.question.item > .question.main > .detail').ellipsis();
        },
    },
});

