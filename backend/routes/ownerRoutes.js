

import  express ,{ Router } from 'express';
import { protect, authorizeRole } from '../middleware/auth.js';
import { addCar, changeRoleToOwner, deleteCar, getDashboardData, getOwnerCars, toggleCarAvailability, updateUserImage } from '../controllers/ownerController.js';
import upload from '../middleware/multer.js';
 const ownerRouter=express.Router();

 ownerRouter.get('/change-role',protect,changeRoleToOwner)
 ownerRouter.post('/add-car',protect,authorizeRole(['owner']),upload.single("image"),addCar)
ownerRouter.get('/cars',protect,authorizeRole(['owner']),getOwnerCars)
ownerRouter.post('/toggle-car',protect,authorizeRole(['owner']),toggleCarAvailability)
ownerRouter.post('/delete-car',protect,authorizeRole(['owner']),deleteCar)

ownerRouter.get('/dashboard', protect, authorizeRole(['owner']), getDashboardData)
ownerRouter.post('/update-image', protect,authorizeRole(['owner']), upload.single("image"), updateUserImage)
 export  default ownerRouter;



