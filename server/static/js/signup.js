$(function() {
    $(".dimmer").dimmer({
        on: 'hover',
        closable: false
    });

    setTimeout(function() {
        $('.dimmer').dimmer('show')
    }, 300);

    setTimeout(function() {
        $('.dimmer').dimmer('hide')
    }, 1500);

    $('.track.option .checkbox').change(function(e) {
        var dimmer = $(this).parents('.dimmer');
        dimmer.dimmer({
            on: $(this).children('input').prop('checked') ? false : 'hover' ,
            closable: false
        });
    });

});
