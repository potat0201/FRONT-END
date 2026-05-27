import React, { useState, useEffect } from "react"; 
import { Typography } from "@mui/material";
import { useParams, Link } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

function UserDetail() {
    const { userId } = useParams(); 
    const [userInfo, setUserInfo] = useState(null); 

    useEffect(() => {
        fetchModel("/user/" + userId)
            .then((data) => {
                setUserInfo(data); 
            })
            .catch((error) => {
                console.error("Lỗi khi lấy chi tiết người dùng:", error);
            });
    }, [userId]); 

    if (!userInfo) {
        return <Typography>Loading user details...</Typography>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <Typography variant="h4">
                {userInfo.first_name} {userInfo.last_name}
            </Typography>
            
            <Typography variant="body1" style={{ marginTop: "10px" }}>
                <strong>Location:</strong> {userInfo.location}
            </Typography>
            
            <Typography variant="body1" style={{ marginTop: "10px" }}>
                <strong>Occupation:</strong> {userInfo.occupation}
            </Typography>
            
            <Typography variant="body1" style={{ marginTop: "10px" }}>
                <strong>Description:</strong> {userInfo.description}
            </Typography>

            <br />
            {/* Link dẫn đến trang xem ảnh */}
            <Link to={"/photos/" + userId}>
                View Photos
            </Link>
        </div>
    );
}

export default UserDetail;