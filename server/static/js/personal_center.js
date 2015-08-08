Vue.config.delimiters = ['[[', ']]'];

var records = [
];

var vueBody = new Vue({
    el: 'body',
    data: {
        views           : ['database', 'reminder'],
        rightMenu       : ['design', 'modeling', 'experiment'],
        currentView     : 'database',
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
                        completeness    : 1,
                        time            : 2,
                    },
                    {
                        title           : 'DNA and Protein',
                        description     : 'They listened in silence. No one interrupted.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur aut officia necessitatibus possimus neque vitae expedita dolor autem, reprehenderit reiciendis ad esse ab sapiente minus, inventore voluptatem molestias assumenda rerum!',
                        tags            : ['Public'],
                        completeness    : 3,
                        time            : 1,
                    },
                    {
                        title           : 'DNA and Protein',
                        description     : 'They listened in silence. No one interrupted.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur aut officia necessitatibus possimus neque vitae expedita dolor autem, reprehenderit reiciendis ad esse ab sapiente minus, inventore voluptatem molestias assumenda rerum!',
                        tags            : ['Task'],
                        completeness    : 2,
                        time            : 3,
                    }
                    ],
                    currentOrder    : 'time',
                    orderReverse    : false,
                    orders          : ['time', 'completeness'],
                    editStatus      : false,
                }
            },
            template: '#database-template',
            created : function() {
                $(function() { $("#order_dropdown").dropdown(); });
            }
        },
        reminder: {
            template: '#reminder-template'
        }
    }
});


