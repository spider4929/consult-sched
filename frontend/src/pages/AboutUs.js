import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import React from "react";
import Taylar from './Images/Taylar.PNG'
const AboutUs = () => {
    return (
        <Box sx={{
            height: 800,
            display:"flex",
            alignItems:"center",
            justifyContent:"center" 
        }}>
            {/* do a map function here to map every developer */}
            <Card sx={{
                p:3,
                m:3
            }}>
                <CardMedia
                    component="img"
                    alt="Dr. Taylar"
                    height="140"
                    image={Taylar}/>
                <CardContent>
                    <Typography>Dr. Taylar</Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default AboutUs