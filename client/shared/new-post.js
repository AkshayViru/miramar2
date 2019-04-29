Template.newpost.events({
     
    'keyup [data-id=body]': (event, template) => {
        // If body section has text enable the submit button, else disable it
        if (template.find('[data-id=body]').value.toString().trim() !== '') {
          $('input[type=submit]').removeClass('disabled');
        } else {
          $('input[type=submit]').addClass('disabled');
        }
    
        // When shift and enter are pressed, submit form
        if (event.shiftKey && event.keyCode === 13) {
          $('[data-id=insert-post-form]').submit();
        }
      },

    'click [id=StakeSubmit]': (event, template) => {
      event.preventDefault();
  

      // Only continue if button isn't disabled
      if (!$('input[type=submit]').hasClass('disabled')) {4
        let title = template.find("#post-title").value;
        let body = template.find('[data-id=body]').value;
        let stake_val = template.find("#stake_val").value;
        let branch = template.find("#branch").value;
        let ipfshash= "";
        
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
        
        if(buf){
          Meteor.call('photo.insert', buf,(error, result) => {
            if (error) {
              Bert.alert(error.reason, 'danger', 'growl-top-right');
            }
            if(result){
              console.log(result);
              Meteor.call('posts.insert', title, body, stake_val, branch, result, (error, result) => {
                if (error) {
                  Bert.alert(error.reason, 'danger', 'growl-top-right');
                } else {
                  Bert.alert('Post successfully submitted', 'success', 'growl-top-right');
                  $('[data-id=body]').css('height', '39px');
                  $('input[type=submit]').addClass('disabled');
                  //FlowRouter.go('/branches/'+ branch);
                }
              });
            }
          });
        }
        /*var reader = new FileReader();

        reader.onload = function(event){          
           var buffer = new Uint8Array(reader.result) */
         //  Meteor.call('photo.insert', file);
     //   }

        
      }
    },

    'change [id=photo]':(event,template) => {
      event.preventDefault();

      const reader = new FileReader();
      reader.readAsArrayBuffer(event.target.files[0]);
      console.log(reader)
      reader.onloadend = function() {
        //const ipfs = window.IpfsApi('localhost', 5001) // Connect to IPFS
        let Buffer = require('buffer/').Buffer;
        buf = Buffer.from(reader.result);
        /*Meteor.call('photo.insert', buf,(error, result) => {
          if (error) {
            Bert.alert(error.reason, 'danger', 'growl-top-right');
          }
          else{
          }
        });*/
      }
    },

    'click [id=cancel]': (event, template) => {
        FlowRouter.go('/');
    }
});