const admin = require('firebase-admin');
const challengeFollowersLikes = require('./fanouts/challengesFollowersLikes');

exports.handler = (change, context) => {
    const votes = change.after.val();
    const root = change.after.ref.root;



    //get id from path
    const challengeId = context.params.challengeId;
    const challengesId = context.params.challengesId;

    //find owner and followers from database
    const owner = root.child('/challenges/' + challengesId ).once('value'); //creater of chalenges
    const followers = root.child('/challenges/' + challengesId ).once('value');
    const currentUser = change.after.ref.parent.child("userId").once('value');

    return Promise.all([owner, followers, currentUser]).then(results => {
        const followers = results[0].val().followers;
        const owner = results[1].val().owner;
        const currentUser = results[2].val();

        let fanoutObj = challengeFollowersLikes(
            followers,
            challengesId,
            challengeId,
            currentUser,
            owner,
            votes
        );

        return root.update(fanoutObj)
    });

};
