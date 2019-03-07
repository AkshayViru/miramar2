signInRequired = FlowRouter.group({
  triggersEnter: [function(context, redirect) {
    if (!(Meteor.loggingIn() || Meteor.user())){
        FlowRouter.go('/login-modal');
    }
    else{
      FlowRouter.go('/');
    }
  }]
});

signInRequired.route('/login-modal', {
  name: 'login-modal',
  action: () => {
    BlazeLayout.render('layout');
  }
});

signInRequired.route('/', {
  name: 'feed',
  action: () => {
    BlazeLayout.render('layout');
  }
});
