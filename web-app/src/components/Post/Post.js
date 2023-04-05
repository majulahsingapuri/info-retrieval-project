import React, { useState } from 'react';
import './Post.css';
import {
    ListItem,
    ListItemText,
    Typography,
    Fab
  } from '@material-ui/core';

const Post = ({info_retrieval}) => {
    const [votes, setVotes] = useState("");

    console.log("GetTable: ",info_retrieval);

    return (
        <ListItem key={info_retrieval.id} alignItems="flex-start">
            <ListItemText
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
                        <button variant="extended" label="Button" color="primary">
                            <b>Useful</b>
                        </button>
                        <span style={{marginLeft: "20px"}}>
                            <button variant="extended" label="Button" color="primary">
                                <b>Not Useful</b>
                            </button>
                        </span>
                        <div />
                    </React.Fragment>
                }
            />
        </ListItem>
    )
}

export default Post;