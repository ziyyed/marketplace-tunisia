import express from 'express';
import { verifyToken } from './auth.js';

const router = express.Router();

// Mock conversations data
const mockConversations = [
  {
    _id: 'conv1',
    participants: ['user1', 'user2'],
    listing: 'mock1',
    lastMessage: 'message1',
    updatedAt: new Date().toISOString()
  }
];

// Mock messages data
const mockMessages = [
  {
    _id: 'message1',
    conversation: 'conv1',
    sender: 'user2',
    recipient: 'user1',
    content: 'Hi, is this item still available?',
    read: true,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    _id: 'message2',
    conversation: 'conv1',
    sender: 'user1',
    recipient: 'user2',
    content: 'Yes, it is still available!',
    read: false,
    createdAt: new Date().toISOString()
  }
];

// Get conversations for current user
router.get('/conversations', verifyToken, async (req, res) => {
  try {
    // Filter conversations where the user is a participant
    const conversations = mockConversations.filter(
      conv => conv.participants.includes(req.user._id)
    );
    
    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Error fetching conversations' });
  }
});

// Get messages for a conversation
router.get('/:conversationId', verifyToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    // Find conversation
    const conversation = mockConversations.find(conv => conv._id === conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    // Check if user is a participant
    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Get messages for conversation
    const messages = mockMessages.filter(msg => msg.conversation === conversationId);
    
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Send a message
router.post('/:conversationId', verifyToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;
    
    // Validate content
    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }
    
    // Find conversation
    const conversation = mockConversations.find(conv => conv._id === conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    // Check if user is a participant
    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Get other participant
    const recipient = conversation.participants.find(p => p !== req.user._id);
    
    // Create new message
    const newMessage = {
      _id: 'message' + (mockMessages.length + 1),
      conversation: conversationId,
      sender: req.user._id,
      recipient,
      content,
      read: false,
      createdAt: new Date().toISOString()
    };
    
    // Add message to mock data
    mockMessages.push(newMessage);
    
    // Update conversation lastMessage and updatedAt
    conversation.lastMessage = newMessage._id;
    conversation.updatedAt = newMessage.createdAt;
    
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

export default router; 