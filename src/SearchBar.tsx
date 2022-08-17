import React, { FC } from "react";
import "./custom.css";
import SearchIcon from "@material-ui/icons/Search";
import MicIcon from '@material-ui/icons/Mic';

export const SearchBar= () => {


    return (
        <div className="search">
            <div className="searchInputs search-Box">
                <div className="searchIcon"><SearchIcon/></div>
                <input type="text" placeholder="search here......" />
                <button  > <div className="micIcon"><MicIcon></MicIcon></div> </button>
                
            </div>
            
        </div>
    )
}