import React, { useState, useEffect } from "react"; 
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom"; 

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

function UserList () {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        fetchModel("/user/list")
            .then((data) => {
                setUsers(data);
            })
            .catch((error) => {
                console.log("Có lỗi khi lấy danh sách người dùng", error);
            });
    }, []); 

    return (
      <div>
        <Typography variant="body1">
          This is the user list, which takes up 3/12 of the window. You might
          choose to use <a href="https://mui.com/components/lists/">Lists</a>{" "}
          and <a href="https://mui.com/components/dividers/">Dividers</a> to
          display your users like so:
        </Typography>
        <List component="nav">
          
          {users.map((item) => (
            <div key={item._id}>
              <ListItem>
                  <Link to={"/users/" + item._id}>
                      <ListItemText primary={item.first_name + " " + item.last_name}/>
                  </Link>
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
        
      </div>
    );
}

export default UserList;