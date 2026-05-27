const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001; 

const models = require('./src/modelData/models.js').default;

app.use(cors());

// 1. Lấy thông tin test
app.get('/test/info', (req, res) => {
  res.json(models.schemaInfo());
});

// 2. Lấy danh sách người dùng
app.get('/user/list', (req, res) => {
  res.json(models.userListModel());
});

// 3. Lấy chi tiết một người dùng
app.get('/user/:id', (req, res) => {
  const id = req.params.id;
  const user = models.userModel(id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send("User not found");
  }
});

// 4. Lấy ảnh của một người dùng
app.get('/photosOfUser/:id', (req, res) => {
  const id = req.params.id;
  const photos = models.photoOfUserModel(id);
  if (photos) {
    res.json(photos);
  } else {
    res.status(404).send("Photos not found");
  }
});

app.listen(port, () => {
  console.log(`🚀 Server dữ liệu đang chạy tại http://localhost:${port}`);
});