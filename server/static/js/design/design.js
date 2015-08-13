/**
 * @file design.js
 * @description Help the user to design circuits and logics
 * @author JinJin Lin
 * @mail jinjin.lin@outlook.com
 * @data Aug 7 2015
 * @copyright 2015 SYSU-Software. All rights reserved.
 * 
 */

"use strict";
var operationLog;
var design;
var leftBar;
var rightBar;
var rubberband;
var designMenu;

var typeTable = [];
var relationFromAtoB = [];
var relationAdjmatrix = [];
var devicesList = [];

/**
 * @class OperationLog
 *
 * @method constructor
 *
 */
function OperationLog() {};

OperationLog.prototype.init = function() {
    $.timeago.settings.allowFuture = true;
};

OperationLog.prototype.addPart = function(partName) {
    var message = "Added a <a>" + partName + "</a> part.";
    var EventElem = this._getEventElem("plus icon", message);
    this._writeToRightBar(EventElem);
};

OperationLog.prototype.removePart = function(partName) {
    var message = "Removed a <a>" + partName + "</a> part.";
    var EventElem = this._getEventElem("remove icon", message);
    this._writeToRightBar(EventElem);
};

OperationLog.prototype.openFile = function() {
    var message = "Open a new file";
    var EventElem = this._getEventElem("folder open icon", message);
    this._writeToRightBar(EventElem);
};

OperationLog.prototype.connectPart = function(partNameA, partNameB) {
    var message = "Connected <a>" + partNameA + "</a> and <a>" + partNameB + "</a>.";
    var EventElem = this._getEventElem("compress icon", message);
    this._writeToRightBar(EventElem);
};

OperationLog.prototype._getEventElem = function(iconClass, message) {
    var eventDiv = $("<div></div>");
    eventDiv.addClass("event");
    var labelDiv = $("<div></div>");
    labelDiv.addClass("label");
    var icon = $("<i></i>");
    icon.addClass(iconClass);
    icon.appendTo(labelDiv);
    labelDiv.appendTo(eventDiv);

    var contentDiv = $("<div></div>");
    contentDiv.addClass("content");
    var summaryDiv = $("<div></div>");
    summaryDiv.addClass("summary");
    summaryDiv.html(message);
    var timeElem = $("<time></time>");
    timeElem.addClass("date timeago");
    timeElem.attr("datetime", new Date().toISOString());
    timeElem.appendTo(summaryDiv);
    summaryDiv.appendTo(contentDiv);
    contentDiv.appendTo(eventDiv);

    return eventDiv;
};

OperationLog.prototype._writeToRightBar = function(EventElem) {
    $(".ui .feed").prepend(EventElem);
    $("time.timeago").timeago();
};

//==========================================================================================
/**
 * @class Design
 *
 * @method constructor
 *
 */
function Design() {
    this.filterDiv = $(".filterDiv");
    this.nodes = $(".node");
    this.drawArea = $("#drawArea");
    this.drawMenu = $("#drawArea-menu");
    this._isProOrInhiLink = false;
    this._putPartElemList = [];
    this._partCount = 0;
};

Design.prototype.clear = function() {
    this._putPartElemList = [];
}

Design.prototype.init = function() {
    this._initJsPlumbOption();
    this._makeDrawAreaDroppabble();
    operationLog.init();
    operationLog.openFile();
};

Design.prototype.addPromoteAndInhibitionLine = function(partA) {
    var partNameA = partA.attr('part-name');
    for (var i in this._putPartElemList) {
        var partB = this._putPartElemList[i];
        var partNameB = partB.attr('part-name');
        if (this._isHasPromoteOrInhibitionRelation(partNameA, partNameB)) {
            var lineType = this._getLineType(partNameA, partNameB);
            this.drawLine(partA, partB, lineType);
        } else if (this._isHasPromoteOrInhibitionRelation(partNameB, partNameA)) {
            var lineType = this._getLineType(partNameB, partNameA);
            this.drawLine(partB, partA, lineType);
        }
    }
};

Design.prototype.drawLine = function(fromPartA, toPartB, lineType) {
    var overlaysClass = this._getOverLaysClass(lineType);
    var strokeStyle = this._getStorkeStyle(lineType);
    this._isProOrInhiLink = true;
    jsPlumb.connect({
        connector: ["Flowchart"],
        anchor: "Continuous",
        paintStyle: { strokeStyle: strokeStyle, lineWidth: 2 },
        // hoverPaintStyle: { strokeStyle: "blue" },
        source:fromPartA,
        target:toPartB,
        endpoint:"Blank",
        overlays: [overlaysClass],
        allowLoopback: true,
        Container: "drawArea",
        scope: lineType
    });
};

Design.prototype._getStorkeStyle = function(lineType) {
    if (lineType == 'normal') return "green";
    if (lineType == 'inhibition') return "red";
    if (lineType == "promotion") return "blue";
};

Design.prototype._getOverLaysClass = function(lineType) {
    if (lineType == 'normal') return  ["Custom", { create:function(component) {return $("<div></div>");}}];
    if (lineType == 'inhibition') return [ "Diamond", {width:25, length: 1, location:1, foldback:1}];
    if (lineType == "promotion") return ['Arrow', {width:25, length: 15, location:1, foldback:0.3}];
};

Design.prototype._getLineType = function(fromPartA, toPartB) {
    for (var i in relationFromAtoB) {
        if (relationFromAtoB[i].start === fromPartA &&
            relationFromAtoB[i].end === toPartB) {
            return relationFromAtoB[i].type;
        }
    }
    return "";
};

Design.prototype._isHasPromoteOrInhibitionRelation = function(fromPartA, toPartB) {
    for (var i in relationFromAtoB) {
        if (relationFromAtoB[i].start === fromPartA &&
            relationFromAtoB[i].end === toPartB && 
            (relationFromAtoB[i].type == "promotion" ||
                relationFromAtoB[i].type == "inhibition")) {
            return true;
        }
    }
    return false;
};

Design.prototype._makeDrawAreaDroppabble = function() {
    var that = this;
    this.drawArea.droppable({
        accept: '.item',
        containment: 'drawArea',
        drop:function(e, ui) {
            var dropedElement = ui.helper.clone();
            ui.helper.remove();
            $(dropedElement).removeAttr("class");

            $(dropedElement).find("img").addClass("no-margin");
            $(dropedElement).find("h4").addClass("text-center");
            $(dropedElement).find("h4").css("bottom", "px");

            var filterDiv = $("<div></div>");
            filterDiv.addClass("filterDiv");
            filterDiv.appendTo(dropedElement);

            var minusCircle = Util.createMinusCircleDiv();
            minusCircle.appendTo(dropedElement);

            $(dropedElement).find("img").removeAttr("class");
            dropedElement.addClass("node");
            dropedElement.appendTo('#drawArea');
            dropedElement.attr("normal-connect-num", 0);

            var left = $(dropedElement).position().left - leftBar.view.width();
            var top  = $(dropedElement).position().top - that.drawMenu.height();

            $(dropedElement).css({left:left, top:top});
            design.addDraggable(dropedElement);
            design.addPromoteAndInhibitionLine(dropedElement);
            design.makeSourceAndTarget(dropedElement);

            that._partCount += 1;
            var partName = dropedElement.attr("part-name");
            dropedElement.attr("part-id", partName + "_" + String(that._partCount));

            that._putPartElemList.push(dropedElement);
            operationLog.addPart(dropedElement.attr("part-name"));
        }
    });
}

Design.prototype.makeSourceAndTarget = function(elem) {
    jsPlumb.makeSource(elem, {
        filter: ".filterDiv",
        connector: ["Flowchart"],
        // connectorStyle: { strokeStyle: "green", lineWidth: 2 },
        anchor: "Continuous",
        endpoint:"Blank",
        overlays: [["Custom", { create:function(component) {return $("<div></div>");}}]],
        allowLoopback: false
    });

    jsPlumb.makeTarget(elem, {
        anchor: "Continuous",
        dropOptions: { hoverClass: "dragHover"},
        endpoint:"Blank",
        allowLoopback: false
    });
};

Design.prototype._initJsPlumbOption = function() {
    jsPlumb.bind("connection", function(CurrentConnection) {
        var target = $(CurrentConnection.connection.target);
        var source = $(CurrentConnection.connection.source);
        var targetNormalNum = parseInt(target.attr("normal-connect-num"));
        var sourceNormalNum = parseInt(source.attr("normal-connect-num"));
        if (this._isProOrInhiLink == false) {
            CurrentConnection.connection.scope = "normal";
            if (sourceNormalNum === 2) {
                source.attr("data-content", "Most link to two objects");
                source.popup('show');
                source.removeAttr("data-content");
                jsPlumb.detach(CurrentConnection.connection);
                return;
            }
            if (targetNormalNum === 2){
                target.attr("data-content", "Most link to two objects");
                target.popup('show');
                target.removeAttr("data-content");
                jsPlumb.detach(CurrentConnection.connection);
                return;
            }
            sourceNormalNum += 1;
            source.attr("normal-connect-num", sourceNormalNum);
            targetNormalNum += 1;
            target.attr("normal-connect-num", targetNormalNum);

            operationLog.connectPart(source.attr("part-name"), target.attr("part-name"))
        } else {
            this._isProOrInhiLink = false;
        }
    });

    jsPlumb.ready(function() {
        jsPlumb.setContainer(this.drawArea);
    });

    jsPlumb.on(this.drawArea, "click", ".minus", function() {
        operationLog.removePart($(this.parentNode.parentNode).attr("part-name"));
        jsPlumb.remove(this.parentNode.parentNode);
    });
};

Design.prototype.addDraggable = function(elem) {
    jsPlumb.draggable(elem, {
        containment: 'parent',
    })
};

//========================================================================================
/**
 * @class Rubberband
 *
 * @method constructor
 *
 */

function Rubberband() {
    this.view = $("#rubberband");
    this.drawArea = $("#drawArea");
    this._x = null;
    this._y = null;
};

Rubberband.prototype.init = function() {
    this._listenDrawAreaMouseMove();
    this._listenDrawAreaMouseDown();
    this._listenDrawAreaMouseup();
    this._listenDrawAreaClick();
    // this.drawArea.mousedown(rubberbandInstance.drawAreaMouseDown);
    // this.drawArea.mousemove(rubberbandInstance.drawAreaMouseMove);
    // this.drawArea.mouseup(rubberbandInstance.drawAreaMouseUp);
    // this.drawArea.click(rubberbandInstance.drawAreaClick);
}

Rubberband.prototype._listenDrawAreaMouseMove = function() {
    var that = this;
    this.drawArea.mousemove(function(event) {
        if(that.view.is(":visible") !== true) { return; }
             
        // Get the top- and left values
        var t = (event.pageY > that._y) ? that._y : event.pageY;
        var l = (event.pageX >= that._x) ? that._x : event.pageX;
                 
        // Get the width of the rubberband
        var wcalc = event.pageX - that._x;
        var w = (event.pageX > that._x) ? wcalc : (wcalc * -1); 
            
        // Get the height of the rubberband     
        var hcalc = event.pageY - that._y;
        var h = (event.pageY > that._y) ? hcalc : (hcalc * -1); 
     
        // Update the rubberband with the new values
        if (leftBar.isOpenLeftBar == true) {
            l -= leftBar.view.width();
        }
        // t -= drawArea_menu.height();

        that.view.css({top:t, left:l, height:h, width:w, position:'relative'});
    });
};

Rubberband.prototype._listenDrawAreaMouseup = function() {
    var that = this;
    this.drawArea.mouseup(function(event) {
        that._diagramContainerFindSelectedItem();
        that.view.hide();
    });
};

Rubberband.prototype._listenDrawAreaMouseDown = function() {
    var that = this;
    this.drawArea.mousedown(function(event) {
        if ($(event.target).attr("class") == "filterDiv") return;
        that._x = event.pageX;         
        that._y = event.pageY;
                 
        that.view.css({top:that._y, left:that._x, height:1, width:1, position:'relative'});
        that.view.show();
    });
};

Rubberband.prototype._listenDrawAreaClick = function() {
    var that = this;
    this.drawArea.click(function(event) {
        if(that._x === event.pageX && that._y === event.pageY)
        {   
            jsPlumb.clearDragSelection();
            $(".node").each(function() {
                $(that).removeClass("selected");
            });
        }
    });
};

Rubberband.prototype._getTopLeftOffset = function(elem) {
    var elemDimension = {};
    elemDimension.left = elem.offset().left;
    elemDimension.top =  elem.offset().top;
 
    // Distance to the left is: left + width
    elemDimension.right = elemDimension.left + elem.outerWidth();
 
    // Distance to the top is: top + height
    elemDimension.bottom = elemDimension.top + elem.outerHeight();
     
    return elemDimension;
};

Rubberband.prototype._diagramContainerFindSelectedItem = function() {
    if(this.view.is(":visible") !== true) { return; }
    var rubberbandOffset = this._getTopLeftOffset(this.view);
    var that = this;
    $(".node").each(function() {
        var itemOffset = that._getTopLeftOffset($(this));
        if( itemOffset.top > rubberbandOffset.top &&
            itemOffset.left > rubberbandOffset.left &&
            itemOffset.right < rubberbandOffset.right &&
            itemOffset.bottom < rubberbandOffset.bottom) {
            $(this).addClass("selected");
 
            var elementid = $(this).attr('id');
            jsPlumb.addToDragSelection(elementid);
        }
    });
};

//========================================================================================
/**
 * @class DesignMenu
 *
 * @method constructor
 *
 */
function DesignMenu() {
    this.menu = $("#drawArea-menu");
    this.saveBtn = $("#save");
    this.downloadBtn = $("#download");
    this.openFileBtn = $("#openFile");
    this.clearBtn = $("#clear");
    this.changeChartToImageBtn = $("#showImage");
    this.connPartBtn = $("#connect-part");
    this.minusBtn = $("#minus");

    this._isMinusBtnOpen = false;
    this._isConnectPartBtnOpen = true;
};

DesignMenu.prototype.init = function() {
    this.enableSaveCircuitchartBtn();
    this.enableChangeCircuitToImageBtn();
    this.enableLoadCircuitchartBtn();
    this.enableClearCircuitchartBtn();
    this.enableChangeCircuitToImageBtn();
    this.enableConnectPartBtn();
    this.enableRemovePartBtn();
}

DesignMenu.prototype.enableRemovePartBtn = function() {
    var that = this;
    this.minusBtn.click(function() {
        if (that._isMinusBtnOpen == false) {
            that._isMinusBtnOpen = true;
            $(".minusCircle").each(function() {
                $(this).css("display", "block");
            });
        } else {
            that._isMinusBtnOpen = false;
            $(".minusCircle").each(function() {
                $(this).css("display", "none");
            });
        }
    });
}

DesignMenu.prototype.enableConnectPartBtn = function() {
    var that = this;
    this.connPartBtn.click(function() {
        if (that._isConnectPartBtnOpen == true) {
            that._isConnectPartBtnOpen = false;
            $(".filterDiv").each(function() {
                $(this).css("display", "none");
            });
        } else {
            that._isConnectPartBtnOpen = true;
            $(".filterDiv").each(function() {
                $(this).css("display", "block");
            });
        }
    });
};

DesignMenu.prototype.enableClearCircuitchartBtn = function() {
    this.clearBtn.click(function() {
        jsPlumb.empty("drawArea");
        design.clear();
    });
};

DesignMenu.prototype.enableSaveCircuitchartBtn = function(){
    this.saveBtn.click(function() {
        var parts = []
        design.nodes.each(function (idx, elem) {
            var $elem = $(elem);
            parts.push({
                partID: $elem.attr('part-id'),
                partName: $elem.attr('part-name'),
                positionX: parseInt($elem.css("left"), 10),
                positionY: parseInt($elem.css("top"), 10)
            });
        });

        var connections = [];
        $.each(jsPlumb.getAllConnections(), function (idx, CurrentConnection) {
            connections.push({
                start: $(CurrentConnection.source).attr("part-id"),
                end: $(CurrentConnection.target).attr("part-id"),
                type: CurrentConnection.scope
            });
        });

        var curcuitChart = {};
        curcuitChart.parts = parts;
        curcuitChart.title = "curcuit1";
        curcuitChart.relationship = connections;
        curcuitChart.interfaceA = "Pcl_1";
        curcuitChart.interfaceB = "cl_1";
    });
};

DesignMenu.prototype.enableLoadCircuitchartBtn = function(curcuitChart) {
    // var that = this;
    // this.openFileBtn.click(function() {
    //     var parts = curcuitChart.parts;
    //     var connections = curcuitChart.relationship;

    //     var nodeElems = that._loadCircuitNodes(parts);
    //     that._loadCircuitLinks(connections, nodeElems);

    //     //update id
    //         //     partCount += 1;
    //         // div.attr("part-id", elem.partName + "_" + String(partCount));
    // });

};

DesignMenu.prototype._loadCircuitNodes = function(parts) {
    var nodeElems = [];
    $.each(parts, function(index, elem ) {
        var node = this._createNewNode(elem);
        node.appendTo(design.drawArea);

        design.addDraggable(node);
        design.addPromoteAndInhibitionLine(node);
        design.makeSourceAndTargetake(node);

        // putPartElemList.push(div);
        var partID = elem.partID;
        nodeElems.push([partID, node]);
    });

    return nodeElems;
};

DesignMenu.prototype._createNewNode = function(elem) {
    var node = $("<div></div>");
    var left = elem.positionX;
    var top = elem.positionY;
    node.css({left: left, top: top});
    node.css({position: "absolute"});
    node.attr("part-name", elem.partName);
    node.attr("normal-connect-num", 0);
    node.addClass("node");

    var img = Util.createImageDiv(elem.partName);
    img.appendTo(node);

    var titleDiv = Util.createTitleDiv(elem.partName);
    titleDiv.appendTo(node);

    var filterDiv = $("<div></div>");
    filterDiv.addClass("filterDiv");
    filterDiv.appendTo(node);

    var minusCircle = Util.createMinusCircleDiv();
    minusCircle.appendTo(node);

    return node;
};

DesignMenu.prototype._loadCircuitLinks = function(connections, nodeElems) {
    $.each(connections, function(index, elem) {
        // if (elem.type == "promotion" || elem.type == "inhibition") return;
        var startElem;
        var endElem;
        for (var index in nodeElems) {
            if (nodeElems[index][0] == elem.start) startElem = nodeElems[index][1];
            if (nodeElems[index][0] == elem.end) endElem = nodeElems[index][1];
        }
        var startNormalNum = parseInt($(startElem).attr("normal-connect-num"));
        var endNormalNum = parseInt($(endElem).attr("normal-connect-num"));
        startNormalNum += 1;
        endNormalNum += 1;
        $(startElem).attr("normal-connect-num", startNormalNum);
        $(endElem).attr("normal-connect-num", endNormalNum);
        drawLine(startElem, endElem, elem.type);
    }); 
};

DesignMenu.prototype.enableChangeCircuitToImageBtn =function() {
    this.changeChartToImageBtn.click(function() {
        html2canvas(design.drawArea, {
            onrendered: function(canvas) {
                var that = this;
                this.canvas = document.createElement('canvas');
                this.ctx = canvas.getContext('2d');
                // # Render Flows/connections on top of same canvas
                this.flows = $('> svg', el);

                this.flows.each(function() {
                    var svg = $(this)
                    var offset = svg.position();
                    var svgStr = this.outerHTML;
                    that.ctx.drawSvg(svgStr, offset.left, offset.top);
                });

                $("#main-contain").append(canvas);
                this.ctx.drawImage(canvas, 0, 0);

                // var dataURL = canvas.toDataURL();
                // console.log(dataURL);
                // ctx.getImageData()
                // $.ajax({
                //   type: "POST",
                //   url: "script.php",
                //   data: { 
                //      imgBase64: dataURL
                //   }
                // }).done(function(o) {
                //   console.log('saved'); 
                //   // If you want the file to be visible in the browser 
                //   // - please modify the callback in javascript. All you
                //   // need is to return the url to the file, you just saved 
                //   // and than put the image in your browser.
                // });
            }
        }); 
    });
};

//========================================================================================
/**
 * @class LeftBar
 *
 * @method constructor
 *
 */
function LeftBar() {
    var that = this;
    this.view = $("#left-sidebar");
    this.leftTrigger = $(".trigger-left");
    this.isOpenLeftBar = false;
    this._leftBarWidth = 400;
    this._searchTitle = [];

    this.elemsDataList = [];
    this.searchRelateBox = $("searchRelate");
    this.searchNewBox = $("searchNew");
}

LeftBar.prototype.init = function() {
    this._leftTriggerAnimation();

    $('.ui.styled.accordion').accordion();
    $('.menu .item').tab();
};

LeftBar.prototype.showData = function() {
        //create left-bar data list
    for (var each in dataList) {
        this._searchTitle.push({title: each});
        
        var div = $("<div></div>");
        div.attr('id', each);
        div.attr('part-name', each);
        div.addClass('item');

        var img = Util.createImageDiv(each);
        img.appendTo(div);

        var h4 = Util.createTitleDiv(each);
        h4.appendTo(div);

        var dataDiv = $("<div></div>");
        dataDiv.addClass("data");
        div.appendTo(dataDiv);

        var span = $("<span></span>");
        span.text("In genetics, a promoter is a region of DNA that initiates transcription of a particular gene....");
        span.appendTo(dataDiv);

        var btn = Util.createItemBtn();
        btn.appendTo(dataDiv);
        btn.popup();

        this.elemsDataList.push(dataDiv);

        // newList.push(div);
        this._makeItJqeryDraggable(div);
    }
}

LeftBar.prototype.showData = function() {
    dataDiv.appendTo($("#parts"));

    var divider = $("<div></div>");
    divider.addClass("ui inverted divider");
    divider.appendTo($("#parts"));
}

LeftBar.prototype._makeItJqeryDraggable = function(elem) {
    elem.draggable({
        helper: 'clone',
        cursor: 'move',
        tolerance: 'fit',
        revert: true
    });
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

            $("#main-contain").animate({
                left: '0px'
            }, 500);
            that.leftTrigger.find(".trigger-left > i").removeClass("left").addClass("right");
        } else {
            that.isOpenLeftBar = true;

            that.view.animate({
                left: '0px'
            }, 500);

            $("#main-contain").animate({
                left: that._leftBarWidth + 'px'
            }, 500);

            that.leftTrigger.find(".trigger-left > i").removeClass("right").addClass("left");
        }
    });
}

LeftBar.prototype.enableSearchNewBox = function() {
    var that = this;
    this.searchNewBox.keyup(function() {
        if (that.searchNewBox.val() != "") {
            
            for ()
        }
    });
}

// $("#searchNew").keyup(function() {
//     if ($(this).val() == "") {
        
//     } else {
//         $(".data").each(function() {
//             $(this).css("display", "none");
//         });
//         $("[part-name='"+ $(this).val() +"']").each(function() {
//             $(this).css("display", "block");
//         });
//     }
// });

//========================================================================================
/**
 * @class RightBar
 *
 * @method constructor
 *
 */
function RightBar() {
    this.rightTrigger = $(".trigger-right");
    this.view = $("#right-sidebar");
    this._isOpenRightBar = false;
    this._rightBarWidth = 400; 
};

RightBar.prototype.init = function() {
    this.leftTriggerAnimation();
}

RightBar.prototype.leftTriggerAnimation = function() {
    var that = this;
    this.rightTrigger.click(function() {
        var right = that.view.css("right");

        if (parseInt(right) == 0) {
            that._isOpenRightBar = false;
            that.view.animate({
                right: '-' + that._rightBarWidth + 'px'
            }, 500);

            that.view.find(".trigger-right > i").removeClass("right").addClass("left");
        } else {
            that._isOpenRightBar = true;

            that.view.animate({
                right: '0px'
            }, 500);
            
            that.view.find(".trigger-right > i").removeClass("left").addClass("right");
        }
    });
};

//========================================================================================
/**
 * @class Util
 *
 * @method constructor
 *
 */
function Util() {};

Util.getType = function(part) {
    return typeTable[part];
};

Util.getImagePath = function(type, imgSize) {
    var imgSize = 60;
    return "/static/img/design/"+ type + "_" + imgSize +".png";
};

Util.createImageDiv = function(partName) {
    var img = $("<img></img>");
    var partType = this.getType(partName);
    var imgPath = this.getImagePath(partType);
    img.addClass("ui left floated image no-margin");
    img.attr("src", imgPath);
    return img;
}

Util.createTitleDiv = function(partName) {
    var titleDiv = $("<h4></h4>");
    titleDiv.addClass("ui no-margin");
    titleDiv.text(partName);
    return titleDiv;
}

Util.createMinusCircleDiv = function() {
    var minusCircle = $("<div></div>");
    var icon = $("<i></i>");
    icon.addClass("minus circle icon");
    icon.appendTo(minusCircle);
    minusCircle.addClass("minusCircle");
    return minusCircle;
}

Util.createItemBtn = function() {
    var btn = $("<button></button>");
    btn.addClass("ui mini button");
    btn.attr("data-content", "Read more about this part");
    btn.text("more");
    return btn;
}

//===============================================================================
function getInitDataFromServer() {
    $.get("/data/fetch/parts", function(data, status) {
        typeTable = data['parts'];
        // leftBar.showData(typeTable);
        // $('.ui.search')
        //   .search({
        //     source: searchTitle
        //   })
        // ;
    });

    $.get("/data/fetch/relationship", function(data, status) {
        relationFromAtoB = data['relationship'];
    });

    $.get("/data/fetch/adjmatrix", function(data, status) {
        relationAdjmatrix = data['adjmatrix'];
    });

    $.get("/data/fetch/device", function(data, status) {
        devicesList = data['deviceList'];
        // loadCircuitchart(devicesList[0]);
    });
};
//===============================================================================

$(function() {
    design = new Design();
    leftBar = new LeftBar();
    rightBar = new RightBar();
    rubberband = new Rubberband();
    operationLog = new OperationLog();
    designMenu = new DesignMenu();
    operationLog.init();
    design.init();
    leftBar.init();
    rightBar.init();
    rubberband.init();
    designMenu.init();
    getInitDataFromServer();
})