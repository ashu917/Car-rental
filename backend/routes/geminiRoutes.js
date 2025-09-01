// import express from 'express';
// import { getInfo } from '../controllers/geminiController.js';
// // import { protect } from '../middleware/auth.js';
// // import { requireMessageBody } from '../middleware/geminiValidate.js';

// const router = express.Router();

// // GET /api/gemini -> public info/health
// router.get('/carDetails', getInfo);

// // // POST /api/gemini -> protected generate
// // router.post('/', protect, requireMessageBody, postGenerate);

// export default router



import express from 'express';
import { getInfo, askGemini } from '../controllers/geminiController.js';

const router = express.Router();

// DB car search (you may want this under /api/cars instead)
router.get('/carDetails', getInfo);

// Real Gemini endpoint
router.post('/ask', askGemini);

export default router;



