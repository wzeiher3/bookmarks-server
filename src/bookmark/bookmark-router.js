const express = require('express')

const bookmarksRouter = express.Router()
const bodyParser = express.json()
const { v4: uuid } = require('uuid')
const logger = require('../logger')
const { bookmarks } = require('../store')



bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    // move implementation logic into here
    const { title, content, rating } = req.body;

  if (!title) {
    logger.error(`Title is required`);
    return res
      .status(400)
      .send('Invalid data');
  }
  
  if (!content) {
    logger.error(`Content is required`);
    return res
      .status(400)
      .send('Invalid data');
  }
  const id = uuid();

  const bookmark = {
    id,
    title,
    content,
    rating
  };
  
  bookmarks.push(bookmark);

  logger.info(`bookmark with id ${id} created`);

res
  .status(201)
  .location(`http://localhost:8000/bookmarks/${id}`)
  .json(bookmark);
  })

bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
       const { id } = req.params;
       const bookmark = bookmarks.find(c => c.id == id);
    
       // make sure we found a bookmark
       if (!bookmark) {
         logger.error(`Bookmark with id ${id} not found.`);
         return res
           .status(404)
           .send('Bookmark Not Found');
       }
    
       res.json(bookmark); 
  })
  .delete((req, res) => {
       const { id } = req.params;

   const bookmarkIndex = bookmarks.findIndex(c => c.id === id);

   if (bookmarkIndex === -1) {
     logger.error(`Bookmark with id ${id} not found.`);
     return res
      .status(404)
       .send('Not found');
   }

   //remove bookmark from bookmarks
   //assume bookmarkIds are not duplicated in the bookmarkIds array
  //  bookmarks.forEach(bookmark => {
  //    const bookmarkIds = bookmark.bookmarkIds.filter(cid => cid !== id);
  //    bookmark.bookmarkIds = bookmarkIds;
  //  });

   bookmarks.splice(bookmarkIndex, 1);

   logger.info(`Bookmark with id ${id} deleted.`);

   res
     .status(204)
     .end();
  })

module.exports = bookmarksRouter