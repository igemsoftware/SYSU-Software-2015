"use strict"


var modeling;

function Modeling() {
    this.variables = null;
    this.xAxis = null;
}

Modeling.prototype.drawChart = function() {
    var that = this;
    // for (var i in this.xAxis) {
    //     this.xAxis[i] =  parseFloat(this.xAxis[i]);
    // }
    $('#chart').highcharts({
        plotOptions: {
            series: {
                marker: {
                    enabled: false, /*数据点是否显示*/
                },            
            }
        },
        chart: {
          type: 'spline'
        },
        title: {
            text: 'Dynamic Performance',
            x: -20
        },
        subtitle: {
            text: 'I am subtitle',
            x: -20
        },
        marker: {
                    enabled: false
                },
        xAxis: {
            categories: that.xAxis,
            labels: {
                    formatter: function() {
                        return this.value.toFixed(2);//这里是两位小数，你要几位小数就改成几
                    },
                },
        },
        yAxis: {
            title: {
                text: 'Output'
            }
            // plotLines: [{
            //     value: 0,
            //     width: 1,
            //     color: '#808080'
            // }]
        },
        // tooltip: {
        //     valueSuffix: '°C'
        // },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: that.variables
        // series: that.variables
    });
}

Modeling.prototype.loadData = function() {
    var that = this;
    $.get("/modeling/circuit/1", function(data) {
        console.log(data);
        that.variables = data.variables;
        that.xAxis = data.x_axis;
        console.log(that.variables);
        console.log(that.xAxis);
        that.drawChart();
    });
}

$(function() {
    modeling = new Modeling();
    modeling.loadData();
})

$(".ui.menu .item").tab();
