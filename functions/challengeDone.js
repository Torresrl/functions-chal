const admin = require('firebase-admin');

//When user do a challenge this function add it to all followers
exports.handler = (snapshot, context) => {
    console.log("challenge updated");

    const post = snapshot.val();
    const root = snapshot.ref.root;

    console.log(post);

    const currentUser = post["userId"];
    console.log("current user: " + currentUser);

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
        //const currentUser = Object.keys(post)[0];

        console.log(followers);
        console.log("followers: ");
        console.log("currentUser:" + currentUser);
        console.log("------------------------------------------");
        console.log(post[currentUser]);
        console.log("------------------------------------------");


        // Turn the hash of followers to an array of each id as the string
        //problemt er at me ikke får rett verdi fra followersSnapshot

        let fanoutObj = {};
        const followersKeys = Object.keys(followers);

        console.log(followersKeys);
        console.log("followersKeys: ");

        //finner alle followers
        for (var i = 0; i < followersKeys.length; i++) {

            console.log(followersKeys[i]);
            fanoutObj[
            '/Users/' + followersKeys[i] +
            '/myChallenges/' + challengesId +
            '/challenges/' + challengeId +
            '/timeline/' + currentUser] = post;

        }

        //oppdaterer eieren sin timeline
        fanoutObj[
        '/Users/' + owner +
        '/myChallenges/' + challengesId +
        '/challenges/' + challengeId +
        '/timeline/' + currentUser] = post;

        fanoutObj[
        '/Users/' + currentUser +
        '/myChallenges/' + challengesId +
        '/challenges/' +challengeId + '/done'] = true;



    //må ikke oppdatere men skrive!!!!!!!!! wups
    return root.update(fanoutObj)

    });




};





