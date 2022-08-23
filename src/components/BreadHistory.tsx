import { List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Bread } from "../model/bread";
import { HeaderMenu } from "./HeaderMenu";


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

    const breadList = <BreadList breads={props.breads} />;

    return <HeaderMenu title="History">
        {breadList}
    </HeaderMenu>
}