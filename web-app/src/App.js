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
import CloseIcon from '@material-ui/icons/Close';
import FilterListIcon from '@material-ui/icons/FilterList';
import API, { ENDPOINT }  from "./components/API";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Nav from './components/Navbar/Nav';
import { 
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js'

import { Pie } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
)

const carList = [
  "All",
  "toyota",
  "bmw",
  "mini",
];

function App() {
  const [suggestSearch, setSuggestSearch] = useState([]);
  const [autoComSearch, setAutoComSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [speedQ, setSpeedQ] = useState("");
  const [currentSearchInput, setCurrentSearchInput] = useState("");
  const [comments, setComments] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [start, setStart] = useState(0);
  const [maxRowNo, setMaxRowNo] = useState(0);
  const [chart, setChart] = useState("");
  const [votes, setVotes] = useState("");
  
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
      baseQuery += `&fq=MANUFACTURER:"${manufacturerFilter}"`
    }
    if (yearFilter !== "All") {
      baseQuery += `&fq=YEAR:${yearFilter}`
    }
    return baseQuery
  }

  // Flip Page
  const flipPage = (newStart) => {
    setLoading(true);
    let api = new API();
    api
    .get(createQuery(`${ENDPOINT}/solr/info_retrieval/select?indent=true&q.op=OR&q=${currentSearchInput ? `TEXT:${currentSearchInput}` : '*:*'}&rows=${rowsPerPage}&start=${newStart}&stats=true&stats.field=LABEL`))
    .then((data) => {
      setStart(newStart);
      setComments(data.response.docs);
      setSpeedQ(data.responseHeader.QTime);
      setMaxRowNo(data.response.numFound - 1);
      setChart(data.stats.stats_fields.LABEL.sum);
      setLoading(false);
    })
    .catch((error) => {
      setError("Something went wrong 1")
      setLoading(false);
    })
  }

  const changeRowsPage = (event) => {
    var preRowPage = rowsPerPage
    setRowsPerPage(event.target.value)
    setLoading(true);
    let api = new API();
    api
    .get(createQuery(`${ENDPOINT}/solr/info_retrieval/select?q=${currentSearchInput ? `TEXT:${currentSearchInput}` : '*:*'}&rows=${event.target.value}&start=0&stats=true&stats.field=LABEL`))
    .then((data) => {
      setStart(0);
      setComments(data.response.docs)
      setSpeedQ(data.responseHeader.QTime);
      setMaxRowNo(data.response.numFound - 1);
      setChart(data.stats.stats_fields.LABEL.sum);
      setLoading(false);
    })
    .catch((error) => {
      setError("Error found. Flip page error")
      setRowsPerPage(preRowPage);
      setLoading(false);
    })
  }

  const handleClose = () => {
    setDialogOpen(false);
    if (comments.length > 0) {
      setLoading(true);
      let api = new API();
      api
      .get(createQuery(`${ENDPOINT}/solr/info_retrieval/select?q=${currentSearchInput ? `TEXT:${currentSearchInput}` : '*:*'}&rows=${rowsPerPage}&start=0&stats=true&stats.field=LABEL`))
      .then((data) => {
        setStart(0);
        setComments(data.response.docs);
        setSpeedQ(data.responseHeader.QTime);
        setMaxRowNo(data.response.numFound-1);
        setChart(data.stats.stats_fields.LABEL.sum);
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
    .get(createQuery(`${ENDPOINT}/solr/info_retrieval/select?q=${searchInput ? `TEXT:${searchInput}` : '*:*'}&rows=${rowsPerPage}&start=0&stats=true&stats.field=LABEL`))
    .then((data) => {
      setStart(0);
      setCurrentSearchInput(searchInput);
      // get query speed
      setSpeedQ(data.responseHeader.QTime);
      // get all json data
      setComments(data.response.docs);
      // get total result found
      setMaxRowNo(data.response.numFound-1);
      // get Label sum
      setChart(data.stats.stats_fields.LABEL.sum);
      setLoading(false);
      
    })
    .catch((error) => {
      setError("Error found. Unable to search");
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

  // Suggest
  const handleTokenization = (event) => {
    searchInput(event.target.value);
    let api = new API();
    api
    .get(createQuery(`${ENDPOINT}/solr/info_retrieval/suggest?q=${event.target.value}&rows=10`))
    .then((data) => {
    })
  }

  // Pie Chart
  const data = {
    labels: ['one','two'],
    datasets:[
        {data: [4, 7],
        backgroundColor: ['aqua', 'purple']}
    ]
  }

  // Vote
  const voteCounter = (event) =>{
    console.log("votes:", votes);
    //console.log("id:", id);
    //console.log("vote:", votes);
  }

  return (
    <div className="Head">
      <div className="gradient__bg">
        <Nav />
      </div>
      <div className="Body">
        <div className='searchBarStyle'>
          <div className='searchBarStyle_container'>
            <input type="search" placeholder="Input your search"
              value={searchInput} onChange={(event) => { 
                setSearchInput(event.target.value);
              }}
            />
            <button type="button" onClick={handleSearch}>Search</button>
          </div>
        </div>
        <div className='carReviewStyle'>
          <h1>Car Review</h1>
          <p>Search Query Speed : {speedQ}</p>
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
            <List className="transbox">
              {
                comments.map((info_retrieval) =>
                  <ListItem key={info_retrieval.id} alignItems="flex-start">
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <div className='contentStyle'>
                          </div>
                            <table>
                            <tr><th>Year</th><td>{info_retrieval.id}</td></tr>
                              <tr><th>Year</th><td>{info_retrieval.YEAR}</td></tr>
                              <tr><th>Text</th><td>{info_retrieval.TEXT}</td></tr>
                              <tr><th>Manufacturer</th><td>{info_retrieval.MANUFACTURER}</td></tr>
                              <tr><th>Model</th><td>{info_retrieval.MODEL}</td></tr>
                              <tr><th>Label</th><td>{info_retrieval.LABEL}</td></tr>
                              <tr><th>Votes</th><td>{info_retrieval.VOTES}</td></tr>
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
                          <Fab variant="extended" label="Button" color="primary">
                            <b>Useful</b>
                          </Fab>
                          <span style={{marginLeft: "20px"}}>
                            <Fab variant="extended" label="Button" color="primary">
                              <b>Not Useful</b>
                            </Fab>
                          </span>
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
                <IconButton onClick={() => {flipPage(start-rowsPerPage)}} disabled={start === 0 ? true : false} >
                  <ArrowBackIosIcon />
                </IconButton>
                <IconButton onClick={() => {flipPage(start+rowsPerPage)}} disabled={start+rowsPerPage > maxRowNo ? true : false}>
                  <ArrowForwardIosIcon />
                </IconButton>
              </div>

              <div>
              <div>
                <p>Label sum : {chart}</p>
                <div style = {
                    {
                    padding:'20px',
                    width:"50%"
                    }
                } > 
                <Pie 
                    data={data}
                    >
                    </Pie>
                </div>
              </div>
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
                  carList.map((MANUFACTURER) => 
                    <MenuItem value={`${MANUFACTURER}`}>{MANUFACTURER}</MenuItem>
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