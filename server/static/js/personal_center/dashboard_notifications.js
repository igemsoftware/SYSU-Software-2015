var vNotifications = new Vue({
    el : 'body',
    data: function() { return {
        notifications: [
        ],
        selectedTag: '',
        selectedTab: 'unread',
        tags       : ['experiment remind', 'experiment record', 'database', 'taskhall'],
    }},
    ready: function() {
        this.$eval('updateData()');
    },
    computed: {
        unreadOnly: function() {
            return this.selectedTab === 'unread' ? false : undefined;
        },
        selectedTag: function() {
            return (this.selectedTab === 'unread' || this.selectedTab === 'all') ? '' : this.selectedTab;
        },
        displayingList: function() {
            return this.$eval('notifications | filterBy unreadOnly read | filterBy selectedTag source')
        },
        unreadNotifications: function() {
            return this.$eval('notifications | filterBy false read');
        }
    },
    methods : {
        updateData : function() {
            var store = this;
            $.get('/person/notifications', function(data) {
                store.notifications = data.notifications;
            });
        },
        markAsRead : function(id) {
            var store = this;
            $.post('/person/notifications/' + id, function() {
                store.$eval('updateData()');
            });
        },
        deleteNotif : function(id) {
            var store = this;
            $.ajax({
                url: '/person/notifications/' + id,
                success : function() {
                    store.$eval('updateData()');
                },
                method  : 'DELETE'
            });
        },
    }
});
