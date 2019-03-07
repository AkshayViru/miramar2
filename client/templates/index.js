
Template.index.events({
  'click #LoginButtonMM': function(e) {
    e.preventDefault();

    var illegalChars = /\W/;

    var textbox = $("[data-id=username]").val();

    let user_address = web3.eth.defaultAccount; 

    if(textbox.length < 3){
        Bert.alert("Username must have a minimum of 3 characters");
    }
    else if (illegalChars.test(textbox)) {
        Bert.alert("Username can contain only characters, numbers, and underscore");
    }
    else{

      UserCrt.getUsernameByAddress(user_address ,function(error, result){
        console.log(result);
        if(result !== "0x")
            {           
              UserCrt.getAddressByUsername(textbox,function(error2, result2){
                if(result2 !== "0x"){
                      if(result2 == user_address){
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
      
                              login(res, textbox, nonce);
      
                            }
                          });
                    
                        });
                      }
                      else{
                          Bert.alert("Username and public key don't match1");
                      }
                }
                else{
                  Bert.alert("Username and public key don't match2");
                }
              });

            }
        else{
          UserCrt.usernameTaken(textbox, function(error2, result2){
            if(result2 !== true){
                  UserCrt.createUser(textbox, "none",function(error2, result2){
                    if(!error2)
                        {
                          console.log("added");
                        }
                    else
                        console.error(error2);
                  });

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

                        login(res, textbox, nonce);

                      }
                    });
              
                  });
            }
            else{
              Bert.alert("Username already exists");
            }
          });
        }
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

function login(signed_nonce, username, nonce) {

  UserCrt.getAddressByUsername(username, function(error, result){
    if(!error)
        {
          Meteor.call('user.login', result, signed_nonce, nonce, function(err, res) {
            if (err) {
              console.log(err);
            } else {
              //Meteor.loginWithToken(stampedLoginToken.token);
              Meteor.loginWithToken(res.token);
              console.log(res.token)
              $('#loginModal').modal('hide');
            }
          });
        }
    else
        console.error(error);
  });

}
