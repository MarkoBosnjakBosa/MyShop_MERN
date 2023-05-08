import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCategories } from "../../api/api";
import constants from "../../utilities/constants";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import "@fortawesome/fontawesome-free/css/all.css";

const LeftNavigation = (props) => {
  const data = props.data;
  const { isLoggedIn, hasPermission } = data;
  const [links, setLinks] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const requestCategories = async () => {
    const categories = await getCategories(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/getCategories`);
    setLinks([{ ...constants.SHOP_DEFAULT_LINK }, ...categories]);
  };

  useEffect(() => {
    if (isLoggedIn && hasPermission) {
      setLinks(constants.NAVIGATION_LINKS);
    } else {
      requestCategories();
    }
  }, [isLoggedIn, hasPermission]);

  const openPage = (page) => {
    if (page !== location.pathname) {
      navigate(page);
    }
  };

  const toggleLeftNavigation = (type, event) => {
    props.onToggleLeftNavigation(type, event);
  };

  return (
    <>
      <Drawer anchor="left" open onClose={(event) => toggleLeftNavigation(false, event)}>
        <Box sx={{ width: "250px" }} role="presentation" onClick={(event) => toggleLeftNavigation(false, event)} onKeyDown={(event) => toggleLeftNavigation(false, event)}>
          <List>
            {links.map((link) => {
              if (link._id) {
                return (
                  <ListItem key={link._id} onClick={() => openPage(link._id === "default" ? "/shop" : `/shop/${link._id}`)} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <i className={link.icon} />
                      </ListItemIcon>
                      <ListItemText primary={link.title} />
                    </ListItemButton>
                  </ListItem>
                );
              } else {
                return (
                  <ListItem key={link.title} onClick={() => openPage(link.page)} disablePadding>
                    <ListItemButton>
                      <ListItemText primary={link.title} />
                    </ListItemButton>
                  </ListItem>
                );
              }
            })}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default LeftNavigation;
