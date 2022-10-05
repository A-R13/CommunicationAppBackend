// YOU SHOULD MODIFY THIS OBJECT BELOW
let data = {
  'users': [],
  'channels': [],
};

/* Use the below structure
Single User =  {
            authUserId: id,
            user_handle: user_handle,
            email: email,
            password: password,
            nameFirst: nameFirst,
            nameLast: nameLast,
        }

Single Channel = {
        channelId: channelID,
        channelName: name,
        isPublic: isPublic,
        ownerMembers: [
          {
            authUserId: user.authUserId,
            User_Handle: user.user_handle,
          },
        ],
        allMembers: [
          {
            authUserId: user.authUserId,
            User_Handle: user.user_handle,
          },
        ],
        messages: [],
      }

*/

// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

// Use get() to access the data
function getData() {
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData) {
  data = newData;
}

export { getData, setData };
