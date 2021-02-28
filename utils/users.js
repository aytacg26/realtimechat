const users = [];

//Join user to chat
export function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

//Get current user
export function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

//User Leaves the room :
export function userLeave(userId) {
  const index = users.findIndex((user) => user.id === userId);

  if (index !== -1) {
    const leftUser = users.splice(index, 1);

    return leftUser[0];
  }
}

//Get room users :
export function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}
