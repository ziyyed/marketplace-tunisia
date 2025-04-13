import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Grid,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { api } from '../services/api';

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');

  const { data: conversations, isLoading, error } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => api.messages.getConversations(),
  });

  const { data: messages, refetch: refetchMessages } = useQuery({
    queryKey: ['messages', selectedConversation],
    queryFn: () => api.messages.getMessages(selectedConversation),
    enabled: !!selectedConversation,
  });

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedConversation) return;

    try {
      await api.messages.sendMessage(selectedConversation, message);
      setMessage('');
      refetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Alert severity="error">Error loading conversations</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Messages
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '70vh', overflow: 'auto' }}>
            <List>
              {conversations?.map((conversation) => (
                <React.Fragment key={conversation._id}>
                  <ListItem
                    button
                    selected={selectedConversation === conversation._id}
                    onClick={() => setSelectedConversation(conversation._id)}
                  >
                    <ListItemAvatar>
                      <Avatar src={conversation.participant.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={conversation.participant.name}
                      secondary={conversation.lastMessage?.content}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {selectedConversation ? (
            <Paper sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6">
                  {conversations?.find(c => c._id === selectedConversation)?.participant.name}
                </Typography>
              </Box>

              <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                {messages?.map((msg) => (
                  <Box
                    key={msg._id}
                    sx={{
                      display: 'flex',
                      justifyContent: msg.sender._id === selectedConversation ? 'flex-start' : 'flex-end',
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: '70%',
                        bgcolor: msg.sender._id === selectedConversation ? 'grey.100' : 'primary.main',
                        color: msg.sender._id === selectedConversation ? 'text.primary' : 'white',
                        p: 2,
                        borderRadius: 2,
                      }}
                    >
                      <Typography>{msg.content}</Typography>
                      <Typography variant="caption" display="block">
                        {format(new Date(msg.createdAt), 'h:mm a')}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <form onSubmit={handleSendMessage}>
                  <Grid container spacing={1}>
                    <Grid item xs>
                      <TextField
                        fullWidth
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        type="submit"
                        variant="contained"
                        endIcon={<SendIcon />}
                        disabled={!message.trim()}
                      >
                        Send
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            </Paper>
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="70vh"
              bgcolor="grey.100"
            >
              <Typography color="text.secondary">
                Select a conversation to start messaging
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Messages; 