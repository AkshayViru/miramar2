import { Meteor } from 'meteor/meteor';
import ipfs from '/server/ipfs';

Meteor.methods({
    'photo.insert': async function(photo) {
        var buf = Buffer.from(photo);
         return new Promise(function(resolve, reject){
            ipfs.add(buf)
            .then((response) => {
               resolve(response[0].hash);
            }).catch((err) => {
               console.error(err);
               reject(err);
            });
         });
    } 
})