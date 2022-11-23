import { Stack, Box, Paper, Card, CardContent, CardMedia, Typography } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";

import Taylar from '../static/images/Taylar.PNG'
import Baturiano from '../static/images/Baturiano.jpg'
import Julongbayan from '../static/images/Julongbayan.jpg'
import Nazareno from '../static/images/Nazareno.jpg'
import Dones from '../static/images/Dones.jpg'

const AboutUs = () => {

    const theme = useTheme()
    const cardWidth = '18%'
    const imageHeight = '140'

    return (
        <Box sx={{
            display: "flex",
            padding: `${theme.spacing(5)}`,
        }}>
            <Paper sx={{
                padding: `${theme.spacing(5)}`,
                mr:  `${theme.spacing(2)}`,
                width: '30%'
            }}>
                <Stack spacing={2} >
                    <Typography variant="h5" sx={{
                        mb: `${theme.spacing(1)}`
                    }}>About this page</Typography>
                    <Typography>
                    The project is a web application with two main systems: a scheduling system and a chat system. The scheduling system is where the student can create a consultation schedule by choosing among a list of instructors. Once the student has chosen his or her instructor, a list of schedules will be shown to the student, as set by the instructor. Once the schedule is set, it will show up in both the student and instructor’s calendar screen.  
                    </Typography>
                    <Typography>
                    The chat system is present to facilitate communication between the instructor and the user without having to go outside the platform. This will allow the student to communicate to the instructor outside of the designated consultation schedule while keeping it in a platform that does not have to compromise their public accounts in platforms such as Facebook. This is also where the student will be notified, alongside their email, whenever updates or cancellations of their chosen schedule occurred.
                    </Typography>
                </Stack>

            </Paper>

            <Paper sx={{
                padding: `${theme.spacing(5)}`,
                width: '70%'
            }}>
                <Typography variant="h5" sx={{
                    mb: `${theme.spacing(2)}`
                }}>The developers</Typography>

                <Stack spacing={2}>

                    <Box sx={{
                        display: 'flex',
                        justifyContent:"center" 
                    }}>
                        <Card 
                            align='center'
                            sx={{
                            width: cardWidth
                        }}>
                            <CardMedia
                                component='img'
                                alt='advisor-image'
                                height={imageHeight}
                                image={Taylar}
                            />
                            <CardContent>
                                <Typography variant="h6" align='center'>Advisor</Typography>
                                <Typography align='center'>Dr. Jonathan Taylar</Typography>
                            </CardContent>
                        </Card>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        justifyContent:"center" 
                    }}>

                        <Card sx={{
                            width: cardWidth,
                            marginRight: `${theme.spacing(2)}`
                        }}>
                            <CardMedia
                                component='img'
                                alt='advisor-image'
                                height={imageHeight}
                                image={Baturiano}
                            />
                            <CardContent>
                                <Typography variant="h6" align='center'>Group Leader</Typography>
                                <Typography align='center'>Kristian John Q. Baturiano</Typography>
                            </CardContent>
                        </Card>

                        <Card sx={{
                            width: cardWidth,
                            marginRight: `${theme.spacing(2)}`
                        }}>
                            <CardMedia
                                component='img'
                                alt='advisor-image'
                                height={imageHeight}
                                image={Dones}
                            />
                            <CardContent>
                                <Typography variant="h6" align='center'>Member</Typography>
                                <Typography align='center'>Mickel Trystan Dones</Typography>
                            </CardContent>
                        </Card>

                        <Card sx={{
                            width: cardWidth,
                            marginRight: `${theme.spacing(2)}`
                        }}>
                            <CardMedia
                                component='img'
                                alt='advisor-image'
                                height={imageHeight}
                                image={Taylar}
                            />
                            <CardContent>
                                <Typography variant="h6" align='center'>Member</Typography>
                                <Typography align='center'>Moriancumer E. Liad</Typography>
                            </CardContent>
                        </Card>

                        <Card sx={{
                            width: cardWidth,
                            marginRight: `${theme.spacing(2)}`
                        }}>
                            <CardMedia
                                component='img'
                                alt='advisor-image'
                                height={imageHeight}
                                image={Julongbayan}
                            />
                            <CardContent>
                                <Typography variant="h6" align='center'>Member</Typography>
                                <Typography align='center'>Dan Angelo A. Julongbayan</Typography>
                            </CardContent>
                        </Card>

                        <Card sx={{
                            width: cardWidth
                        }}>
                            <CardMedia
                                component='img'
                                alt='advisor-image'
                                height={imageHeight}
                                image={Nazareno}
                            />
                            <CardContent>
                                <Typography variant="h6" align='center'>Member</Typography>
                                <Typography align='center'>Franklin T. Nazareno Jr.</Typography>
                            </CardContent>
                        </Card>

                    </Box>
                    
                </Stack>
                    
                    

            </Paper>

        </Box>
    );
};

export default AboutUs