module.exports = (followers, challengesId, challengeId, currentUser, owner, post) => {
    console.log("fanout functions is called");

    let fanoutObj = {};
    const followersKeys = Object.keys(followers);

    //finde all followers
    for (var i = 0; i < followersKeys.length; i++) {

        console.log(followersKeys[i]);
        fanoutObj[
        '/Users/' + followersKeys[i] +
        '/myChallenges/' + challengesId +
        '/challenges/' + challengeId +
        '/timeline/' + currentUser + '/votes'] = post;

    }

    //update owners (creater of chalenges) challenge
    fanoutObj[
    '/Users/' + owner +
    '/myChallenges/' + challengesId +
    '/challenges/' + challengeId +
    '/timeline/' + currentUser + '/votes'] = post;


    /*
     når du legger til timline, bare legg sammen challenges + challengID + user
     */

    return fanoutObj
};