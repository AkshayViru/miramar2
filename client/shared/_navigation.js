/* On navigation template created */
Template.navigation.onCreated(function() {
  this.autorun(() => {
    // Set subscriptions
    this.subscribe('messages.all');
  });
});

Template.navigation.helpers({
  activeIfRouteNameIs: (routeName) => {
    if (FlowRouter.getRouteName() === routeName) {
      return 'active';
    }
    return '';
  }
});
