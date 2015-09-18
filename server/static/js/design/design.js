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
var dfs;
var test;
var setDrawLineStyle = function() {
    jsPlumb.importDefaults({
        PaintStyle : { strokeStyle: "green", lineWidth: 2 },
        Overlays: [["Custom", { create:function(component) {return $("<div></div>");}}]]
    });
}

//==========================================================================================
/**
 * @class CNode
 * @method constructor
 *
 */
function CNode() {
    this.view = null;
    this.partType = null;
    this.partName = null;
    this.normalConnNum = 0;
    this.partID = null;
}

/**
 * Create a design operable node
 * @method constructor
 * @for CNode
 * @param {elem} partElem A part dom element
 *
 */
CNode.prototype.createCNode = function(partElem) {
    this.view = partElem;
    this.view.attr('normal-connect-num', '0');
    this.view.attr("data-content", "Most link to two objects");
    this.view.removeAttr("class");
    this.view.find(".BBa").remove();
    var partType = partElem.attr('part-type');

    var filterDiv = $("<div></div>");
    filterDiv.addClass("filterDiv");
    filterDiv.css('display', 'none');
    filterDiv.appendTo(this.view);

    var minusCircle = Util.createMinusCircleDiv();
    minusCircle.appendTo(this.view);

    this.view.find("img").removeAttr("class");
    this.view.css("text-align", "center");
    this.view.addClass("node");

    var titleDiv = $("<div></div>");
    titleDiv.css("text-align", "center");
    titleDiv.text(this.view.find(".partTitle").text());
    this.view.find("span").replaceWith(titleDiv);
}

//========================================================================================
/**
 * @class Design
 * @method constructor
 *
 */
function Design() {
    this.filterDiv = $(".filterDiv");
    this.nodes = $(".node");
    this.drawArea = $("#drawArea");
    this.drawMenu = $("#drawArea-menu");
    this.isPromoteLink = false;
    this.isInhibitLink = false;
    this._isNormalLink = false;
    this.nodeElemList = [];
    this._partCount = 0;
    this.risk = 1;
    this.isRemove = false;
    this.designID = -1;
    this.drawAreaHeight = parseInt($("#drawArea").css("height"));
    this.drawAreaWidth = parseInt($("#drawArea").css("width"));
    this.DRAWAREA_HEIGHT = 550;
    this.DRAWAREA_WIDTH = 1190
    this.designName = "New design";
};

/**
 * Clear the design area
 * @method clear
 * @for Design
 *
 */
Design.prototype.clear = function() {
    this.nodeElemList = [];
    this.risk = 1;
    this.updateRiskView(1);
}

/**
 * Init the design area
 * @method init
 * @for Design
 *
 */
Design.prototype.init = function() {
    this._initJsPlumbOption();
    this._makeDrawAreaDroppabble();
    operationLog.init();
    operationLog.openFile();
    this.setDesignName(this.designName);
};

/**
 * Set the design area's height
 * @method setDrawAreaHeight
 * @for Desgin
 * @param {int} height
 *
 */
Design.prototype.setDrawAreaHeight = function(height) {
    this.drawAreaHeight = height;
    $("#drawArea").css("height", this.drawAreaHeight);
    var temp = this.drawAreaHeight - this.DRAWAREA_HEIGHT;
    var val = parseInt((parseFloat(temp*100))/this.DRAWAREA_HEIGHT);
    $(".heightSlider input").val(val);
}


/**
 * Set the design area's width
 * @method setDrawAreaHeight
 * @for Desgin
 * @param {int} width
 *
 */
Design.prototype.setDrawAreaWidth = function(width) {
    this.drawAreaWidth = width;
    $("#drawArea").css("width", this.drawAreaWidth);
    var temp = this.drawAreaWidth - this.DRAWAREA_WIDTH;
    var val = parseInt((parseFloat(temp*100))/this.DRAWAREA_WIDTH);
    $(".widthSlider input").val(val);
}

/**
 * Add the promotion or inhibition relationship for a part
 * @method addProAndInhibitLine
 * @for Desgin
 * @param {Part} partA a part which need to find relationship with others
 *
 */
Design.prototype.addProAndInhibitLine = function(partA) {
    var partAttrA = partA.attr('part-attr');
    for (var i in this.nodeElemList) {
        var partB = this.nodeElemList[i];
        var partAttrB = partB.attr('part-attr');
        if (DataManager.isProOrInhibitRelation(partAttrA, partAttrB)) {
            var lineType = DataManager.getLineType(partAttrA, partAttrB);
            this.drawLine(partA, partB, lineType);
        } else if (DataManager.isProOrInhibitRelation(partAttrB, partAttrA)) {
            var lineType = DataManager.getLineType(partAttrB, partAttrA);
            this.drawLine(partB, partA, lineType);
        }
    }
};

/**
 * Draw the line between two parts with line type
 * @method drawLine
 * @for Desgin
 * @param {Part} frompartA a part as source
 * @param {Part} toPartB a part as target
 * @param {String} lineType a string "promotion/inhibition/normal" which decides the line style.
 *
 */
Design.prototype.drawLine = function(fromPartA, toPartB, lineType) {
    var overlaysClass = this._getOverLaysClass(lineType);
    var strokeStyle = this._getStorkeStyle(lineType);
    jsPlumb.importDefaults({
        PaintStyle : { strokeStyle: "green", lineWidth: 2 },
        Overlays: [["Custom", { create:function(component) {return $("<div></div>");}}]]
    });
    if (lineType == "promotion") this.isPromoteLink = true;
    if (lineType == "inhibition") this.isInhibitLink = true;
    jsPlumb.connect({
        connector: ["Flowchart"],
        anchor: "Continuous",
        paintStyle: { strokeStyle: strokeStyle, lineWidth: 2 },
        source:fromPartA,
        target:toPartB,
        endpoint:"Blank",
        overlays: [overlaysClass],
        allowLoopback: true,
        Container: "drawArea",
        scope: lineType
    });
};

/**
 * Get the style of the connection's storkeStyle
 * @method _getStorkeStyle
 * @for Desgin
 * @param {String} lineType a string "promotion/inhibition/normal" which decides the line style.
 *
 */
Design.prototype._getStorkeStyle = function(lineType) {
    if (lineType == 'normal') return "green";
    if (lineType == 'inhibition') return "red";
    if (lineType == "promotion") return "blue";
};

/**
 * Get the style of the connection's overlays
 * @method _getOverLaysClass
 * @for Desgin
 * @param {String} lineType a string "promotion/inhibition/normal" which decides the line style.
 *
 */
Design.prototype._getOverLaysClass = function(lineType) {
    if (lineType == 'normal') return  ["Custom", { create:function(component) {return $("<div></div>");}}];
    if (lineType == 'inhibition') return [ "Diamond", {width:25, length: 1, location:1, foldback:1}];
    if (lineType == "promotion") return ['Arrow', {width:25, length: 15, location:1, foldback:0.3}];
};

/**
 * Make the design area droppable.
 * @method _makeDrawAreaDroppabble
 * @for Desgin
 *
 */
Design.prototype._makeDrawAreaDroppabble = function() {
    var that = this;
    this.drawArea.droppable({
        accept: '.item',
        containment: 'drawArea',
        drop:function(e, ui) {
            var dropedElement = ui.helper.clone();
            ui.helper.remove();
            if (dropedElement.attr('part-type') == 'device') {
                that.putNewDevice(dropedElement);
                return ;
            }
            var node = new CNode();
            node.createCNode($(dropedElement));
            node.view.css({left: e.pageX, top: e.pageY});
            $("#drawArea").append(node.view);
            var offset = $("#drawArea").offset();
            var left = node.view.position().left - offset.left- 30;
            var top  = node.view.position().top - offset.top - 50;
            node.view.css({left:left, top:top});

            that.addPartEvent(node.view);
            that.addProAndInhibitLine(node.view);
            operationLog.addPart(dropedElement.attr("part-attr"));
        }
    });
}

/**
 * Process the part after the putting the part on the design area
 * @method addPartEvent
 * @for Desgin
 * @param {CNode} elem a CNode which is put on the design area
 *
 */
Design.prototype.addPartEvent = function(elem) {
    this.addDraggable(elem);
    this.makeSourceAndTarget(elem);
    this.nodeElemList.push(elem);
    this._partCount += 1;
    var partAttr = elem.attr("part-attr");
    elem.attr('part-id', partAttr + "_" + String(this._partCount));
    var part = DataManager.getPartByAttr(partAttr);
    rightBar.processDropedPart(part);
    this.updateRisk(part);
}

/**
 * Put a new device on the design area
 * @method putNewDevice
 * @for Desgin
 * @param {DeviceView} elem a device dom element which is put on the design area
 *
 */
Design.prototype.putNewDevice = function(elem) {
    jsPlumb.importDefaults({
        PaintStyle : { strokeStyle: "green", lineWidth: 2 },
        Overlays: [["Custom", { create:function(component) {return $("<div></div>");}}]]
    });
    var device = DataManager.getDeviceByName(elem.attr('device-name'));
    console.log('Put a device:');
    console.log(device);
    var parts = device.parts;
    var connections = device.relationship;
    var nodeElems = Util.loadCircuitCNodes(parts);
    Util.loadCircuitLinks(connections, nodeElems);
    Util.loadBackbone(device.backbone);
    setDrawLineStyle();
    rightBar.processDropedDevice(device);
    if (designMenu.isHideNormalLine == false) {
        designMenu.hideBtn.click();
    }
    operationLog.addDevice(elem.attr("device-name"));
}

/**
 * Make a part to be source and target so that they can connect with line
 * @method makeSourceAndTarget
 * @for Desgin
 * @param {PartView} elem a part dom element
 *
 */
Design.prototype.makeSourceAndTarget = function(elem) {
    jsPlumb.makeSource(elem, {
        filter: ".filterDiv",
        connector: ["Flowchart"],
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

/**
 * Init the jsPlumb library option
 * @method _initJsPlumbOption
 * @for Desgin
 *
 */
Design.prototype._initJsPlumbOption = function() {
    var that = this;
    jsPlumb.importDefaults({
      PaintStyle : { strokeStyle: "green", lineWidth: 2 },
    });

    jsPlumb.bind("connection", function(CurrentConnection) {
        var target = $(CurrentConnection.connection.target);
        var source = $(CurrentConnection.connection.source);
        var targetNormalNum = parseInt(target.attr("normal-connect-num"));
        var sourceNormalNum = parseInt(source.attr("normal-connect-num"));
        if (target.hasClass("dotShape")) {
            CurrentConnection.connection.scope = "backbone";
        } else if (that.isInhibitLink == true) {
            CurrentConnection.connection.scope = "inhibition";
            that.isInhibitLink = false;
        } else if (that.isPromoteLink == true) {
            CurrentConnection.connection.scope = "promotion";
            that.isPromoteLink = false;
        } else {
            CurrentConnection.connection.scope = "normal";
            if (sourceNormalNum == 2) {
                source.popup('show');
                jsPlumb.detach(CurrentConnection.connection);
                return;
            }
            if (targetNormalNum == 2){
                target.popup('show');
                jsPlumb.detach(CurrentConnection.connection);
                return;
            }
            sourceNormalNum += 1;
            source.attr("normal-connect-num", sourceNormalNum);
            targetNormalNum += 1;
            target.attr("normal-connect-num", targetNormalNum);

            operationLog.connectPart(source.attr("part-name"), target.attr("part-name"))
        }
    });

    jsPlumb.ready(function() {
        jsPlumb.setContainer(that.drawArea);
    });

    jsPlumb.bind('connectionDetached', function(info, originalEvent) {
        var target = $(info.connection.target);
        var source = $(info.connection.source);
        if (target.hasClass("dotShape")) {
            source.remove();
        }
        var targetNormalNum = parseInt(target.attr("normal-connect-num"));
        var sourceNormalNum = parseInt(source.attr("normal-connect-num"));
        if (that.isRemove == true && info.connection.scope == "normal") {
            targetNormalNum -= 1;
            sourceNormalNum -= 1;
            source.attr("normal-connect-num", sourceNormalNum);
            target.attr("normal-connect-num", targetNormalNum);
        }
    })

    jsPlumb.on(that.drawArea, "click", ".minus", function() {
        that.isRemove = true;
        operationLog.removePart($(this.parentNode.parentNode).attr("part-name"));
        that.removeCNodeElem($(this.parentNode.parentNode).attr("part-id"));
        jsPlumb.remove(this.parentNode.parentNode);
        that.checkDesignRisk();
        that.isRemove = false;
    });
};

/**
 * Remove a CNode element from the design area
 * @method removeCNodeElem
 * @for Desgin
 * @param {number} partID a part's id
 *
 */
Design.prototype.removeCNodeElem = function(partID) {
    for (var i in this.nodeElemList) {
        if (this.nodeElemList[i].attr('part-id') == partID) {
            var partAttr = this.nodeElemList[i].attr('part-attr');
            this.nodeElemList.splice(i, 1);
            if (!this.isPartInDrawArea(partAttr)) {
                rightBar.removePartViewByAttr(partAttr);
            }
            break;
        }
    }
}

/**
 * Search that is there the part on the design
 * @method isPartInDrawArea
 * @for Desgin
 * @param {String} partAttr a part's attr
 *
 */
Design.prototype.isPartInDrawArea = function(partAttr) {
    for (var i in this.nodeElemList) {
        if (this.nodeElemList[i].attr('part-attr') == partAttr) {
            return true;
        }
    }
    return false;
}

/**
 * Make the part element draggble
 * @method addDraggable
 * @for Desgin
 * @param {elem} elem a part element
 *
 */
Design.prototype.addDraggable = function(elem) {
    jsPlumb.draggable(elem, {
        containment: 'parent',
        grid: [30, 30],
        drag:function(e){
            if (designMenu.isHideNormalLine == true) {
                $("svg").each(function() {
                    if ($(this).find('path').attr('stroke') == 'green') {
                        $(this).css('display', 'none');
                    }
                });
            }
        },
        stop: function(e){
            if (designMenu.isHideNormalLine == true) {
                $("svg").each(function() {
                    if ($(this).find('path').attr('stroke') == 'green') {
                        $(this).css('display', 'none');
                    }
                });
            }
        },
    })
};

/**
 * Update the risk after putting a new part
 * @method updateRisk
 * @for Desgin
 * @param {Part} Part a part element
 *
 */
Design.prototype.updateRisk = function(part) {
    if (this.risk < part.risk) {
        this.updateRiskView(part.risk);
    }
}

/**
 * Check the risk of the design
 * @method checkDesignRisk
 * @for Desgin
 *
 */
Design.prototype.checkDesignRisk = function() {
    var risk = 1;
    for (var i in this.nodeElemList) {
        if (this.nodeElemList[i].attr('risk') > risk) {
            risk = this.nodeElemList[i].attr('risk');
        }
    }
    if (risk < this.risk) {
        this.updateRiskView(risk);
    }
}

/**
 * Update the risk of view
 * @method updateRiskView
 * @for Desgin
 * @param {number} risk a risk number
 *
 */
Design.prototype.updateRiskView = function(risk) {
    var color;
    var popupStr;
    if (risk == 1) {
        color = "green";
        popupStr = "Low risk(1)";
    }
    if (risk == 2) {
        color = "orange";
        popupStr = "Moderate risk(2)"
    }
    if (risk == 3) {
        color = "pink";
        popupStr = "High risk(3)";
    }
    if (risk == 4) {
        color = "red";
        popupStr = "Extreme risk(4)"
    }
    $("#risk").removeClass("green orange pink red");
    $("#risk").addClass(color);
    $("#riskSpan").attr("data-content", popupStr);
    $("#riskSpan").popup("show");
    setTimeout(function () {  $("#riskSpan").popup("hide"); }, 3000);
}

/**
 * Set the name of current design
 * @method setDesignName
 * @for Desgin
 * @param {String} designName
 *
 */
Design.prototype.setDesignName = function(designName) {
    $("#designName").text(designName);
    this.designName = designName;
}

//========================================================================================
/**
 * @class DesignMenu
 * @method constructor
 *
 */
function DesignMenu() {
    this.menu = $("#drawArea-menu");
    this.saveBtn = $("#save");
    this.downloadBtn = $("#download");
    this.openFileBtn = $("#openFile");
    this.clearBtn = $("#clear");
    this.normalConnBtn = $("#normal-conn");
    this.promotionConnBtn = $("#promotion-conn");
    this.inhibitionConnBtn = $("#inhibition-conn");
    this.minusBtn = $("#minus");
    this.backboneBtn = $("#backbone");
    this.hideBtn = $("#hideNormal");
    this.importPerBtn = $("#importPerBtn");
    this.importForBtn = $("#importForBtn");
    this.importPubBtn = $("#importPubBtn");

    this._isMinusBtnOpen = false;
    this.isHideNormalLine = false;
};

/**
 * Init the design menu
 * @method init
 * @for DesignMenu
 *
 */
DesignMenu.prototype.init = function() {
    this.enableSaveDesignBtn();
    this.enableDownloadBtn();
    this.enableLoadDesignBtn();
    this.enableClearDesignBtn();
    this.enableNormalConnBtn();
    this.enablePromotionConnBtn();
    this.enableInhibitionConnBtn();
    this.enableRemovePartBtn();
    this.enableBackboneBtn();
    this.enableHideNormal();
    this.enableDesignSlider();
    this.popUpAllButton();

    $("#risk").popup();
}

/**
 * Enable the button of adding backbone line
 * @method enableBackboneBtn
 * @for DesignMenu
 *
 */
DesignMenu.prototype.enableBackboneBtn = function() {
    this.backboneBtn.click(function() {
        var dotStart = Util.createEndpoint();
        var dotEnd = Util.createEndpoint();
        var offSet = $("#drawArea").offset();
        if (leftBar.isOpenLeftBar == true) {
            offSet.left -= leftBar.view.width();
        }
        dotStart.css({left:offSet.left+100, top: '10px'});
        dotEnd.css({left:offSet.left+300, top:'10px'});
        dotStart.appendTo($("#drawArea"));
        dotEnd.appendTo($("#drawArea"));
        var minusCircle = Util.createMinusCircleDiv();
        minusCircle.appendTo(dotEnd);

        Util.connectBackbone(dotStart, dotEnd);
    });
};

/**
 * Pop up all the button of the menu
 * @method popUpAllButton
 * @for DesignMenu
 *
 */
DesignMenu.prototype.popUpAllButton = function() {
    this.saveBtn.popup();
    this.downloadBtn.popup();
    this.openFileBtn.popup();
    this.clearBtn.popup();
    this.normalConnBtn.popup();
    this.promotionConnBtn.popup();
    this.inhibitionConnBtn.popup();
    this.minusBtn.popup();
    this.backboneBtn.popup();
    this.hideBtn.popup();
}

/**
 * Enable the slider of changing the size of design area
 * @method enableDesignSlider
 * @for DesignMenu
 *
 */
DesignMenu.prototype.enableDesignSlider = function() {
    $(".heightSlider input").val(0);
    $(".heightSlider input").change(function() {
        var zoom = parseFloat($(this).val())/100;
        var height = parseInt(design.DRAWAREA_HEIGHT);
        $("#drawArea").css("height", String(height*(zoom+1)+'px'));
    });

    $(".widthSlider input").val(0);
    $(".widthSlider input").change(function() {
        var zoom = parseFloat($(this).val())/100;
        var width = parseInt(design.DRAWAREA_WIDTH);
        $("#drawArea").css("width", String(width*(zoom+1)+'px'));
    });
}

/**
 * Enable the button of hidden the normal line
 * @method enableHideNormal
 * @for DesignMenu
 *
 */
DesignMenu.prototype.enableHideNormal = function() {
    var that = this;
    this.hideBtn.click(function() {
        if (that.isHideNormalLine == false) {
            $(this).addClass("ired");
            that.isHideNormalLine = true;
            $("svg").each(function() {
                if ($(this).find('path').attr('stroke') == 'green') {
                    $(this).css('display', 'none');
                }
            });
        } else {
            $(this).removeClass("ired");
            that.isHideNormalLine = false;
            $("svg").each(function() {
                if ($(this).find('path').attr('stroke') == 'green') {
                    $(this).css('display', 'block');
                }
            });
        }
    });
}

/**
 * Enable the button of removing part
 * @method enableRemovePartBtn
 * @for DesignMenu
 *
 */
DesignMenu.prototype.enableRemovePartBtn = function() {
    var that = this;
    this.minusBtn.click(function() {
        if (that._isMinusBtnOpen == false) {
            $(this).addClass("ired");
            that._isMinusBtnOpen = true;
            $(".minusCircle").each(function() {
                $(this).css("display", "block");
            });
        } else {
            $(this).removeClass("ired");
            that._isMinusBtnOpen = false;
            $(".minusCircle").each(function() {
                $(this).css("display", "none");
            });
        }
    });
}

/**
 * Enable the button of connect two parts
 * @method enableNormalConnBtn
 * @for DesignMenu
 *
 */
DesignMenu.prototype.enableNormalConnBtn = function() {
    var that = this;
    this.normalConnBtn.click(function() {
        if ($(this).hasClass('ired')) {
            $(this).removeClass("ired");
            $(".filterDiv").each(function() {
                $(this).css("display", "none");
            });
        } else {
            that.hightConnBtn($(this));
            design._isNormalLink = true;
            setDrawLineStyle = function() {
                jsPlumb.importDefaults({
                    PaintStyle : { strokeStyle: "green", lineWidth: 2 },
                    Overlays: [["Custom", { create:function(component) {return $("<div></div>");}}]]
                });
            }
            setDrawLineStyle();
            $(".filterDiv").each(function() {
                $(this).css("display", "block");
                $(this).css('background-color', 'green');
            });
        }
    });
};

/**
 * Enable the button of adding promotion relationship
 * @method enablePromotionConnBtn
 * @for DesignMenu
 *
 */
DesignMenu.prototype.enablePromotionConnBtn = function() {
    var that = this;
    this.promotionConnBtn.click(function() {
        if ($(this).hasClass('ired')) {
            $(this).removeClass("ired");
            $(".filterDiv").each(function() {
                $(this).css("display", "none");
            });
        } else {
            that.hightConnBtn($(this));
            design.isPromoteLink = true
            setDrawLineStyle = function() {
                jsPlumb.importDefaults({
                    PaintStyle : { strokeStyle: "blue", lineWidth: 2 },
                    Overlays: [['Arrow', {width:25, length: 15, location:1, foldback:0.3}]]
                });
            };
            setDrawLineStyle();
            $(".filterDiv").each(function() {
                $(this).css("display", "block");
                $(this).css('background-color', 'blue');
            });
        }
    });
};

/**
 * Enable the button of adding inhibition relationship
 * @method enableInhibitionConnBtn
 * @for DesignMenu
 *
 */
DesignMenu.prototype.enableInhibitionConnBtn = function() {
    var that = this;
    this.inhibitionConnBtn.click(function() {
        if ($(this).hasClass('ired')) {
            $(this).removeClass("ired");
            $(".filterDiv").each(function() {
                $(this).css("display", "none");
            });
        } else {
            that.hightConnBtn($(this));
            design.isInhibitLink = true;
            setDrawLineStyle = function() {
                jsPlumb.importDefaults({
                    PaintStyle : { strokeStyle: "red", lineWidth: 2 },
                    Overlays: [[ "Diamond", {width:25, length: 1, location:1, foldback:1}]]
                });
            }
            setDrawLineStyle();
            $(".filterDiv").each(function() {
                $(this).css("display", "block");
                $(this).css('background-color', 'red');
            });
        }
    });
};

/**
 * highting the button of normal/promotion/inhibition
 * @method hightConnBtn
 * @for DesignMenu
 * @param {Button} connBtn
 *
 */
DesignMenu.prototype.hightConnBtn = function(connBtn) {
    this.normalConnBtn.removeClass('ired');
    this.promotionConnBtn.removeClass('ired');
    this.inhibitionConnBtn.removeClass('ired');
    connBtn.addClass('ired');
}

/**
 * Enable the button of clearing the design area
 * @method enableClearDesignBtn
 * @for DesignMenu
 *
 */
DesignMenu.prototype.enableClearDesignBtn = function() {
    var that = this;
    this.clearBtn.click(function() {
        $("#deleteModal").modal({transition: 'bounce'}).modal('show');
        $("#deleteBtn").click(function() {
            jsPlumb.empty("drawArea");
            design.clear();
            rightBar.clear();
            var rubberband = new Rubberband();
            rubberband.init();
            $("#deleteModal").modal('hide');
        });
    });
};

/**
 * Enable the button of saving the design area
 * @method enableSaveDesignBtn
 * @for DesignMenu
 *
 */
DesignMenu.prototype.enableSaveDesignBtn = function(){
    var that = this;
    this.saveBtn.click(function() {
        $("#secureModal").modal("show");
    });

    $('#continueToSave').click(function() {
        $("#secureModal").modal("hide");
        $('#saveModal').modal('show');
    });

    $("#saveCircuitBtn").click(function() {
        var there = this;
        var img;
        var curcuitChartData = that.getDesignChartData();
        curcuitChartData.name = $("#curcuitName").val();
        curcuitChartData.full_description = $("#full_description").val();
        curcuitChartData.brief_description = $("#brief_description").val();
        curcuitChartData.references = $("#designSource").val();
        curcuitChartData.risk = design.risk;
        curcuitChartData.plasmids = dfs.getCircuits();
        curcuitChartData.id = design.designID;

        design.setDesignName(curcuitChartData.name);
        var el = $("#drawArea").get(0);
        console.log('test1');
        html2canvas(el, {
            onrendered: function(canvas) {
                console.log('test2');
                var that = this;
                this.canvas = document.createElement('canvas');
                this.ctx = canvas.getContext('2d');
                this.flows =  $("> svg", el);
                this.flows.each(function() {
                    var svg = $(this)
                    var offset = svg.position();
                    var svgStr = this.outerHTML;
                    that.ctx.drawSvg(svgStr, offset.left, offset.top);
                });

                curcuitChartData.img = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                console.log("Post Data");
                console.log(curcuitChartData);
                $("#saveCircuitBtn").addClass("loading");
                var postDataJson = JSON.stringify(curcuitChartData);
                $.ajax({
                    type: 'POST',
                    contentType: 'application/json',
                    url: '/design/data',
                    dataType : 'json',
                    data : postDataJson,
                    success: function(data) {
                        design.designID = data['id'];
                        DataManager.getPerDesignDataFromServer(function(designs) {
                            designMenu.perDesignList = designs;
                        })
                        $("#saveModal").modal("hide");
                        $("#saveCircuitBtn").removeClass("loading");
                        $("#saveSuccessModal").modal('show');
                    }
                });
            }
        });
    });
};

/**
 * Get the data of the design area
 * @method enableSaveDesignBtn
 * @for DesignMenu
 * @return {Json} a design data structure
 */
DesignMenu.prototype.getDesignChartData = function() {
    var parts = this.getDesignParts();
    var data = this.getDesignConns();
    var curcuitChart = {};
    curcuitChart.parts = parts;
    curcuitChart.relationship = data.connections;
    curcuitChart.interfaceA = "interfaceB-partName";
    curcuitChart.interfaceB = "interfaceA-partName";
    curcuitChart.backbone = data.backbones;
    return curcuitChart;
}

/**
 * Get all the connetion data of the design area
 * @method getDesignConns
 * @for DesignMenu
 *
 */
DesignMenu.prototype.getDesignConns = function() {
    var connections = [];
    var backbones = [];
    $.each(jsPlumb.getAllConnections(), function (idx, CurrentConnection) {
        if (CurrentConnection.scope == 'backbone') {
            backbones.push({
                start: [parseInt($(CurrentConnection.source).css('left'), 10),
                        parseInt($(CurrentConnection.source).css('top'), 10)],
                end: [parseInt($(CurrentConnection.target).css('left'), 10),
                    parseInt($(CurrentConnection.target).css('top'), 10)]
            });
            return ;
        }
        connections.push({
            start: $(CurrentConnection.source).attr("part-id"),
            end: $(CurrentConnection.target).attr("part-id"),
            type: CurrentConnection.scope
        });
    });
    var data = {};
    data.connections = connections;
    data.backbones = backbones;
    return data;
}

/**
 * Get all the parts data of the design area
 * @method getDesignParts
 * @for DesignMenu
 * @return {List} a parts list
 *
 */
DesignMenu.prototype.getDesignParts = function() {
    var parts = []
    $(".node").each(function (idx, elem) {
        var $elem = $(elem);
        parts.push({
            partID: $elem.attr('part-id'),
            partName: $elem.attr('part-name'),
            partAttr: $elem.attr('part-attr'),
            positionX: parseInt($elem.css("left"), 10),
            positionY: parseInt($elem.css("top"), 10)
        });
    });
    return parts;
}

/**
 * Enable the button of loading design
 * @method enableLoadDesignBtn
 * @for DesignMenu
 *
 */
DesignMenu.prototype.enableLoadDesignBtn = function() {
    var that = this;
    var isOpen = false;
    this.openFileBtn.click(function() {
        $("#chooseModal").modal('show');
        isOpen = true;
        that.initOpenList(that.perDesignList);
    });
    this.importPerBtn.click(function() {
        $("#chooseModal").modal('show');
        isOpen = false;
        that.initOpenList(that.perDesignList);
    });
    this.importForBtn.click(function() {
        $("#chooseModal").modal('show');
        isOpen = false;
        that.initOpenList(that.forDesignList);
    });
    this.importPubBtn.click(function() {
        $("#chooseModal").modal('show');
        isOpen = false;
        that.initOpenList(that.pubDesignList);
    });

    $("#choose").click(function() {
        if (isOpen == true) {
            jsPlumb.empty("drawArea");
            design.clear();
        }
        $("#designList div").each(function() {
            if($(this).hasClass('ired')) {
                var id = $(this).find('input').val();
                design.designID = id;
                var curcuitChart;
                $.get("/design/data/"+design.designID, function(data) {
                    console.log(data["content"]);
                    var curcuitChart = data["content"];
                    var parts = curcuitChart.parts;
                    var connections = curcuitChart.relationship;
                    var backbones = curcuitChart.backbone;
                    var nodeElems = Util.loadCircuitCNodes(parts);
                    Util.loadBackbone(backbones);
                    Util.loadCircuitLinks(connections, nodeElems);
                    design.setDesignName(curcuitChart.name);
                });
            }
        });
        $("#chooseModal").modal('hide');
    });
};

/**
 * Init the modal of opening a design
 * @method initOpenList
 * @for DesignMenu
 *
 */
DesignMenu.prototype.initOpenList = function(designs) {
    $("#designList").empty();
    for (var i in designs) {
        var div = $("<div></div>");
        div.text(designs[i].name);
        var idElem = $("<input type='text'></input>");
        idElem.css("display", "none");
        idElem.val(designs[i].id);
        var divider = $("<div class='ui divider'></div>");
        div.append(idElem);
        div.addClass('title')
        div.click(function() {
            $("#designList div").each(function() {
                $(this).removeClass("ired");
            })
            $(this).addClass("ired");
        });
        $("#designList").append(div);
        $("#designList").append(divider);
    }
}

/**
 * Enable the button of downloading design data and image
 * @method enableDownloadBtn
 * @for DesignMenu
 *
 */
DesignMenu.prototype.enableDownloadBtn =function() {
    var that = this;
    this.downloadBtn.click(function() {
        $('#downloadModal').modal("show");
    });

    $("#downloadsubmit").click(function() {
        $('#downloadModal').modal("hide");
        var curcuitChartData = that.getDesignChartData();
        var designName = $("#curcuitDownName").val();
        curcuitChartData.name = designName;
        Util.downloadFile(designName+".txt", JSON.stringify(curcuitChartData));
        that.downloadChartAsImage(designName);
    });
}

/**
 * Downloading design as image
 * @method downloadChartAsImage
 * @for DesignMenu
 * @param {String} designName
 *
 */
DesignMenu.prototype.downloadChartAsImage = function(designName) {
    var el = $("#drawArea").get(0);
    html2canvas(el, {
        onrendered: function(canvas) {
            var that = this;
            this.canvas = document.createElement('canvas');
            this.ctx = canvas.getContext('2d');
            this.flows =  $("> svg", el);
            this.flows.each(function() {
                var svg = $(this)
                var offset = svg.position();
                var svgStr = this.outerHTML;
                that.ctx.drawSvg(svgStr, offset.left, offset.top);
            });
            var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            Util.downloadImage(designName+".png", image);
        }
    });
};

//========================================================================================
/**
 * @class SideBarWorker
 * @method constructor
 *
 */
function SideBarWorker() {}

/**
 * Create view of part
 * @method createPartView
 * @for SideBarWorker
 * @param {Part} part
 * return {elem}
 */
SideBarWorker.prototype.createPartView = function(part) {
    var partName = part.name;
    var partType = part.type;
    var partIntro = part.full_description;
    var BBa = part.BBa;
    var attr = part.attr;
    var risk = part.risk;

    var dataDiv = $("<div class='data'></div>");
    var itemDiv = $("<div class='item'></div>");
    var imgElem = $("<img class='ui mini avatar image'/>");
    var titleSpan = $("<span class='partTitle'></span>");
    var iconSpan = $('<span class="more part-more"><i class="zoom icon"></i></span>');
    var BBaSpan = $("<span class='BBa'></span>");
    var leftSpan = $("<span class='leftBox'></span>");

    dataDiv.attr("type", partType);
    itemDiv.attr('id', partName);
    itemDiv.attr('risk', risk);
    itemDiv.attr('part-type', partType);
    itemDiv.attr('part-name', partName);
    itemDiv.attr('part-attr', attr);
    imgElem.attr("src", Util.getImagePath(partType, 60));
    titleSpan.text(partName);
    iconSpan.attr("data-content", "Read more about this part");
    iconSpan.popup();
    this.addReadPartInfoEvent(iconSpan);
    if (BBa != "") {
        BBaSpan.text("("+BBa+")");
    }

    itemDiv.append(imgElem);
    itemDiv.append(titleSpan);
    titleSpan.append(BBaSpan);
    leftSpan.append(itemDiv);
    dataDiv.append(leftSpan);
    dataDiv.append(iconSpan);
    this._makeItJqueryDraggable(itemDiv);

    return dataDiv;
}

/**
 * Add element to the view
 * @method addElemToView
 * @for SideBarWorker
 * @param {elem} view A view which will be used for putting the part
 * @param {elem} elem A part view
 *
 */
SideBarWorker.prototype.addElemToView = function(elem, view) {
    view.append(elem);
    elem.find(".more").popup();
    this._makeItJqueryDraggable(elem.find('.item'));
    view.append(Util.createDivider());
}

/**
 * Show part list to the view
 * @method showView
 * @for SideBarWorker
 * @param {List} elemsPartList A list of part element
 * @param {elem} view A part view
 *
 */
SideBarWorker.prototype.showView = function(elemsPartList, view) {
    view.empty();
    for (var i in elemsPartList) {
        this.addElemToView(elemsPartList[i], view);
    }
}

SideBarWorker.prototype.showDeviceView = function(elemsDeviceList, view) {
    view.empty();
    for (var i in elemsDeviceList) {
        this.addDevicePartInfoEvent(elemsDeviceList[i]);
        this.addElemToView(elemsDeviceList[i], view);
    }
}

/**
 * Make the part view draggable
 * @method _makeItJqueryDraggable
 * @for SideBarWorker
 * @param {elem} view A part view
 *
 */
SideBarWorker.prototype._makeItJqueryDraggable = function(elem) {
    elem.draggable({
        helper: 'clone',
        cursor: 'move',
        tolerance: 'fit',
        revert: true
    });
}

/**
 * Create a device view
 * @method createDeviceView
 * @for SideBarWorker
 * @param {device} device A device data structure
 * @return {elem}
 *
 */
SideBarWorker.prototype.createDeviceView = function(device) {
    var dataDiv = $("<div class='data'></div>");
    var itemDiv = $("<div class='item'></div>");
    var imgElem = $("<img/>");
    var titleSpan = $("<span class='deviceTitle'></span>");
    var iconSpan = $("<span class='more device-more'><i class='icon zoom'></i></span>");

    imgElem.attr("src", "/static/img/design/devices/"+device.name+'.png');
    titleSpan.text(device.name);
    itemDiv.attr('part-type', 'device');
    itemDiv.attr('device-name', device.name);
    iconSpan.attr("data-content", "Read more about this device");
    iconSpan.popup();


    this.addDevicePartInfoEvent(iconSpan);
    itemDiv.append(imgElem);
    dataDiv.append(itemDiv);
    dataDiv.append(titleSpan);
    dataDiv.append(iconSpan);

    this._makeItJqueryDraggable(itemDiv);
    return dataDiv
}

/**
 * Add event of reading the information of the part
 * @method addReadPartInfoEvent
 * @for SideBarWorker
 * @param {elem} moreElem
 *
 */
SideBarWorker.prototype.addReadPartInfoEvent = function(moreElem) {
    var that = this;
    moreElem.click(function() {
        var partAttr = $(this).parent().find('.item').attr('part-attr');
        var part = DataManager.getPartByAttr(partAttr);
        that.writePartInfoToModal(part);
        $("#readPartInfoModal").modal({transition: 'horizontal flip'}).modal('show');
    });
}

/**
 * Write the information of part to modal
 * @method writePartInfoToModal
 * @for SideBarWorker
 * @param {part} part A part data structure
 *
 */
SideBarWorker.prototype.writePartInfoToModal = function(part) {
    var that = this;
    var infoModal = $("#readPartInfoModal");
    infoModal.find('.partName').text(part.name);
    infoModal.find('.partBBa').text(part.BBa == '' ? 'None': part.BBa);
    infoModal.find('.partImg').attr('src', '/static/img/design/parts/'+part.type+'_70.png');
    infoModal.find('.partType').text(part.type);
    infoModal.find('.partRisk').text(Util.getRiskText(part.risk));
    infoModal.find('.partRisk').attr("class", "partRisk");
    infoModal.find('.partRisk').addClass(Util.getRiskColor(part.risk));
    infoModal.find('.partBact').text(part.bacterium);
    infoModal.find('.partIntro').text(part.introduction);
    infoModal.find('.partSource').text(part.source);

    this.ncbiUrl = "http://www.ncbi.nlm.nih.gov/gquery/?term=" + part.name;
    this.fastaUrl = "http://parts.igem.org/fasta/parts/" + part.BBa;
    this.part = part;
    $("#ncbiBtn").click(function() {
        window.open(that.ncbiUrl);
    });
    $("#fastaBtn").click(function() {
        window.open(that.fastaUrl);
    });
    $("#searchCds").click(function() {
        var there = this;
        if (that.part.BBa == "") {
            console.log('111');
            $("#noBBaErrorModal").modal('show');
            $("#noBBaErrorModal").find('.back').click(function() {
                $("#noBBaErrorModal").modal('hide');
            });
            return ;
        }
        $(this).addClass('loading');
        var postDataJson = JSON.stringify({BBa: that.part.BBa});
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: '/proxy/part/cds',
            dataType : 'json',
            data : postDataJson,
            success: function(data) {
                $("#cdsModal").find('.cdsContent').text(data['cds']);
                $("#cdsModal").modal('show');
                $(there).removeClass('loading');
                $("#cdsModal").find('.back').click(function() {
                    $("#cdsModal").modal('hide');
                    $("#readPartInfoModal").modal('show');
                });
            }
        });
    });

}

/**
 * Add event of reading the information of the device
 * @method addReadPartInfoEvent
 * @for SideBarWorker
 * @param {elem} moreElem
 *
 */
SideBarWorker.prototype.addDevicePartInfoEvent = function(moreElem) {
    var that = this;
    moreElem.click(function() {
        var deviceName = $(this).parent().find('.item').attr('device-name');
        var device = DataManager.getDeviceByName(deviceName);
        that.writeDeviceInfoToModal(device);
        $("#readDeviceInfoModal").modal('show');
    });
}

/**
 * Write the information of device to modal
 * @method writeDeviceInfoToModal
 * @for SideBarWorker
 * @param {device} device A device data structure
 *
 */
SideBarWorker.prototype.writeDeviceInfoToModal = function(device) {
    var infoModal = $("#readDeviceInfoModal");
    infoModal.find('.deviceName').text(device.name);
    infoModal.find('.deviceParts').text(Util.getDevicePartsString(device));
    infoModal.find('.deviceImg').attr('src', '/static/img/design/devices/'+device.name+'.png');
    infoModal.find('.deviceRisk').text(Util.getRiskText(device.risk));
    infoModal.find('.deviceRisk').attr("class", "deviceRisk");
    infoModal.find('.deviceRisk').addClass(Util.getRiskColor(device.risk));
    infoModal.find('.deviceInterface').text(device.interfaceA+", "+device.interfaceB);
    infoModal.find('.deviceSource').text(device.source);
    infoModal.find('.deviceIntro').text(device.full_description);
}

//=====================================================================================================
/**
 * @class LeftBar
 * @method constructor
 *
 */
function LeftBar() {
    this.isOpenLeftBar = false;
    this._leftBarWidth = 400;
    this.view = $("#left-sidebar");
    this.leftTrigger = $(".trigger-left");

    this.view.parts = $("#parts");
    this.view.devices = $("#devices");
    this.view.customs = $("#customs");
    // this.vide.systems = $("#systems");
    this.view.relates = $("#relates");
    this.view.relateParts = $("#relateParts");
    this.view.relateDevices = $("#relateDevices");
    this.view.relateSystems = $("#relateSystems");

    this._searchPartTitle = [];
    this._searchDeviceTitle = [];
    this.elemsPartList = [];
    this.elemsDeviceList = [];
    this.elemsSystemList = [];
    this.elemsCustomList = [];
    this.elemsPromoterList = [];
    this.elemsRBSList = [];
    this.elemsProteinList = [];
    this.elemsGeneList = [];
    this.elemsTermiList = [];
    this.elemsChemList = [];
    this.elemsRNAList = [];
    this.elemsMatList = [];
    this.elemsUnkList = [];

    this.view.searchRelateInput = $("#searchRelate");
    this.view.searchPartInput = $("#searchNew");
    this.view.searchDeviceInput = $("#searchDevice");

    this.leftbarWorker = new SideBarWorker();
}

/**
 * Init the left bar
 * @method init
 * @for LeftBar
 *
 */
LeftBar.prototype.init = function() {
    this._leftTriggerAnimation();
    this.enableSearchPartBox();
    this.enableSearchRelateBox();
    this.enableSearchDeviceInputBox();
    this.enableFilter();
    $('.menu .item').tab();
};

/**
 * Init the parts of the left bar
 * @method initPart
 * @for LeftBar
 * @param {List} partList
 *
 */
LeftBar.prototype.initPart = function(partList) {
    for (var i in partList) {
        var dataDiv = this.leftbarWorker.createPartView(partList[i]);
        this.elemsPartList.push(dataDiv);
        this.addPartToBar(dataDiv);
        this._searchPartTitle.push({title: partList[i].attr});
    }
    this.updateSearchBar();
}

/**
 * Init the devices of the left bar
 * @method initDevice
 * @for LeftBar
 * @param {List} deviceList
 *
 */
LeftBar.prototype.initDevice = function(deviceList) {
    for (var i in deviceList) {
        var dataDiv = this.leftbarWorker.createDeviceView(deviceList[i]);
        this.elemsDeviceList.push(dataDiv);
        this.addDeviceToBar(dataDiv);
        this._searchDeviceTitle.push({title: deviceList[i].name});
    }
    this.updateSearchBar();
}

/**
 * Add device view to the left bar
 * @method addDeviceToBar
 * @for LeftBar
 * @param {elem} elem A device Dom element
 *
 */
LeftBar.prototype.addDeviceToBar = function(elem) {
    elem.find('.more').popup();
    this.leftbarWorker.addElemToView(elem, this.view.devices);
}

/**
 * Add part view to the left bar
 * @method addPartToBar
 * @for LeftBar
 * @param {elem} elem A part Dom element
 *
 */
LeftBar.prototype.addPartToBar = function(elem) {
    var partType = elem.attr("type");
    var elemClone = elem.clone();
    this.leftbarWorker._makeItJqueryDraggable(elemClone.find(".item"));
    this.leftbarWorker.addReadPartInfoEvent(elemClone.find(".more"));
    elemClone.find(".more").popup();
    if (partType == 'promoter') {
        this.elemsPromoterList.push(elemClone);
    }
    if (partType == 'RBS') {
        this.elemsRBSList.push(elemClone);
    }
    if (partType == 'protein') {
        this.elemsProteinList.push(elemClone);
    }
    if (partType == 'gene') {
        this.elemsGeneList.push(elemClone);
    }
    if (partType == 'terminator') {
        this.elemsTermiList.push(elemClone);
    }
    if (partType == 'chemical') {
        this.elemsChemList.push(elemClone);
    }
    if (partType == 'RNA') {
        this.elemsRNAList.push(elemClone);
    }
    if (partType == 'material') {
        this.elemsMatList.push(elemClone);
    }
    if (partType == 'unknown') {
        this.elemsUnkList.push(elemClone);
    }

    this.leftbarWorker.addElemToView(elem, this.view.parts);
}

/**
 * Enable filter/search box
 * @method enableFilter
 * @for LeftBar
 *
 */
LeftBar.prototype.enableFilter = function() {
    var that = this;
    $("#filterParts").change(function() {
        var partType = $(this).val();
        if (partType == 'promoter') {
            that.leftbarWorker.showView(that.elemsPromoterList, that.view.parts);
        }
        if (partType == 'RBS') {
            that.leftbarWorker.showView(that.elemsRBSList, that.view.parts);
        }
        if (partType == 'protein') {
            that.leftbarWorker.showView(that.elemsProteinList, that.view.parts);
        }
        if (partType == 'gene') {
            that.leftbarWorker.showView(that.elemsGeneList, that.view.parts);
        }
        if (partType == 'terminator') {
            that.leftbarWorker.showView(that.elemsTermiList, that.view.parts);
        }
        if (partType == 'chemical') {
            that.leftbarWorker.showView(that.elemsChemList, that.view.parts);
        }
        if (partType == 'material') {
            that.leftbarWorker.showView(that.elemsMatList, that.view.parts);
        }
        if (partType == 'unknown') {
            that.leftbarWorker.showView(that.elemsUnkList, that.view.parts);
        }
        if (partType == 'RNA') {
            that.leftbarWorker.showView(that.elemsRNAList, that.view.parts);
        }
        if (partType == 'all') {
            that.leftbarWorker.showView(that.elemsPartList, that.view.parts);
        }
    })
}

/**
 * Add custom part view to the left bar
 * @method addCustomPart
 * @for LeftBar
 * @param {Part} part A part Dom element
 *
 */
LeftBar.prototype.addCustomPart = function(part) {
    var dataDiv = this.leftbarWorker.createPartView(part);
    this.elemsCustomList.push(dataDiv);
    this._searchPartTitle.push({title: part.name});
    this.updateSearchBar();
    this.leftbarWorker.addElemToView(dataDiv, this.view.customs);
}

/**
 * Update search box
 * @method updateSearchBar
 * @for LeftBar
 *
 */
LeftBar.prototype.updateSearchBar = function() {
    var that = this;
    $('#searchPartBox').search({
        source: this._searchPartTitle,
        onSelect: function(value) {
            var e = jQuery.Event("keyup");
            e.keyCode =13;
            that.view.searchPartInput.val(value.title);
            that.view.searchPartInput.trigger(e);
        }
    });
    $('#searchDeviceBox').search({
        source: this._searchDeviceTitle,
        onSelect: function(value) {
            var e = jQuery.Event("keyup");
            e.keyCode =13;
            that.view.searchDeviceInput.val(value.title);
            that.view.searchDeviceInput.trigger(e);
        }
    });
    $('#searchRelateBox').search({
        source: this._searchPartTitle,
        onSelect: function(value) {
            var e = jQuery.Event("keyup");
            e.keyCode =13;
            that.view.searchRelateInput.val(value.title);
            that.view.searchRelateInput.trigger(e);
        }
    });
}

/**
 * Enable left-bar trigger animation
 * @method _leftTriggerAnimation
 * @for LeftBar
 *
 */
LeftBar.prototype._leftTriggerAnimation = function() {
    var that = this;
    this.leftTrigger.click(function() {
        var left = that.view.css("left");
        if (parseInt(left) == 0) {
            that.isOpenLeftBar = false;
            that.view.animate({
                left: '-' + that._leftBarWidth + 'px'
            }, 500);
            $("#drawArea").animate({
                left: '0px'
            }, 500);
            $("#drawArea-menu").animate({
                left: '0px'
            }, 500);
            that.leftTrigger.find("i").removeClass("left").addClass("right");
        } else {
            that.isOpenLeftBar = true;
            that.view.animate({
                left: '0px'
            }, 500);
            $("#drawArea").animate({
                left: that._leftBarWidth + 'px'
            }, 500);
            $("#drawArea-menu").animate({
                left: that._leftBarWidth + 'px'
            }, 500);
            that.leftTrigger.find("i").removeClass("right").addClass("left");
        }
    });
}

/**
 * Enable searching part box
 * @method enableSearchPartBox
 * @for LeftBar
 *
 */
LeftBar.prototype.enableSearchPartBox = function() {
    var that = this;
    this.view.searchPartInput.keyup(function() {
        that.updateSearchBar();
        var val = that.view.searchPartInput.val().toLowerCase();
        if (val != "") {
            var searchElemPartList = [];
            for (var i in that.elemsPartList) {
                var partAttr = $(that.elemsPartList[i].find("div")[0]).attr("part-attr").toLowerCase();
                if (partAttr.indexOf(val) != -1) {
                    searchElemPartList.push(that.elemsPartList[i]);
                }
            }
            that.leftbarWorker.showView(searchElemPartList, that.view.parts);
        } else {
            that.leftbarWorker.showView(that.elemsPartList, that.view.parts);
        }
    });
};

/**
 * Enable searching related part box
 * @method enableSearchRelateBox
 * @for LeftBar
 *
 */
LeftBar.prototype.enableSearchRelateBox = function() {
    var that = this;
    this.view.searchRelateInput.keyup(function() {
        var val = that.view.searchRelateInput.val();
        if (val != "") {
            var searchElemPartList = [];
            for (var i in that.elemsPartList) {
                var partAttr = $(that.elemsPartList[i].find("div")[0]).attr("part-attr");
                if (DataManager.isRelate(val, partAttr)) {
                    console.log(val);
                    console.log(partAttr);
                    searchElemPartList.push(that.elemsPartList[i]);
                }
            }
            that.leftbarWorker.showView(searchElemPartList, that.view.relates);
        } else {
            that.view.relates.empty();
        }
    })
}

/**
 * Enable searching deivce box
 * @method enableSearchDeviceInputBox
 * @for LeftBar
 *
 */
LeftBar.prototype.enableSearchDeviceInputBox = function() {
    var that = this;
    this.view.searchDeviceInput.keyup(function() {
        var val = that.view.searchDeviceInput.val().toLowerCase();
        if (val != "") {
            var searchElemDeviceList = [];
            for (var i in that.elemsDeviceList) {
                var deviceName = $(that.elemsDeviceList[i].find("div")[0]).attr("device-name").toLowerCase();
                if (deviceName.indexOf(val) != -1) {
                    searchElemDeviceList.push(that.elemsDeviceList[i]);
                }
            }
            that.leftbarWorker.showDeviceView(searchElemDeviceList, that.view.devices);
        } else {
            that.leftbarWorker.showDeviceView(that.elemsDeviceList, that.view.devices);
        }
    })
}

//========================================================================================
/**
 * @class RightBar
 * @method constructor
 *
 */
function RightBar() {
    this.rightTrigger = $(".trigger-right");
    this.view = $("#right-sidebar");
    this._isOpenRightBar = false;
    this._rightBarWidth = 400;

    this.elemsPartList = [];
    this.elemsDeviceList = [];
    this.elemsSystemList = [];
    this.elemsCustomList = [];

    this.view.parts = $("#addedParts");
    this.view.devices = $("#addedDevices");
    this.view.systems = $("#addedSystems");
    this.view.customs = $("#addedCustoms");
    this.view.searchAddInput = $("#searchAddInput");
    this.view.searchAddBox = $("#searchAddBox");
    this.rightbarWorker = new SideBarWorker();
    this._searchPartTitle = [];
    this._searchDeviceTitle = [];
};

/**
 * Init the left bar
 * @method init
 * @for RightBar
 *
 */
RightBar.prototype.init = function() {
    this._rightTriggerAnimation();
    this.enableSearchAddInput();
}

/**
 * Clear right part/device/system/.. view
 * @method clear
 * @for RightBar
 *
 */
RightBar.prototype.clear = function() {
    this._searchPartTitle = [];
    this._searchDeviceTitle = [];
    this.elemsPartList = [];
    this.elemsDeviceList = [];
    this.elemsSystemList = [];
    this.elemsCustomList = [];
    this.view.parts.empty();
    this.view.devices.empty();
    this.view.systems.empty();
    this.view.customs.empty();
}

/**
 * Add right bar trigger animation
 * @method _rightTriggerAnimation
 * @for RightBar
 *
 */
RightBar.prototype._rightTriggerAnimation = function() {
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

/**
 * Process the part after putting
 * @method processDropedPart
 * @for RightBar
 * @param {Part} part A part data structure
 *
 */
RightBar.prototype.processDropedPart = function(part) {
    this.updateAddedView(part);
}

/**
 * Process the device after putting
 * @method processDropedDevice
 * @for RightBar
 * @param {Device} device A device data structure
 *
 */
RightBar.prototype.processDropedDevice = function(device) {
    var deviceElem = this.rightbarWorker.createDeviceView(device);
    if (!this.isDeviceAdded(device)) {
        this.elemsDeviceList.push(deviceElem);
        this._searchDeviceTitle.push({title: device.name});
        this.updateSearchBar();
        this.rightbarWorker.showView(this.elemsDeviceList, this.view.devices);
    }
}

/**
 * Update "Added" view of the right bar
 * @method updateAddedView
 * @for RightBar
 * @param {Part} part A part data structure
 *
 */
RightBar.prototype.updateAddedView = function(part) {
    var partElem = this.rightbarWorker.createPartView(part);
    if (!this.isPartAdded(part)) {
        this.elemsPartList.push(partElem);
        this._searchPartTitle.push({title: part.attr});
        this.updateSearchBar();
        this.rightbarWorker.showView(this.elemsPartList, this.view.parts);
    }
}

/**
 * Remove part view by part.attr
 * @method removePartViewByAttr
 * @for RightBar
 * @param {String} partAttr A part attr
 *
 */
RightBar.prototype.removePartViewByAttr = function(partAttr) {
    for (var i in this.elemsPartList) {
        if ($(this.elemsPartList[i].find('.item')).attr('part-attr') == partAttr) {
            this.elemsPartList[i].splice(i, 1);
            this.rightbarWorker.showView(this.elemsPartList, this.view.parts);
            break;
        }
    }
}

/**
 * Check if is the part added
 * @method isPartAdded
 * @for RightBar
 * @param {Part} part A part data structure
 *
 */
RightBar.prototype.isPartAdded = function(part) {
    for (var i in this.elemsPartList) {
        if ($(this.elemsPartList[i].find('.item')).attr('part-attr') == part.attr) {
            return true;
        }
    }
    return false;
}

/**
 * Check if is the device added
 * @method isDeviceAdded
 * @for RightBar
 * @param {Device} device A device data structure
 *
 */
RightBar.prototype.isDeviceAdded = function(device) {
    for (var i in this.elemsDeviceList) {
        if ($(this.elemsDeviceList[i]).find(".partTitle").text() == device.name) {
            return true;
        }
    }
    return false;
}

/**
 * Update search bar
 * @method updateSearchBar
 * @for RightBar
 *
 */
RightBar.prototype.updateSearchBar = function() {
    this.view.searchAddBox.search({source: this._searchPartTitle});
}

/**
 * Enable searching box of added part
 * @method enableSearchAddInput
 * @for RightBar
 *
 */
RightBar.prototype.enableSearchAddInput = function() {
    var that = this;
    this.view.searchAddInput.keyup(function() {
        var val = that.view.searchAddInput.val().toLowerCase();
        if (val != "") {
            var searchElemPartList = [];
            for (var i in that.elemsPartList) {
                var partAttr = $(that.elemsPartList[i].find("div")[0]).attr("part-attr").toLowerCase();
                if (partAttr.indexOf(val) != -1) {
                    searchElemPartList.push(that.elemsPartList[i]);
                }
            }
            if (searchElemPartList !== []) {
                that.view.parts.prev().addClass("active");
                that.view.parts.addClass("active");
            }
            that.rightbarWorker.showView(searchElemPartList, that.view.parts);
        } else {
            that.rightbarWorker.showView(that.elemsPartList, that.view.parts);
        }
    });
};

/**
 * Init equation parts
 * @method initEquationParts
 * @for RightBar
 * @param {List} partList A part list
 *
 */
RightBar.prototype.initEquationParts = function(partList) {
    for (var i in partList) {
        var option = $("<option></option>");
        option.attr("value", partList[i].attr);
        option.text(partList[i].attr);
        option.appendTo("#multiParts");
    }
    for (var i in partList) {
        var option = $("<option></option>");
        option.attr("value", partList[i].attr);
        option.text(partList[i].attr);
        option.appendTo("#target");
    }
    for (var i in partList) {
        var option = $("<option></option>");
        option.attr("value", partList[i].attr);
        option.text(partList[i].attr);
        option.appendTo("#searchParts");
    }
}

//===============================================================================
$(function() {
    design = new Design();
    leftBar = new LeftBar();
    rightBar = new RightBar();
    rubberband = new Rubberband();
    operationLog = new OperationLog();
    designMenu = new DesignMenu();
    dfs = new DFS();
    operationLog.init();
    design.init();
    leftBar.init();
    rightBar.init();
    rubberband.init();
    designMenu.init();
    DataManager.getPartDataFromServer(function(partList) {
        leftBar.initPart(partList);
        rightBar.initEquationParts(partList);
    });
    DataManager.getDeviceDataFromServer(function(deviceList) {
        leftBar.initDevice(deviceList);
    });
    DataManager.getPerDesignDataFromServer(function(designs) {
        designMenu.perDesignList = designs;
    })
    DataManager.getForDesignDataFromServer(function(designs) {
        designMenu.forDesignList = designs;
    })
    DataManager.getPubDesignDataFromServer(function(designs) {
        designMenu.pubDesignList = designs;
    })
    DataManager.getRelationAdjDataFromServer();
    DataManager.getRelationShipDataFromServer();

})
//===============================================================================

$("#createCustomPart").click(function() {
    $('#createCustomPartModal').modal("show");
})

$('.dropdown').dropdown();

$(".cancel").each(function() {
    $(this).click(function() {
        $('.modal').modal("hide");
    });
});

$("#customPartType").change(function() {
    var partType = $(this).attr("value");
    $("#customImg").attr("src", "/static/img/design/parts/"+partType+"_70.png");
});

$("#customCreate").click(function() {
    $('#createCustomPartModal').modal("hide");
    var part = {};
    part.name = $("#customPartName").val();
    part.BBa = $("#customBBaName").val();
    part.type = $("#customPartType").val();
    part.full_description = $("#customIntro").val();
    DataManager.addPart(part);
    leftBar.addCustomPart(part);

});

$('#loadingData').dimmer('show');

$("#moveTo").click(function() {
    window.location.href = "/modeling?id="+design.designID;
});

$(".modal").modal({transition: 'horizontal flip'});

$('.ui.accordion').accordion();

$("#openFormularModal").click(function() {
    $("#formularModal").modal('show');
});

$("#openAddParamModal").click(function() {
    $("#paramModal").modal('show');
});

$('#openAddParamModal').popup();

$("#createParam").click(function() {
    $("#paramModal").modal('hide');
    var coeffName = $("#coeffName").val();
    var coeffNum = $("#coeffNum").val();
    var labelDiv = $("<div class='ui label coeffName'></div>");
    var input = $("<input type='number' class='coeffNum'>");
    labelDiv.text(coeffName);
    input.val(coeffNum);

    var div = $("<div class='ui labeled input'></div>");
    div.append(labelDiv);
    div.append(input);
    div.appendTo($("#coefficient"));
});

$("#createEquationBtn").click(function() {
    var target = $("#target").val();
    var requirement = $("#multiParts").val();
    var formular = $("#formular").val();
    var coeffList = [];
    if (target == null || requirement == null || formular == null || coeffList == null) {
        $("#createEquationErrorModal").modal({transition: 'bounce'}).modal('show');
        return ;
    }
    $("#coefficient").find(".ui.labeled.input").each(function() {
        var coeffName = $(this).find(".coeffName").text();
        var coeffNum = $(this).find('.coeffNum').val();
        console.log(coeffName);
        console.log(coeffNum);
        coeffList.push({coeffName: parseInt(coeffNum)});
    });
    var data = {};
    data.target = target;
    data.requirement = requirement;
    data.coeffList = coeffList;
    data.formular = formular;
    var postDataJson = JSON.stringify(data);
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: '/design/equation',
        dataType : 'json',
        data : postDataJson,
        success: function() {
            $("#createEquationSuccessModal").modal('show');
        }
    });
});

$("#searchEquationsBtn").click(function() {
    var postData = {};
    postData.related = $("#searchParts").val();
    if (postData.related.length == 0) return;
    $(this).addClass("loading");
    var postDataJson = JSON.stringify(postData);
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: '/design/equation/search',
        dataType : 'json',
        data : postDataJson,
        success: function(data) {
            var equations = data['equations'];
            if (equations.length == 0) {
                $("#searchEquationsBtn").removeClass("loading");
                $("#searchEquationErrorModel").modal('show');
                return;
            }
            console.log('Equation Results: ')
            console.log(data);
            $('#equaSearchResultModal .content .equationList').empty();
            for (var i in equations) {
                var gridElem = Util.createEquationShow();
                var divider = $("<div class='ui divider'></div>");
                var requirStr = "";
                var coeff = "";
                var coeffStr = "";
                console.log(equations[i].target);
                for (var j in equations[i].requirement) {
                    requirStr += equations[i].requirement[j] + ", ";
                }
                for (var j in equations[i].coeffList) {
                    var name = Object.getOwnPropertyNames(equations[i].coeffList[j]);
                    var value = equations[i].coeffList[j][name];
                    coeffStr = "( " + name + ', ' + value + '), ';
                    console.log(name);
                }
                gridElem.find('.target').text(equations[i].target);
                gridElem.find('.requirement').text(requirStr);
                gridElem.find('.coefficient').text(coeffStr);
                var replaced = equations[i].formular.replace(/[{}]/g, '')
                                                        .replace(/\*\*/g, '^');
                var latexExp = '\\frac{d' + equations[i].target + '}{dt}=' + math.parse(replaced).toTex({parentheses: 'auto'});
                gridElem.find('.formular').text("$" + latexExp + "$");
                gridElem.appendTo($('#equaSearchResultModal .content .equationList'));
                divider.appendTo($('#equaSearchResultModal .content .equationList'));
            }
            MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
            $("#equaSearchResultModal").modal('show');
            $("#searchEquationsBtn").removeClass("loading");
        }
    });
});

// initialize all modals
$('.coupled.modal')
  .modal({
    allowMultiple: true
  })
;

$("#equationHelp").click(function() {
    $("#equationHelpModal").modal("show");
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
});