//========================================================================================
/**
 * @class Util
 *
 * @method constructor
 *
 */
function Util() {};

Util.getImagePath = function(type, imgSize) {
    // console.log("getImagePath function");
    return "/static/img/design/"+ type + "_" + imgSize +".png";
    // return "";
};

Util.createImageDiv = function(partType) {
    var img = $("<img></img>");
    var imgPath = this.getImagePath(partType, 60);
    img.addClass("ui left floated image no-margin");
    img.attr("src", imgPath);
    return img;
}

Util.createTitleDiv = function(partName) {
    var titleDiv = $("<h4></h4>");
    titleDiv.addClass("ui no-margin text-center");
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
	console.log(content);
    var aLink = document.createElement('a');
    var blob = new Blob([content]);
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", false, false);
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    // aLink.href = content;
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

DataManager.getPartByName = function(partName) {
    for (var i in this.partList) {
        if (this.partList[i].name == partName) return this.partList[i];
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

DataManager.getRelationAdjFromPartName = function(partName) {
    return this.relationAdjList[partName];
}

DataManager.isPartInRelationAdj = function(partName, relationAdj) {
    for (var i in relationAdj) {
        if (partName.toLowerCase() == relationAdj[i].toLowerCase()) {
            return true;
        }
    }
    return false;
}

DataManager.isRelate = function(partNameA, partNameB) {
    for (var i in this.relationShipList) {
        var start = this.relationShipList[i].start.toLowerCase();
        var end = this.relationShipList[i].end.toLowerCase();
        if ((start === partNameA.toLowerCase() && end === partNameB.toLowerCase()) ||
            (start === partNameB.toLowerCase() && end === partNameA.toLowerCase())) {
            return true;
        }
    }
    return false;
}

DataManager.getEquation = function(partNameA, partNameB) {
    for (var i in this.relationShipList) {
        var start = this.relationShipList[i].start.toLowerCase();
        var end = this.relationShipList[i].end.toLowerCase();
        if ((start === partNameA.toLowerCase() && end === partNameB.toLowerCase()) ||
            (start === partNameB.toLowerCase() && end === partNameA.toLowerCase())) {
            return this.relationShipList[i].equation;
        }
    }
    return "There are no equation between "+ partNameA + " and " + partNameB;
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
        that.initRelationAdjList(data['adjmatrix']);
    });
}

DataManager.getDeviceDataFromServer = function(callback) {
    var that = this;
    $.get("/design/data/fetch/device", function(data, status) {
        console.log("DeviceList:");
        console.log(data['deviceList']);
        that.initDeviceList(data['deviceList']);
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
