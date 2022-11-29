import { List, ListItemButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import ChatLoading from "./ChatLoading";

const MyChats = () => {
    const [ loggedUser, setLoggedUser ] = useState();

    const { selectedChat, setSelectedChat, user, chats, setChats} = useAuthContext();


    const fetchChats = async () => {
        try {
            const response = await fetch(`api/chat/me`, {
                headers: {
                    'x-auth-token': `${user.token}`
                }
            })

            const json = await response.json()

            setChats(json);
        } catch (error) {
            
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("user")));
        fetchChats();
    }, []);

    return (
        <List>
        { chats ? (
            <Stack 
                sx={{
                    overflow: 'hidden',
                    overflowY: "scroll",
                    mt: 2,
                }}>
                {chats.map((chat) => (
                    <ListItemButton
                        onClick={() => setSelectedChat(chat)}
                        key={chat._id}
                        sx={[
                        {
                        '&:active': {
                            backgroundColor: "#f3f3f3"
                        },
                        display: 'flex',
                        flexDirection: 'row'
                        },]}>
                        <Typography>{user && user.role === 1 ? chat.teacher_name : chat.student_name}</Typography>
                    </ListItemButton>

                ))}
            </Stack>
        ) : ( <ChatLoading/>) }
        </List>
    );
};
export default MyChats;