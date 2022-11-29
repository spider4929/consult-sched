import { Stack, Box, Paper, Card, CardContent, CardMedia, Typography, Grid, Avatar, Button } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";
import ConfettiExplosion from 'react-confetti-explosion';

import Taylar from '../static/images/Taylar.PNG'
import Baturiano from '../static/images/Baturiano.jpg'
import Julongbayan from '../static/images/Julongbayan.jpg'
import Nazareno from '../static/images/Nazareno.jpg'
import Dones from '../static/images/Dones.jpg'
import Liad from '../static/images/Liad.jpg'

const list = [
        {
        "name": 'Kristian John Q. Baturiano',
        "role": 'Leader',
        "image": Baturiano
         },
         {
        "name": 'Mickel Trystan Dones',
        "role": 'Member',
        "image": Dones
         },
         {
        "name": 'Morian Cumer E. Liad',
        "role": 'Member',
        "image": Liad
        },
        {
        "name": 'Dan Angelo A. Julongbayan',
        "role": 'Member',
        "image": Julongbayan
        },
        {
        "name": 'Franklin T. Nazareno Jr.',
        "role": 'Member',
        "image": Nazareno
        },
]
const AboutUs = () => {

    const [isExploding, setIsExploding] = React.useState(false)

    const theme = useTheme()
    // const cardWidth = '18%'
    const imageHeight = '140'
    let counter = 0

    const handleClick = () => {
        counter += 1
        if(counter % 10 === 0) {
            setIsExploding(true)
        }
        if(counter % 10 !== 0) {
            setIsExploding(false)
        }
    }

    return (
        <Box sx={{
            display: "flex",
            padding: `${theme.spacing(5)}`,
        }}>
            <Grid container>
                <Grid item component={Paper} sx={{
                    padding: `${theme.spacing(5)}`,
                    mb: 3
                }} xs={12} lg={5}>
                <Stack spacing={2} >
                    <Typography variant="h5" sx={{
                        mb: `${theme.spacing(1)}`
                    }}>About this page</Typography>
                    <Typography variant="body">
                    The project is a web application with two main systems: a scheduling system and a chat system. The scheduling system is where the student can create a consultation schedule by choosing among a list of instructors. Once the student has chosen his or her instructor, a list of schedules will be shown to the student, as set by the instructor. Once the schedule is set, it will show up in both the student and instructor’s calendar screen.  
                    </Typography>
                    <Typography variant="body">
                    The chat system is present to facilitate communication between the instructor and the user without having to go outside the platform. This will allow the student to communicate to the instructor outside of the designated consultation schedule while keeping it in a platform that does not have to compromise their public accounts in platforms such as Facebook. This is also where the student will be notified, alongside their email, whenever updates or cancellations of their chosen schedule occurred.
                    </Typography>
                </Stack>

            </Grid>

            <Grid item component={Paper} sx={{
                padding: `${theme.spacing(5)}`,
                width: '50%',
                mb: 3
            }} xs={12} lg={7}>
                <Typography variant="h5" sx={{
                    mb: `${theme.spacing(2)}`
                }}>The developers</Typography>

                <Stack spacing={2}>

                    <Grid container sx={{
                        display: 'flex',
                        justifyContent:"center" 
                    }}>
                        {isExploding && <ConfettiExplosion />}
                        <Box sx={{ display: '1 1 flex', mb: 5}}>
                        <Button onClick={handleClick}>
                            <Avatar variant={"rounded"} alt="advisor-image" src={Taylar} 
                            sx={{
                                width: 200,
                                height: 200,
                                display:{
                                    xs: 'none',
                                    md: 'block'
                                }
                                }}/>
                        </Button>
                            <Box sx={{flexGrow: 1, mt: 4, ml: 2}}>
                                <Typography variant="h4" align="center">Dr Jonathan Taylar</Typography>
                                <Typography variant="h6" align="center">Adviser</Typography>
                            </Box>
                        </Box>
                    <Grid item xs={12}></Grid>
                    {list && list.map((people) => (
                        <Grid item xs={12} md={3}>
                    <Card sx={{ 
                            marginRight: `${theme.spacing(2)}`,
                            mb: 2
                        }}>
                            
                            <CardMedia
                                component='img'
                                alt='${people.name} image'
                                height={imageHeight}
                                image={people.image}
                                sx={{
                                    display: {
                                        xs: 'none',
                                        md: 'block'
                                    }
                                }}
                            />
                            <CardContent>
                                <Typography variant="h6" align='center'>{people.role}</Typography>
                                <Typography align='center'>{people.name}</Typography>
                            </CardContent>
                        </Card>
                        </Grid>))}
                    </Grid>
                </Stack>
            </Grid>
            </Grid>
        </Box>
    );
};

export default AboutUs