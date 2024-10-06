const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')


const router = require('express').Router()


router.post('/register',userCtrl.register)

router.post('/login',userCtrl.login)

router.post('/logout',userCtrl.logout)

router.get('/refresh_token',userCtrl.refreshtoken)

router.get('/infor', auth, userCtrl.getUser)

router.patch('/addcart', userCtrl.Updatecart)

router.post('/cart', userCtrl.Getcart)

router.post('/cart/delete',userCtrl.DeleteCart);
// New route to get user details by email
router.post('/details', userCtrl.getUserByEmail);
 
router.post('/cart/comment', userCtrl.getcomment);




module.exports = router