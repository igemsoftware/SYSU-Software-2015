Vue.config.delimiters = ['[[', ']]'];

var records = [
];

var vueBody = new Vue({
    el: 'body',
    data: {
        user            : 'leasunhy',
        views           : ['database', 'reminder', 'favourites'],
        rightMenu       : ['design', 'modeling', 'experiment'],
        currentView     : 'database',
        loader          : {active: false, text: 'Loading'},
    },
    components: {
        database: {
            data    : function() {
                return {
                    databaseRecords : [
                    {
                        title           : 'DNA and Protein',
                        description     : 'They listened in silence. No one interrupted.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur aut officia necessitatibus possimus neque vitae expedita dolor autem, reprehenderit reiciendis ad esse ab sapiente minus, inventore voluptatem molestias assumenda rerum!',
                        tags            : ['Task', 'Share'],
                        completeness    : 0,
                        time            : 2,
                        author          : 'leasunhy',
                    },
                    {
                        title           : 'DNA and Protein',
                        description     : 'They listened in silence. No one interrupted.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur aut officia necessitatibus possimus neque vitae expedita dolor autem, reprehenderit reiciendis ad esse ab sapiente minus, inventore voluptatem molestias assumenda rerum!',
                        tags            : ['Public'],
                        completeness    : 2,
                        time            : 1,
                        author          : 'leasunhy',
                    },
                    {
                        title           : 'DNA and Protein',
                        description     : 'They listened in silence. No one interrupted.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur aut officia necessitatibus possimus neque vitae expedita dolor autem, reprehenderit reiciendis ad esse ab sapiente minus, inventore voluptatem molestias assumenda rerum!',
                        tags            : ['Public'],
                        completeness    : 2,
                        time            : 1,
                        author          : 'leasunhy',
                    },
                    {
                        title           : 'DNA and Protein',
                        description     : 'They listened in silence. No one interrupted.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur aut officia necessitatibus possimus neque vitae expedita dolor autem, reprehenderit reiciendis ad esse ab sapiente minus, inventore voluptatem molestias assumenda rerum!',
                        tags            : ['Public'],
                        completeness    : 2,
                        time            : 1,
                        author          : 'leasunhy',
                    },
                    {
                        title           : 'DNA and Protein',
                        description     : 'They listened in silence. No one interrupted.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur aut officia necessitatibus possimus neque vitae expedita dolor autem, reprehenderit reiciendis ad esse ab sapiente minus, inventore voluptatem molestias assumenda rerum!',
                        tags            : ['Public'],
                        completeness    : 2,
                        time            : 1,
                        author          : 'leasunhy',
                    },
                    {
                        title           : 'DNA and Protein',
                        description     : 'They listened in silence. No one interrupted.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur aut officia necessitatibus possimus neque vitae expedita dolor autem, reprehenderit reiciendis ad esse ab sapiente minus, inventore voluptatem molestias assumenda rerum!',
                        tags            : ['Public'],
                        completeness    : 2,
                        time            : 1,
                        author          : 'leasunhy',
                    },
                    {
                        title           : 'DNA and Protein',
                        description     : 'They listened in silence. No one interrupted.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur aut officia necessitatibus possimus neque vitae expedita dolor autem, reprehenderit reiciendis ad esse ab sapiente minus, inventore voluptatem molestias assumenda rerum!',
                        tags            : ['Task'],
                        completeness    : 1,
                        time            : 3,
                        author          : 'leasunhy',
                    }
                    ],
                    currentOrder    : 'time',
                    orderReverse    : true,
                    orders          : ['time', 'completeness', 'Task', 'Public', 'Share'],
                    editStatus      : false,
                }
            },
            template: '#database-template',
            created : function() {
                $(function() { $("#order_dropdown").dropdown(); });
            },
            filters : {
                recordOrderBy: function(arr, sortKey, reverse) {
                    if (!sortKey)
                        return arr;
                    if (sortKey === 'time' || sortKey === 'completeness')
                        return Vue.filter('orderBy')(arr, sortKey, reverse);
                    var order = 1;
                    if (arguments.length > 2) {
                        if (reverse === '-1') {
                            order = -1;
                        } else {
                            order = reverse ? -1 : 1;
                        }
                    }
                    return arr.slice().sort(function (a, b) {
                        var aHasTag = a.tags.indexOf(sortKey) !== -1;
                        var bHasTag = b.tags.indexOf(sortKey) !== -1;
                        if (aHasTag && !bHasTag) return order;
                        if (!aHasTag && bHasTag) return -order;
                        return a.time === b.time ? 0 : a.time > b.time ? order : -order;
                    });
                }
            },
            methods : {
                getRecordClass: function(completeness) {
                    return ['design', 'modeling', 'experiment'][completeness];
                }
            }
        },
        reminder: {
            template: '#reminder-template'
        },
    }
});


