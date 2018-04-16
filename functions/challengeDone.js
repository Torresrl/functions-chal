const admin = require('firebase-admin');

//When user do a challenge this function add it to all followers
exports.handler = (snapshot, context) => {
    console.log("challenge updated");

    const post = snapshot.val();
    const root = snapshot.ref.root;

    console.log(post);

    const currentUser = Object.keys(post)[0];

    //get id from path
    const challengeId = context.params.challengeId;
    const challengesId = context.params.challengesId;

    //find owner and followers from database
    const owner = root.child('/challenges/' + challengesId ).once('value');
    const followers = root.child('/challenges/' + challengesId ).once('value');

    //waint for owner and followers to finishe then execute
    return Promise.all([owner, followers]).then(results => {
        const followers = results[0].val().followers;
        const owner = results[1].val().owner;

        console.log("update one first worked");

        console.log(followers);
        console.log("followers: ");
        console.log("owner:" + owner);

        // Turn the hash of followers to an array of each id as the string
        //problemt er at me ikke får rett verdi fra followersSnapshot

        let fanoutObj = {};
        const followersKeys = Object.keys(followers);

        console.log(followersKeys);
        console.log("followersKeys: ");

        for (var i = 0; i < followersKeys.length; i++) {

            console.log(followersKeys[i]);
            fanoutObj[
            '/Users/' + followersKeys[i] +
            '/myChallenges/' + challengesId +
            '/challenges/' + challengeId +
            '/timeline/'] = post;

        }

        for (var j = 0; j < followersKeys.length; j++) {

            console.log(followersKeys[j]);
            fanoutObj[
            '/Users/' + followersKeys[j] + '/timeline/'] = post;

        }



        //oppdaterer eieren sin timeline
        fanoutObj[
        '/Users/' + owner +
        '/myChallenges/' + challengesId +
        '/challenges/' +challengeId +
        '/timeline/'] = post;

        fanoutObj[ '/Users/' + owner + '/timeline/'] = post;
        fanoutObj[ '/Users/' + owner + '/profile/timeline/'] = post;


        fanoutObj[
        '/Users/' + currentUser +
        '/myChallenges/' + challengesId +
        '/challenges/' +challengeId + '/done'] = true;




    return root.update(fanoutObj)

    });




};





