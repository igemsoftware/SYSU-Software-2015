"use strict"


var modeling;

function Modeling() {
    this.variables = null;
    this.xAxis = null;
    this.count = 0;
}

Modeling.prototype.drawChart = function(view, xArray, yArray) {
    var that = this;
    view.highcharts({
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
        series: yArray
    });
}

Modeling.prototype.loadData = function() {
    var that = this;
    // $.get("/modeling/design/1", function(data) {
    //     console.log(data);
    //     that.variables = data.variables;
    //     that.xAxis = data.x_axis;
    //     console.log(that.variables);
    //     console.log(that.xAxis);
    //     that.drawChart($("#chart", that.xAxis, that.variables));
    // });
    // that.drawMyChart();
}

Modeling.prototype.initTable = function() {
    for (var i = 0; i < 10; i++) {
        this.createLine();
    }
}
Modeling.prototype.createLine = function() {
    var tr = $("<tr></tr>");
    var td1 = $("<td></td>");
    var td2 = $("<td class='x'></td>");
    var td3 = $("<td class='y'></td>");
    var input1 = $("<div class='ui fluid transparent input'><input type='text'><div>")
    var input2 = $("<div class='ui fluid transparent input'><input type='text'><div>")
    this.count += 1;
    td1.append(String(this.count));
    td2.append(input1);
    td3.append(input2);
    tr.append(td1);
    tr.append(td2);
    tr.append(td3);
    tr.appendTo($("#dataTable"));
}

Modeling.prototype.initMenu = function() {
    for (var i in this.variables) {
        this.addItem(this.variables[i].name);
    }
}

Modeling.prototype.addItem = function(name) {
    var itemElem = $("<div class='item'></div>");
    itemElem.text(name);
    itemElem.attr("data-value", name);
    itemElem.append($("#myMenu"));
}

Modeling.prototype.enableGetPlot = function() {
    var that = this;
    $('#getPlot').click(function() {
        var name = $("#protein").val();
        var yArray = [];
        var xArray = [];
        $("table tbody tr").each(function() {
            xArray.push(this.find('.x').val());
            yArray.push(this.find('.y').val());
        });
        var series = {};
        series.data = xArray;
        series.name = name;
        that.drawChart($("#myChart"), xArray, yArray);
    })
}

$(function() {
    modeling = new Modeling();
    modeling.loadData();
    modeling.initTable();
})

// $("#chooseModal").modal('show');

$(".cancel").click(function() {
    $('.ui.modal').modal('hide');
});

$(".ui.menu .item").tab();

$("#addLine").click(function() {
    modeling.createLine();
})

$('.ui.dropdown')
  .dropdown()
;