import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  InputBase,
  IconButton,
  MenuItem,
  Select,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const categories = [
  'All Categories',
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Vehicles',
  'Sports',
  'Books',
  'Other',
];

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All Categories');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchQuery) queryParams.append('search', searchQuery);
    if (category !== 'All Categories') queryParams.append('category', category);
    navigate(`/search?${queryParams.toString()}`);
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSearch}
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: 800,
        mx: 'auto',
      }}
    >
      <Select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        sx={{
          width: 200,
          '& .MuiSelect-select': {
            py: 1,
          },
        }}
      >
        {categories.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </Select>
      <Box sx={{ width: 1, mx: 1 }}>
        <InputBase
          placeholder="Search for items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: '100%' }}
        />
      </Box>
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
} 