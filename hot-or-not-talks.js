Talks = new Mongo.Collection('talks');

Talks.allow({
    insert: function(userId) {
        return !! userId;
    }
});

Meteor.methods({
    upvote: function(talkId) {
        var talk = Talks.findOne(talkId);
        Talks.update(
            talkId,
            { $set: { upvotes: parseInt(talk.upvotes) + 1 }}
        );
    },

    downvote: function(talkId) {
        var talk = Talks.findOne(talkId);
        Talks.update(
            talkId,
            { $set: { downvotes: talk.downvotes + 1 }}
        );
    }
});

if (Meteor.isClient) {

    Meteor.subscribe('talks');

    Template.talksList.helpers({
        talks: Talks.find({}, {sort: {upvotes: -1}})
    });

    Template.talksList.events({
        'click .vote-up': function(e) {
            e.preventDefault();
            Meteor.call('upvote', this._id);
        },

        'click .vote-down': function(e) {
            e.preventDefault();
            Meteor.call('downvote', this._id);
        }
    });

    Template.talkForm.events({
        'submit form': function(e) {
            e.preventDefault();
            var talkName = $('#talk-name');
            var talkDescription = $('#talk-description');
            Talks.insert({
                'name': talkName.val(),
                'name': talkDescription.val(),
                'upvotes': 0,
                'downvotes': 0
            });
            talkName.val('');
            talkDescription.val('');
        }
    });

}

if (Meteor.isServer) {

    Meteor.publish('talks', function() {
        return Talks.find();
    });
}