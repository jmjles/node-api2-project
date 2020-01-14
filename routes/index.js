const Express = require("express");
const Route = Express.Router();
const db = require("../data/db");

Route.get("/", async (req, res) => {
  try {
      res.status(200).json(await db.find())
  } catch {
      throw new Error(res.status(500).json({ error: "The posts information could not be retrieved." }))
  }
});

Route.post("/", async  (req, res) => {
  try {const newPost = {
          title: req.body.title,
          contents:req.body.contents
      }
      if(!newPost.title || !newPost.contents) throw new Error(res.status(400).json({ errorMessage: "Please provide title and contents for the post." }))
      
      await db.insert(newPost)
      res.status(201).json(await db.find())
  } catch {
      throw new Error(res.status(500).json({ error: "There was an error while saving the post to the database" }))
  }
});

Route.get("/:id", async (req, res) => {
  try {
      const post = await db.findById(req.params.id)
      if(!post.length) throw new Error(res.status(404).json({ message: "The post with the specified ID does not exist." }))
      res.status(200).json(post)
  } catch {
    throw new Error(res.status(500).json({ error: "The post could not be retrieved." }))
  }
});
Route.get("/:id/comments", async (req, res) => {
  try {
    const post = await db.findById(req.params.id)
    if(!post.length) throw new Error(res.status(404).json({ message: "The post with the specified ID does not exist." }))
  res.status(200).json(await db.findPostComments(req.params.id))
} catch {
    throw new Error(res.status(500).json({ error: "The comments information could not be retrieved." }))
}
});

Route.post("/:id/comments", async(req, res) => {
  try {
    const post = await db.findById(req.params.id)
    if(!post.length) throw new Error(res.status(404).json({ message: "The post with the specified ID does not exist." }))
    
    const data = {
        text: req.body.text,
        post_id: req.params.id
    }
    if(!data.text) throw new Error(res.status(400).json({ errorMessage: "Please provide text for the comment." }))
    res.status(201).json(await db.insertComment(data))
} catch {
    throw new Error(res.status(500).json({ error: "There was an error while creating the comment" }))
}
});

Route.delete("/:id", async (req, res) => {
    try {
        const post = await db.findById(req.params.id)
        if(!post.length) throw new Error(res.status(404).json({ message: "The post with the specified ID does not exist." }))
        res.status(202).json(await db.remove(req.params.id))
    } catch {
        throw new Error(res.status(500).json({ error: "There was an error while deleting the post" }))
    }
  });

  Route.put("/:id", async (req, res) => {
    try {
        const post = await db.findById(req.params.id)
        if(!post.length) throw new Error(res.status(404).json({ message: "The post with the specified ID does not exist." }))
        const data = {
            title: req.body.title,
            contents: req.body.contents
        }
        if(!data.title ||!data.contents) throw new Error(res.status(400).json({ errorMessage: "Please provide title and contents for the post." }))
        res.status(200).json(await db.update(req.params.id,data))
    } catch {
        throw new Error(res.status(500).json({ error: "There was an error while editing the post" }))
    }
  });
module.exports = Route;
