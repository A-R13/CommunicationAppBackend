function channelMessagesV1 ( authUserId, channelId, start ){
    return {
        messages: [
            {
              messageId: 1,
              uId: 1,
              message: 'Hello world',
              timeSent: 1582426789,
            }
          ],
          start: 0,
          end: 50,
    }

}
function channelDetailsV1( authUserId, channelId ) {

  let check_uId = 0 
  let count2 = 0
  let count3 = 0

  if (data.users.find(users => users.uid === authUserId)){
    check_uId = true;
}

  for (let i of dataStore.academic) {
    if (academicId === i.academicId) {
      count += 2;
    } else {
      count++;
    }
  }

  if (dataStore.course.length != 0) {
    for (let j of dataStore.course) {
      if (courseId === j.courseId) {
        for (let i = 0; i < dataStore.course[j.courseId-1].allMembers.length; i++) {
          if (academicId === dataStore.course[j.courseId-1].allMembers[i].academicId) {
            count3 = 1;
          }
        }
      } 
    }
  }

  for (let j of dataStore.academic) {
    if (courseId === j.academicId) {
      count2 += 2;
    } else {
      count2++;
    }
  }

  if (count === dataStore.academic.length || count2 === dataStore.academic.length || count3 === 0) {
    return {error: "error"};
  } else {
    return {
      course: dataStore.course[courseId - 1],
    };
  }

    return {
        name: 'Hayden',
        ownerMembers: [
          {
            uId: 1,
            email: 'example@gmail.com',
            nameFirst: 'Hayden',
            nameLast: 'Jacobs',
            handleStr: 'haydenjacobs',
          }
        ],
        allMembers: [
          {
            uId: 1,
            email: 'example@gmail.com',
            nameFirst: 'Hayden',
            nameLast: 'Jacobs',
            handleStr: 'haydenjacobs',
          }
        ],
      }

}



function channelJoinV1 ( authUserId, channelId ) {
    return {
        
    }
}


function channelInviteV1( authUserId, channelId ) {

    return {

    }
}
