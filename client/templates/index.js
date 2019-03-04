
Template.index.events({
  'click #LoginButtonMM': function(e) {
    e.preventDefault();

    var illegalChars = /\W/;

    var textbox = $("[data-id=username]").val();
    console.log(textbox);
    if(textbox.length < 3){
        Bert.alert("Username must have a minimum of 3 characters");
    }
    else if (illegalChars.test(textbox)) {
        Bert.alert("Username can contain only characters, numbers, and underscore");
    }
    else{
      let user_address = web3.eth.defaultAccount;  
      UserCrt.getUsernameByAddress('0x25E8f77c46aeB120F31EB09ef119724C2B80a703',function(error, result){
        if(!error)
            {
              var str = web3.toAscii(result);
              console.log(str);
            }
        else
            console.error(error);
      });
     /* UserCrt.createUser(textbox, "none",function(error, result){
        if(!error)
            {
              console.log("added");
            }
        else
            console.error(error);
      });*/
  
      Meteor.call('user.generateNewLoginAttempt', user_address, textbox, function(err, nonce) {
        // nonce = the nonce generated on server
        console.log('nonce: ' + nonce);
        // hash nonce
        let sh3_nonce = web3.sha3(nonce); // depending on web3 version use: web3.utils.sha3(nonce)
        console.log('sh3 hashed nonce: ' + sh3_nonce);
  
        // sign hashed nonce
        web3.eth.sign(user_address, sh3_nonce, function(err, res) {
          if (err) {
            console.log(err);
          } else {
            // res = the signed nonce
            // login with signed nonce
            login(res);
          }
        });
  
      });
    }
  },
  'keyup [data-id=username]': (event, template) => {
    // If body section has text enable the submit button, else disable it
    if (template.find('[data-id=username]').value.toString().trim() !== '') {
      $("#LoginButtonMM").prop('disabled', false);
    } else {
      $("#LoginButtonMM").prop('disabled', true);
    }
  
    // When shift and enter are pressed, submit form
    if (event.shiftKey && event.keyCode === 13) {
      $('[data-id=login-form]').submit();
    }
  },
});

Template.index.onRendered(() => {

  // Set submit button to disabled since text field is emp
  $("#LoginButtonMM").prop('disabled', true);
});

function login(signed_nonce) {
  let user_address = web3.eth.defaultAccount;

  Meteor.call('user.login', user_address, signed_nonce, function(err, res) {
    if (err) {
      console.log(err);
    } else {
      //Meteor.loginWithToken(stampedLoginToken.token);
      Meteor.loginWithToken(res.token);
      $('#loginModal').modal('hide');
    }
  });
}
