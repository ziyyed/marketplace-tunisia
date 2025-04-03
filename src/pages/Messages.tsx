import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { messages } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  listingId: string;
  listingTitle: string;
  otherUser: {
    id: string;
    name: string;
    avatar?: string;
  };
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await messages.getConversations();
        setConversations(data);
      } catch (err) {
        setError('Failed to load conversations');
        console.error('Error fetching conversations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return;

      try {
        const data = await messages.getMessages(selectedConversation.id);
        setCurrentMessages(data);
      } catch (err) {
        setError('Failed to load messages');
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversation || !newMessage.trim()) return;

    try {
      await messages.send(selectedConversation.listingId, newMessage);
      setNewMessage('');
      // Refresh messages
      const data = await messages.getMessages(selectedConversation.id);
      setCurrentMessages(data);
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Messages
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Conversations List */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ height: '70vh', overflow: 'auto' }}>
              <List>
                {conversations.length === 0 ? (
                  <ListItem>
                    <ListItemText
                      primary="No conversations yet"
                      secondary="Start by messaging a seller"
                    />
                  </ListItem>
                ) : (
                  conversations.map((conversation) => (
                    <div key={conversation.id}>
                      <ListItem
                        button
                        selected={selectedConversation?.id === conversation.id}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <ListItemAvatar>
                          <Avatar src={conversation.otherUser.avatar}>
                            {conversation.otherUser.name[0]}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={conversation.otherUser.name}
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {conversation.listingTitle}
                              </Typography>
                              <br />
                              {conversation.lastMessage}
                            </>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </div>
                  ))
                )}
              </List>
            </Paper>
          </Grid>

          {/* Messages */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
              {selectedConversation ? (
                <>
                  {/* Messages Header */}
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="h6">
                      {selectedConversation.otherUser.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedConversation.listingTitle}
                    </Typography>
                  </Box>

                  {/* Messages List */}
                  <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                    {currentMessages.map((message) => (
                      <Box
                        key={message.id}
                        sx={{
                          display: 'flex',
                          justifyContent:
                            message.senderId === user?.id ? 'flex-end' : 'flex-start',
                          mb: 2,
                        }}
                      >
                        <Paper
                          sx={{
                            p: 2,
                            backgroundColor:
                              message.senderId === user?.id
                                ? 'primary.main'
                                : 'grey.100',
                            color:
                              message.senderId === user?.id ? 'white' : 'inherit',
                            maxWidth: '70%',
                          }}
                        >
                          <Typography variant="body1">{message.content}</Typography>
                          <Typography
                            variant="caption"
                            display="block"
                            sx={{ mt: 1, opacity: 0.8 }}
                          >
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </Typography>
                        </Paper>
                      </Box>
                    ))}
                  </Box>

                  {/* Message Input */}
                  <Box
                    component="form"
                    onSubmit={handleSendMessage}
                    sx={{
                      p: 2,
                      borderTop: 1,
                      borderColor: 'divider',
                      display: 'flex',
                      gap: 1,
                    }}
                  >
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      endIcon={<SendIcon />}
                      disabled={!newMessage.trim()}
                    >
                      Send
                    </Button>
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography color="text.secondary">
                    Select a conversation to view messages
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
} 