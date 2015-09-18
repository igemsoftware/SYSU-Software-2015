Vue.config.delimiters = ['[[', ']]'];

var vBody = new Vue({
    el: "body",
    data: {
        selectedTab: 'Description',
    },
    ready: function() {
    },
    methods: {
        selectTab : function(i) {
            this.selectedTab = i;
            if (i !== 'Charts') return;
            this.$nextTick(function() {
                $(window).trigger('resize');
            });
        },
    }
});
