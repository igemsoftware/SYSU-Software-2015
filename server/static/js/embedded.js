Vue.config.delimiters = ['[[', ']]'];
var vBody = new Vue({
    el: "body",
    data: {
        selectedTab: 0,
        ratingCriteria: ['Compatibility', 'Safety', 'Demand', 'Completeness', 'Efficiency', 'Reliability', 'Accessibility'],
        oriRating: [1, 1, 1, 1, 3, 3, 3],
        curRating: [3, 3, 3, 3, 3, 3, 3],
        rated: false,
    },
    ready: function() {
        var ctx = document.getElementById("embedded-rating-radar").getContext("2d");
        radar = new Chart(ctx).Radar({
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
            ]
        });

        var store = this;
        $('#embedded-rating > .rating.container > .rating').rating({
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
});
