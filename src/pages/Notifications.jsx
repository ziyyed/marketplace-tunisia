import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { format } from 'date-fns';
import { api } from '../services/api';

const Notifications = () => {
  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.users.getNotifications(),
  });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Notifications
        </Typography>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">
          Error loading notifications. Please try again later.
        </Alert>
      ) : notifications?.length === 0 ? (
        <Alert severity="info">
          You don't have any notifications yet.
        </Alert>
      ) : (
        <List>
          {notifications?.map((notification, index) => (
            <React.Fragment key={notification._id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar src={notification.sender?.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={notification.title}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" display="block">
                        {format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < notifications.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Container>
  );
};

export default Notifications; 