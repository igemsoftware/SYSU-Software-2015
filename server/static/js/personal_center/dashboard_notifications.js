var vNotificationsComponent = Vue.component('dashboard-notifications', {
    template: "#notifications-template",
    data: function() { return {
        notifications: [
            {
                source  : "experiment remind",
                content : "Experiment unread.",
                read    : false,
            },
            {
                source  : "database",
                content : "Database read.",
                read    : true,
            },
            {
                source  : "taskhall",
                content : "taskhall unread.",
                read    : false,
            },
            {
                source  : "database",
                content : "database unread.",
                read    : false,
            },
            {
                source  : "experiment remind",
                content : "Experiment hahaha.",
                read    : true,
            },
            {
                source  : "experiment record",
                content : "Experiment hahaha.",
                read    : true,
            },
        ],
        selectedTag: '',
        selectedTab: 'unread',
        tags       : ['experiment remind', 'experiment record', 'database', 'taskhall'],
    }},
    ready: function() {
    },
    computed: {
        unreadOnly: function() {
            return this.selectedTab === 'unread' ? true : undefined;
        },
        selectedTag: function() {
            return (this.selectedTab === 'unread' || this.selectedTab === 'all') ? '' : this.selectedTab;
        },
        displayingList: function() {
            return this.$eval('notifications | filterBy unreadOnly read | filterBy selectedTag source')
        },
        unreadNotifications: function() {
            return this.$eval('notifications | filterBy true read');
        }
    },
});
