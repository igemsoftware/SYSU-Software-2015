var selected_tracks = [];
var avatar_url = '';

function processAvatarUploadResponse(data) {
    if (data.url !== undefined) {
        avatar_url = data.url;
        $('.avatar-image').attr('src', avatar_url);
        $('#avatar-url-input').attr('value', avatar_url);
        $('#avatar-modal').modal('hide');
    } else if (data.error !== undefined) {
        $('#avatar-upload-error')
            .text(data.error.message)
            .parents('.message').removeClass('hidden');
    } else {
        $('#avatar-upload-error')
            .text('Unknown error.')
            .parents('.message').removeClass('hidden');
    }
}

$(function() {
    avatar_url = $('avatar-url-input').val();
    $("#avatar .dimmer, .track.option .dimmer").dimmer({
        on: 'hover',
        closable: false,
        duration: {
            show: 200,
            hide: 200
        }
    });

    setTimeout(function() {
        $('#avatar .dimmer, .track.option .dimmer').dimmer('show')
    }, 300);

    setTimeout(function() {
        $('#avatar .dimmer, .track.option .dimmer').dimmer('hide')
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

    $("#avatar-form").ajaxForm({
        dataType: 'json',
        success: processAvatarUploadResponse
    });

});
