const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.readPost = (req, res) => {
  PostModel.find()
    .then((docs) => {
      res.send(docs);
    }).sort({ createdAt: -1 })
    .catch((err) => {
      console.log("Error to get data : " + err);
    });
};


module.exports.createPost = async (req, res) => {
  console.log(req.body); // Log the body of the request
  try {
    const newPost = new PostModel({
      posterId: req.body.posterId,
      message: req.body.message,
      video: req.body.video,
      likers: [],
      comments: [],
    });

    const post = await newPost.save();
    return res.status(201).json(post);
  } catch (err) {
    console.log(err); // Log any errors
    return res.status(400).send(err);
  }
};



module.exports.updatePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  const updatedRecord = {
    message: req.body.message,
  };

  try {
    let docs = await PostModel.findByIdAndUpdate(
      req.params.id,
      { $set: updatedRecord },
      { new: true }
    );
    if (!docs) {
      return res.status(404).send();
    }
    res.send(docs);
  } catch (err) {
    console.log("Update error : " + err);
    res.status(500).send(err);
  }
};


module.exports.deletePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  PostModel.findByIdAndDelete(req.params.id)
    .then((doc) => {
      if (!doc) {
        return res.status(404).end();
      }
      return res.status(204).end();
    })
    .catch((err) => {
      console.error("Delete error : " + err);
      return res.status(500).end();
    });
};

module.exports.commentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    let docs = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true }
    );
    if (!docs) {
      return res.status(404).send();
    }
    res.send(docs);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};




module.exports.editCommentPost = (req, res) => {
  // if (!ObjectID.isValid(req.params.id))
  //return res.status(400).send("ID unknown : " + req.params.id);
  // try {
  // return PostModel.findById(
  //    req.params.id,
  //   (err, docs) => {
  //    const theComment = docs.comments.find((comment) => {
  //      comment._id.equals(req.body.commentId);
}; //);

 // }
//}

//module.exports.deleteCommentPost = (req, res) => {
 // if (!ObjectID.isValid(req.params.id))
 // return res.status(400).send("ID unknown : " + req.params.id);
//}
 

  


module.exports.deleteCommentPost = (req, res) => {
}