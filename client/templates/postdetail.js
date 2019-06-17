Template.postdetail.onCreated(function() {
  this.searchQuery = new ReactiveVar('');
  this.filter = new ReactiveVar('all');
  this.limit = new ReactiveVar(20);
  this.autorun(() => {
    this.subscribe('posts.all', this.searchQuery.get(), this.filter.get(), this.limit.get());
  });
});

Template.postdetail.events({
  'click [data-id=remove-post]': function(event, template) {
    let self = this;

    // Sweet Alert delete confirmation
    swal({
      title: 'Delete post?',
      text: 'Are you sure that you want to delete this post?',
      type: 'error',
      showCancelButton: true,
      closeOnConfirm: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#da5347'
    }, function() {
      Meteor.call('posts.remove', self._id, (error, result) => {
        if (error) {
          Bert.alert(error.reason, 'danger', 'growl-top-right');
        } else {
          Bert.alert('Post successfully removed', 'success', 'growl-top-right');
        }
      });
    });
  },
  'click [data-id=like-post]': function(event, template) {
    let self = FlowRouter.getParam('postid');

    Meteor.call('posts.like', self, (error, result) => {
      if (error) {
        Bert.alert(error.reason, 'danger', 'growl-top-right');
      }
    });
    let likes = Posts.findOne({ _id: this._id}).likecount;
    let stake = Posts.findOne({_id: this._id}).stake_val;

    if(likes == 2 && stake !== "0"){
      let userAddress = Meteor.users.findOne({_id: this.authorId}).profile.publicKey;
      Coursetro.transfer(userAddress, stake*2,function(error, result){
        if(!error)
            {
              console.log("Post admin got rewarded")
              Meteor.call('posts.update_stake', self._id, (error, result) => {
                if (error) {
                  Bert.alert(error.reason, 'danger', 'growl-top-right');
                }
              });
            }
        else
            console.error(error);
      });
    }
  },
  'click [data-id=unlike-post]': function(event, template) {
    let self = FlowRouter.getParam('postid');

    Meteor.call('posts.unlike', self, (error, result) => {
      if (error) {
        Bert.alert(error.reason, 'danger', 'growl-top-right');
      }
    });
  }
});

Template.postdetail.helpers({
  postid: function() {
    return Posts.findOne({_id: FlowRouter.getParam('postid')});
  },
  author: function() {
    return Meteor.users.findOne({ _id: Posts.findOne({_id: FlowRouter.getParam('postid')}).authorId });
  },
  belongsPostToUser: function() {
    return Posts.findOne({_id: FlowRouter.getParam('postid')}).authorId === Meteor.userId();
  },
  formatDate: function(date) {
    let currDate = moment(new Date()),
        msgDate = moment(new Date(date));

    let diff = currDate.diff(msgDate, 'days');

    if (diff === 0 && currDate.day() === msgDate.day()) {
      let hourDiff = currDate.diff(msgDate, 'hours'),
          minDiff = currDate.diff(msgDate, 'minutes');
      if (hourDiff > 0) {
        if (hourDiff === 1) {
          return (hourDiff + ' hr ago');
        } else {
          return (hourDiff + ' hrs ago');
        }
      } else if (minDiff > 0) {
        if (minDiff === 1) {
          return (minDiff + ' min ago');
        } else {
          return (minDiff + ' mins ago');
        }
      } else {
        return 'Just now';
      }
    } else if (diff <= 1 && currDate.day() !== msgDate.day()) {
      return ('Yesterday at ' + moment(date).format('h:mm a'));
    } else {
      if (currDate.year() !== msgDate.year()) {
        return moment(date).format('MMMM DD, YYYY');
      } else {
        return (moment(date).format('MMMM DD'));
      }
    }
  },
  isLiked: function() {
    if (Posts.find( { _id: FlowRouter.getParam('postid'), already_voted: { $in: [Meteor.userId()]} }).count() === 1) {
      return 'liked';
    }
    return '';
  }, 
  isUnliked: function() {
    if (Posts.find( { _id: FlowRouter.getParam('postid'), already_unliked: { $in: [Meteor.userId()]} }).count() === 1) {
      return 'unliked';
    }
    return '';
  }
});
