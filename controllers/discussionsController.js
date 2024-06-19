// controllers/discussionsController.js
"use strict";

const Discussion = require("../models/Discussion"), // 사용자 모델 요청
  getDiscussionParams = (body, user) => {
    return {
      title: body.title,
      description: body.description,
      author: user,
      category: body.category,
      tags: body.tags,
    };
  };

module.exports = {
  /**
   * =====================================================================
   * C: CREATE / 생성
   * =====================================================================
   */
  // 1. new: 액션,
  // 2. create: 액션,
  // 3. redirectView: 액션,
  new: (req, res) => {
    res.render("discussions/new", {
      page: "new-discussions",
      title: "New discussions",
    });
  },

  create: (req, res, next) => {
    let discussionParams = {
      name: {
        first: req.body.first,
        last: req.body.last,
      },
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      profileImg: req.body.profileImg,
    };
    Discussion.create(discussionParams)
      .then((discussions) => {
        res.locals.redirect = "/discussions";
        res.locals. discussions = discussions;
        next();
      })
      .catch((error) => {
        console.log(`Error saving Discussions : ${error.message}`);
        next(error);
      });
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },


  /**
   * =====================================================================
   * R: READ / 조회
   * =====================================================================
   */
  /**
   * ------------------------------------
   * ALL records / 모든 레코드
   * ------------------------------------
   */
  // 4. index: 액션,
  // 5. indexView: 엑션,
  index: (req, res, next) => {
    Discussion.find()
      .then((discussions) => {
        res.locals.discussions = discussions;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching discussions: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    if (req.query.format === "json") {
      res.json(res.locals.users);
    } else {
      res.render("discussions/index", {
        page: "discussions",
        title: "All discussions",
      });
    }
  },


  /**
   * ------------------------------------
   * SINGLE record / 단일 레코드
   * ------------------------------------
   */
  // 6. show: 액션,
  // 7. showView: 액션,
  show: (req, res, next) => {
    let discussionParams = req.params.id;
    Discussion.findById(discussionId)
      .then((discussion) => {
        res.locals.discussion = discussion; 
        next();
      })
      .catch((error) => {
        console.log(`Error fetching Discussions by ID: ${error.message}`);
        next(error); 
      });
  },
  showView: (req, res) => {
    res.render("discussions/show", {
      page: "discussions-details",
      title: "discussions Details",
    });
  },



  /**
   * =====================================================================
   * U: UPDATE / 수정
   * =====================================================================
   */
  // 8. edit: 액션,
  // 9. update: 액션,
  edit: (req, res, next) => {
    let discussionParams = req.params.id;
    Discussion.findById(discussionId) 
      .then((discussion) => {
        res.render("discussions/edit", {
          discussion: discussion,
        }); 
      })
      .catch((error) => {
        console.log(`Error fetching Discussion by ID: ${error.message}`);
        next(error);
      });
  },

  update: (req, res, next) => {
    let discussionParams = req.params.id;
    discussionParams = {
        name: {
          first: req.body.first,
          last: req.body.last,
        },
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        profileImg: req.body.profileImg,
      }; 

    Discussion.findByIdAndUpdate(discussionId, {
      $set: discussionParams,
    })
      .then((discussion) => {
        res.locals.redirect = `/discussions/${discussionId}`;
        res.locals.discussion = discussion;
        next(); 
      })
      .catch((error) => {
        console.log(`Error updating Discussion by ID: ${error.message}`);
        next(error);
      });
  },

  /**
   * =====================================================================
   * D: DELETE / 삭제
   * =====================================================================
   */
  // 10. delete: 액션,
  delete: (req, res, next) => {
    let discussionParams = req.params.id;
    Discussion.findByIdAndRemove(discussionId)
      .then(() => {
        res.locals.redirect = "/discussions";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting discussion by ID: ${error.message}`);
        next();
      });
  },
};
