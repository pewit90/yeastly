import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bread } from "../model/bread";
import { cloneAndStoreBread, deleteBread, getBreads } from "../model/store";
import { Page } from "./common/Page";
import { TimersView } from "./TimersView";

function BreadListItem(props: { bread: Bread; onChange: Function }) {
  const navigate = useNavigate();
  return (
    <ListItem
      secondaryAction={
        <>
          <IconButton
            edge="end"
            aria-label="copy"
            onClick={() => {
              cloneAndStoreBread(props.bread);
              props.onChange();
            }}
          >
            <ContentCopyIcon />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => {
              deleteBread(props.bread.uuid);
              props.onChange();
            }}
          >
            <DeleteIcon />
          </IconButton>
        </>
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

function BreadList(props: { breads: Bread[]; onChange: Function }) {
  const items = props.breads.map((el) => (
    <BreadListItem bread={el} key={el.uuid} onChange={() => props.onChange()} />
  ));
  return <List>{items}</List>;
}

export function BreadHistory() {
  const navigate = useNavigate();
  const [breads, setBreadList] = useState(getBreads());
  const breadList = (
    <BreadList
      breads={breads}
      onChange={() => {
        const currentBreads = getBreads();
        setBreadList(currentBreads);
      }}
    />
  );

  return (
    <Page title="History">
      <TimersView />
      {breadList}

      <Fab
        color="secondary"
        aria-label="add"
        sx={{ position: "fixed", bottom: "2rem", right: "2rem" }}
        onClick={() => {
          navigate("/edit");
        }}
      >
        <AddIcon />
      </Fab>
    </Page>
  );
}
