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

var leftBar = $("#left-sidebar");
var rightBar = $("#right-sidebar");
var isOpenLeftBar = false;
var isOpenRightBar = false;
var leftBarWidth = 400;
var rightBarWidth = 400;
var drawArea_menu = $("#drawArea-menu");
var putPartElemList = [];
var relationFromAtoB = [];
var isSelectOne = false;
var rubberbandInstance = new Rubberband();
var typeTable = [];
var relationAdjmatrix = [];
var isProOrInhiLink = false;
var isConnectPart = true;
var isMinusOpen = false;
var devicesList = [];
var partCount = 0;
var searchTitle = [];

var flowChartJson = {};

function OperationLog() {
    jQuery.timeago.settings.allowFuture = true;
    jQuery("time.timeago").timeago();
};

// OperationLog.prototype.addPart(partName) {

// };

// OperationLog.prototype.removePart(partName) {

// };

// OperationLog.prototype.openFile() {

// };

// OperationLog.prototype.connectPart(partNameA, partNameB) {

// };

// OperationLog.prototype.writeToRightBar(elem) {

// };

/**
 * @class Relation
 *
 * @method constructor
 *
 * @description the object of an Relation
 */
function Relation(fromPartA, toPartB, relationType) {
    var that = this;
    this.fromPartA = fromPartA;
    this.toPartB = toPartB;
    this.relationType = relationType;
}

function getType(part) {
    return typeTable[part];
};

function getImagePath(type, imgSize) {
    var imgSize = 60;
    return "/static/img/design/"+ type + "_" + imgSize +".png";
};

function makeItJqeryDraggable(div) {
    div.draggable({
        helper: 'clone',
        cursor: 'move',
        tolerance: 'fit',
        revert: true
    });
}

function addPromoteAndInhibitionLine(partA) {
    var partNameA = partA.attr('part-name');
    for (var i in putPartElemList) {
        var partB = putPartElemList[i];
        var partNameB = partB.attr('part-name');
        if (isHasPromoteOrInhibitionRelation(partNameA, partNameB)) {
            var lineType = getLineType(partNameA, partNameB);
            drawLine(partA, partB, lineType);
        } else if (isHasPromoteOrInhibitionRelation(partNameB, partNameA)) {
            var lineType = getLineType(partNameB, partNameA);
            drawLine(partB, partA, lineType);
        }
    }
}

function drawLine(fromPartA, toPartB, lineType) {
    var that = this;
    // var fromPartNameA = fromPartA.attr('part-name');
    // var fromPartNameB = toPartB.attr('part-name');
    var overlaysClass = getOverLaysClass(lineType);
    var strokeStyle = getStorkeStyle(lineType);
    // var anchor = getAnchorStyle(lineType);
    isProOrInhiLink = true;
    jsPlumb.connect({
        connector: ["Flowchart"],
        anchor: "Continuous",
        paintStyle: { strokeStyle: strokeStyle, lineWidth: 2 },
        // hoverPaintStyle: { strokeStyle: "blue" },
        source:fromPartA,
        target:toPartB,
        endpoint:"Blank",
        overlays: [overlaysClass],
        // overlays: [['Arrow', {width:25, length: 15, location:1, foldback:0.3}]],
        allowLoopback: true,
        Container: "drawArea",
        scope: lineType
    });
}

// function getAnchorStyle(lineType) {
//     if (lineType == "normal") {
//         return ["Continuous", { faces:[ "left", "right" ] }];
//     } else if (lineType == "inhibition" || lineType == "promotion") {
//         return ["Continuous", { faces:[ "top", "bottom"] }];
//     }
// }

function getStorkeStyle(lineType) {
    if (lineType == 'normal') return "green";
    if (lineType == 'inhibition') return "red";
    if (lineType == "promotion") return "blue";
}

function getOverLaysClass(lineType) {
    if (lineType == 'normal') return  ["Custom", { create:function(component) {return $("<div></div>");}}];
    if (lineType == 'inhibition') return [ "Diamond", {width:25, length: 1, location:1, foldback:1}];
    if (lineType == "promotion") return ['Arrow', {width:25, length: 15, location:1, foldback:0.3}];
}

function getLineType(fromPartA, toPartB) {
    for (var i in relationFromAtoB) {
        if (relationFromAtoB[i].start === fromPartA &&
            relationFromAtoB[i].end === toPartB) {
            return relationFromAtoB[i].type;
        }
    }
    return "";
}

function isHasPromoteOrInhibitionRelation(fromPartA, toPartB) {
    for (var i in relationFromAtoB) {
        if (relationFromAtoB[i].start === fromPartA &&
            relationFromAtoB[i].end === toPartB && 
            (relationFromAtoB[i].type == "promotion" ||
                relationFromAtoB[i].type == "inhibition")) {
            return true;
        }
    }
    return false;
}

function isHasNormalRelation(fromPartA, toPartB) {
    for (var i in relationFromAtoB) {
        if (relationFromAtoB[i].start === fromPartA &&
            relationFromAtoB[i].end === toPartB && 
            relationFromAtoB[i].type == "normal") {
            return true;
        }
    }
    return false;
}

// function addRelation(fromPartA, toPartB, relationType) {
//     relationFromAtoB.push(new Relation(fromPartA, toPartB, relationType))
// }

function initDesignPage() {
    //create left-bar data list
    for (var each in typeTable) {
        searchTitle.push({title: each});
        
        var div = $("<div></div>");
        div.attr('id', each);
        div.attr('part-name', each);
        div.addClass('item');

        var img = $("<img></img>");
        var partType = getType(each);
        var imgPath = getImagePath(partType);
        img.addClass("ui left floated image");
        img.attr("src", imgPath);
        img.appendTo(div);

        var h4 = $("<h4></h4>");
        h4.addClass("ui no-margin");
        h4.text(each);
        h4.appendTo(div);

        var dataDiv = $("<div></div>");
        dataDiv.addClass("data");
        div.appendTo(dataDiv);

        var span = $("<span></span>");
        span.text("In genetics, a promoter is a region of DNA that initiates transcription of a particular gene....");
        span.appendTo(dataDiv);

        var button = $("<button></button>");
        button.addClass("ui mini button");
        button.attr("data-content", "Read more about this part");
        button.text("more");
        button.appendTo(dataDiv);
        button.popup();

        dataDiv.appendTo($("#parts"));

        var divider = $("<div></div>");
        divider.addClass("ui inverted divider");
        divider.appendTo($("#parts"));

        makeItJqeryDraggable(div);
    }
}

function addDraggable(Element) {
    jsPlumb.draggable(Element, {
        containment: 'parent',
    })
}

function Rubberband() {
    this.x = null;
    this.y = null;
}

Rubberband.prototype.diagramContainer_MouseMove = function(event) {
    // console.log(rubberband);
    if($("#rubberband").is(":visible") !== true) { return; }
         
    // Get the top- and left values
    var t = (event.pageY > this.y) ? this.y : event.pageY;
    var l = (event.pageX >= this.x) ? this.x : event.pageX;
             
    // Get the width of the rubberband
    var wcalc = event.pageX - this.x;
    var w = (event.pageX > this.x) ? wcalc : (wcalc * -1); 
        
    // Get the height of the rubberband     
    var hcalc = event.pageY - this.y;
    var h = (event.pageY > this.y) ? hcalc : (hcalc * -1); 
 
    // Update the rubberband with the new values
    if (isOpenLeftBar == true) {
        l -= leftBar.width();
    }
    t -= drawArea_menu.height();

    $("#rubberband").css({top:t, left:l, height:h, width:w, position:'relative'});
}

Rubberband.prototype.diagramContainer_MouseUp = function(event) {
    diagramContainer_FindSelectedItem();
    $("#rubberband").hide();
}

Rubberband.prototype.diagramContainer_MouseDown = function(event) {
    if ($(event.target).attr("class") == "filterDiv") return;
    this.x = event.pageX;         
    this.y = event.pageY;
             
    $("#rubberband").css({top:this.y, left:this.x, height:1, width:1, position:'relative'});
    $("#rubberband").show();
}

Rubberband.prototype.diagramContainer_Click = function(event) {
    if(this.x === event.pageX && this.y === event.pageY)
    {   
        jsPlumb.clearDragSelection();
        $(".node").each(function() {
            isSelectOne = false;
            $(this).removeClass("selected");
        });
    }
}

function getTopLeftOffset(element) {
    var elementDimension = {};
    elementDimension.left = element.offset().left;
    elementDimension.top =  element.offset().top;
 
    // Distance to the left is: left + width
    elementDimension.right = elementDimension.left + element.outerWidth();
 
    // Distance to the top is: top + height
    elementDimension.bottom = elementDimension.top + element.outerHeight();
     
    return elementDimension;
}

function diagramContainer_FindSelectedItem() {
    if($("#rubberband").is(":visible") !== true) { return; }
             
    var rubberbandOffset = getTopLeftOffset($("#rubberband"));
 
    $(".node").each(function() {
        var itemOffset = getTopLeftOffset($(this));
        if( itemOffset.top > rubberbandOffset.top &&
            itemOffset.left > rubberbandOffset.left &&
            itemOffset.right < rubberbandOffset.right &&
            itemOffset.bottom < rubberbandOffset.bottom) {
            isSelectOne = true;
            $(this).addClass("selected");
 
            var elementid = $(this).attr('id');
            jsPlumb.addToDragSelection(elementid);
        }
    });
}

function saveCircuitchart(){
    var parts = []
    $(".node").each(function (idx, elem) {
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

    flowChartJson = JSON.stringify(curcuitChart);

    // console.log(flowChartJson);
}

function loadCircuitchart(curcuitChart){
    // var circuitChartJson = flowChartJson;
    // var curcuitChart = JSON.parse(circuitChartJson);
    var parts = curcuitChart.parts;
    var connections = curcuitChart.relationship;
    var nodeElems = loadCircuitNodes(parts);

    // console.log(nodeElems);
    loadCircuitLinks(connections, nodeElems);

    //update id
        //     partCount += 1;
        // div.attr("part-id", elem.partName + "_" + String(partCount));

}

function loadCircuitNodes(parts) {
    var nodeElems = [];
    $.each(parts, function( index, elem ) {
        var div = $("<div></div>");
        var left = elem.positionX;
        var top = elem.positionY;
        div.css({left: left, top: top});
        div.css({position: "absolute"});
        div.attr("part-name", elem.partName);
        div.attr("normal-connect-num", 0);
        div.addClass("node");
        div.appendTo($("#drawArea"));

        var img = $("<img></img>");
        var partType = getType(elem.partName);
        var imgPath = getImagePath(partType);
        img.addClass("ui left floated image no-margin");
        img.attr("src", imgPath);
        img.appendTo(div);

        var h4 = $("<h4></h4>");
        h4.addClass("ui no-margin text-center");
        h4.text(elem.partName);
        h4.appendTo(div);

        var filterDiv = $("<div></div>");
        filterDiv.addClass("filterDiv");
        filterDiv.appendTo(div);

        var minusCircle = $("<div></div>");
        var icon = $("<i></i>");
        icon.addClass("minus circle icon");
        icon.appendTo(minusCircle);
        minusCircle.addClass("minusCircle");
        minusCircle.appendTo(div);

        addDraggable(div);

        var partID = elem.partID;
        nodeElems.push([partID, div]);
    });

    return nodeElems;
}

function loadCircuitLinks(connections, nodeElems) {
    $.each(connections, function(index, elem ) {
        var startElem;
        var endElem;
        for (var index in nodeElems) {
            if (nodeElems[index][0] == elem.start) startElem = nodeElems[index][1];
            if (nodeElems[index][0] == elem.end) endElem = nodeElems[index][1];
        }
        drawLine(startElem, endElem, elem.type);
    }); 
}

function clearCircuitchart() {
    jsPlumb.empty("drawArea");
    putPartElemList = [];
}

function changeCircuitToImage() {
    var el = $("#drawArea"); // get flow container div
    html2canvas(el, {
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
}

function getInitDataFromServer() {
    $.get("/data/fetch/parts", function(data, status) {
        typeTable = data['parts'];
        $(initDesignPage);
        $('.ui.search')
          .search({
            source: searchTitle
          })
        ;
    });

    $.get("/data/fetch/relationship", function(data, status) {
        relationFromAtoB = data['relationship'];
    });

    $.get("/data/fetch/adjmatrix", function(data, status) {
        relationAdjmatrix = data['adjmatrix'];
    });

    $.get("/data/fetch/device", function(data, status) {
        devicesList = data['deviceList'];
        loadCircuitchart(devicesList[0]);
    });
}

$(getInitDataFromServer);

//make item draggable
$(".item").draggable({
    helper: 'clone',
    cursor: 'move',
    tolerance: 'fit',
    revert: true
});

$('.ui.styled.accordion').accordion();

$("#save").click(function() {
    saveCircuitchart();
});

$("#download").click(function() {
    changeCircuitToImage();
});

$("#openFile").click(function() {
    loadCircuitchart();
});

$("#clear").click(function() {
    clearCircuitchart();
});

$("#showImage").click(function() {
    changeCircuitToImage();
});

$("#connect-part").click(function() {
    if (isConnectPart == true) {
        isConnectPart = false;
        $(".filterDiv").each(function() {
            $(this).css("display", "none");
        });
    } else {
        isConnectPart = true;
        $(".filterDiv").each(function() {
            $(this).css("display", "block");
        });
    }
});

$("#minus").click(function() {
    if (isMinusOpen == false) {
        isMinusOpen = true;
        $(".minusCircle").each(function() {
            $(this).css("display", "block");
        });
    } else {
        isMinusOpen = false;
        $(".minusCircle").each(function() {
            $(this).css("display", "none");
        });
    }
});

$(".trigger-left").click(function() {
    var left = leftBar.css("left");

    if (parseInt(left) == 0) {
        isOpenLeftBar = false;
        leftBar.animate({
            left: '-' + leftBarWidth + 'px'
        }, 500);

        $("#main-contain").animate({
            left: '0px'
        }, 500);
        $("#left-sidebar .trigger-left > i").removeClass("left").addClass("right");
    } else {
        isOpenLeftBar = true;

        leftBar.animate({
            left: '0px'
        }, 500);

        $("#main-contain").animate({
            left: leftBarWidth + 'px'
        }, 500);

        $("#left-sidebar .trigger-left > i").removeClass("right").addClass("left");
    }
})

$(".trigger-right").click(function() {
    var right = rightBar.css("right");

    if (parseInt(right) == 0) {
        isOpenRightBar = false;
        rightBar.animate({
            right: '-' + rightBarWidth + 'px'
        }, 500);

        // $("#main-contain").animate({
        //     right: '0px'
        // }, 500);
        $("#right-sidebar .trigger-right > i").removeClass("right").addClass("left");
    } else {
        isOpenRightBar = true;

        rightBar.animate({
            right: '0px'
        }, 500);

        // $("#main-contain").animate({
        //     right: rightBarWidth + 'px'
        // }, 500);

        $("#right-sidebar .trigger-right > i").removeClass("left").addClass("right");
    }
})

$("#drawArea").mousedown(rubberbandInstance.diagramContainer_MouseDown);
$("#drawArea").mousemove(rubberbandInstance.diagramContainer_MouseMove);
$("#drawArea").mouseup(rubberbandInstance.diagramContainer_MouseUp);

$("#drawArea").click(rubberbandInstance.diagramContainer_Click);

$("#drawArea").droppable({
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

        var minusCircle = $("<div></div>");
        var icon = $("<i></i>");
        icon.addClass("minus circle icon");
        icon.appendTo(minusCircle);
        minusCircle.addClass("minusCircle");
        minusCircle.appendTo(dropedElement);

        $(dropedElement).find("img").removeAttr("class");
        dropedElement.addClass("node");
        dropedElement.appendTo('#drawArea');
        dropedElement.attr("normal-connect-num", 0);

        var left = $(dropedElement).position().left - leftBar.width();
        var top  = $(dropedElement).position().top - drawArea_menu.height();

        $(dropedElement).css({left:left, top:top});
        addDraggable(dropedElement);
        addPromoteAndInhibitionLine(dropedElement);

        partCount += 1;
        var partName = dropedElement.attr("part-name");
        dropedElement.attr("part-id", partName + "_" + String(partCount));

        jsPlumb.makeSource(dropedElement, {
            filter: ".filterDiv",
            connector: ["Flowchart"],
            // connectorStyle: { strokeStyle: "green", lineWidth: 2 },
            anchor: "Continuous",
            endpoint:"Blank",
            // maxConnections: 1,
            overlays: [["Custom", { create:function(component) {return $("<div></div>");}}]],
            allowLoopback: false
            // Container: "drawArea"
        })

        jsPlumb.makeTarget(dropedElement, {
            // maxConnections: 1,
            anchor: "Continuous",
            dropOptions: { hoverClass: "dragHover"},
            endpoint:"Blank",
            allowLoopback: false
        })

        putPartElemList.push(dropedElement);
    }
});

jsPlumb.bind("connection", function(CurrentConnection) {
    var target = $(CurrentConnection.connection.target);
    var source = $(CurrentConnection.connection.source);
    var targetNormalNum = parseInt(target.attr("normal-connect-num"));
    var sourceNormalNum = parseInt(source.attr("normal-connect-num"));
    if (isProOrInhiLink == false) {
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
    } else {
        isProOrInhiLink = false;
    }
});

jsPlumb.on("#drawArea", "click", ".minus", function() {
    jsPlumb.remove(this.parentNode.parentNode);
});

$('.menu .item').tab();

$('.button')
  .popup()
;

jsPlumb.ready(function() {
    jsPlumb.setContainer($("#drawArea"));
});