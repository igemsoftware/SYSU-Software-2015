var selected_tracks = [];

$(function() {
    $(".dimmer").dimmer({
        on: 'hover',
        closable: false,
        duration: {
            show: 200,
            hide: 200
        }
    });

    setTimeout(function() {
        $('.dimmer').dimmer('show')
    }, 300);

    setTimeout(function() {
        $('.dimmer').dimmer('hide')
    }, 1000);

    $(".track.option").click(function() {
        var self = $(this);
        var self_value = self.attr("data-value");
        if (self.hasClass("selected")) {
            self.removeClass("selected");
        } else {
            self.addClass("selected");
        }
        var now_selected = self.hasClass("selected");
        self.find('.dimmer').dimmer({
            on:  now_selected ? false : 'hover' ,
            closable: false
        });
        if (now_selected)
            selected_tracks.push(self_value);
        else
            selected_tracks.splice(selected_tracks.indexOf(self_value), 1);
        $("#select-tracks").val(selected_tracks);
    });

    $('#change-avatar').click(function() {
        $("#avatar-modal").modal("show");
    });

});
