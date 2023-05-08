import { useState, useEffect } from "react";
import { getUserData } from "../../utilities/authentication";
import { getRequestData } from "../../api/api";
import { getImage } from "../../utilities/scripts";
import { validObject } from "../../utilities/validations";
import TotalQuantity from "../cart/TotalQuantity";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ListItemIcon from "@mui/material/ListItemIcon";
import Settings from "@mui/icons-material/Settings";
import SecurityIcon from "@mui/icons-material/Security";
import LockIcon from "@mui/icons-material/Lock";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ReceiptIcon from "@mui/icons-material/Receipt";
import Logout from "@mui/icons-material/Logout";
import Divider from "@mui/material/Divider";
import style from "./Navigation.module.css";

const TopNavigation = (props) => {
  const data = props.data;
  const { isLoggedIn, hasPermission, username } = data;
  const [avatar, setAvatar] = useState(props.avatar || {});
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);

  useEffect(() => {
    const loadData = async () => {
      const avatar = await loader();
      if (validObject(avatar)) {
        setAvatar(avatar);
      }
    };
    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

  const openPage = (page) => {
    props.onOpenPage(page);
  };

  const toggleLeftNavigation = (event, type) => {
    props.onToggleLeftNavigation(event, type);
  };

  const logout = () => {
    props.onLogout();
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }} style={{ minWidth: "500px", display: "flex", justifyContent: "right", height: "42px", backgroundColor: "#f2f2f2" }}>
        <Typography sx={{ minWidth: "100px" }} className={style.link} onClick={(event) => toggleLeftNavigation(true, event)}>{hasPermission ? "Settings" : "Shop"}</Typography>
        <Typography sx={{ minWidth: "100px" }} className={style.link} onClick={() => openPage("/home")}>Home</Typography>
        {!hasPermission && (<Typography sx={{ minWidth: "100px" }} className={style.link} onClick={() => openPage("/contact")}>Contact</Typography>)}
        {!isLoggedIn && (<Typography sx={{ minWidth: "100px" }} className={style.link} onClick={() => openPage("/registration")}>Registration</Typography>)}
        {!isLoggedIn && (<Typography sx={{ minWidth: "100px" }} className={style.link} onClick={() => openPage("/login")}>Login</Typography>)}
        {(isLoggedIn && !hasPermission) && (
          <IconButton onClick={() => openPage("/cart")}>
            <ShoppingCartIcon sx={{ width: "32px", height: "32px" }} />
            <TotalQuantity />
          </IconButton>
        )}
        {isLoggedIn && (
          <Tooltip title={`Settings for ${username}`}>
            <IconButton aria-controls={open ? "menu" : undefined} aria-haspopup="true" aria-expanded={open ? "true" : undefined} onClick={(event) => setAnchor(event.currentTarget)}>
              {validObject(avatar) ? (
                <Box src={getImage(avatar)} alt={avatar.name} component="img" className={style.image} />
              ) : (
                <PersonIcon sx={{ width: "32px", height: "32px" }} />
              )}
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Menu anchorEl={anchor} id="menu" open={open} onClose={() => setAnchor(null)} onClick={() => setAnchor(null)}
        PaperProps={{
          elevation: 0,
          sx: { 
            overflow: "visible", filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))", mt: 1.5, "& .MuiAvatar-root": { width: "32px", height: "32px", ml: -0.5, mr: 1 }, 
            "&:before": { content: "''", display: "block", position: "absolute", top: "0px", right: "14px", width: "10px", height: "10px", bgcolor: "background.paper", transform: "translateY(-50%) rotate(45deg)", zIndex: 0 }
          }
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }} anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => openPage("/profile")}><ListItemIcon><Settings fontSize="small" /></ListItemIcon>Profile</MenuItem>
        <MenuItem onClick={() => openPage("/setup")}><ListItemIcon><SecurityIcon fontSize="small" /></ListItemIcon>Setup</MenuItem>
        <MenuItem onClick={() => openPage("/reset/password")}><ListItemIcon><LockIcon fontSize="small" /></ListItemIcon>Reset password</MenuItem>
        <MenuItem onClick={() => openPage("/avatar")}><ListItemIcon><AccountCircleIcon fontSize="small" /></ListItemIcon>Avatar</MenuItem>
        {!hasPermission && (<MenuItem onClick={() => openPage("/user/orders")}><ListItemIcon><ReceiptIcon fontSize="small" /></ListItemIcon>Orders</MenuItem>)}
        <Divider />
        <MenuItem onClick={logout}><ListItemIcon><Logout fontSize="small" /></ListItemIcon>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default TopNavigation;

const loader = async () => {
  const { token, userId } = getUserData();
  return await getRequestData({ url: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_SERVER_PORT}/getAvatar/${userId}`, headers: { Authentication: `Bearer ${token}` } });
};
