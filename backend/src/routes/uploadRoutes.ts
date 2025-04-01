import express from 'express';
import multer from 'multer';
import { uploadFile, listFiles } from '../controllers/uploadController';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });


router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    await uploadFile(req, res);
  } catch (error) {
    next(error); 
  }
});

router.get('/files', async (req, res, next) => {
  try {
    await listFiles(req, res);
  } catch (error) {
    next(error); 
  }
}); 



export default router;
