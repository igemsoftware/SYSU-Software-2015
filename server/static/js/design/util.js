//========================================================================================
/**
 * @class Util
 *
 * @method constructor
 *
 */
function Util() {};

Util.getImagePath = function(type, imgSize) {
    return "/static/img/design/"+ type + "_" + imgSize +".png";
};

Util.createImageDiv = function(partType) {
    var img = $("<img></img>");
    var imgPath = this.getImagePath(partType, 60);
    img.attr("src", imgPath);
    return img;
}

Util.createTitleDiv = function(partName) {
    var titleDiv = $("<div class='partTitle'></div>");
    titleDiv.css("text-align", "center");
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

Util.createDivider = function() {
	var divider = $("<div></div>");
    divider.addClass("ui inverted divider");
    return divider;
}

Util.downloadFile = function(fileName, content){
    var aLink = document.createElement('a');
    var blob = new Blob([content]);
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", false, false);
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    aLink.dispatchEvent(evt);
}

Util.downloadImage = function(fileName, content){
    var aLink = document.createElement('a');
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", false, false);
    aLink.download = fileName;
    aLink.href = content;
    // aLink.href = content;
    aLink.dispatchEvent(evt);
}

Util.renderEquation = function(e) {
    var res = e.content;  
    for (var key in e.parameters) 
        res=res.replace('{{'+key+'}}', e.parameters[key]); 
    res = "$$ " + res + " $$";
    return res;
}

Util._loadCircuitCNodes = function(parts) {
    var nodeElems = [];
    var that = this;
    $.each(parts, function(index, part ) {
        var node = that._createNewCNode(part);
        node.appendTo(design.drawArea);
        design.addPartEvent(node);
        // design.addProAndInhibitLine(node);
        var partID = part.partID;
        nodeElems.push([partID, node]);
    });

    return nodeElems;
};

Util._createNewCNode = function(part) {
    var node = $("<div></div>");
    var left = part.positionX;
    var top = part.positionY;
    node.css({left: left, top: top});
    node.css({position: "absolute"});
    node.attr("part-name", part.partName);
    node.attr("part-attr", part.partAttr);
    node.attr("data-content", "Most link to two objects");
    node.attr("normal-connect-num", 0);
    node.addClass("node");
    node.css("text-align", "center");

    var partType = DataManager.getPartType(part.partName)
    var img = this.createImageDiv(partType);
    img.appendTo(node);

    var titleDiv = this.createTitleDiv(part.partName);
    titleDiv.appendTo(node);

    if (partType == 'gene' || partType == 'promoter' 
        || partType == 'RBS' || partType == 'terminator') {
        var filterDiv = $("<div></div>");
        filterDiv.addClass("filterDiv");
        filterDiv.appendTo(node);
    }

    var minusCircle = this.createMinusCircleDiv();
    minusCircle.appendTo(node);

    return node;
};

Util.loadBackbone = function(backbones) {
    var that = this;
    $.each(backbones, function(index, elem) {
        var dotStart = that.createEndpoint();
        var dotEnd = that.createEndpoint();
        dotStart.css({left: elem.start[0], top: elem.start[1]});
        dotEnd.css({left:elem.end[0], top:elem.end[1]});
        var minusCircle = that.createMinusCircleDiv();
        minusCircle.appendTo(dotEnd);
        dotStart.appendTo($("#drawArea"));
        dotEnd.appendTo($("#drawArea"));

        that.connectBackbone(dotStart, dotEnd);
    })
}

Util.connectBackbone = function(dotStart, dotEnd) {
    jsPlumb.connect({
        source: dotStart,
        target: dotEnd,
        endpoint:"Blank",
        paintStyle: { strokeStyle: "#123456", lineWidth: 6},
        connector: ["Straight"],
        Container: "drawArea"
    });
    
    jsPlumb.draggable(dotStart, {
        containment: 'parent',
    });
    jsPlumb.draggable(dotEnd, {
        containment: 'parent',
    });
}

Util.createEndpoint = function () {
    return $("<div class='dotShape'></div>");
}

Util.loadCircuitLinks = function(connections, nodeElems) {
    $.each(connections, function(index, elem) {
        // if (elem.type == "promotion" || elem.type == "inhibition") return;
        var startElem;
        var endElem;
        for (var index in nodeElems) {
            if (nodeElems[index][0] == elem.start) startElem = nodeElems[index][1];
            if (nodeElems[index][0] == elem.end) endElem = nodeElems[index][1];
        }
        // if (elem.type == 'normal') {
            // var startNormalNum = parseInt($(startElem).attr("normal-connect-num"));
            // var endNormalNum = parseInt($(endElem).attr("normal-connect-num"));
            // if (elem.type == 'normal') {
            //     startNormalNum += 1;
            //     endNormalNum += 1;
            //     $(startElem).attr("normal-connect-num", startNormalNum);
            //     $(endElem).attr("normal-connect-num", endNormalNum);
            // }
            design.drawLine(startElem, endElem, elem.type);
        // }
    }); 
};
//========================================================================================
/**
 * @class DataManager
 *
 * @method constructor
 *
 */
function DataManager() {
    this.partList = [];
    this.deviceList = [];
    this.relationAdjList = [];
    this.relationShipList = [];
}

DataManager.addPart = function(part) {
    this.partList.push(part);
}

DataManager.addPartList = function(partList) {
    for (var i in partList) this.addPart(partList[i]);
}

DataManager.initPartList = function(partList) {
    this.partList = partList;
}

DataManager.addDevice = function(device) {
    this.deviceList.push(device);
}

DataManager.addDeviceList = function(deviceList) {
    for (var i in deviceList) this.addDevice(deviceList[i]);
}

DataManager.initDeviceList = function(deviceList) {
    this.deviceList = deviceList;
}

DataManager.addRelationAdj = function(relationAdj) {
    this.relationAdjList.push(relationAdj);
}

DataManager.addRelationAdjList = function(relationAdjList) {
    for (var i in relationAdjList) this.addRelationAdj(relationAdjList[i]);
}

DataManager.initRelationAdjList = function(relationAdjList) {
    this.relationAdjList = relationAdjList;
}

DataManager.addRelationShip = function(relationShip) {
    this.relationShipList.push(relationShip);
}

DataManager.addRelationShipList = function(relationShipList) {
    for (var i in relationShipList) this.addRelationShip(relationShipList[i]);
}

DataManager.initRelationShipList = function(relationShipList) {
    this.relationShipList = relationShipList;
}

DataManager.getPartList = function() {
    return this.partList;
}

DataManager.getDeviceList = function() {
    return this.devicesList;
}

DataManager.getSystemList = function() {
    return this.systemList;
}

DataManager.getPartByAttr = function(partAttr) {
    for (var i in this.partList) {
        if (this.partList[i].attr == partAttr) return this.partList[i];
    }
    return null;
}

DataManager.getDeviceByTitle = function(deviceName) {
    for (var i in this.deviceList) {
        if (this.deviceList[i].name == deviceName) return this.deviceList[i];
    }
    return null;
}

DataManager.getPartType = function(partName) {
    for (var i in this.partList) {
        if (this.partList[i].name == partName) return this.partList[i].type;
    }
    return null;
}

DataManager.getLineType = function(fromPartA, toPartB) {
    for (var i in this.relationShipList) {
        if (this.relationShipList[i].start === fromPartA &&
            this.relationShipList[i].end === toPartB) {
            return this.relationShipList[i].type;
        }
    }
    return null;
};

DataManager.isRelate = function(partAttrA, partAttrB) {
    for (var i in this.relationShipList) {
        var start = this.relationShipList[i].start.toLowerCase();
        var end = this.relationShipList[i].end.toLowerCase();
        if ((start === partAttrA.toLowerCase() && end === partAttrB.toLowerCase()) ||
            (start === partAttrB.toLowerCase() && end === partAttrA.toLowerCase())) {
            return true;
        }
    }
    return false;
}

DataManager.getEquation = function(partAttrA, partAttrB) {
    var equationStr;
    for (var i in this.relationShipList) {
        var start = this.relationShipList[i].start.toLowerCase();
        var end = this.relationShipList[i].end.toLowerCase();
        if ((start === partAttrA.toLowerCase() && end === partAttrB.toLowerCase()) ||
            (start === partAttrB.toLowerCase() && end === partAttrA.toLowerCase())) {
            equationStr = Util.renderEquation(this.relationShipList[i].equation);
            return equationStr
        }
    }
    return "There are no equation between "+ partAttrA + " and " + partAttrB;
}

DataManager.isProOrInhibitRelation = function(fromPartA, toPartB) {
    for (var i in this.relationShipList) {
        if (this.relationShipList[i].start === fromPartA &&
            this.relationShipList[i].end === toPartB && 
            (this.relationShipList[i].type == "promotion" ||
                this.relationShipList[i].type == "inhibition")) {
            return true;
        }
    }
    return false;
};

DataManager.getPartDataFromServer = function(callback) {
    var that = this;
    $.get("/design/data/fetch/parts", function(data, status) {
        console.log("Parts:");
        console.log(data['parts']);
        that.initPartList(data['parts']);
        callback(that.getPartList());
    });
}

DataManager.getRelationShipDataFromServer = function(callback) {
    var that = this;
    $.get("/design/data/fetch/relationship", function(data, status) {
        console.log("Relationship:");
        console.log(data['relationship']);
        that.initRelationShipList(data['relationship']);
    });
}

DataManager.getRelationAdjDataFromServer = function(callback) {
    var that = this;
    $.get("/design/data/fetch/adjmatrix", function(data, status) {
        console.log("Adjmatrix:");
        console.log(data['adjmatrix']);
        test = data['adjmatrix'];
        that.initRelationAdjList(data['adjmatrix']);
    });
}

DataManager.getDeviceDataFromServer = function(callback) {
    var that = this;
    $.get("/design/data/fetch/device", function(data, status) {
        console.log("DeviceList:");
        console.log(data['deviceList']);
        that.initDeviceList(data['deviceList']);
        callback(data['deviceList']);
        $('#loadingData').dimmer('hide');
    });
}

DataManager.getPerDesignDataFromServer = function(callback) {
    var that = this;
    $.get("/design/all", function(data, status) {
        console.log("Personal Designs:");
        console.log(data['designs']);
        callback(data['designs']);
    });
}

DataManager.getForDesignDataFromServer = function(callback) {
    var that = this;
    $.get("/design/favorite", function(data, status) {
        console.log("Favorite Designs:");
        console.log(data['designs']);
        callback(data['designs']);
    });
}

DataManager.getPubDesignDataFromServer = function(callback) {
    var that = this;
    $.get("/design/public", function(data, status) {
        console.log("Public Designs:");
        console.log(data['designs']);
        callback(data['designs']);
    });
}

//========================================================================================
/**
 * @class Rubberband
 *
 * @method constructor
 *
 */

function Rubberband() {
    this.drawArea = $("#drawArea");
    this._x = null;
    this._y = null;
};

Rubberband.prototype.createView = function() {
    this.view = $('<div id="rubberband"></div>');
    this.view.appendTo(this.drawArea);
}

Rubberband.prototype.init = function() {
    this.createView();
    this._listenDrawAreaMouseMove();
    this._listenDrawAreaMouseDown();
    this._listenDrawAreaMouseup();
    this._listenDrawAreaClick();
}

Rubberband.prototype._listenDrawAreaMouseMove = function() {
    var that = this;
    this.drawArea.mousemove(function(event) {
        if(that.view.is(":visible") !== true) { return; }
        var offset = $("#drawArea").offset();
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
        // if (leftBar.isOpenLeftBar == true) {
        //     l -= leftBar.view.width();
        // }

        // t -= drawArea_menu.height();

        that.view.css({top:t-offset.top, left:l-offset.left, height:h, width:w, position:'relative'});
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
        var offset = $("#drawArea").offset();
        var top = that._y-offset.top;
        var left = that._x-offset.left;
        that.view.css({top:top, left:left, height:1, width:1, position:'relative'});
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
                $(this).removeClass("selected");
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

OperationLog.prototype.addDevice = function(deviceName) {
    var message = "Added a <a>" + deviceName + "</a> Device.";
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
