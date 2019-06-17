Survey = new Mongo.Collection('survey');

Meteor.methods({
  'survey.update':(_id, val) => {
    check(val, String);

    if (!Meteor.user()) {
      throw new Meteor.Error(401, 'You need to be signed in to continue');
    }
    if (!_id) {
      throw new Meteor.Error(422, '_id should not be blank');
    }

    Posts.update({_id: _id}, {$set: {claim: "true"}});
    Posts.update({_id: _id}, {$set: {ans: val}});

  }
});
