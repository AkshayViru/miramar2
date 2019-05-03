Template.branch_new.onCreated(function () {
    this.searchQuery = new ReactiveVar('');
    this.filter = new ReactiveVar('all');
    this.limit = new ReactiveVar(20);
    this.postsCount = new ReactiveVar(0);

    this.autorun(() => {
      this.subscribe('posts.all', this.searchQuery.get(), this.filter.get(), this.limit.get(), FlowRouter.getParam('branch_name'));
      this.postsCount.set(Counts.get('posts.all'));
    });
  });
  
Template.branch_new.helpers({    
    posts: () => {
        return Posts.find({branch: FlowRouter.getParam('branch_name')}, { sort: { createdAt: -1 } });
    },

    activeIfFilterIs: (filter) => {
        if (filter === Template.instance().filter.get()) {
        return 'active';
        }
    }
  });

  Template.branch_new.events({
    'click [data-id=all]': (event, template) => {
      template.filter.set('all');
    },
  
    'click [data-id=following]': (events, template) => {
      template.filter.set('following');
    },

    'click [id=best]': (event, template) => {
      FlowRouter.go('/branches/'+FlowRouter.getParam('branch_name')+'/best');
    },

    'click [id=new]': (event, template) => {
      FlowRouter.go('/branches/'+FlowRouter.getParam('branch_name')+'/new');
    },

  });
  