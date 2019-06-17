Template.profile.events({
  'click [data-id=load-more]': (event, template) => {
    template.limit.set(template.limit.get() + 20);
  },
  
  'click [id=donate_button]': (event, template) => {
    event.preventDefault();
    let amount = template.find("#donate").value;

    let receiverAddress = Meteor.users.findOne({_id: FlowRouter.getParam('_id')}).profile.publicKey;

      Coursetro.transfer(receiverAddress, amount,function(error, result){
        if(!error)
            {
              Bert.alert(amount + ' MRM successfully sent!', 'success', 'growl-top-right');
            }
        else
            console.error(error);
      });
   /* }
    else{
              Bert.alert('Not enough balance', 'danger', 'growl-top-right');
    }*/
  } 
});

Template.profile.onRendered(() => {
  autosize($('[data-id=body]'));

  let currentUser = Meteor.users.findOne({_id: Meteor.userId()});
  //set max send value
  if (currentUser && currentUser.profile) {
    let userAddress = Meteor.users.findOne({_id: Meteor.userId()}).profile.publicKey;
    Coursetro.balanceOf(userAddress,function(error, result){
      if(!error)
          {
            $("#donate").attr("max",result);
          }
      else
          console.error(error);
    });
  }
});


Template.profile.helpers({
  user: () => {
    return Meteor.users.findOne({ _id: FlowRouter.getParam('_id') });
  },

  posts: function() {
    return Posts.find({authorId: FlowRouter.getParam('_id')}, { sort: { likecount: -1 } });
  },

  hasMorePosts: () => {
    return Template.instance().limit.get() <= Template.instance().userPostsCount.get();
  }
});

Template.profile.onCreated(function () {
  this.limit = new ReactiveVar(20);
  this.userPostsCount = new ReactiveVar(0);

  this.autorun(() => {
    this.subscribe('users.profile', FlowRouter.getParam('_id'), this.limit.get());
    this.userPostsCount.set(Counts.get('users.profile'));

    // Get current user's social media accounts
    let profileUser = Meteor.users.findOne({_id: FlowRouter.getParam('_id')});

    // Display social media links
    if (profileUser && profileUser.socialMedia) {
      $('#socialMediaAccounts').empty();
      for (var prop in profileUser.socialMedia) {
        let smLink = '<a id="' + prop + '" class="smAccount" href="' + profileUser.socialMedia[prop] + '"><img src="/img/' + prop + '.svg"/></a>';
        $(smLink).appendTo('#socialMediaAccounts');
      }
    }
  });
});
