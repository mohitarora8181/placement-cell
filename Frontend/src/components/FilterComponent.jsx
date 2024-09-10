import React, { useState } from 'react';
import { Box, TextField, Button, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const StyledFilterBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  alignItems: 'center',
  justifyContent: 'center'
}));

const FilterComponent = ({ onFilterChange, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    degree: '',
    cgpa: '',
    nationality: ''
  });

  const handleSearch = () => {
    onSearch(searchQuery, filters);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <StyledFilterBox>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label="Degree"
        variant="outlined"
        value={filters.degree}
        onChange={(e) => updateFilter('degree', e.target.value)}
        size="small"
      />
      <TextField
        label="CGPA"
        variant="outlined"
        type="number"
        value={filters.cgpa}
        onChange={(e) => updateFilter('cgpa', e.target.value)}
        size="small"
      />
      <TextField
        label="Nationality"
        variant="outlined"
        value={filters.nationality}
        onChange={(e) => updateFilter('nationality', e.target.value)}
        size="small"
      />
    </StyledFilterBox>
  );
};

export default FilterComponent;
