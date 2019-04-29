import { Meteor } from 'meteor/meteor';
import ipfs from '/server/ipfs';

Meteor.methods({
    'photo.insert': function(photo) {
        var buf = Buffer.from(photo);

        ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
           if(err) {
              console.error(err)
               return
            }
            else{
               console.log('ifpsHash', result[0].hash)
                
                return result[0].hash;
            }
         })
    }
})