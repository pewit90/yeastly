import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import { ReactElement, ReactNode } from "react";


export function HeaderMenu(props: {
    title: string,
    navigationIcon?: ReactElement,
    children: ReactNode
}) {
    return <Container maxWidth={'sm'}>
        <AppBar >
            <Toolbar>
                {props.navigationIcon}
                <Typography variant="h6" component="div" align='left' sx={{ flexGrow: 1 }}>
                    {props.title}
                </Typography>
            </Toolbar>
        </AppBar>
        <Box >
            <Toolbar />
            {props.children}
        </Box>
    </Container>
}