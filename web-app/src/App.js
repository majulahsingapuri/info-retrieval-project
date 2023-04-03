import React, { useState, useEffect } from 'react';
import './App.css';
import {
  TextField,
  IconButton,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
  Snackbar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Fab
} from '@material-ui/core';
import {Autocomplete} from '@autocomplete/material-ui';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import FilterListIcon from '@material-ui/icons/FilterList';
import API, { ENDPOINT }  from "./components/API";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Nav from './components/Navbar/Nav';

const carList = [
  "All",
  "toyota",
  "bmw",
  "mini",
];

function App() {
  const [suggestions, setSuggestions] = useState([])
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [speedQ, setSpeedQ] = useState("");
  const [currentSearchInput, setCurrentSearchInput] = useState("");
  const [comments, setComments] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [start, setStart] = useState(0);
  const [maxRowNo, setMaxRowNo] = useState(0);
  
  const [sortDirection, setSortDirection] = useState("desc");
  const [manufacturerFilter, setManufacturerFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");

  const [errorBarOpen, setErrorBarOpen] = React.useState(false);
  const [errorText, setErrorText] = React.useState('');

  const [dialogOpen, setDialogOpen] = React.useState(false);

  // Filter Query
  const createQuery = (baseQuery) => {
    if (sortDirection !== "desc") {
      baseQuery += `&sort=${sortDirection}`
    }
    if (manufacturerFilter !== "All") {
      baseQuery += `&fq=manufacturer:"${manufacturerFilter}"`
    }
    if (yearFilter !== "All") {
      baseQuery += `&fq=year:${yearFilter}`
    }
    return baseQuery
  }

  // Flip Page
  const handleChangeStart = (newStart) => {
    setLoading(true);
    let api = new API();
    api
    .get(createQuery(`${ENDPOINT}/solr/info_retrieval/select?indent=true&q.op=OR&q=${currentSearchInput ? currentSearchInput : '*:*'}&rows=${rowsPerPage}&start=${newStart}`))
    .then((data) => {
      setStart(newStart);
      setComments(data.response.docs)
      setSpeedQ(data.responseHeader.QTime);
      setMaxRowNo(data.response.numFound - 1)
      setLoading(false);
    })
    .catch((error) => {
      setError("Something went wrong 1")
      setLoading(false);
    })
  }

  const changeRowsPage = (event) => {
    var previousRowsPerPage = rowsPerPage
    setRowsPerPage(event.target.value)
    setLoading(true);
    let api = new API();
    api
    .get(createQuery(`${ENDPOINT}/solr/info_retrieval/select?q=${currentSearchInput ? currentSearchInput : '*:*'}&rows=${event.target.value}&start=0`))
    .then((data) => {
      setStart(0);
      setComments(data.response.docs)
      setSpeedQ(data.responseHeader.QTime);
      setMaxRowNo(data.response.numFound - 1);
      setLoading(false);
    })
    .catch((error) => {
      setError("Something went wrong 2")
      setRowsPerPage(previousRowsPerPage);
      setLoading(false);
    })
  }

  const handleClose = () => {
    setDialogOpen(false);
    if (comments.length > 0) {
      setLoading(true);
      let api = new API();
      api
      .get(createQuery(`${ENDPOINT}/solr/info_retrieval/select?q=${currentSearchInput ? currentSearchInput : '*:*'}&rows=${rowsPerPage}&start=0`))
      .then((data) => {
        setStart(0);
        setComments(data.response.docs);
        setSpeedQ(data.responseHeader.QTime);
        setMaxRowNo(data.response.numFound-1);
        setLoading(false);
      })
      .catch((error) => {
        setError("Something went wrong 3");
        setLoading(false);
      })
    }
  }

  const handleSearch = () => {
    setLoading(true);
    let api = new API();
    api
    .get(createQuery(`${ENDPOINT}/solr/info_retrieval/select?q=${searchInput ? searchInput : '*:*'}&rows=${rowsPerPage}&start=0`))
    .then((data) => {
      setStart(0);
      setCurrentSearchInput(searchInput);
      // get query speed
      setSpeedQ(data.responseHeader.QTime);
      // get all json data
      setComments(data.response.docs);
      // get total result found
      setMaxRowNo(data.response.numFound-1)
      setLoading(false);
      
    })
    .catch((error) => {
      setError("Something went wrong 4");
      setLoading(false);
    })
  }

  const setError = (text) => {
    setErrorText(text);
    setErrorBarOpen(true);
  }

  const closeError = () => {
    setErrorBarOpen(false);
  }

  /*
  const handleSearchInputChange = (e, newValue) => {
    setSearchInput(e.target.value);
    if (e.target.value === "") {
      setSuggestions([]);
    } 
    else {
      setAutocompleteLoading(true);
      let api = new API();
      api
      .get(`${ENDPOINT}/solr/info_retrieval/suggest?q=${e.target.value}&rows=10`)
      .then((data) => {
        setAutocompleteLoading(false);
        setSuggestions(data.suggest.mySuggester[`${e.target.value}`].suggestions)
      })
      .catch((error) => {
        setAutocompleteLoading(false);
        setSuggestions([]);
      })
    }
  }
  */

  return (
    <div className="App">
      <div className="gradient__bg">
        <Nav />
      </div>
      <div className="Body">
        <div className='searchBarStyle' />
          <div className='searchBarStyle_container'>
            <input type="search" placeholder="Input your search"
              value={searchInput}
              onChange={(event, newValue) => {
                setSearchInput(newValue);
              }}/>
            <IconButton onClick={handleSearch}><SearchIcon /></IconButton>
          </div>
        <div className='carReviewStyle'>
          <h1>Car Review</h1>
          <h5>Search Query Speed : {speedQ}</h5>
          <div className='carReviewStyle_container'>
            <FormControl variant="outlined" className="formControlStyle">
              <InputLabel>Rows</InputLabel>
              <Select
                value={rowsPerPage}
                onChange={changeRowsPage}
                label="Rows"
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>15</MenuItem>
                <MenuItem value={20}>20</MenuItem>
              </Select>
            </FormControl>
            <IconButton onClick={() => {setDialogOpen(true)}}>
              <FilterListIcon />
            </IconButton>
          </div>
        </div>
        {
          (loading) ? (
            <div className='loadingStyle'>
                <CircularProgress size={40} />
            </div>
          ) : (
            <List className="root">
              {
                comments.map((info_retrieval) =>
                  <ListItem key={info_retrieval.id} alignItems="flex-start">
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <div className='contentStyle'>
                            <Typography
                              component="span"
                              variant="body1"
                              className="inline"
                              color="textPrimary"
                            >
                            </Typography>
                            <b>{info_retrieval.year}</b>
                          </div>
                            <table>
                              <tr><th>Text</th><td>{info_retrieval.TEXT}</td></tr>
                              <tr><th>Favorite</th><td>{info_retrieval.FAVORITE}</td></tr>
                              <tr><th>Manufacturer</th><td>{info_retrieval.manufacturer}</td></tr>
                              <tr><th>Model</th><td>{info_retrieval.model}</td></tr>
                            </table>
                        </React.Fragment>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            className="inline"
                            color="textPrimary"
                          >
                            Comment by {info_retrieval.AUTHOR} on {new Date(info_retrieval.DATE).toLocaleDateString()}
                          </Typography>
                          <div />
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                )
              }
            </List>   
          )
        }
        {
          !(loading) && (
            <Divider variant="middle" />
          )
        }
        {
          !(loading) && (comments.length > 0) && (
            <div>
              <h5>Displaying {start+1} to {start+rowsPerPage > maxRowNo ? maxRowNo+1 : start+rowsPerPage} of {maxRowNo+1} comments.</h5>
              <div>
                <IconButton onClick={() => {handleChangeStart(start-rowsPerPage)}} disabled={start === 0 ? true : false} >
                  <ArrowBackIosIcon />
                </IconButton>
                <IconButton onClick={() => {handleChangeStart(start+rowsPerPage)}} disabled={start+rowsPerPage > maxRowNo ? true : false}>
                  <ArrowForwardIosIcon />
                </IconButton>
              </div>
            </div>
          )
        }
      </div>
      <div style={{marginTop: "10px"}}/>
      <Snackbar 
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={errorBarOpen}
      autoHideDuration={6000}
      onClose={closeError}
      message={errorText}
      action={
        <React.Fragment>
          <IconButton size="small" aria-label="close" color="inherit" onClick={closeError}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
      />
      <Dialog onClose={handleClose} open={dialogOpen}>
        <DialogTitle><b>Sort</b></DialogTitle>
        <DialogContent dividers>
          <div />
          <FormControl component="fieldset" className="formControlStyle">
            <FormLabel component="legend">Direction</FormLabel>
            <RadioGroup value={sortDirection} onChange={(event) => {setSortDirection(event.target.value)}}>
              <FormControlLabel value="desc" control={<Radio />} label="Descending" />
              <FormControlLabel value="asc" control={<Radio />} label="Ascending" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogTitle><b>Filter</b></DialogTitle>
        <DialogContent dividers>
          <div />
          <FormControl component="fieldset" className="formControlStyle">
            <FormLabel component="legend">Year</FormLabel>
            <RadioGroup value={yearFilter} onChange={(event) => {setYearFilter(event.target.value)}}>
              <FormControlLabel value="All" control={<Radio />} label="All" />
              <FormControlLabel value="2007" control={<Radio />} label="2007" />
              <FormControlLabel value="2008" control={<Radio />} label="2008" />
              <FormControlLabel value="2009" control={<Radio />} label="2009" />
            </RadioGroup>
          </FormControl>
          <div />
          <FormControl variant="outlined" className="formControlStyle">
            <FormLabel component="legend">Manufacturer</FormLabel>
              <Select
                value={manufacturerFilter}
                onChange={(event) => {setManufacturerFilter(event.target.value)}}
                label="Manufacturer"
              >
                {
                  carList.map((manufacturer) => 
                    <MenuItem value={`${manufacturer}`}>{manufacturer}</MenuItem>
                  )
                }
              </Select>
          </FormControl>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;

/*
        <Autocomplete
          style={{width: "100%"}}
          freeSolo
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          disableClearable
          value={searchInput}
          onChange={(event, newValue) => {
            setSearchInput(newValue);
          }}
          options={suggestions.map((suggestion) => suggestion.term)}
          loading={autocompleteLoading}
          renderInput={(params) => (
            <TextField
              style={{margin: "10px"}}
              {...params}
              label="Search"
              margin="normal"
              variant="outlined"
              value={searchInput}
              onChange={handleSearchInputChange}
              InputProps={{ 
                ...params.InputProps, 
                type: 'search',
                endAdornment: (
                  <React.Fragment>
                    {autocompleteLoading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
          />
*/