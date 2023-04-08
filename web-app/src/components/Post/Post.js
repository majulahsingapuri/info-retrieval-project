import React, { useState } from 'react';
import './Post.css';
import {
    ListItem,
    ListItemText,
    Typography
  } from '@material-ui/core';
import API, { ENDPOINT }  from "../../Api/API";

const Post = ({info_retrieval, handleSearch}) => {
    const [post, setPost] = useState(info_retrieval);

    const updateVote = (num) => {
        const updateVotingsData = {
            "DATE": [info_retrieval.DATE],
            "AUTHOR":[info_retrieval.AUTHOR],
            "TEXT":[info_retrieval.TEXT],
            "YEAR":[info_retrieval.YEAR],
            "MANUFACTURER":[info_retrieval.MANUFACTURER],
            "MODEL":[info_retrieval.MODEL],
            "LABEL":[info_retrieval.LABEL],
            "VOTES":[parseInt(info_retrieval.VOTES)+num],
            "id": info_retrieval.id
        }

        let api = new API();
        api
        .post(`${ENDPOINT}/solr/info_retrieval/update/json/docs?commitWithin=1000&overwrite=true`, updateVotingsData)
        .then((data) => {
            console.log("data: ", data);
            setPost(updateVotingsData);
            console.log("hello", updateVotingsData);
            handleSearch();
        });
    }

    // Print label in words
    const displayWord = (getLabel) =>{
        if(getLabel == 1){
            return "Postive"
        }
        if(getLabel == 0){
            return "Negative"
        }
    }

    return (
        <div class="card">
            <div class="container">
                <ListItem key={info_retrieval.id} className='listStyle'>
                    <ListItemText className='listItemStyle'
                        primary={
                            <React.Fragment>
                                <table>
                                    <tr><th>Year</th><td>{info_retrieval.YEAR}</td></tr>
                                    <tr><th>Comment</th><td>{info_retrieval.TEXT}</td></tr>
                                    <tr><th>Manufacturer</th><td>{info_retrieval.MANUFACTURER}</td></tr>
                                    <tr><th>Model</th><td>{info_retrieval.MODEL}</td></tr>
                                    <tr><th>Label</th><td>{displayWord(info_retrieval.LABEL)}</td></tr>
                                    <tr><th>Votes</th><td>{info_retrieval.VOTES}</td></tr>
                                </table>
                            </React.Fragment>
                        }
                        secondary={
                            <React.Fragment>
                                <Typography component="span" variant="body2" className="inline-left" color="textPrimary">
                                    Comment by {info_retrieval.AUTHOR} on {new Date(info_retrieval.DATE).toLocaleDateString()}
                                </Typography>
                                <p>
                                    <button className='usefulnessStyle1' label="Button" onClick={() => updateVote(1)}>Useful</button>
                                    <span className='usefulnessSpan'>
                                        <button className='usefulnessStyle2' label="Button" onClick={() => updateVote(-1)}>Not Useful</button>
                                    </span>
                                </p>
                            </React.Fragment>
                        }
                    />
                </ListItem>
            </div>
        </div>
    )
}

export default Post;