const users = [];

//Join user to chat
const userJoin = (id, username, room) => {
  const user = { id, username, room };

  users.push(user);

  return user;
};

//Get current user
const getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

const userActions = Object.freeze({
  userJoin,
  getCurrentUser,
});

export default userActions;
