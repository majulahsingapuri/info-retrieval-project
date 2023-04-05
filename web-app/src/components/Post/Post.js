import React, { useState } from 'react';
import './Post.css';
import {
    ListItem,
    ListItemText,
    Typography,
    Fab
  } from '@material-ui/core';
import API, { ENDPOINT }  from "../../Api/API";

const Post = ({info_retrieval}) => {
    const [votes, setVotes] = useState("");

    const updateVotingsData = {
        "DATE": [info_retrieval.DATE],
        "AUTHOR":[info_retrieval.AUTHOR],
        "TEXT":[info_retrieval.TEXT],
        "YEAR":[info_retrieval.YEAR],
        "MANUFACTURER":[info_retrieval.MANUFACTURER],
        "MODEL":[info_retrieval.MODEL],
        "LABEL":[info_retrieval.LABEL],
        "VOTES":[info_retrieval.votes+1],
        "id": info_retrieval.id
    }
    
    const updateVote = (e) => {
        let api = new API();
        api
        .get(`${ENDPOINT}/solr/info_retrieval/update?q=${e.target.value}&start=0`)
        .then((data) => {
            setVotes(data.responseHeader);
        });
    }

    return (
        <div class="card">
            <div class="container">
            <ListItem key={info_retrieval.id} className='listStyle'>
            <ListItemText className='listItemStyle'
                primary={
                    <React.Fragment>
                        <div className='contentStyle'>
                        </div>
                        <table>
                            <tr><th>Id</th><td>{info_retrieval.id}</td></tr>
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
                        <Typography component="span" variant="body2" className="inline" color="textPrimary">
                            Comment by {info_retrieval.AUTHOR} on {new Date(info_retrieval.DATE).toLocaleDateString()}
                        </Typography>
                        <p>
                            <button className='usefulnessStyle1' label="Button">Useful</button>
                            <span className='usefulnessSpan'>
                                <button className='usefulnessStyle2' label="Button">Not Useful</button>
                            </span>
                        </p>
                        <div />
                    </React.Fragment>
                }
            />
        </ListItem>
            </div>
        </div>
    )
}

export default Post;