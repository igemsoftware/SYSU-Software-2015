var vDatabaseComponent = Vue.component('dashboard-database', {
    template: '#database-template',
    data    : function() {
        return {
            databaseRecords : [],
            favoriteRecords : [],
            editStatus      : false,
            tagData         : null,
            tagKey          : null,
            tagRev          : false,
            tagMine         : true,
            selectedRecord  : null,
            selectedTag     : 'all',
            selectedTab     : 0,
            searchTerm      : '',
        }
    },
    computed: {
        recordsBeingDisplayed: function() {
            return this.$eval('(this.tagMine ? this.databaseRecords : this.favoriteRecords)' +
                              '| recordFilterBy tagData in tagKey tagRev' +
                              '| filterBy searchTerm');
        },
    },
    ready : function() {
        $('.progress[data-content]').popup({position: 'top center'});
        var store = this;
        $.get('/person/mine', function(data) {
            store.$set('databaseRecords', data.mine);
        });
        $.get('/person/favorite', function(data) {
            store.$set('favoriteRecords', data.favorite);
        });
    },
    methods : {
        selectTag: function(tag, mine, data, key, reverse) {
            this.selectedTag = tag;
            this.tagMine = mine;
            this.tagData = data;
            this.tagKey = key;
            this.tagRev = reverse;
        },
        selectRecord: function(rec) {
            this.selectedTab = 0;
            this.selectedRecord = rec;
        },
    },
    filters : {
        recordFilterBy : function (arr, search, delimiter, dataKey, reverse) {
            var result = Vue.filter('filterBy')(arr, search, delimiter, dataKey);
            if (!reverse)
                return result;
            result = arr.filter(function(item) {return result.indexOf(item) < 0;})
            return result;
        },
    },
});

