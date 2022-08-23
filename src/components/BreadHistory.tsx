import AddIcon from '@mui/icons-material/Add';
import { Fab, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Bread } from "../model/bread";
import { Page } from "./Page";


function BreadListItem(props: { bread: Bread }) {
    const navigate = useNavigate();
    return (
        <ListItem onClick={() => navigate('/' + props.bread.uuid)}>
            <ListItemText
                primary={<Typography color={'text.primary'} variant='h6'>{props.bread.name} </Typography>}
                secondary={<Typography color={'text.secondary'} variant='subtitle2'>{props.bread.createdTimestamp.toLocaleDateString()} </Typography> } />
        </ListItem>
    )
}

function BreadList(props: { breads: Bread[] }) {
    const items = props.breads.map(el => <BreadListItem bread={el} key={el.uuid} />);
    return <List>{items}</List>
}

export function BreadHistory(props: { breads: Bread[] }) {

    const breadList = <BreadList breads={props.breads} />;
    const newBreadButton = <Fab color='secondary' aria-label='add' onClick={() => { alert('TODO: New Bread goes here') }}><AddIcon /></Fab>

    return <Page title="History" fabButton={newBreadButton}>
        {breadList}
    </Page>
}