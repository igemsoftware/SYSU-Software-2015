var rightBar;
var calendar = $("#calendar");

function RightBar() {
    this.isOpenLeftBar = false;
    this._rightBarWidth = 350;
    this.view = $("#right-sidebar");
    this.rightTrigger = $(".trigger-right");
};

RightBar.prototype.init = function() {
	this._rightTriggerAnimation();
	this.enableAddEvent();
	this.enableTimePicker();
}

RightBar.prototype._rightTriggerAnimation = function() {
    var that = this;
    this.rightTrigger.click(function() {
        var right = that.view.css("right");
        if (parseInt(right) == 0) {
        	that.closeRightBar();
        } else {
        	$("#deleteEvent").hide();
        	$("#saveEvent").hide();
	        $("#createEvent").show();
	        $("#cancelEvent").show();
        	that.openRightBar();
        }
    });
};

RightBar.prototype.closeRightBar = function() {
   	var that = this;
   	this._isOpenRightBar = false;
    this.view.animate({
        right: '-' + this._rightBarWidth + 'px'
    }, 100);

    this.rightTrigger.find("i").removeClass("right").addClass("left");
}

RightBar.prototype.openRightBar = function() {
	var that = this;
    this._isOpenRightBar = true;
    this.view.animate({
        right: '0px'
    }, 100);
    
    this.rightTrigger.find("i").removeClass("left").addClass("right");
}

RightBar.prototype.enableTimePicker = function() {
	$('#startTime').datetimepicker({theme:'dark', step: 30});
	$('#endTime').datetimepicker({theme:'dark', step: 30});
}

RightBar.prototype.enableAddEvent = function() {
	var that = this;
	$("#createEvent").click(function() {
		var title = $("#eventTitle").val();
		var start = $("#startTime").val();
		var end = $("#endTime").val();
		var protocol = $("#eventProtocol").val();
		var record = $("#eventRecord").val();
		var error = $("#eventError").val();

		$("#eventTitle").val("");
		$("#startTime").val("");
		$("#endTime").val("");
		$("#eventProtocol").val("");
		$("#eventRecord").val("");
		$("#eventError").val("");

		var newEvent = {
			title: title,
			start: start,
			end: end,
			protocol: protocol,
			record: record,
			error: error
		}

		calendar.fullCalendar('renderEvent', newEvent, true);
		that.closeRightBar();
	})
}

// RightBar.prototype.enableDeleteBtn =  function() {
// 	var that = this;
// 	$("#deleteEvent").click(function() {
// 		console.log(calendar.fullCalendar( 'clientEvents'))''
		
// 	});
// }

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
		slotEventOverlap: false,  //设置议程视图中的事件是否可以重叠
		editable: true,
		droppable: true,
		eventLimit: true,
		selectable: true, //设置日程表的天和时间槽是否可以点击选中和拖拽
		selectHelper: true, // 设置是否在用户拖拽事件的时候绘制占位符
		weekMode: "liquid", //  日程表显示4、5或者6周，由当前的月份决定,每周的高度将拉伸到可用高度
		select: function(start, end) {
			$("#deleteEvent").hide();
			$("#saveEvent").hide();
			$("#createEvent").show();
	        $("#cancelEvent").show();

			start = start.format('YYYY/MM/DD HH:mm');
			end = end.format('YYYY/MM/DD HH:mm');
			$("#startTime").val(start);
			$("#endTime").val(end);

			rightBar.openRightBar();
		    // var title = prompt('Event Title:');
		    // if (title) {
		    // 	var newEvent = {
		    //             title: title,
		    //             start: start,
		    //             end: end
		    //         };
		    //     calendar.fullCalendar('renderEvent', newEvent, true);
		        // calendar.fullCalendar('addEvent', newEvent);
		        /**
		         * ajax call to store event in DB
		         */
		        // jQuery.post(
		        //     "event/new" // your url
		        //     , { // re-use event's data
		        //         title: title,
		        //         start: start,
		        //         end: end,
		        //         allDay: allDay
		        //     }
		        // );
		    // }
		    // calendar.fullCalendar('unselect');
		},
		eventClick: function(event, jsEvent, view) {
	        $("#startTime").val(event.start.format('YYYY/MM/DD HH:mm'));
	        $("#endTime").val(event.end.format('YYYY/MM/DD HH:mm'));
	        $("#eventTitle").val(event.title);
	        $("#eventProtocol").val(event.protocol);
	        $("#eventRecord").val(event.record);
	        $("#eventError").val(event.error);

	        $("#eventOpTitle").text("Edit event");
			$("#deleteEvent").click(function() {
				calendar.fullCalendar('removeEvents',event._id);
				rightBar.closeRightBar();
			});

			$("#saveEvent").click(function() {
				event.title = $("#eventTitle").val();
				event.start = $("#startTime").val();
				event.end = $("#endTime").val();
				event.protocol = $("#eventProtocol").val();
				event.record = $("#eventRecord").val();
				event.error = $("#eventError").val();

				$('#calendar').fullCalendar('updateEvent', event);
				rightBar.closeRightBar();
			});

	        $("#deleteEvent").show();
	        $("#saveEvent").show();
	        $("#createEvent").hide();
	        $("#cancelEvent").hide();
	        rightBar.openRightBar();
	    },
		events: [
					{
						title: 'Long Event',
						start: '2015-09-02',
						end: '2015-09-3'
					}
				]
		// drop: function(date, allDay) {
	 //        alert("Dropped on " + date + " with allDay=" + allDay);
	 //    }
	});
})

$(function() {
	rightBar = new RightBar();
	rightBar.init();
})

// $('#my-draggable').draggable({
//     revert: true,      // immediately snap back to original position
//     revertDuration: 0  //
// });