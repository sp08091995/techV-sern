module.exports = function(app, passport) {
    const express = require('express');
    const router = express.Router();
    const logger = require('../../logger').documentRouteLogger;
    // const methodOverride = require('method-override');
    const userController = require('../../controllers/document');


    // const multer = require('multer');
    // const upload=multer({
    //     // dest:'files',
    //     limits:{
    //         fileSize: 2000000
    //     },
    //     fileFilter(req,file,cb){
    //         // console.log(file)
    //         if(!file.originalname.match(/\.(doc|docx|pdf)$/)){
    //             return cb(new Error('Unsupported file provided'))
    //         }
    //         cb(undefined,true)
    //     }
    // })
    // router.use(methodOverride('_method'))

    
    router.get('/', userController.getHome)

    router.post('/upload',userController.upload.array('files'), userController.uploadDocuments,userController.documentUploadErrorCallback)

    router.get('/getall',userController.getAllDocuments)

    router.delete('/delete/:id', userController.deleteDocument)

    
    // router.get('/edit/:email', userController.fetchByEmail)
    
    // router.get('/login', userController.login)

    // router.delete('/logout', userController.logout)
    return router
}