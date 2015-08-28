Vue.component('v-comment', {
    template: "#comment-template",
    data: function() { return {
        showReply: false,
    }},
});

var vueBody = new coreBody({
    el: 'body',
    data : {
        user                : "leasunhy",
        rightMenu           : ['All Questions', 'Unanswered'],
        notificationCount   : 2,
    },
});

