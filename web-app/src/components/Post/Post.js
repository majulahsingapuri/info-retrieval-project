import React, { useState } from 'react';
import './Post.css';
import {
    ListItem,
    ListItemText,
    Typography
} from '@material-ui/core';
import API, { ENDPOINT } from "../../Api/API";

const Post = ({ info_retrieval, handleSearch }) => {
    const [post, setPost] = useState(info_retrieval);

    const updateVote = (num) => {
        const updateVotingsData = {
            "DATE": [info_retrieval.DATE],
            "AUTHOR": [info_retrieval.AUTHOR],
            "TEXT": [info_retrieval.TEXT],
            "YEAR": [info_retrieval.YEAR],
            "MANUFACTURER": [info_retrieval.MANUFACTURER],
            "MODEL": [info_retrieval.MODEL],
            "LABEL": [info_retrieval.LABEL],
            "VOTES": [parseInt(info_retrieval.VOTES) + num],
            "id": info_retrieval.id
        }

        let api = new API();
        api
            .post(`${ENDPOINT}/solr/info_retrieval/update/json/docs?commitWithin=1000&overwrite=true`, updateVotingsData)
            .then((data) => {
                setPost(updateVotingsData);
                handleSearch();
            });
    }

    // Print label in words
    const displayWord = (getLabel) => {
        if (parseInt(getLabel) === 1) {
            return "Postive"
        }
        if (parseInt(getLabel) === 0) {
            return "Negative"
        }
    }

    return (
        <div class="card">
            <div class="container">
                <ListItem key={post.id} className='listStyle'>
                    <ListItemText className='listItemStyle'
                        primary={
                            <React.Fragment>
                                <table>
                                    <tr><th>Year</th><td>{post.YEAR}</td></tr>
                                    <tr><th>Comment</th><td>{post.TEXT}</td></tr>
                                    <tr><th>Manufacturer</th><td>{post.MANUFACTURER}</td></tr>
                                    <tr><th>Model</th><td>{post.MODEL}</td></tr>
                                    <tr><th>Label</th><td>{displayWord(post.LABEL)}</td></tr>
                                    <tr><th>Votes</th><td>{post.VOTES}</td></tr>
                                </table>
                            </React.Fragment>
                        }
                        secondary={
                            <React.Fragment>
                                <Typography component="span" variant="body2" className="inline-left" color="textPrimary">
                                    Comment by {post.AUTHOR} on {new Date(post.DATE).toLocaleDateString()}
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