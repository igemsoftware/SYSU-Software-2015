var vueDelimitersSave = Vue.config.delimiters;
Vue.config.delimiters = ['[[', ']]'];
var vRating = new Vue({
    el: "#rating-wrapper",
    data: {
        ratingCriteria: ['Compatibility', 'Safety', 'Demand', 'Completeness', 'Efficiency', 'Reliability', 'Accessibility'],
        oriRating: [1, 1, 1, 1, 3, 3, 3],
        curRating: [3, 3, 3, 3, 3, 3, 3],
        rated: false,
    },
    ready: function() {
        var ctx = document.getElementById("rating-radar").getContext("2d");
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
                data: [3, 3, 3, 3, 3, 3, 3]
            },
            ]}, {
                scaleOverride: true,
                scaleSteps: 5,
                scaleStepWidth: 1,
                scaleStartValue: 0
        });

        var store = this;
        $('#rating-wrapper > .rating.container > .rating').rating({
            onRate: function(value) {
                var criterionIndex = $(this).data('criterion-index');
                radar.datasets[1].points[criterionIndex].value = value;
                radar.update();
                store.curRating[criterionIndex] = value;
            },
        });
        this.$watch('oriRating', function() {
            for (var i = this.ratingCriteria.length - 1; i >= 0; i--) {
                radar.datasets[0].points[i].value = this.oriRating[i];
            };
            radar.update();
        });
    },
    methods: {
        rate : function() {
            console.log(this.curRating);
            this.rated = true;
        },
    }
});

Vue.config.delimiters = vueDelimitersSave;
