const router = require('express').Router();

const petController = require('../controllers/petController')

//middlewares
const verifyToken = require('../helpers/verifyToken');
const { imageUpload } = require('../helpers/imageUpload');

router.post('/create', verifyToken,imageUpload.array('images'), petController.create)
router.get('/', petController.getAll)
router.get('/mypets',verifyToken, petController.getAllUserPets)
router.get('/myadoptions',verifyToken, petController.getAllUserAdoptions)
router.get('/:id', petController.getPetById)
router.delete("/delete/:id", verifyToken, petController.deletePetById);
router.patch('/update/:id', verifyToken, imageUpload.array('images'), petController.updatePetById)

module.exports = router