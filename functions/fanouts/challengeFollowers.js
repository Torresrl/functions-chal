module.exports = (followers, challengesId, challengeId, currentUser, owner, post) => {
    console.log("fanout functions is called");

    let fanoutObj = {};
    if(followers && followers.length > 0) {
        const followersKeys = Object.keys(followers);

        ///Update followers challenge timeline
        for (var i = 0; i < followersKeys.length; i++) {

            console.log(followersKeys[i]);
            fanoutObj[
            '/Users/' + followersKeys[i] +
            '/myChallenges/' + challengesId +
            '/challenges/' + challengeId +
            '/timeline/' + currentUser] = post;

            //update followers main timeline
            fanoutObj[
            '/Users/' + followersKeys[i] +
            '/timeline/' + challengesId +
            challengeId + currentUser] = post;


        }
    }

    //update owners (creater of chalenges) challenge
    fanoutObj[
    '/Users/' + owner +
    '/myChallenges/' + challengesId +
    '/challenges/' + challengeId +
    '/timeline/' + currentUser] = post;

    fanoutObj[
    '/Users/' + currentUser +
    '/myChallenges/' + challengesId +
    '/challenges/' + challengeId +
    '/done'] = true;

    //update over timeLine
    fanoutObj[
    '/Users/' + owner +
    '/timeline/' + challengesId +
    challengeId + currentUser] = post;


    /*
    når du legger til timline, bare legg sammen challenges + challengID + user
     */

    return fanoutObj
};