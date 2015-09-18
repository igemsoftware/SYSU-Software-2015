Vue.component('v-graph', {
    template: '#chart-template',
    props : ['designId'],
    data : function() { return {
        designId : 1,
        chartObj : null,
    }},
    ready : function() {
        this.$watch('designId', function() {
            var store = this;
            $.get("/modeling/design/" + this.designId, function(data) {
                console.log(data);
                store.drawChart(data.xAxis, data.variables);
            });
        }, {immediate: true});
    },
    methods : {
        drawChart : function(xArray, series) {
            if (this.chartObj !== null)
                this.chartObj.destroy();
            this.chartObj = new Highcharts.Chart({
                plotOptions: {
                    series: { marker: { enabled: false } }
                },
                chart: { renderTo: this.$$.chart, type: 'spline', backgroundColor: 'transparent' },
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
        }
    }
});
