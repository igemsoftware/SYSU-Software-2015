Vue.config.delimiters = ['[[', ']]'];

var vBody = new Vue({
    el: "body",
    data: {
        selectedTab: 0,
    },
    ready: function() {
    },
    methods: {
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
            });
        },
    }
});
