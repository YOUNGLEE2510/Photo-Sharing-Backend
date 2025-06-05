// Schema Info
const schemaInfo = {
  load_date_time: "Fri Apr 29 2016 01:45:15 GMT-0700 (PDT)",
  __v: 0,
  _id: "57231f1b30e4351f4e9f4bf6",
};

// Users
const im = {
  _id: "57231f1a30e4351f4e9f4bd7",
  first_name: "Peter",
  last_name: "Griffin",
  location: "Austin, Texas",
  description: "Should've stayed in the car.",
  occupation: "Mathematician",
};
const er = {
  _id: "57231f1a30e4351f4e9f4bd8",
  first_name: "Glenn",
  last_name: "Quagmire",
  location: "Ottawa, Canada",
  description: "Lvl 6 rating. Pilot.",
  occupation: "Warrant Officer",
};
const pt = {
  _id: "57231f1a30e4351f4e9f4bd9",
  first_name: "Cleverland",
  last_name: "Brown",
  location: "Cape Town, South Africa",
  description: "Home is behind, the world ahead... ",
  occupation: "Worker",
};
const rk = {
  _id: "57231f1a30e4351f4e9f4bda",
  first_name: "Joe",
  last_name: "Swanson",
  location: "Madrid, Spain",
  description: "Excited to be here!",
  occupation: "Police Officer",
};
const admin = {
  _id: "57231f1a30e4351f4e9f4bdb",
  first_name: "Danh",
  last_name: "Lee",
  location: "Vietnam",
  description: "Admin account",
  occupation: "Administrator",
  login_name: "Danhlee",
  password: "25102004"
};
const users = [im, er, pt, rk, admin];

// Photos (Cập nhật với ảnh mới)
const photo1 = {
  _id: "57231f1a30e4351f4e9f4bde",
  date_time: "2024-03-15 20:00:00",
  file_name: "kenobi1.jpg",
  user_id: im._id,
};
const photo2 = {
  _id: "57231f1a30e4351f4e9f4bdf",
  date_time: "2024-03-15 20:05:03",
  file_name: "kenobi2.jpg",
  user_id: im._id,
};
const photo3 = {
  _id: "57231f1a30e4351f4e9f4be0",
  date_time: "2024-03-15 18:02:00",
  file_name: "kenobi3.jpg",
  user_id: im._id,
};
const photo4 = {
  _id: "57231f1a30e4351f4e9f4be2",
  date_time: "2024-03-15 16:02:49",
  file_name: "kenobi4.jpg",
  user_id: er._id,
};
const photo5 = {
  _id: "57231f1a30e4351f4e9f4be3",
  date_time: "2024-03-15 16:03:00",
  file_name: "ludgate1.jpg",
  user_id: er._id,
};
const photo6 = {
  _id: "57231f1a30e4351f4e9f4be4",
  date_time: "2024-03-15 16:03:30",
  file_name: "malcolm1.jpg",
  user_id: er._id,
};
const photo7 = {
  _id: "57231f1a30e4351f4e9f4be5",
  date_time: "2024-03-15 16:04:00",
  file_name: "malcolm2.jpg",
  user_id: pt._id,
};
const photo8 = {
  _id: "57231f1a30e4351f4e9f4be6",
  date_time: "2024-03-15 16:04:30",
  file_name: "ousters.jpg",
  user_id: pt._id,
};
const photo9 = {
  _id: "57231f1a30e4351f4e9f4be7",
  date_time: "2024-03-15 16:05:00",
  file_name: "ripley1.jpg",
  user_id: pt._id,
};
const photo10 = {
  _id: "57231f1a30e4351f4e9f4be8",
  date_time: "2024-03-15 16:05:30",
  file_name: "ripley2.jpg",
  user_id: rk._id,
};
const photo11 = {
  _id: "57231f1a30e4351f4e9f4be9",
  date_time: "2024-03-15 16:06:00",
  file_name: "took1.jpg",
  user_id: rk._id,
};
const photo12 = {
  _id: "57231f1a30e4351f4e9f4bea",
  date_time: "2024-03-15 16:06:30",
  file_name: "took2.jpg",
  user_id: rk._id,
};
const photos = [
  photo1,
  photo2,
  photo3,
  photo4,
  photo5,
  photo6,
  photo7,
  photo8,
  photo9,
  photo10,
  photo11,
  photo12,
];

// Comments (Cập nhật để khớp với ảnh mới)
const comment1 = {
  _id: "57231f1a30e4351f4e9f4be8",
  date_time: "2024-03-15 10:00:00",
  comment: "This looks epic!",
  user: pt,
  photo_id: photo1._id,
};
const comment2 = {
  _id: "57231f1a30e4351f4e9f4be9",
  date_time: "2024-03-15 11:00:00",
  comment: "Great shot!",
  user: er,
  photo_id: photo2._id,
};
const comment3 = {
  _id: "57231f1a30e4351f4e9f4bea",
  date_time: "2024-03-15 12:00:00",
  comment: "Love the angle!",
  user: pt,
  photo_id: photo3._id,
};
const comment4 = {
  _id: "57231f1a30e4351f4e9f4bec",
  date_time: "2024-03-15 14:00:00",
  comment: "This is amazing!",
  user: im,
  photo_id: photo4._id,
};
const comment5 = {
  _id: "57231f1a30e4351f4e9f4bed",
  date_time: "2024-03-15 14:01:00",
  comment: "Nice capture!",
  user: rk,
  photo_id: photo5._id,
};
const comment6 = {
  _id: "57231f1a30e4351f4e9f4bee",
  date_time: "2024-03-15 14:02:00",
  comment: "So cool!",
  user: im,
  photo_id: photo6._id,
};
const comment7 = {
  _id: "57231f1a30e4351f4e9f4bef",
  date_time: "2024-03-15 14:03:00",
  comment: "Wow, great photo!",
  user: er,
  photo_id: photo7._id,
};
const comment8 = {
  _id: "57231f1a30e4351f4e9f4bf0",
  date_time: "2024-03-15 14:04:00",
  comment: "Love this one!",
  user: pt,
  photo_id: photo8._id,
};
const comment9 = {
  _id: "57231f1a30e4351f4e9f4bf1",
  date_time: "2024-03-15 14:05:00",
  comment: "Fantastic!",
  user: rk,
  photo_id: photo9._id,
};
const comment10 = {
  _id: "57231f1a30e4351f4e9f4bf2",
  date_time: "2024-03-15 14:06:00",
  comment: "Really impressive!",
  user: im,
  photo_id: photo10._id,
};
const comment11 = {
  _id: "57231f1a30e4351f4e9f4bf3",
  date_time: "2024-03-15 14:07:00",
  comment: "Nice work!",
  user: er,
  photo_id: photo11._id,
};
const comment12 = {
  _id: "57231f1a30e4351f4e9f4bf4",
  date_time: "2024-03-15 14:08:00",
  comment: "Looks awesome!",
  user: pt,
  photo_id: photo12._id,
};
const comments = [
  comment1,
  comment2,
  comment3,
  comment4,
  comment5,
  comment6,
  comment7,
  comment8,
  comment9,
  comment10,
  comment11,
  comment12,
];

// Gắn comment vào photo tương ứng
comments.forEach((comment) => {
  const photo = photos.find((p) => p._id === comment.photo_id);
  if (photo) {
    if (!photo.comments) {
      photo.comments = [];
    }
    photo.comments.push(comment);
  }
});

// Các hàm model
const userListModel = () => users;
const userModel = (userId) => users.find((user) => user._id === userId) || null;
const photoOfUserModel = (userId) =>
  photos.filter((photo) => photo.user_id === userId);
const schemaModel = () => schemaInfo;

// Export theo CommonJS
module.exports = {
  userListModel,
  userModel,
  photoOfUserModel,
  schemaInfo: schemaModel,
};

const loginModel = (login_name, password) => {
  return users.find((user) => user.login_name === login_name && user.password === password) || null;
};

module.exports = {
  userListModel,
  userModel,
  photoOfUserModel,
  schemaInfo: schemaModel,
  loginModel // Thêm dòng này
};