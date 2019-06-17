Template.survey.onCreated(function () {

    this.autorun(() => {
      this.subscribe('allSurvey');
    });
});

Template.survey.helpers({
   survey : function(){
      return Survey.find();
   }
});

Template.survey.events({

    'click [id=submit-btn]': async (event, template) => {
      event.preventDefault();
  
      let userAddress = Meteor.users.findOne({_id: Meteor.userId}).profile.publicKey;

      let ans = template.find("#input-val").value;
      let val = template.find("#submit-btn").value;
      console.log(userAddress)
      
      Coursetro.transfer(userAddress, val,function(error, result){
        if(!error)
            {
              Bert.alert( val+ ' MRM successfully received!', 'success', 'growl-top-right');
            }
        else
            console.error(error);
      });

      Meteor.call('survey.update', self._id , ans, (error, result) => {
         if (error) {
           Bert.alert(error.reason, 'danger', 'growl-top-right');
         } else {
           Bert.alert('Submitted', 'success', 'growl-top-right');
         }
      });
    }
});