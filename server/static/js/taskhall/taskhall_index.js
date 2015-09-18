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
        this.updateTasks(this, false);
        this.$watch('page', function() {
            this.updateTasks(this, false);
        });
        this.$watch('selectedTab', function() {
            this.updateTasks(this, true);
        });
        this.$watch('currentOrder', function() {
            this.updateTasks(this, true);
        });
        this.$watch('searchTerm', function() {
            this.updateTasks(this, true);
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
        updateTasks : function(store, resetPage) {
            if (resetPage) store.page = 1;
            var url = '/co-dev/list?page=' + store.page +
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

