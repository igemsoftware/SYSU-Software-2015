var vueBody = new coreBody({
    el: 'body',
    data : {
        user                : "leasunhy",
        selectedTab         : 'All Questions',
        currentOrder        : 'vote',
        orders              : ['vote', 'view', 'time'],
        page                : 1,
        tasks               : [],
        searchTerm          : '',
        ckeInit             : false,
    },
    ready: function() {
        $('#taskhall-index-sticky').sticky({ offset: 60 });
        $('#taskhall-index-order-dropdown').dropdown();
        this.$eval('updateTasks(this)');
        this.$watch('page', function() {
            this.$eval('updateTasks(this)');
        });
        this.$watch('selectedTab', function() {
            this.page = 1;
            this.$eval('updateTasks(this)');
        });
        this.$watch('currentOrder', function() {
            this.page = 1;
            this.$eval('updateTasks(this)');
        });
        this.$watch('searchTerm', function() {
            this.page = 1;
            this.$eval('updateTasks(this)');
        });
        this.$watch('tasks', function() {
            $('.question.author').popup({
                inline: true,
                position: 'right center',
                width: '300px',
            });
        });
    },
    computed : {
        unansweredOnly : function() {
            return this.selectedTab === 'Unanswered';
        }
    },
    methods: {
        showAskModal : function() {
            $('#taskhall-index-ask-modal').modal('show');
            if (!this.ckeInit) {
                this.ckeInit = true;
                CKEDITOR.replace('askcontent');
            }
        },
        updateTasks : function(store) {
            var url = '/taskhall/list?page=' + store.page +
                      '&order=' + store.currentOrder +
                      '&keyword=' + store.searchTerm +
                      (store.unansweredOnly ? '&unanswered=True' : '');
            $.get(url, function(data) {
                store.tasks = data.tasks;
                console.log(data);
            });
            $('.taskhall-index.question.item > .question.main > .detail').ellipsis();
            $("html, body").animate({ scrollTop: 0 }, "slow");
        },
    },
});

