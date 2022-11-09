import { Avatar, Box, Button, ListItemButton, Typography } from "@mui/material";
import React from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

const UserListItem = ({ user, handleFunction }) => {
    console.log(user)
    return (
        <ListItemButton
            onClick={handleFunction}
            
            sx={[
                {
                '&:hover': {
                    color: "white",
                    backgroundColor: "#38B2AC",
                },
                display: 'flex',
                flexDirection: 'row'
            },
            ]}
            >
            <Avatar alt="Profile Picture" src={user.user.avatar} 
                sx={[{
                    margin: 1,}
                ]}/>
                <Typography>{user.user.last_name} {user.user.first_name}</Typography>
        </ListItemButton>
    );
};

export default UserListItem;