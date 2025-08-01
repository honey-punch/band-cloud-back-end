import express from 'express';
import * as dotenv from 'dotenv';
import { router as assetRouter } from './routes/asset';
import { router as userRouter } from './routes/user';

dotenv.config({ path: '.env.development' });

const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
  console.log(req.method, req.url);
  res.send({ message: 'Hello World!'});
});

app.use(userRouter);
app.use(assetRouter);

app.listen(port, () => {
  // console.log(`Server is running at http://localhost:${port}`);
});
