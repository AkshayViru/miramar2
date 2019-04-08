Template.feed.events({
     
    'click [id=StakeSubmit]': (event, template) => {
      event.preventDefault();
  
      // Only continue if button isn't disabled
      if (!$('input[type=submit]').hasClass('disabled')) {
        let body = template.find('[data-id=body]').value;
        let stake_val = template.find("#stake_val").value;
  
        // If a user is mentioned in the post add span with class to highlight their username
        if(body.indexOf('@') !== -1) {
          for(let x = 0; x < body.length; x++) {
            if(body[x] === '@') {
              let u = body.slice(x + 1, body.indexOf(' ', x));
              let mentionedUser = Meteor.users.findOne({username: u});
  
              // If a valid user
              if(mentionedUser) {
                // Add opening and closing span tags
                body = body.slice(0, x) + '<a href="/users/' + mentionedUser._id + '">' + body.slice(x, body.indexOf(' ', x)) + '</a>' +
                       body.slice(body.indexOf(' ', x));
  
                // Increment by number of characters in opening span tag
                // so the same mention doesn't get evaluated multiple times
                x+= 16;
              }
            }
          }
        }
  
        Coursetro.transfer(MiramarAddress, stake_val,function(error, result){
          if(!error)
              {
                Bert.alert( stake_val+ ' MRM successfully staked!', 'success', 'growl-top-right');
              }
          else
              console.error(error);
        });
  
        Meteor.call('posts.insert', body, stake_val, (error, result) => {
          if (error) {
            Bert.alert(error.reason, 'danger', 'growl-top-right');
          } else {
            Bert.alert('Post successfully submitted', 'success', 'growl-top-right');
            template.find('[data-id=body]').value = '';
            template.find("#stake_val").value = '';
            $('[data-id=body]').css('height', '39px');
            $('input[type=submit]').addClass('disabled');
          }
        });
      }
    },
});