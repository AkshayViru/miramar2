/*import { Meteor } from 'meteor/meteor';
import ipfs from '/server/ipfs';

Meteor.methods({
    'post.insert': function(content, user) {
        const data = JSON.stringify({
            body: content,
            author: user
          })        
        var buf = Buffer.from(data);
        ipfs.files.add(buf, (error, result) => {
            if(error) {
                console.error(error)
                return
            }
            else{
                console.log('ifpsHash', result)
                return result;
            }
        })
    }
});*/