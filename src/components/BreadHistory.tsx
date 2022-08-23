import { AppBar, Box, Container, IconButton, List, ListItem, ListItemText, Toolbar, Typography } from "@mui/material";
import { Bread } from "../model/bread";
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from "react-router-dom";


function BreadListItem(props: { bread: Bread }) {
    const navigate = useNavigate();
    return (
        <ListItem onClick={() => navigate('/' + props.bread.uuid)}>
            <ListItemText
                primary={props.bread.name}
                secondary={props.bread.createdTimestamp.toLocaleDateString()} />
        </ListItem>
    )
}

function BreadList(props: { breads: Bread[] }) {
    const items = props.breads.map(el => <BreadListItem bread={el} key={el.uuid} />);
    return <List>{items}</List>
}

export function BreadHistory(props: { breads: Bread[] }) {
    return <Container maxWidth={'sm'}>
        <Box sx={{ height: '100%' }}>
            <AppBar position="static">
                <Toolbar>
                    {/* <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => alert('not implemented')}
                    >
                        <MenuIcon />
                    </IconButton> */}
                    <Typography variant="h6" component="div" align='left' sx={{ flexGrow: 1 }}>
                        {"History"}
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
        <BreadList breads={props.breads} />
    </Container>
}