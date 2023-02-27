const express = require("express");
const router = express.Router();
const User = require("../models/User");
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
//const User = require("../models/User");
const { body, validationResult } = require("express-validator");
//Route 1 :Get all the notes using GET /api/notes/fetchAllNotes
router.get("/fetchAllNotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

////Route 2 :Add a new note using POST /api/notes/addnote.Login required
router.post(
  "/addnote",
  fetchuser,
  [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be alteast 5 characters').isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //If there are errors return BAD Request and errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note =  new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
//Route 3:update an exisiting note using PUT:/api/notes/updatenote.Login required
router.put('/updatenote/:id',fetchuser,async(req,res)=>{
  const {title,description,tag}=req.body;
  try {
   //Create newNote object
  const newNote={};
  if(title){newNote.title=title};
  if(description){newNote.description=description};
  if(tag){newNote.tag=tag};
  //Find the note to be updated and update it
  let note=await Notes.findById(req.params.id);
  if(!note){
    return res.status(404).send("Not Found");
  }
  if(note.user.toString() !== req.user.id){
    return res.status(401).send("Not allowed");
  }
  note=await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
  res.json({note});
   
} catch (error) {
  console.error(error.message);
  res.status(500).send("Internal Server Error");
}
})
//Route 4:delete an existing note using PUT:/api/notes/deletnote.Login required
router.delete('/deletenote/:id',fetchuser,async(req,res)=>{
  const {title,description,tag}=req.body;
  try {
      //Find the note to be updated and update it
    let note=await Notes.findById(req.params.id);
    if(!note){
      return res.status(404).send("Not Found");
    }
    if(note.user.toString()!==req.user.id){
      return res.status(401).send("Not allowed");
    }
    note=await Notes.findByIdAndDelete(req.params.id);
    res.json({"Success":"Note has been deleted",note:note});

    
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
  }
})
module.exports = router;