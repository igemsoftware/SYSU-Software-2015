Vue.config.delimiters = ['[[', ']]'];
var vBody = new Vue({
    el: "body",
    data: {
        selectedTab: 0,
        ratingCriteria: ['Feasibility', 'Safety', 'CriterionA', 'CriterionB', 'CriterionC'],
    },
    ready: function() {
        var ctx = document.getElementById("embedded-rating-radar").getContext("2d");
        var radar = new Chart(ctx).Radar({
            labels: this.ratingCriteria,
            datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [3, 3, 3, 3, 3]
            },
            {
                label: "My First dataset",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [3, 5, 4, 2, 4]
            },
            ]
        });

        var store = this;
        $('#embedded-rating > .rating.container > .rating').rating({
            onRate: function(value) {
                var criterionIndex = $(this).data('criterion-index');
                radar.datasets[0].points[criterionIndex].value = value;
                radar.update();
            },
        });
    },
});
