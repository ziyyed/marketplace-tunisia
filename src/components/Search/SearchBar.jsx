import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  Autocomplete,
  TextField,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Vehicles',
    'Property',
    'Jobs',
    'Services',
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: 600 }}>
      <Paper
        component="form"
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
        onSubmit={handleSearch}
      >
        <Autocomplete
          freeSolo
          options={categories}
          sx={{ width: 150, mx: 1 }}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              placeholder="Category"
              variant="standard"
              InputProps={{
                ...params.InputProps,
                disableUnderline: true,
              }}
            />
          )}
        />
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search for anything..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <IconButton type="submit" sx={{ p: '10px' }}>
          <SearchIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default SearchBar; 