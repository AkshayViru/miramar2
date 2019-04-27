Template.branch.onCreated(function () {
    this.searchQuery = new ReactiveVar('');
    this.filter = new ReactiveVar('all');
    this.limit = new ReactiveVar(20);
    this.postsCount = new ReactiveVar(0);

    this.autorun(() => {
      this.subscribe('posts.all', this.searchQuery.get(), this.filter.get(), this.limit.get(), FlowRouter.getParam('branch_name'));
      this.postsCount.set(Counts.get('posts.all'));
    });
  });
  
Template.branch.helpers({    
    posts: () => {
        return Posts.find({branch: FlowRouter.getParam('branch_name')}, { sort: { likecount: -1 } });
    },

    activeIfFilterIs: (filter) => {
        if (filter === Template.instance().filter.get()) {
        return 'active';
        }
    }
  });

  Template.feed.events({
    'click [data-id=all]': (event, template) => {
      template.filter.set('all');
    },
  
    'click [data-id=following]': (events, template) => {
      template.filter.set('following');
    }
  });
  