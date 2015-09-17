var vDatabase = new Vue({
    el: 'body',
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
            selectedTab     : 'Description',
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
            this.selectedTab = 'Description';
            this.selectedRecord = rec;
            var store = this;
            $.get("/modeling/design/" + rec.id, function(data) {
                console.log(data);
                store.drawChart($("#chart"), data.xAxis, data.variables);
            });
        },
        drawChart : function(view, xArray, series) {
            var that = this;
            view.highcharts({
                plotOptions: {
                    series: { marker: { enabled: false } }
                },
                chart: { type: 'spline', backgroundColor: 'transparent' },
                title: {
                    text: 'Dynamic Performance',
                    x: -20,
                    style: {
                        fontSize: "20px"
                    }
                },
                subtitle: {
                    text: 'The equations describing the change of concentration of protein over time',
                    x: -20
                },
                marker: {
                    enabled: false
                },
                xAxis: {
                    categories: xArray,
                    labels: {
                        formatter: function() {
                            return this.value.toFixed(2);//这里是两位小数，你要几位小数就改成几
                        },
                    },
                },
                yAxis: {
                    title: {
                        text: 'Output (concn [a.u.])',
                        style: {
                            fontSize: "17px"
                        }
                    },
                    minorTickInterval: 'auto',
                },
                tooltip: {
                    valueSuffix: '[a.u.]'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: series
            }
        );
        $(window).trigger('resize');
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

