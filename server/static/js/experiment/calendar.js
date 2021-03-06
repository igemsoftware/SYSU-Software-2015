/**
 * @file calendar.js
 * @description Calendar function
 * @author JinJin Lin
 * @mail jinjin.lin@outlook.com
 * @date Sept 11 2015
 * @copyright 2015 SYSU-Software. All rights reserved.
 * 
 */

var rightBar;
var calendar = $("#calendar");
var clickedEvent;

/**
 * @class RightBar
 * @method constructor
 *
 */
function RightBar() {
    this.isOpenLeftBar = false;
    this._rightBarWidth = 350;
    this.view = $("#right-sidebar");
    this.rightTrigger = $(".trigger-right");
};

/**
 * Init the right bar
 * @method init
 * @for RightBar
 * 
 */
RightBar.prototype.init = function() {
	this._rightTriggerAnimation();
	this.enableAddEvent();
	this.enableTimePicker();
}

/**
 * Enable the right bar trigger function
 * @method _rightTriggerAnimation
 * @for RightBar
 * 
 */
RightBar.prototype._rightTriggerAnimation = function() {
    var that = this;
    this.rightTrigger.click(function() {
        var right = that.view.css("right");
        if (parseInt(right) == 0) {
        	that.closeRightBar();
        } else {
        	that.openRightBar("create");
        }
    });
};

/**
 * Close the right bar
 * @method closeRightBar
 * @for RightBar
 * 
 */
RightBar.prototype.closeRightBar = function() {
   	var that = this;
   	this._isOpenRightBar = false;
    this.view.animate({
        right: '-' + this._rightBarWidth + 'px'
    }, 100);

    this.rightTrigger.find("i").removeClass("right").addClass("left");
}

/**
 * Open the right bar
 * @method openRightBar
 * @for RightBar
 * @param {String} op A string for desicript the operation
 * 
 */
RightBar.prototype.openRightBar = function(op) {
	if (op == "create") {
    	$("#deleteEvent").hide();
    	$("#saveEvent").hide();
        $("#createEvent").show();
        $("#cancelEvent").show();
	} else if (op == "edit") {
    	$("#deleteEvent").show();
    	$("#saveEvent").show();
        $("#createEvent").hide();
        $("#cancelEvent").hide();
	}
	var that = this;
    this._isOpenRightBar = true;
    this.view.animate({
        right: '0px'
    }, 100);
    
    this.rightTrigger.find("i").removeClass("left").addClass("right");
}

/**
 * Enable the timepicker
 * @method enableTimePicker
 * @for RightBar
 * 
 */
RightBar.prototype.enableTimePicker = function() {
	$('#startTime').datetimepicker({theme:'dark', step: 30});
	$('#endTime').datetimepicker({theme:'dark', step: 30});
}

/**
 * Clear the right bar
 * @method clearBar
 * @for RightBar
 * 
 */
RightBar.prototype.clearBar = function() {
	$("#eventTitle").val("");
	$("#startTime").val("");
	$("#endTime").val("");
	$("#eventProtocol").val("");
	$("#eventRecord").val("");
	$("#eventError").val("");
}

/**
 * Enable the adding event button
 * @method enableAddEvent
 * @for RightBar
 * 
 */
RightBar.prototype.enableAddEvent = function() {
	var that = this;
	$("#createEvent").click(function() {
		var title = $("#eventTitle").val();
		var start = $("#startTime").val();
		var end = $("#endTime").val();
		var protocol = $("#eventProtocol").val();
		var record = $("#eventRecord").val();
		var error = $("#eventError").val();
		var newEvent = {
			id: -1,
			title: title,
			start: start,
			end: end,
			protocol: protocol,
			record: record,
			error: error
		}

		calendar.fullCalendar('renderEvent', newEvent, true);
		that.syncEvents();
		that.closeRightBar();
		that.clearBar();
	})
}

/**
 * SYNC the events
 * @method syncEvents
 * @for RightBar
 * 
 */
RightBar.prototype.syncEvents = function() {
	var events = calendar.fullCalendar('clientEvents');
	var eventsArr = [];
	for (var i in events) {
		eventsArr.push({
			id: events[i].id,
			start: events[i].start.format('YYYY/MM/DD HH:mm'),
			end: events[i].end.format('YYYY/MM/DD HH:mm'),
			title: events[i].title,
			error: events[i].error,
			protocol: events[i].protocol,
			record: events[i].record
		});
	}
	var postDataJson = JSON.stringify(eventsArr);

	$.ajax({
	    type: 'POST',
	    contentType: 'application/json',
	    url: '/calendar/all',
	    dataType : 'json',
	    data : postDataJson,
        success: function(data) {
            calendar.fullCalendar( 'removeEvents' );
	        calendar.fullCalendar( 'addEventSource', data["events"]);
        }
	});

}

/**
 * Init the protocols
 * @method initProtocol
 * @for RightBar
 * 
 */
RightBar.prototype.initProtocol = function() {
	var protocols = DataManager.getPerProtocols();
	for (var i in protocols) {
		var optionELem = $("<option></option>");
		optionELem.text(protocols[i].name);
		optionELem.attr("value", protocols[i].name);
		optionELem.appendTo($("#eventProtocol"));
	}
	$('#eventProtocol.dropdown').dropdown();
}

$(function() {
	calendar.fullCalendar({
		height: 500,
	    header: {
	    	center:   'title',
		    left: 'month,agendaWeek,agendaDay',
		    right:  'prev,next today'
		},
		editable: true,
		slotEventOverlap: false,  //设置议程视图中的事件是否可以重叠
		startEditable: true,
		droppable: true,
		eventLimit: true,
		selectable: true, //设置日程表的天和时间槽是否可以点击选中和拖拽
		selectHelper: true, // 设置是否在用户拖拽事件的时候绘制占位符
		weekMode: "liquid", //  日程表显示4、5或者6周，由当前的月份决定,每周的高度将拉伸到可用高度
		eventColor: '#A4FAEF',
		eventTextColor: '#0D0D0D',
		select: function(start, end) {

			start = start.format('YYYY/MM/DD HH:mm');
			end = end.format('YYYY/MM/DD HH:mm');
			$("#startTime").val(start);
			$("#endTime").val(end);

			rightBar.openRightBar("create");
		},
		eventClick: function(event, jsEvent, view) {
	        $("#startTime").val(event.start.format('YYYY/MM/DD HH:mm'));
	        $("#endTime").val(event.end.format('YYYY/MM/DD HH:mm'));
	        $("#eventTitle").val(event.title);
	        $("#eventProtocol").val(event.protocol);
	        $("#eventRecord").val(event.record);
	        $("#eventError").val(event.error);

	        $("#eventOpTitle").text("Edit event");
	        clickedEvent = event;
	        rightBar.openRightBar("edit");
	        rightBar.event = event;
	    },
	    eventResize: function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view) {
	    	rightBar.syncEvents();
	    },
	    eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
	    	rightBar.syncEvents();
	    }
	});
})

$(function() {
	rightBar = new RightBar();
	rightBar.init();
})

$.get("/calendar/all", function(data, status) {
	console.log('Get data for initing:');
 	console.log(data);
 	calendar.fullCalendar( 'addEventSource', data["events"]);
});

$("#deleteEvent").click(function() {
	calendar.fullCalendar('removeEvents', rightBar.event._id);
	$.ajax({
	    type: 'DELETE',
	    url: '/calendar/all',
	    data : "id="+rightBar.event._id,
	});
	rightBar.closeRightBar();
	rightBar.clearBar();
});

$("#saveEvent").click(function() {
	clickedEvent.title = $("#eventTitle").val();
	clickedEvent.start = $("#startTime").val();
	clickedEvent.end = $("#endTime").val();
	clickedEvent.protocol = $("#eventProtocol").val();
	clickedEvent.record = $("#eventRecord").val();
	clickedEvent.error = $("#eventError").val();

	$('#calendar').fullCalendar('updateEvent', clickedEvent);
	rightBar.syncEvents();
	rightBar.closeRightBar();
	rightBar.clearBar();
});
