import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.development' });

import express from 'express';
import cookieParser from 'cookie-parser';
import { router as assetRouter } from './routes/asset';
import { router as userRouter } from './routes/user';
import { router as authRouter } from './routes/auth';
import { router as fileRouter } from './routes/file';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use('/api/user', userRouter);
app.use('/api/asset', assetRouter);
app.use('/api/auth', authRouter);
app.use('/file', fileRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
