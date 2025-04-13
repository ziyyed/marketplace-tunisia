import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useQuery } from "@tanstack/react-query";
import { searchListings } from "../../services/api";

const SearchBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => searchListings(searchQuery),
    enabled: searchQuery.length >= 2,
  });

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setShowResults(query.length >= 2);
  };

  const handleClear = () => {
    setSearchQuery('');
    setShowResults(false);
  };

  const handleSelectResult = (result) => {
    navigate(`/listing/${result.id}`);
    setShowResults(false);
  };

  return (
    <Box sx={{ position: 'relative', width: isMobile ? '100%' : 300 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search listings..."
        value={searchQuery}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton onClick={handleClear} size="small">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: 'background.paper',
          },
        }}
      />
      {showResults && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            maxHeight: 300,
            overflow: 'auto',
            zIndex: 1000,
          }}
        >
          {isLoading ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography>Loading...</Typography>
            </Box>
          ) : searchResults?.length > 0 ? (
            <List>
              {searchResults.map((result) => (
                <ListItem
                  key={result.id}
                  button
                  onClick={() => handleSelectResult(result)}
                >
                  <ListItemText
                    primary={result.title}
                    secondary={`${result.price} TND - ${result.location}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography>No results found</Typography>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default SearchBar; 