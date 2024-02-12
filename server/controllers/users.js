import User from "../models/User.js";

// READ
export const getUser = async (req, res) => {
  try {
    // getting user id from params
    const { id } = req.params;

    // finding user by id
    const user = await User.findById(id);

    // sending user data to client
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    // getting user id from params
    const { id } = req.params;

    // finding user by id
    const user = await User.findById(id);

    // getting friends from user
    const friends = await Promise.all(
      user.friends.map((friendId) => User.findById(friendId)),
    );

    // formatting friends data
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      },
    );

    // sending friends data to client
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// UPDATE
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;

    const user = await User.findById(id);

    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      // removing friend from user's friends
      user.friends = user.friends.filter((id) => id !== friendId);

      // removing user from friend's friends
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      // adding friend to user's friends
      user.friends.push(friendId);

      // adding user to friend's friends
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    // getting friends from user
    const friends = await Promise.all(
      user.friends.map((friendId) => User.findById(friendId)),
    );

    // formatting friends data
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      },
    );

    res.status(200).json(formattedFriends); 
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
