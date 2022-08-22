import { AppBar, Box, Container, IconButton, Paper, Stack, Toolbar, Typography } from "@mui/material";
import { Bread } from "../model/bread";
import MenuIcon from '@mui/icons-material/Menu';


function BreadListItem(props: { bread: Bread }) {
    return <Paper>
        <Typography>
            {props.bread.name}
        </Typography>
    </Paper>
}

function BreadList(props: { breads: Bread[] }) {
    const items = props.breads.map(el => BreadListItem({ bread: el as Bread }));
    return <Stack>
        {items}
    </Stack>
}

export function BreadHistory(props: { breads: Bread[] }) {
    return <Container maxWidth={'sm'}>
        <Box sx={{ height:'100%' }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => alert('not implemented')}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" align='left' sx={{ flexGrow: 1 }}>
                        {"History"}
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
        <BreadList breads={props.breads}/>
    </Container>
}