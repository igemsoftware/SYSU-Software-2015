var vBody = new Vue({ el: 'body' });


$(document).ready(function() {
    var indices = $('#index .list .item');
    var titles = $('.title');
    var w = $(window);

    $(window).scroll(function() {
        var x = w.scrollTop()+w.height()*0.25 ;
  
        titles.each(function(ind, ele) {
            if ($(ele).position().top < x) 
                $(indices[ind]).addClass('active').siblings().removeClass('active')
                                
        });
    });

    $(indices).each(function(ind, ele) {
        $(ele).click(function() {
            $('html, body').stop().animate({scrollTop: $(titles[ind]).position().top-w.height()*0.24}, 300, 'swing');
        });
    });
});
