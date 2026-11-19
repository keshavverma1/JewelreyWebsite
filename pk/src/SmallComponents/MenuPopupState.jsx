
import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, {
  bindTrigger,
  bindMenu,
} from "material-ui-popup-state";
import { FaRegUser } from "react-icons/fa";
import { Auth } from "../context/AuthContext";
import api from "../api/api";
import toast from 'react-hot-toast';

export default function MenuPopupState() {
  const { user, setUser ,navigate} = React.useContext(Auth);
 

const handleLogout = async () => {
  try {
    const res = await api.post("/api/user/logout");

    if (res.data.success) {
      setUser(null);
      toast.success("Log out Successfully")
      navigate("/Login");
    }
  } catch (error) {
    console.error(
      "Logout failed:",
      error.response?.data?.message
    );
  }
};

  const menuItemStyle = {
    fontSize: "14px",
    padding: "11px 16px",
    color: "#333",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#fbf1dc",
      color: "#8a5200",
    },
  };

  return (
    <PopupState variant="popover" popupId="user-menu">
      {(popupState) => (
        <>
          <Button
            {...bindTrigger(popupState)}
            disableRipple
            sx={{
              minWidth: "40px",
              width: "40px",
              height: "40px",
              padding: 0,
              borderRadius: "50%",
              color: "#8a1c1c",
              backgroundColor: "transparent",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#fbf1dc",
                color: "#8a5200",
                boxShadow: "none",
              },
            }}
          >
            <FaRegUser size={19} />
          </Button>

          <Menu
            {...bindMenu(popupState)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 190,
                borderRadius: "12px",
                border: "1px solid #efe6d2",
                boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
                overflow: "hidden",
              },
            }}
          >
            {user ? (
              <>
                <MenuItem
                  sx={menuItemStyle}
                  onClick={() => {
                    popupState.close();
                    navigate("/Profile");
                  }}
                >
                  My Profile
                </MenuItem>

                <MenuItem
                  sx={menuItemStyle}
                  onClick={() => {
                    popupState.close();
                    navigate("/MyOrders");
                  }}
                >
                  My Orders
                </MenuItem>

                <MenuItem
                  sx={menuItemStyle}
                  onClick={() => {
                    popupState.close();
                    navigate("/Wishlist");
                  }}
                >
                  My Wishlist
                </MenuItem>

                <MenuItem
                  sx={{
                    ...menuItemStyle,
                    color: "#8a1c1c",
                    borderTop: "1px solid #efe6d2",
                  }}
                  onClick={() => {
                    popupState.close();
                    handleLogout();
                  }}
                >
                  Logout
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem
                  sx={menuItemStyle}
                  onClick={() => {
                    popupState.close();
                    navigate("/Login");
                  }}
                >
                  Log in
                </MenuItem>

                <MenuItem
                  sx={menuItemStyle}
                  onClick={() => {
                    popupState.close();
                    navigate("/Signup");
                  }}
                >
                  Create Account (Sign up)
                </MenuItem>
              </>
            )}
          </Menu>
        </>
      )}
    </PopupState>
  );
}
