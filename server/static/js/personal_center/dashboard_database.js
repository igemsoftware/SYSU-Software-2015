var helper = {
    contains: function(val, search) {
        if (Vue.util.isPlainObject(val)) {
            for (var key in val)
                if (this.contains(val[key], search))
                    return true;
        } else if (Vue.util.isArray(val)) {
            var i = val.length;
            while (i--)
                if (this.contains(val[i], search))
                    return true;
        } else if (val != null) {
            return val.toString().toLowerCase().indexOf(search) > -1;
        }
    },
};


var vDatabaseComponent = Vue.component('dashboard-database', {
    data    : function() {
        return {
            databaseRecords : [
            {
                title           : 'DNA and Protein 1',
                description     : 'They listened in silence. No one interrupted.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur aut officia necessitatibus possimus neque vitae expedita dolor autem, reprehenderit reiciendis ad esse ab sapiente minus, inventore voluptatem molestias assumenda rerum!',
                tags            : ['Task', 'Share'],
                completeness    : 0,
                time            : 2,
            },
            {
                title           : 'DNA and Protein 2',
                description     : 'They listened in silence. No one interrupted.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur aut officia necessitatibus possimus neque vitae expedita dolor autem, reprehenderit reiciendis ad esse ab sapiente minus, inventore voluptatem molestias assumenda rerum!',
                tags            : ['Public'],
                completeness    : 2,
                time            : 1,
            },
            {
                title           : 'DNA and Protein 3',
                description     : 'They listened in silence. No one interrupted.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur aut officia necessitatibus possimus neque vitae expedita dolor autem, reprehenderit reiciendis ad esse ab sapiente minus, inventore voluptatem molestias assumenda rerum!',
                tags            : ['Public'],
                completeness    : 2,
                time            : 1,
            },
            {
                title           : 'DNA and Protein',
                description     : 'They listened in silence. No one interrupted.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur aut officia necessitatibus possimus neque vitae expedita dolor autem, reprehenderit reiciendis ad esse ab sapiente minus, inventore voluptatem molestias assumenda rerum!',
                tags            : ['Public'],
                completeness    : 2,
                time            : 1,
            },
            {
                title           : 'DNA and Protein',
                description     : 'They listened in silence. No one interrupted.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur aut officia necessitatibus possimus neque vitae expedita dolor autem, reprehenderit reiciendis ad esse ab sapiente minus, inventore voluptatem molestias assumenda rerum!',
                tags            : ['Public'],
                completeness    : 2,
                time            : 1,
            },
            {
                title           : 'DNA and Protein',
                description     : 'They listened in silence. No one interrupted.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur aut officia necessitatibus possimus neque vitae expedita dolor autem, reprehenderit reiciendis ad esse ab sapiente minus, inventore voluptatem molestias assumenda rerum!',
                tags            : ['Public'],
                completeness    : 2,
                time            : 1,
            },
            {
                title           : 'DNA and Protein',
                description     : 'They listened in silence. No one interrupted.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur aut officia necessitatibus possimus neque vitae expedita dolor autem, reprehenderit reiciendis ad esse ab sapiente minus, inventore voluptatem molestias assumenda rerum!',
                tags            : ['Task'],
                completeness    : 1,
                time            : 3,
            }
            ],
            currentOrder    : 'time',
            orderReverse    : true,
            orders          : ['time', 'completeness', 'Task', 'Public', 'Share'],
            editStatus      : false,
            filterData      : null,
            filterKey       : null,
            filterRev       : false,
            filterMine      : true,
            selectedRecord  : null,
            selectedTag     : 'all',
        }
    },
    template: '#database-template',
    ready : function() {
        $(function() { $("#order_dropdown").dropdown(); });
    },
    methods : {
        getRecordClass: function(completeness) {
            return ['design', 'modeling', 'experiment'][completeness];
        },
        selectTag: function(tag, mine, data, key, reverse) {
            this.selectedTag = tag;
            this.filterMine = mine;
            this.filterData = data;
            this.filterKey = key;
            this.filterRev = reverse;
        },
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
        },
        recordFilterBy : function (arr, search, delimiter, dataKey, reverse) {
            console.log(search);
            if (search == null)
                return arr;
            search = ('' + search).toLowerCase();
            return arr.filter(function (item) {
                return reverse ^ (dataKey ? helper.contains(item[dataKey], search) : helper.contains(item, search));
            });
        },
    },
});

