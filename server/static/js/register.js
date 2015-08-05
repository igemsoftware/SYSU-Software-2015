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

    $('#submit').click(function(e) {
        if ($('#password2').val() !== $('#password').val()) {
            $('#reenter-modal').modal({ closable: false, onApprove: function() { return false; } }).modal('show');
            e.preventDefault();
        }
    });

    $('#submit2').click(function(e){
        if ($('#password2').val() !== $('#password').val()) {
            $('#reenter-note').text('Password mismatch.');
        } else {
            $('#reenter-note').text('Password matched.');
            $('#submit').click();
        }
    });

});
