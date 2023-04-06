import React, { useState } from 'react';
import './App.css';
import {
  IconButton,
  CircularProgress,
  List,
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
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import FilterListIcon from '@material-ui/icons/FilterList';
import API, { ENDPOINT }  from "./Api/API";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Nav from './components/Navbar/Nav';
import Post from './components/Post/Post';
import { 
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title
} from 'chart.js'
import { Pie } from 'react-chartjs-2';

import data from "./data/cars_model_processed.json"

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    Title
)

const yearList = [
  "All",
  "2000", "2001", "2002", "2003", "2004",
  "2005", "2006", "2007", "2008", "2009",
  "2010", "2011", "2012", "2013", "2014",
  "2015", "2016", "2017", "2018", "2019",
  "2020", "2021", "2022", "2023"
];

const carList = [
  "All",
  "mercedes-benz",
  "lexus",
  "honda",
  "nissan",
  "volkswagen",
  "volvo",
  "mazda",
  "bmw",
  "audi"
];

const modelList = [
  "All", "gl-class",  "rx 350",  "cr-v",  "sentra",  "passat",  "maxima",
  "new beetle",  "rogue",  "civic",  "frontier",  "c-class",  "versa",
  "jetta",  "s80",  "is 250",  "fit",  "r32",  "tribute",  "altima",
  "xterra",  "clk-class",  "ridgeline",  "e-class",  "v50",  "c70",
  "mx-5 miata",  "3 series",  "350z",  "slk-class",  "xc70",  "s8",  "x5",
  "5 series",  "rabbit",  "s-class",  "a5",  "element",  "x3",  "mazdaspeed mazda6",
  "mazda3",  "altima hybrid",  "c30",  "cx-7",  "gs 350",  "q7",  "pathfinder",  "quest",
  "m-class",  "a3",  "ls 460",  "1 series",  "titan",  "pilot",  "gti",  "6 series",  "cx-9",
  "tt",  "mazda5",  "odyssey",  "7 series",  "eos",  "mazda6 gli",  "a4",  "s40",  "a8",  "rs4",
  "a6",  "xc90",  "armada",  "cls-class",  "gs 450h",  "m3",  "is 350",  "is f",  "es 350",
  "r-class",  "sl-class",  "rx 400h",  "x6",  "v70"
]

function App() {
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [speedQ, setSpeedQ] = useState("");
  const [currentSearchInput, setCurrentSearchInput] = useState("");
  const [comments, setComments] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [start, setStart] = useState(0);
  const [maxRowNo, setMaxRowNo] = useState(0);
  const [chart, setChart] = useState({});
  
  const [sortDirection, setSortDirection] = useState("desc");
  const [manufacturerFilter, setManufacturerFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [modelFilter, setModelFilter] = useState("All");

  const [errorBarOpen, setErrorBarOpen] = React.useState(false);
  const [errorText, setErrorText] = React.useState('');
  const [dialogOpen, setDialogOpen] = React.useState(false);

  var model = "";

  // Tokenisation
  const getText = (str) => {
    return `TEXT:${str}`;
  }
  
  const tokenizeSentence = (input) => {
    // Split the input string into an array of words using space as the delimiter
    let words = input.split(" ");
    
    // Create a new array to store the tokens
    let tokens = [];
    
    // Iterate over the words and add them to the tokens array
    for (let i = 0; i < words.length; i++) {
      // Remove any leading or trailing punctuation from the word
      let token = words[i].replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
      
      // Add the token to the array if it's not empty
      if (token !== '') {
        tokens.push(`${getText(token)}`);
      }
    }
    
    // Join the array of tokens with a line break (\n) and return as a single string
    return tokens.join(" \\n ");
  }
  
  // Pie Chat
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Sentiment Overview',
        font: {
          size: 18,
          family: 'Arial',
          weight: 'bold'
        },
        color: 'black'
      }
    }
  };

  // Filter Query
  const createQuery = (baseQuery) => {
    if (sortDirection == "desc") {
      console.log(sortDirection);
      baseQuery = baseQuery + `&sort=VOTES`+`%20`+ `${sortDirection}`
    }
    if (sortDirection == "asc") {
      console.log(sortDirection);
      baseQuery = baseQuery + `&sort=VOTES`+`%20`+ `${sortDirection}`
      console.log("this is the base query for asc:", baseQuery);
    }
    if (manufacturerFilter !== "All") {
      baseQuery += `&fq=MANUFACTURER:${manufacturerFilter}`
    }
    if (yearFilter !== "All") {
      console.log("this is the originial YEAR query for asc:", baseQuery);
      baseQuery += `&fq=YEAR:${yearFilter}`
      console.log("this is the YEAR query for asc:", baseQuery);
    }
    if (modelFilter !== "All") {
      baseQuery += `&fq=MODEL:${modelFilter}`
    }
    return baseQuery
  }

  // Flip Page
  const flipPage = (newStart) => {
    setLoading(true);
    let api = new API();
    api
    .get(createQuery(`${ENDPOINT}/solr/info_retrieval/select?indent=true&q.op=OR&q=${currentSearchInput ? tokenizeSentence(searchInput) : '*'}&rows=${rowsPerPage}&start=${newStart}&stats=true&stats.field=LABEL`))
    .then((data) => {
      setStart(newStart);
      setComments(data.response.docs);
      setSpeedQ(data.responseHeader.QTime);
      setMaxRowNo(data.response.numFound - 1);
      setChart({
        labels: ['positive','negative'],
        datasets:[
            {data: [data.stats.stats_fields.LABEL.sum, data.stats.stats_fields.LABEL.count-data.stats.stats_fields.LABEL.sum],
            backgroundColor: ["#b91d47","#2b5797"]}
        ]
      });
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
    .get(createQuery(`${ENDPOINT}/solr/info_retrieval/select?q=${currentSearchInput ? tokenizeSentence(searchInput) : '*'}&rows=${event.target.value}&start=0&stats=true&stats.field=LABEL`))
    .then((data) => {
      setStart(0);
      setComments(data.response.docs)
      setSpeedQ(data.responseHeader.QTime);
      setMaxRowNo(data.response.numFound - 1);
      setChart({
        labels: ['positive','negative'],
        datasets:[
            {data: [data.stats.stats_fields.LABEL.sum, data.stats.stats_fields.LABEL.count-data.stats.stats_fields.LABEL.sum],
            backgroundColor: ["#b91d47","#2b5797"]}
        ]
      });
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
      .get(createQuery(`${ENDPOINT}/solr/info_retrieval/select?q=${currentSearchInput ? tokenizeSentence(searchInput) : '*'}&rows=${rowsPerPage}&start=0&stats=true&stats.field=LABEL`))
      .then((data) => {
        setStart(0);
        setComments(data.response.docs);
        setSpeedQ(data.responseHeader.QTime);
        setMaxRowNo(data.response.numFound-1);
        setChart({
          labels: ['positive','negative'],
          datasets:[
              {data: [data.stats.stats_fields.LABEL.sum, data.stats.stats_fields.LABEL.count-data.stats.stats_fields.LABEL.sum],
              backgroundColor: ["#b91d47","#2b5797"]}
          ]
        });
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
    .get(createQuery(`${ENDPOINT}/solr/info_retrieval/select?q=${searchInput ? tokenizeSentence(searchInput) : '*'}&rows=${rowsPerPage}&start=0&stats=true&stats.field=LABEL`))
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
      setChart({
        labels: ['positive','negative'],
        datasets:[
            {data: [data.stats.stats_fields.LABEL.sum, data.stats.stats_fields.LABEL.count-data.stats.stats_fields.LABEL.sum],
            backgroundColor: ["#b91d47","#2b5797"]}
        ]
      });
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
            <button type="button" className='searchBtn' onClick={handleSearch}>Search</button>
            <div className='carReviewStyle'>
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
          </div>
        </div>
        {
          !(loading) && (comments.length > 0)&&(
            <div className='resultStyle'>
              <p>About {maxRowNo+1} results ({speedQ} milliseconds)</p>
            </div>
          )
        }
        {
          (loading) ? (
            <div className='loadingStyle'>
                <CircularProgress size={40} />
            </div>
          ) : (
            <List className="transbox">
              {
                comments.map((info_retrieval) =>
                  <Post key={info_retrieval.id} info_retrieval={info_retrieval} handleSearch={handleSearch} />                  
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
              <div className='pageStyle'>
                <h5>Displaying {start+1} to {start+rowsPerPage > maxRowNo ? maxRowNo+1 : start+rowsPerPage} of {maxRowNo+1} comments.</h5>
                <IconButton onClick={() => {flipPage(start-rowsPerPage)}} disabled={start === 0 ? true : false} >
                  <ArrowBackIosIcon />
                </IconButton>
                <IconButton onClick={() => {flipPage(start+rowsPerPage)}} disabled={start+rowsPerPage > maxRowNo ? true : false}>
                  <ArrowForwardIosIcon />
                </IconButton>
              </div>
              <div>
                <div className='PieStyle'> 
                  <Pie 
                    data={chart}
                    options={options}
                    >
                  </Pie>
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
              <FormControlLabel value="desc" control={<Radio />} label="Most Helpful" />
              <FormControlLabel value="asc" control={<Radio />} label="Least Helpful" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogTitle><b>Filter</b></DialogTitle>
        <DialogContent dividers>
          <div />
          <FormControl variant="outlined" className="formControlStyle">
            <FormLabel component="legend">Manufacturer</FormLabel>
              <Select
                value={manufacturerFilter}
                onChange={(event) => {setManufacturerFilter(event.target.value)}}
                label="Manufacturer"
              >
                {
                  Object.keys(data).map((MANUFACTURER) => 
                    <MenuItem value={`${MANUFACTURER}`}>{MANUFACTURER}</MenuItem>
                    //console.log("value", Object.keys(data)),
                    //console.log("values", JSON.stringify(manufacturerFilter)),
                    //console.log("valuesss", Object.keys(data))
                  )
                }
              </Select>
          </FormControl>
          <div />
          <FormControl variant="outlined" className="formControlStyle">
            <FormLabel component="legend">Model</FormLabel>
              <Select
                value={modelFilter}
                onChange={(event) => {setModelFilter(event.target.value)}}
                label="Manufacturer"
              >
                {
                  modelList.map((MODEL) => 
                    <MenuItem value={`${MODEL}`}>{MODEL}</MenuItem>
                  )
                }
              </Select>
          </FormControl>
          <div />
          <FormControl variant="outlined" className="formControlStyle">
            <FormLabel component="legend">Year</FormLabel>
              <Select
                value={yearFilter}
                onChange={(event) => {setYearFilter(event.target.value)}}
                label="Year"
              >
              {
                yearList.map((YEAR) => 
                  <MenuItem value={`${YEAR}`}>{YEAR}</MenuItem>
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