Template.header.events({
  'click [data-id=sign-out]': function() {
    Meteor.logout(function(error) {
      if (error) {
        alert(error.reason);
      } else {
        FlowRouter.go('/sign-in');
      }
    });
  },
  'click [data-id=new-post]': function() {
    FlowRouter.go('/newpost');
  },
  'click [data-id=username]': function() {
    FlowRouter.go('/users/'+Meteor.users.findOne({_id: Meteor.userId()})._id);
  }
});


Template.header.helpers({
user: () => {
return Meteor.users.findOne({_id: Meteor.userId()}).username;
},
});