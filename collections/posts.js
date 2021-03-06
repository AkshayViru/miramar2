Posts = new Mongo.Collection('posts');

Meteor.methods({
  'posts.insert': (title, body, stake_val, branch, ipfshash) => {
    check(body, String);

    if (!Meteor.user()) {
      throw new Meteor.Error(401, 'You need to be signed in to continue');
    }
    if (!body) {
      throw new Meteor.Error(422, 'Body should not be blank');
    }

    let post = {
      title:title,
      body: body,
      authorId: Meteor.userId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      likecount: 0,
      stake_val: stake_val,
      branch:branch,
      ipfshash: ipfshash,
      already_voted: [],
      already_unliked: []
    };

    return Posts.insert(post);
  },
  'posts.remove': (_id) => {
    check(_id, String);

    if (!Meteor.user()) {
      throw new Meteor.Error(401, 'You need to be signed in to continue');
    }
    if (!_id) {
      throw new Meteor.Error(422, '_id should not be blank');
    }
    if (Meteor.userId() !== Posts.findOne({ _id: _id }).authorId) {
      throw new Meteor.Error(422, 'You can only remove your own posts');
    }

    Posts.remove({ _id: _id });
  },
  'posts.like': (_id) => {
    check(_id, String);

    if (!Meteor.user()) {
      throw new Meteor.Error(401, 'You need to be signed in to continue');
    }
    if (!_id) {
      throw new Meteor.Error(422, '_id should not be blank');
    }

    if (Posts.find( { _id: _id, already_unliked: { $in: [Meteor.userId()]} }).count() === 1) {
      Posts.update( { _id: _id }, { $pull: { already_unliked: Meteor.userId() } });
      Posts.update( { _id: _id }, { $push: { already_voted: Meteor.userId() } });
      Posts.update({ _id: _id }, { $inc: {likecount: 2} });
    } else if (Posts.find( { _id: _id, already_voted: { $in: [Meteor.userId()]} }).count() === 0) {
      Posts.update( { _id: _id }, { $push: { already_voted: Meteor.userId() } });
      Posts.update({ _id: _id }, { $inc: {likecount: 1} });
    } else if (Posts.find( { _id: _id, already_voted: { $in: [Meteor.userId()]} }).count() === 1) {
      Posts.update( { _id: _id }, { $pull: { already_voted: Meteor.userId() } });
      Posts.update({ _id: _id }, { $inc: { likecount: -1} });
    }
  },
  'posts.unlike': (_id) => {
    check(_id, String);

    if (!Meteor.user()) {
      throw new Meteor.Error(401, 'You need to be signed in to continue');
    }
    if (!_id) {
      throw new Meteor.Error(422, '_id should not be blank');
    }

    if (Posts.find( { _id: _id, already_unliked: { $in: [Meteor.userId()]} }).count() === 1) {
      //do nothing
    } else if (Posts.find( { _id: _id, already_voted: { $in: [Meteor.userId()]} }).count() === 1) {
      Posts.update( { _id: _id }, { $pull: { already_voted: Meteor.userId() } });
      Posts.update( { _id: _id }, { $push: { already_unliked: Meteor.userId() } });
      Posts.update({ _id: _id }, { $inc: { likecount: -2} });
    } else if (Posts.find( { _id: _id, already_unliked: { $in: [Meteor.userId()]} }).count() === 0) {
      Posts.update( { _id: _id }, { $push: { already_unliked: Meteor.userId() } });
      Posts.update({ _id: _id }, { $inc: {likecount: -1} });
    } 
  },
  'posts.update_stake':(_id) => {
    check(_id, String);

    if (!Meteor.user()) {
      throw new Meteor.Error(401, 'You need to be signed in to continue');
    }
    if (!_id) {
      throw new Meteor.Error(422, '_id should not be blank');
    }

    Posts.update({_id: _id}, {$set: {stake_val: "0"}});
  }
});
