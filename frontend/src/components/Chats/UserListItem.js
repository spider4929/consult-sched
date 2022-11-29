import { Avatar, ListItemButton, Typography } from "@mui/material";
import React from "react";
//import { useAuthContext } from "../../hooks/useAuthContext";

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
                flexDirection: 'row',
                pr: 7
            },
            ]}
            >
            <Avatar alt="Profile Picture" src={user.user.avatar} 
                sx={[{
                    mt: 1,
                    mb: 1,
                    mr: 2}
                ]}/>
                <Typography>{user.user.last_name} {user.user.first_name}</Typography>
        </ListItemButton>
    );
};

export default UserListItem;