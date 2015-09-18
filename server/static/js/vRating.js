var vueDelimitersSave = Vue.config.delimiters;
Vue.config.delimiters = ['[[', ']]'];

var radar;

var vRatingComp = Vue.component('v-rating', {
    //el: "#rating-wrapper",
    template: "#rating-template",
    props : ['canvasWidth', 'canvasHeight', 'designId', 'canRate'],
    data: function() { return {
        ratingCriteria: ['Compatibility', 'Safety', 'Demand', 'Completeness', 'Efficiency', 'Reliability', 'Accessibility'],
        oriRating: [0, 0, 0, 0, 0, 0, 0],
        curRating: [3, 3, 3, 3, 3, 3, 3],
        rated: 0,
        canvasWidth: 230,
        canvasHeight: 230,
        canRate  : 'on',
        designId : 1,
    }},
    ready: function() {
        var ctx = this.$$.ratingRadar.getContext("2d");
        var radar = new Chart(ctx).Radar({
            labels: this.ratingCriteria,
            datasets: [
            {
                label: "Original Rating",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: this.oriRating,
            },
            {
                label: "Your Rating",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: this.curRating
            },
            ]}, {
               scaleOverride: true,
               scaleSteps: 5,
               scaleStepWidth: 1,
               scaleStartValue: 0
           }
           );
        var store = this;
        this.$watch('oriRating', function() {
            for (var i = this.oriRating.length - 1; i >= 0; i--)
                radar.datasets[0].points[i].value = this.oriRating[i];
            radar.update();
        });
        if (this.canRate === 'on') {
            var store = this;
            $(this.$$.ratingWrapper).find('.rating.container > .rating').rating({
                onRate: function(value) {
                    var criterionIndex = $(this).data('criterion-index');
                    radar.datasets[1].points[criterionIndex].value = value;
                    radar.update();
                    store.curRating[criterionIndex] = value;
                },
            });
        }
        var store = this;
        $.ajax({
            type        : 'GET',
            url         : '/design/mark/' + this.designId.toString(),
            dataType    : 'json',
            contentType : 'application/json',
            success     : function(data) { store.oriRating = data.eval; }
        });
    },
    methods: {
        rate : function() {
            this.rated = 1;
            console.log(this.curRating);
            var store = this;
            $.ajax({
                type        : 'POST',
                url         : '/design/mark/' + this.designId.toString(),
                data        : JSON.stringify(this.curRating),
                dataType    : 'json',
                contentType : 'application/json',
                success     : function(data) {
                    store.oriRating = data.eval;
                    $(store.$$.ratingWrapper).find('.rating.container > .rating').rating('disable');
                    store.rated = 2;
                }
            });
        },
    },
});

Vue.config.delimiters = vueDelimitersSave;
