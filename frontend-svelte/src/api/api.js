import axios from "axios";

// const getThreadById = async (id) => {
//   const response = await axios.get(
//     `http://localhost:3000/thread/getThreadById/${id}`
//   );
//   const event = new CustomEvent("threadInfo", {
//     detail: {
//       text: response.data,
//     },
//   });
//   dispatchEvent(event);
//   return;
// };

const getThreadById = async (id, userId) => {
  const res = await makeRequest({
    method: "GET",
    url: `http://localhost:3000/thread/getThreadById/${id}/${userId}`,
  });
  return res;
};
const getCommentOfUser = async (user) => {
  const res = await makeRequest({
    method: "GET",
    url: `http://localhost:3000/comment/getCommentOfUser/${user}`, // Replace with your API endpoint
  });
  return res;
};
const getThreadsOfUser = async (user) => {
  const res = await makeRequest({
    method: "GET",
    url: `http://localhost:3000/thread/getThreadsOfUser/${user}`, // Replace with your API endpoint
  });
  return res;
};
const getUser = async (user) => {
  if (!user) return;
  const res = await makeRequest({
    method: "GET",
    url: `http://localhost:3000/user/get/${user}`, // Replace with your API endpoint
  });
  return res;
};
const replyToThread = async (value, type, id, user) => {
  console.info({ value, type, id, user });
  const res = await makeRequest({
    method: "POST",
    url: `http://localhost:3000/comment/create/${type}/${id}`,
    data: { userID: user, content: value },
  });

  return res;
};
const getAllThreads = async (userId) => {
  const res = await makeRequest({
    method: "GET",
    url: `http://localhost:3000/thread/getThreads/${userId}`, // Replace with your API endpoint
  });
  return res;
};
const createThread = async (user, value) => {
  const res = await makeRequest({
    method: "POST",
    url: `http://localhost:3000/thread/create/${user}`, // Replace with your API endpoint
    data: { content: value },
  });
  return res;
};
const getReplyToComment = async (commentId,userId) => {
  const res = await makeRequest({
    method: "GET",
    url: `http://localhost:3000/comment/getRepliesOfComment/${commentId}/${userId}`, // Replace with your API endpoint
  });
  return res;
};
const postReplyToComment = async (commentId, reply, userID) => {
  const res = await makeRequest({
    method: "POST",
    url: `http://localhost:3000/comment/reply/${commentId}`, // Replace with your API endpoint
    data: { userID, reply },
  });
  return res;
};
const getAllUsers = async () => {
  const res = await makeRequest({
    method: "GET",
    url: `http://localhost:3000/user/getUsers`, // Replace with your API endpoint
  });
  return res;
};
const createUser = async (name) => {
  const res = await makeRequest({
    method: "POST",
    url: `http://localhost:3000/user/create`, // Replace with your API endpoint
    data: { name },
  });
  return res;
};
const upvoteThread = async (commentId, userID) => {
  const res = await makeRequest({
    method: "POST",
    url: `http://localhost:3000/thread/upvote/${commentId}`, // Replace with your API endpoint
    data: { userID },
  });
  return res;
};
const downvoteThread = async (threadId, userID) => {
  const res = await makeRequest({
    method: "DELETE",
    url: `http://localhost:3000/thread/upvote/${threadId}`, // Replace with your API endpoint
    data: { userID },
  });
  return res;
};
const upvoteComment = async (commentId, userID) => {
  const res = await makeRequest({
    method: "POST",
    url: `http://localhost:3000/comment/upvote/${commentId}`, // Replace with your API endpoint
    data: { userID },
  });
  return res;
};
const downvoteComment = async (commentId, userID) => {
  const res = await makeRequest({
    method: "DELETE",
    url: `http://localhost:3000/comment/upvote/${commentId}`, // Replace with your API endpoint
    data: { userID },
  });
  return res;
};

// Create a global Axios instance with common configurations
const axiosInstance = axios.create({
  baseURL: "https://api.example.com", // Replace with your API endpoint
});

let requestQueue = []; // Queue to store pending requests
let isRequesting = false; // Flag to track if a request is in progress

// Function to make Axios requests
const makeRequest = async (config) => {
  return new Promise(async (resolve, reject) => {
    // Add the request to the queue
    requestQueue.push({ config, resolve, reject });

    // If no request is in progress, start the next one
    if (!isRequesting) {
      isRequesting = true;
      await processQueue();
    }
  });
};

async function processQueue() {
  if (requestQueue.length === 0) {
    // No more pending requests
    isRequesting = false;
    return;
  }
  // Get the first request from the queue
  const { config, resolve, reject } = requestQueue.shift();
  try {
    // Make the Axios request
    const response = await axiosInstance(config);
    resolve(response.data);
  } catch (error) {
    reject(error);
  } finally {
    // Continue processing the queue
    processQueue();
  }
}

export {
  getThreadById,
  getAllThreads,
  getCommentOfUser,
  getThreadsOfUser,
  getUser,
  replyToThread,
  createThread,
  getReplyToComment,
  postReplyToComment,
  getAllUsers,
  createUser,
  upvoteComment,
  downvoteComment,
  upvoteThread,
  downvoteThread,
};
