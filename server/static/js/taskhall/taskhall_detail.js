Vue.component('v-comment', {
    props : ['answerId', 'commentAuthor'],
    template: "#comment-template",
    data: function() { return {
        showReply: false,
    }},
});

Vue.component('v-answer', {
    props : ['answerId'],
    template: "#answer-template",
    data: function() { return {
        showComments: false,
    }},
});

var vueBody = new coreBody({
    el: 'body',
    data : {
        user : "leasunhy",
        votes : $('#taskhall-detail-votes').data('votes'),
        voted : false
    },
    methods : {
        updateLike : function(id) {
            if (this.voted) return;
            this.voted = true;
            $.ajax({
                type        : 'POST',
                url         : '/taskhall/action/vote',
                data        : JSON.stringify({'task_id': id}),
                dataType    : 'json',
                contentType : 'application/json'
            });
            this.votes += 1;
        },
    },
});

