/**
 * @file design.js
 * @description Help the user to design circuits and logics
 * @author JinJin Lin
 * @mail jinjin.lin@outlook.com
 * @data Aug 30 2015
 * @copyright 2015 SYSU-Software. All rights reserved.
 * 
 */

"use strict";

var leftbar;

function LeftBar() {
    this.isOpenLeftBar = false;
    this._leftBarWidth = 350;
    this.view = $("#left-sidebar");
    this.leftTrigger = $(".trigger-left");
}

LeftBar.prototype.init = function() {
	this._leftTriggerAnimation();
}

LeftBar.prototype._leftTriggerAnimation = function() {
    var that = this;
    this.leftTrigger.click(function() {
        var left = that.view.css("left");
        if (parseInt(left) == 0) {
            that.isOpenLeftBar = false;
            that.view.animate({
                left: '-' + that._leftBarWidth + 'px'
            }, 500);

            $("#add-protocol").css("color", "#EDEDEF");
            that.leftTrigger.find("i").removeClass("left").addClass("right");
        } else {
            that.isOpenLeftBar = true;

            that.view.animate({
                left: '0px'
            }, 500);
            
            $("#add-protocol").css("color", "#72d3e3");
            that.leftTrigger.find("i").removeClass("right").addClass("left");
        }
    });
}

$('.menu .item')
  .tab()
;

$(function() {
	leftbar = new LeftBar();
	leftbar.init();
});

$("#moreInfor")
	.modal({closable: false,
			transition: 'horizontal flip'})
;

$(".more").click(function() {
	$("#moreInfor")
		.modal({closable: false,
				transition: 'horizontal flip'})
		.modal("show")
	;
});

$("#edit-protocol").click(function() {
	$(".remove-protocol").each(function() {
		$(this).toggle();
	});
	if ($(".remove-protocol:first").css("display") == "none") {
		$("#edit-protocol").css("color", "#EDEDEF");
	} else {
		$("#edit-protocol").css("color", "#72d3e3");
	}
});

$("#add-protocol").click(function() {
	$(".trigger-left").click();
});

$(".save-edit").each(function() {
	$(this).click(function() {
		if ($(this).find("i").hasClass("edit")) {
			console.log("111");
			// come in edit status
			$(this).find("i").removeClass("edit");
			$(this).find("i").addClass("save");
			var temp = $(this).find("i");
			$(this).empty();
			$(this).append(temp);
			$(this).append("Save");

			var contentElem = $(this).parents(".step-content").find("p");
			var content = contentElem.text();
			var textareaElem = $("<textarea></textarea>");
			textareaElem.attr("rows", "7");
			textareaElem.text(content);
			contentElem.replaceWith(textareaElem);
		} else {
			console.log("222");
			// come in save status
			$(this).find("i").removeClass("save");
			$(this).find("i").addClass("edit");
			var temp = $(this).find("i");
			$(this).empty();
			$(this).append(temp);
			$(this).append("Edit");

			var textareaElem = $(this).parents(".step-content").find("textarea");
			var content = textareaElem.text();
			var pElem = $("<p></p>");
			pElem.text(content);
			textareaElem.replaceWith(pElem);
		}
	});
});