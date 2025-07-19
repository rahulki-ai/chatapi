const express = require("express");
const Group = require("../models/Group");
const Message = require("../models/Message");
const router = express.Router();

// Create a group
router.post("/groups", async (req, res) => {
  const { name, members, createdBy } = req.body;

  if (!name || !createdBy) {
    return res.status(400).json({ error: "Group name and creator are required" });
  }

  try {
    const group = await Group.create({ name, members, createdBy });
    res.status(201).json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create group" });
  }
});

// Get group details
router.get("/groups/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const group = await Group.findById(id).populate("members");
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch group details" });
  }
});

router.get("/group-members/:groupId", async (req, res) => {
    const { groupId } = req.params;
  
    try {
      const group = await Group.findById(groupId).populate("members", "name email"); // Populate member details
  
      if (!group) {
        return res.status(404).json({ error: "Group not found" });
      }
  
      res.status(200).json({ members: group.members });
    } catch (error) {
      console.error("Error fetching group members:", error);
      res.status(500).json({ error: "Failed to fetch group members" });
    }
  });

router.get("/groups", async (req, res) => {
    try {
      const groups = await Group.find().populate("members", "name"); // Populating members to include their names
      res.status(200).json(groups);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch groups" });
    }
  });
  router.get("/groups/user/:userId", async (req, res) => {
    const { userId } = req.params;
  
    try {
      const groups = await Group.find({ members: userId }).populate("members", "name email");
      if (!groups || groups.length === 0) {
        return res.status(404).json({ error: "No groups found for this user" });
      }
      res.json(groups);
    } catch (error) {
      console.error("Error fetching user groups:", error);
      res.status(500).json({ error: "Failed to fetch user groups" });
    }
  });
  router.delete("/groups/:groupId/clear-chat", async (req, res) => {
    const { groupId } = req.params;
  
    try {
      const deletedMessages = await Message.deleteMany({ group: groupId });
  
      if (deletedMessages.deletedCount === 0) {
        return res.status(404).json({ error: "No messages found for this group." });
      }
  
      res.status(200).json({ message: "Group chat cleared successfully." });
    } catch (error) {
      console.error("Error clearing group chat:", error);
      res.status(500).json({ error: "Failed to clear group chat." });
    }
  });

router.get("/group-messages/:groupId", async (req, res) => {
    const { groupId } = req.params;
  
    try {
      const messages = await Message.find({ group: groupId })
        .populate("sender", "name")
        .sort({ timestamp: 1 }); // Sort messages by timestamp
  
      res.status(200).json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch group messages" });
    }
  });

// Add a member to a group
router.patch("/groups/:id/add-member", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const group = await Group.findByIdAndUpdate(
      id,
      { $addToSet: { members: userId } }, // Prevent duplicates
      { new: true }
    );
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add member" });
  }
});
router.patch("/groups/:id/change-about", async (req, res) => {
    const { id } = req.params; // Group ID
    const { about } = req.body; // New about text
  
    if (!about || about.trim() === "") {
      return res.status(400).json({ error: "Group about section cannot be empty." });
    }
  
    try {
      const group = await Group.findByIdAndUpdate(
        id,
        { about },
        { new: true } // Return the updated document
      );
  
      if (!group) {
        return res.status(404).json({ error: "Group not found." });
      }
  
      res.status(200).json({ message: "Group about updated successfully.", group });
    } catch (error) {
      console.error("Error updating group about:", error);
      res.status(500).json({ error: "Failed to update group about." });
    }
  });
router.delete("/delete-group/:id", async (req, res) => {
    const { id } = req.params; // Group ID
  
    try {
      // Find and delete the group
      const group = await Group.findByIdAndDelete(id);
  
      if (!group) {
        return res.status(404).json({ error: "Group not found" });
      }
  
      // Optionally, delete all messages in the group
      await Message.deleteMany({ group: id });
  
      res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
      console.error("Error deleting group:", error);
      res.status(500).json({ error: "Failed to delete the group" });
    }
  });
  router.patch("/groups/:id/change-name", async (req, res) => {
    const { id } = req.params; // Group ID
    const { name } = req.body; // New group name
  
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Group name cannot be empty." });
    }
  
    try {
      const group = await Group.findByIdAndUpdate(
        id,
        { name },
        { new: true } // Return the updated document
      );
  
      if (!group) {
        return res.status(404).json({ error: "Group not found." });
      }
  
      res.status(200).json({ message: "Group name updated successfully.", group });
    } catch (error) {
      console.error("Error updating group name:", error);
      res.status(500).json({ error: "Failed to update group name." });
    }
  });
// Remove a member from a group
router.patch("/groups/:id/remove-member", async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const group = await Group.findByIdAndUpdate(
      id,
      { $pull: { members: userId } },
      { new: true }
    );
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove member" });
  }
});

module.exports = router;
