var vBody = new Vue({ el: 'body' });


$(document).ready(function() {
    $(window).scroll(function() {
        var x = $(window).scrollTop()+$(window).height()/2 ;
        var indices = $('#index .list .item');
        var titles = $('.title')
  
        titles.each(function(ind, ele) {
            if ($(ele).position().top < x) 
                $(indices[ind]).addClass('active').siblings().removeClass('active')
                                
        });
    });

});
