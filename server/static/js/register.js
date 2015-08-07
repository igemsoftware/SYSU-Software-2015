$(function() {
    $(".dimmer").dimmer({
        on: 'hover',
        closable: false,
        duration: {
            show: 200,
            hide: 200
        }
    });

    $(".track.option").click(function() {
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
        } else {
            $(this).addClass("selected");
        }
        $(this).find(".checkbox").checkbox('toggle');
    });

    setTimeout(function() {
        $('.dimmer').dimmer('show')
    }, 300);

    setTimeout(function() {
        $('.dimmer').dimmer('hide')
    }, 1000);

    $('.track.option .checkbox').change(function(e) {
        var dimmer = $(this).parents('.dimmer');
        dimmer.dimmer({
            on: $(this).children('input').prop('checked') ? false : 'hover' ,
            closable: false
        });
    });

});
