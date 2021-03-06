Vue.config.delimiters = ['[[', ']]'];

Vue.component('v-topbar', {
    template: "#topbar-template",
    data: function() { return {
    }},
    ready: function() {
        $('#topbar-avatar').popup({
            inline: true,
            position: 'bottom right',
            hoverable: true,
            offset: "-1",
            on: "click",
        });
        $('#topbar-btn-menu').click(function() {
            $('#main-switcher').dimmer('show');
        });
        console.log('topbar init done.')
    },
});

var coreBody = Vue.extend({
    data: function() { return {
        currentView     : '',
    }},
    ready: function() {
        console.log('coreBody init done.')
    },
});


//Function for getting Url Param 
(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
})(jQuery);