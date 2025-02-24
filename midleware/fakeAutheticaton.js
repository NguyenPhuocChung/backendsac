module.exports = (req, res, next) => {
  req.user = { id: "673c554cfee38395acd6620e" }; // userId mặc định
  console.log("Authentication passed");
  next();
};
