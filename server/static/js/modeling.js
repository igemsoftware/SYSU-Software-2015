/**
 * @file modeling.js
 * @description Run the modeling
 * @author JinJin Lin
 * @mail jinjin.lin@outlook.com
 * @date Sept 7 2015
 * @copyright 2015 SYSU-Software. All rights reserved.
 * 
 */

"use strict"

var modeling;
var current_id = 1;

/**
 * @class Modeling
 * @method constructor
 *
 */
function Modeling() {
    this.variables = null;
    this.xAxis = null;
    this.count = 0;
}

/**
 * Init the modeling.html
 * @method init
 * @for Modeling
 * 
 */
Modeling.prototype.init = function() {
    this.enableGetPlot();
    this.enableChooseDesignBtn();
}

/**
 * Draw the chart of modeling 
 * @method drawChart
 * @for Modeling
 * @param {elem} view A dom element for drawing chart
 * @param {List} xArray X coordinates
 * @param {List} series Y coordinates
 * 
 */
Modeling.prototype.drawChart = function(view, xArray, series) {
    var that = this;
    view.highcharts({
        plotOptions: {
            series: {
                marker: {
                    enabled: false,
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
                        return this.value.toFixed(2);
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

/**
 * Load modeling data
 * @method loadData
 * @for Modeling
 * 
 */
Modeling.prototype.loadData = function() {
    var that = this;
    $.get("/modeling/design/"+$.getUrlParam('id'), function(data) {
        console.log('Design id:');
        console.log($.getUrlParam('id'));
        console.log('Load design chart X,Y data:');
        console.log(data);
        that.variables = data.variables;
        that.xAxis = data.x_axis;
        $("#simulation .title span").text(data.name);
		that.drawChart($("#chart"), that.xAxis, that.variables);
        that.drawChart($("#myChart"));
        that.initMenu();
        that.initParametersMenu(data.variables);
    });
}

/**
 * Init the table
 * @method initTable
 * @for Modeling
 * 
 */
Modeling.prototype.initTable = function() {
    for (var i = 0; i < 10; i++) {
        this.createLine();
    }
}

/**
 * Create a line on the table
 * @method createLine
 * @for Modeling
 * 
 */
Modeling.prototype.createLine = function() {
    var tr = $("<tr></tr>");
    var td1 = $("<td></td>");
    var td2 = $("<td></td>");
    var td3 = $("<td></td>");
    var input1 = $("<div class='ui fluid transparent input'><input class='x' type='text'><div>")
    var input2 = $("<div class='ui fluid transparent input'><input class='y' type='text'><div>")
    this.count += 1;
    td1.append(String(this.count));
    td2.append(input1);
    td3.append(input2);
    tr.append(td1);
    tr.append(td2);
    tr.append(td3);
    tr.appendTo($("#dataTable"));
}

/**
 * Init the variables menu
 * @method initMenu
 * @for Modeling
 * 
 */
Modeling.prototype.initMenu = function() {
	$("#myMenu").empty();
    for (var i in this.variables) {
        this.addItem(this.variables[i].name);
    }
}

/**
 * Init the paramters menu
 * @method initParametersMenu
 * @for Modeling
 * @param {List} series
 * 
 */
Modeling.prototype.initParametersMenu = function(series) {
    $('#parameters-quantity').html('');
    var vars = [];
    $(series).each(function(ine, ele) {
        vars.push(ele['name']);
    });
    var postDataJson = JSON.stringify(vars);

    $.ajax({
        url: "/modeling/default",
        data: postDataJson, 
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function(data) {
            console.log(data);
            $(data['initval']).each(function(ind, ele) {
                $('#parameters-quantity').append('<div class="field"><div class="ui labeled input"><div class="ui label">'
                        +vars[ind]+'</div><input type="number" min=0.00 placeholder="Default is '+ele+'" name="'
                        +vars[ind]+'"></div></div>');
            });
        }
    });
}

/**
 * Add item to the menu
 * @method addItem
 * @for Modeling
 * @param {string} name A part name
 * 
 */
Modeling.prototype.addItem = function(name) {
    var itemElem = $("<div class='item'></div>");
    itemElem.text(name);
    itemElem.attr("data-value", name);
    itemElem.appendTo($("#myMenu"));
}

/**
 * Enable get plot button 
 * @method enableGetPlot
 * @for Modeling
 * 
 */
Modeling.prototype.enableGetPlot = function() {
    var that = this;
    $('#getPlot').click(function() {
        var name = $("#protein").val();
        var yArray = [];
        var xArray = [];
        $("table tbody tr").each(function() {
            if ($(this).find('.x').val() == "" ||
                $(this).find('.y').val() == "") {
                return;
            }
            xArray.push(parseFloat($(this).find('.x').val()));
            yArray.push(parseFloat($(this).find('.y').val()));
        });
        var serie = {};
        var series = [];
        serie.data = yArray;
        serie.name = name;
        series.push(serie);
        that.drawChart($("#myChart"), xArray, series);
    })
}

/**
 * Enable choose design button
 * @method enableChooseDesignBtn
 * @for Modeling
 * 
 */
Modeling.prototype.enableChooseDesignBtn = function() {
	$("#chooseDesignBtn").click(function() {
		$("#chooseModal").modal('show');
	});
}

/**
 * Init the choose design modal
 * @method initChooseModal
 * @for Modeling
 * @param {list} designs A list of designs
 * 
 */
Modeling.prototype.initChooseModal = function(designs) {
	var that = this;
	for (var i in designs) {
		var div	= $("<div></div>");
		div.text(designs[i].name);
		var idElem = $("<input type='text'></input>");
		idElem.css("display", "none");
		idElem.val(designs[i].id);
		var divider = $("<div class='ui divider'></div>");
		div.append(idElem);
		div.addClass('title')
		$("#designList").append(div);
		$("#designList").append(divider);
	}

	$("#designList div").each(function() {
		$(this).click(function() {
			$("#designList div").each(function() {
				$(this).removeClass("iyellow");
			})
			$(this).addClass("iyellow");
		});
	});

	$("#choose").click(function() {
		$("#designList div").each(function() {
			if($(this).hasClass('iyellow')) {
				var id = $(this).find('input').val();
                current_id = id; //replot
				$("#simulation .title span").text($(this).text());
				$.get("/modeling/design/"+String(id), function(data) {
					that.variables = data.variables;
                    that.xAxis = data.x_axis;
                    that.drawChart($("#chart"), that.xAxis, that.variables);
                    that.drawChart($("#myChart"));
                    that.initMenu();
                    that.initParametersMenu(data.variables);
				});
			}
		});
		$("#chooseModal").modal('hide');
	})
}

/**
 * Replot the chart
 * @method rePlot
 * @for Modeling
 * 
 */
Modeling.prototype.rePlot = function() {
    var that = this;
    var postData = {}; 
    $('#parameters input').each(function(ind, ele) {
        if (ele.value) postData[ele.name] = ele.value;
    });
    console.log(postData);
    var postDataJson = JSON.stringify(postData);

    $.ajax({
        url: "/modeling/design/"+String(current_id),
        data: postDataJson, 
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function(data) {
            console.log(data);
            that.variables = data.variables;
            that.xAxis = data.x_axis;
            $("#simulation .title span").text(data.name);
            that.drawChart($("#chart"), that.xAxis, that.variables);
            that.drawChart($("#myChart"));
        }
    });
}

$(function() {
    if ($.getUrlParam('id') == null) {
        $("#noDesignErrorModal").modal('setting', 'closable', false).modal('show');
    }
    modeling = new Modeling();
    modeling.init();
    modeling.loadData();
    modeling.initTable();
})

$(".cancel").click(function() {
    $('.ui.modal').modal('hide');
});

$(".ui.menu .item").tab();

$("#addLine").click(function() {
    modeling.createLine();
})

$('.ui.dropdown').dropdown();

$.get("/modeling/design/all", function(data) {
	modeling.initChooseModal(data['designs']);
});

$("#moveToExper").click(function() {
    window.location.href = "/experiment?id="+$.getUrlParam('id');
});

$("#replot").click(function() {
    modeling.rePlot();
});

$("#backToDesign").click(function() {
    window.location.href = "/design";
});
