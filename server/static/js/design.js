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

var isOpenLeftBar = false;
var leftBar = $("#left-sidebar");
var drawArea_menu = $("#drawArea-menu");
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

$('.ui.fluid.accordion').accordion();

var putPartElemList = [];
var relationList = new Array();

function getType(part) {
    return type[part];
};

function getImagePath(type) {
    return "/static/images/"+ type + ".png";
};

function makeItJqeryDraggable(div) {
    div.draggable({
        helper: 'clone',
        cursor: 'move',
        tolerance: 'fit',
        revert: true
    });
}

function addLine(partA) {
    var partNameA = partA.attr('part-name');
    for (var i in putPartElemList) {
        var partB = putPartElemList[i];
        var partNameB = partB.attr('part-name');
        if (isHasRelation(partNameA, partNameB)) {
            drawLine(partA, partB);
        } else if (isHasRelation(partNameB, partNameA)) {
            drawLine(partB, partA);
        }
    }
}

function drawLine(fromPartA, toPartB) {
    var that = this;
    var fromPartNameA = fromPartA.attr('part-name');
    var fromPartNameB = toPartB.attr('part-name');
    var lineType = getLineType(fromPartNameA, fromPartNameB);
    var overlaysClass = getOverLaysClass(lineType);
    var strokeStyle = getStorkeStyle(lineType);
    jsPlumb.connect({
        connector: ["Flowchart"],
        anchor: "Continuous",
        paintStyle: { strokeStyle: strokeStyle, lineWidth: 2 },
        // hoverPaintStyle: { strokeStyle: "blue" },
        source:fromPartA,
        target:toPartB,
        endpoint:"Blank",
        // overlays:[ ["Custom" , { 
        //         create:function(component) {
        //             return $("<div></div>");
        //         },
        //         cssClass: overlaysClass,
        //         width:12, length:12, location:1 }] ],
        overlays: [overlaysClass],
        // overlays: [['Arrow', {width:25, length: 15, location:1, foldback:0.3}]],
        allowLoopback: true,
        Container: "drawArea"
    });
}

var getStorkeStyle = function(lineType) {
    if (lineType == 'normal') return "green";
    if (lineType == 'inhibition') return "red";
    if (lineType == "promotion") return "blue";
}

var getOverLaysClass = function(lineType) {
    if (lineType == 'normal') return  ["Custom" , { create:function(component) {
                                                        return $("<div></div>");
                                                        }
                                                  }
                                      ];
    if (lineType == 'inhibition') return [ "Diamond", {width:25, length: 1, location:1, foldback:1}];
    if (lineType == "promotion") return ['Arrow', {width:25, length: 15, location:1, foldback:0.3}];
}

var getLineType = function(fromPartA, toPartB) {
    for (var i in relationList) {
        if (relationList[i].fromPartA === fromPartA &&
            relationList[i].toPartB === toPartB) {
            return relationList[i].relationType;
        }
    }
    return "";
}

var isHasRelation = function(fromPartA, toPartB) {
    for (var i in relationList) {
        if (relationList[i].fromPartA === fromPartA &&
            relationList[i].toPartB === toPartB) {
            return true;
        }
    }
    return false;
}

var addRelation = function(fromPartA, toPartB, relationType) {
    relationList.push(new Relation(fromPartA, toPartB, relationType))
}

$(function() {
    for (var each in type) {
        var div = $("<div></div>");
        div.attr('id', each);
        div.attr('part-name', each);
        div.addClass('item');

        var img = $("<img></img>");
        var partType = getType(each);
        var imgPath = getImagePath(partType);
        img.addClass("ui middle aligned tiny image");
        img.attr("src", imgPath);
        img.appendTo(div);

        var p = $("<p></p>");
        p.text(each);
        p.appendTo(div);

        makeItJqeryDraggable(div);
        div.appendTo($("#parts"));
    }
});

// $("#showsidebar").click(function() {
//     $('.ui.wide.sidebar')
//     .sidebar({
//               'scrollLock': true,
//               'dimPage': false,
//               'returnScroll': true
//             })
//     .sidebar('toggle');
// });


$(".item").draggable({
    helper: 'clone',
    cursor: 'move',
    tolerance: 'fit',
    revert: true
});

$("#drawArea").droppable({
    accept: '.item',
    containment: 'drawArea',
    drop:function(e, ui) {
        var dropedElement = ui.helper.clone();
        ui.helper.remove();

        $(dropedElement).removeAttr("class");
        dropedElement.addClass("node");
        dropedElement.appendTo('#drawArea');
        
        var left = $(dropedElement).position().left - leftBar.width();
        var top  = $(dropedElement).position().top - drawArea_menu.height();

        $(dropedElement).css({left:left, top:top});
        addDraggable(dropedElement);
        addLine(dropedElement);

        putPartElemList.push(dropedElement);
    }
});

function addDraggable(Element) {
    jsPlumb.draggable(Element, {
        containment: 'parent',
        // stop: function(event) {
        //     stateDragged = true;
        // }
    })
}

var rubberbandInstance = new Rubberband();

jsPlumb.ready(function() {
    jsPlumb.setContainer($("#drawArea"));

    $("#drawArea").mousedown(rubberbandInstance.diagramContainer_MouseDown);
    $("#drawArea").mousemove(rubberbandInstance.diagramContainer_MouseMove);
    $("#drawArea").mouseup(rubberbandInstance.diagramContainer_MouseUp);

    $("#drawArea").click(rubberbandInstance.diagramContainer_Click);
});

// var rubberband = $("#rubberband");

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
            $(this).addClass("selected");
 
            var elementid = $(this).attr('id');
            jsPlumb.addToDragSelection(elementid);
        }
    });
}

$(".trigger-left").click(function() {
    var left = leftBar.css("left");

    if (parseInt(left) == 0) {
        isOpenLeftBar = false;
        leftBar.animate({
            left: '-455px'
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
            left: '455px'
        }, 500);

        $("#left-sidebar .trigger-left > i").removeClass("right").addClass("left");
    }
})

function saveCircuitchart(){
    var nodes = []
    $(".node").each(function (idx, elem) {
        var $elem = $(elem);
        nodes.push({
            partName: $elem.attr('part-name'),
            positionX: parseInt($elem.css("left"), 10),
            positionY: parseInt($elem.css("top"), 10)
        });
    });

    var curcuitChart = {};
    curcuitChart.nodes = nodes;

    var flowChartJson = JSON.stringify(curcuitChart);

    $('#jsonOutput').val(flowChartJson);
}

function loadCircuitchart(){
    var circuitChartJson = $('#jsonOutput').val();
    var curcuitChart = JSON.parse(circuitChartJson);
    var nodes = curcuitChart.nodes;
    $.each(nodes, function( index, elem ) {
        var div = $("<div></div>");
        var left = elem.positionX;
        var top = elem.positionY;
        div.css({left: left, top: top});
        div.css({position: "absolute"});

        var img = $("<img></img>");
        var partType = getType(elem.partName);
        var imgPath = getImagePath(partType);
        img.addClass("ui middle aligned tiny image");
        img.attr("src", imgPath);
        img.appendTo(div);

        div.attr("part-name", elem.partName);
        div.addClass("node");
        div.appendTo($("#drawArea"));
        addDraggable(div);
        addLine(div);

        putPartElemList.push(div);
    });

    // var connections = curcuitChart.connections;
    // $.each(connections, function( index, elem ) {
    //      var connection1 = jsPlumb.connect({
    //         source: elem.pageSourceId,
    //         target: elem.pageTargetId,
    //         anchors: elem.anchors
    //     });
    // });

    // numberOfElements = curcuitChart.numberOfElements;
}

function repositionElement(id, posX, posY){
    $('#'+id).css('left', posX);
    $('#'+id).css('top', posY);
    jsPlumb.repaint(id);
}

function clearCircuitchart() {
    jsPlumb.empty("drawArea");
    putPartElemList = [];
    // $(".node").remove();
    // $("._jsPlumb_connector").remove();
    // $("._jsPlumb_overlay ").remove();
    // $("._jsPlumb_endpoint").remove();
    // jsPlumb.deleteEveryEndpoint();
    // jsPlumb.reset();
}

$("#save").click(function() {
    saveCircuitchart();
});

$("#load").click(function() {
    loadCircuitchart();
});

$("#clear").click(function() {
    clearCircuitchart();
});

$("#showImage").click(function() {
    saveCircuitToImage();
});

function saveCircuitToImage() {
    var el = $("#drawArea"); // get flow container div
    html2canvas(el, {
        onrendered: function(canvas) {
            var that = this;
            this.canvas = document.createElement('canvas');
            this.ctx = canvas.getContext('2d');
            console.log(this.ctx);
            // # Render Flows/connections on top of same canvas
            this.flows = $('> svg', el);

            this.flows.each(function() {
                var svg = $(this)
                var offset = svg.position();
                var svgStr = this.outerHTML;
                console.log(that.ctx);
                that.ctx.drawSvg(svgStr, offset.left, offset.top);
            });
            // # Convert canvas to Blob
            // this.canvas.toBlob(function(blob) {
            //     //# Download Blob canvas
            //         NF.downloadData("test.jpg", blob, 'image/jpeg')
            // });
            $("#main-contain").append(canvas);
            this.ctx.drawImage(canvas, 0, 0);

            var dataURL = canvas.toDataURL();
            console.log(dataURL);
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

addRelation('promoter1', 'lacZ_gene', 'normal');
addRelation('arsD_protein', 'promoter1', 'inhibition');
addRelation('lacZ_gene', 'lacZ_protein', 'promotion');
// addRelation('lacZ_gene', 'promoter_pompc');
addRelation('lacZ_protein', 'lactose', 'promotion');
addRelation('lacZ_protein', 's-gal', 'promotion');
addRelation('lactose', 'lactose_acid+acetic_acid', 'promotion');
addRelation('s-gal', 'black_material', 'promotion');
addRelation('arsD_gene', 'promoter1', 'normal');
addRelation('arsD_gene', 'arsD_protein', 'promotion');
addRelation('arsenic_ion', 'arsD_protein', 'inhibition');
addRelation('arsR_proteion', 'arsenic_ion', 'inhibition');
addRelation('arsR_gene', 'arsR_proteion', 'promotion');
addRelation('arsR_gene', 'CI_gene', 'normal');
addRelation('promoter2', 'arsR_gene', 'normal');
addRelation('CI_gene', 'CI_protein', 'promotion');
addRelation('CI_protein', 'promoter4', 'inhibition');
addRelation('lacl_protein', 'promoter4', 'inhibition');
addRelation('promoter4', 'urease_gene', 'normal');
addRelation('lacl_gene', 'lacl_protein', 'promotion');
addRelation('promoter3', 'lacl_gene', 'normal');
addRelation('urease_gene', 'urease_protein', 'promotion');
addRelation('urease_protein', 'urea', 'promotion');
addRelation('urea', 'carbon_dioxide+ammonia', 'promotion');

var type = {
    'promoter1': 'promoter',
    'promoter2': 'promoter',
    'promoter3': 'promoter',
    'promoter4': 'promoter',
    'lacZ_gene': 'gene',
    'lacZ_protein': 'protein',
    'lactose': 'material',
    'lactose_acid+acetic_acid': 'material',
    's-gal': 'material',
    'black_material': 'material',
    'promoter_pompc': 'promoter',
    'arsD_protein': 'protein',
    'arsD_gene': 'gene',
    'arsenic_ion': 'material',
    'arsR_proteion': 'protein',
    'arsR_gene': 'gene',
    'CI_gene': 'gene',
    'CI_protein': 'protein',
    'lacl_protein': 'protein',
    'urease_gene': 'gene',
    'urease_protein': 'protein',
    'urea': 'material',
    'carbon_dioxide+ammonia': 'material',
    'lacl_gene': 'gene'
};

var relation = {
    'promoter1': ['lacZ_gene', 'arsD_protein', 'arsD_gene'],
    'lacZ_gene':['lacZ_protein', 'promoter_pompc', 'promot er1'],
    'lacZ_protein':['lactose', 's-gal', 'lacZ_gene'],
    'lactose':['lactose_acid+acetic_acid', 'lacZ_protein'],
    's-gal':['black_material', 'lacZ_protein'],
    'promoter_pompc':['lacZ_gene'],
    'arsD_protein':['arsD_gene', 'arsenic_ion', 'promoter1'],
    'arsD_gene': ['arsD_protein', 'promoter1'],
    'arsenic_ion':['arsR_proteion', 'arsD_protein', 'lacl_protein'],
    'arsR_proteion':['arsR_gene', 'arsenic_ion'],
    'arsR_gene':['CI_gene', 'promoter2', 'arsR_proteion'],
    'promoter2':['arsR_gene'],
    'CI_gene':['CI_protein','arsR_gene'],
    'CI_protein':['promoter4', 'CI_gene'],
    'promoter4':['lacl_protein', 'urease_gene', 'CI_protein'],
    'lacl_protein':['lacl_gene', 'promoter4'],
    'lacl_gene':['promoter3', 'lacl_protein'],
    'urease_gene':['urease_protein', 'promoter4'],
    'urease_protein':['urea','urease_gene'],
    'urea':['carbon_dioxide+ammonia', 'urease_protein']
};
