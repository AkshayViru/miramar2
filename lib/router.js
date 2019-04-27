publicAccessible = FlowRouter.group({});

signInRequired = FlowRouter.group({
  triggersEnter: [AccountsTemplates.ensureSignedIn]
});

signInRequired.route('/', {
  name: 'feed',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'feed'
    });
    setTitle('Feed');
  }
});

signInRequired.route('/newpost', {
  name: 'newpost',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'newpost'
    });
    setTitle('New Post');
  }
});

signInRequired.route('/post/:postid', {
  name: 'postdetail',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'postdetail'
    });
    setTitle('Post Detail');
  }
});

signInRequired.route('/update-profile', {
  name: 'updateProfile',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'updateProfile'
    });
    setTitle('Update profile');
  }
});

signInRequired.route('/users/:_id', {
  name: 'profile',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'profile'
    });
    setTitle('Profile');
  }
});


signInRequired.route('/branches/:branch_name', {
  name: 'branch',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'branch'
    });
    setTitle('Branch');
  }
});

signInRequired.route('/browse-users', {
  name: 'browseUsers',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'browseUsers'
    });
    setTitle('Browse users');
  }
});

signInRequired.route('/following', {
  name: 'following',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'following'
    });
    setTitle('Following');
  }
});

signInRequired.route('/follower', {
  name: 'follower',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'follower'
    });
    setTitle('Follower');
  }
});

signInRequired.route('/messages', {
  name: 'messages',
  action: () => {
    BlazeLayout.render('layout', {
      main: 'messages'
    });
    setTitle('Messages');
  }
});

