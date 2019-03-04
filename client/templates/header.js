Template.header.events({
  'click #sign-out': function(e) {
    console.log('logging out user');
    Meteor.logout();
  }
});