import AddIcon from "@mui/icons-material/Add";
import {
  Fab,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Bread } from "../model/bread";
import { Page } from "./Page";
import DeleteIcon from "@mui/icons-material/Delete";
import { createAndStoreBread, deleteBread } from "../model/store";

function BreadListItem(props: { bread: Bread }) {
  const navigate = useNavigate();
  return (
    <ListItem
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => {
            deleteBread(props.bread.uuid);
          }}
        >
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemText
        onClick={() => navigate("/" + props.bread.uuid)}
        primary={
          <Typography color={"text.primary"} variant="h6">
            {props.bread.name}{" "}
          </Typography>
        }
        secondary={
          <Typography color={"text.secondary"} variant="subtitle2">
            {props.bread.createdTimestamp.toLocaleDateString()}{" "}
          </Typography>
        }
      />
    </ListItem>
  );
}

function BreadList(props: { breads: Bread[] }) {
  const items = props.breads.map((el) => (
    <BreadListItem bread={el} key={el.uuid} />
  ));
  return <List>{items}</List>;
}

export function BreadHistory(props: { breads: Bread[] }) {
  const breadList = <BreadList breads={props.breads} />;
  const newBreadButton = (
    <Fab
      color="secondary"
      aria-label="add"
      onClick={() => {
        createAndStoreBread();
      }}
    >
      <AddIcon />
    </Fab>
  );

  return (
    <Page title="History" fabButton={newBreadButton}>
      {breadList}
    </Page>
  );
}
