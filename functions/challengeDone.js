const admin = require('firebase-admin');
const challengeFollowers = require('./fanouts/challengeFollowers');

//When user do a challenge this function add it to all followers
exports.handler = (snapshot, context) => {
    console.log("er ny version");
    const post = snapshot.val();
    const root = snapshot.ref.root;


    const currentUser = post["userId"];

    //get id from path
    const challengeId = context.params.challengeId;
    const challengesId = context.params.challengesId;

    //find owner and followers from database
    const owner = root.child('/challenges/' + challengesId ).once('value'); //creater of chalenges
    const followers = root.child('/challenges/' + challengesId ).once('value');

    //waint for owner and followers to finishe then execute
    return Promise.all([owner, followers]).then(results => {
        const followers = results[0].val().followers;
        const owner = results[1].val().owner;

        let fanoutObj = challengeFollowers(
            followers,
            challengesId,
            challengeId,
            currentUser,
            owner,
            post
        );

    return root.update(fanoutObj)
    });
};





