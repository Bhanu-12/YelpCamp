var express = require("express");
var router = express.Router({
  mergeParams: true
});
var campGround = require("../models/campground");
var middleware = require("../middleware");
router.get("/", function (req, res) { // etrieving everyting and showing it
  campGround.find({}, function (err, allCampGrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/campground", {
        campgrounds: allCampGrounds
      });
    }
  });
});

router.get("/new", isLoggedIn, function (req, res) {
  res.render("campgrounds/newCamp");
});
router.post("/", isLoggedIn, function (req, res) {
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCampground = {
    name: name,
    image: image,
    description: description,
    author: author
  };

  campGround.create(newCampground, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      //redirect back to campgrounds page
      res.redirect("/campground");
    }
  });
});

router.get("/:id", function (req, res) {
  //find the campground with provided ID
  campGround.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      //render show template with that campground
      res.render("campgrounds/show", {
        campground: foundCampground
      });
    }
  });
});

router.get("/:id", function (req, res) {
  //find the campground with provided ID
  Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      console.log(foundCampground)
      //render show template with that campground
      res.render("campgrounds/show", {
        campground: foundCampground
      });
    }
  });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
  campGround.findById(req.params.id, function (err, foundCampground) {
    res.render("campgrounds/edit", {
      campground: foundCampground
    });
  });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  // find and update the correct campground
  campGround.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      //redirect somewhere(show page)
      res.redirect("/campground/" + req.params.id);
    }
  });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  campGround.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/campground");
    } else {
      res.redirect("/campground");
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

function checkCampgroundOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function (err, foundCampground) {
      if (err) {
        res.redirect("back");
      } else {
        // does user own the campground?
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}

module.exports = router;