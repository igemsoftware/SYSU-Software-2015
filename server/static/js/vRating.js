var vueDelimitersSave = Vue.config.delimiters;
Vue.config.delimiters = ['[[', ']]'];

var vRatingComp = Vue.component('v-rating', {
    //el: "#rating-wrapper",
    template: "#rating-template",
    props : ['compatibility', 'safety', 'demand', 'completeness', 'efficiency',
             'reliability', 'accessibility', 'canvasWidth', 'canvasHeight'],
    data: function() { return {
        ratingCriteria: ['Compatibility', 'Safety', 'Demand', 'Completeness', 'Efficiency', 'Reliability', 'Accessibility'],
        oriRating: [this.compatibility, this.safety, this.demand, this.completeness,
                    this.efficiency, this.reliability, this.accessibility],
        curRating: [3, 3, 3, 3, 3, 3, 3],
        rated: false,
        canvasWidth: 230,
        canvasHeight: 230,
    }},
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
                data: this.curRating
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
    },
    methods: {
        rate : function() {
            console.log(this.curRating);
            this.rated = true;
        },
    }
});

Vue.config.delimiters = vueDelimitersSave;
