var userGuideModal = $("#userGuideModal");
var circleTab = userGuideModal.children(".circleTab");
var btnArrowLeft = userGuideModal.children(".btn-arrow.left");
var btnArrowRight = userGuideModal.children(".btn-arrow.right");

setTimeout(function(){
    userGuideInit(27,userGuideModal.children(".content"), circleTab),
    $("#UserGuideBtn").click(function(){
        userGuideModal.modal("show");
    }),
    userGuideModal.find(".content img").each(function(a){
        0===a? $(this).addClass("ui transition image visible"):$(this).addClass("ui transition image hidden")
    });
    var a =! 0, b = circleTab.children(), c = userGuideModal.find(".content img");
    btnArrowLeft.hide(),
    userGuideModal.children(".btn-arrow").click(function(d){
        var e,f;
        if(a) {
            for (a=!1, btnArrowRight.show(), btnArrowLeft.show(), e=$(d.target), f=0;
                f<c.length&&!c.eq(f).hasClass("visible");
                f++);
            if (e.hasClass("left")){
                if(1===f && btnArrowLeft.hide(), 0===f) return;
                c.eq(f).transition("horizontal flip","300ms"),
                c.eq(f-1).transition("horizontal flip","300ms"),
                b.eq(f).removeClass("actived"),
                b.eq(f-1).addClass("actived")
            } else {
                if(f===c.length-2&&btnArrowRight.hide(),f===c.length-1)
                return;
                c.eq(f).transition("horizontal flip","300ms"),
                c.eq(f+1).transition("horizontal flip","300ms"),
                b.eq(f).removeClass("actived"),
                b.eq(f+1).addClass("actived")
            }
            setTimeout(function(){a=!0},300)
        }
    }),
    b.each(function(a){
        $(this).click(function(){
            var d = $(this);
            d.hasClass("actived") || 
            (circleTab.find(".actived").removeClass("actived"), d.addClass("actived"),
            c.eq(a).transition("horizontal flip","300ms"),
            c.filter(".visible").transition("horizontal flip","300ms")),
            0 === a ? 
                (btnArrowLeft.hide(),btnArrowRight.show()):
                a === b.length-1 ? 
                    (btnArrowLeft.show(),btnArrowRight.hide()):(btnArrowLeft.show(),btnArrowRight.show())
        })
    })
},2e3);

function userGuideInit(a, b, c){
    var d, e;
    for(d = 1; a >= d; d++)
        e = 10 > d ? "0"+d : d, $("<img>").attr("src","/static/img/user_guide/user_guide"+e+".jpg").appendTo(b),
        1 === d ? 
            $("<i>").addClass("circle small icon actived").appendTo(c):
            $("<i>").addClass("circle small icon").appendTo(c);
    c.css("margin-left", -28*a/2+"px")
}