var express = require("express");
var router = express.Router({
  mergeParams: true
});
var campGround = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// ====================
// COMMENTS ROUTES
// ====================

router.get("/new", isLoggedIn, function (req, res) {
  // find campground by id
  campGround.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {
        campground: campground
      });
    }
  })
});

router.post("/", isLoggedIn, function (req, res) {
  //lookup campground using ID
  campGround.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log("err");
      res.redirect("/campground");
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log("err");
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          console.log(comment);
          res.redirect('/campground/' + campground._id);
        }
      });
    }
  });
  //create new comment
  //connect new comment to campground
  //redirect campground show page
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campground/" + req.params.id);
    }
  });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
  //findByIdAndRemove
  Comment.findByIdAndRemove(req.params.comment_id, function (err) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campground/" + req.params.id);
    }
  });
});

module.exports = router;