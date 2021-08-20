const logger = require('../../logger').documentRouteLogger;
const multer = require('multer');
const Document = require('../../models/Document')
const upload = multer({
    // dest:'files',
    limits: {
        fileSize: 2000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(doc|docx|pdf)$/)) {
            return cb(new Error('Unsupported file provided'))
        }
        cb(undefined, true)
    }
})

const getHome = (req,res)=>{
    res.redirect('/');
}

const uploadDocuments=async (req,res)=>{
    try {
        logger.info("Inside /document/upload")
        const files=req.files
        const results=[]
        for (let file of files){
            logger.info("File "+file)
            let {originalname,mimetype} = file;
            logger.info("Processing: "+file.originalname)

            /**To check setting expires on date (whether it comes in the payload?)*/
            const doc = Document.build({
                fileName: originalname,
                fileData: file.buffer,
                type:mimetype
            })
            const result=await doc.save()
            if(result){
                results.push(true)
            }
        };
        if(results.length != files.length){
            logger.error("Error in uploading the files")
            res.status(400).json({error: "Error in uploading the files"})
        }
        logger.info("Completed /document/upload")
        res.status(200).json({message: "Upload Succesful"})
    } catch (error) {
        res.status(400).json({error: error.message})
        logger.error("Error in /document/upload "+ error.toString())
        
    }
}

const documentUploadErrorCallback=(error,req,res,next)=>{
    logger.error("Error in /document/upload "+ error.message)
    res.status(400).json({error: error.message})
}

const getAllDocuments=async (req,res)=>{
    try {
        logger.info("Started in /getall: ")
        const documents=await Document.getAllDocuments();
        if(documents){
            logger.info("Started in /getall: ")
            res.status(200).json({data:{documents}})
        }
    } catch (error) {
        logger.error("Error in /getall: "+error.toString())
        res.status(400).json({error: "Unable to get documents"})
    }
}

const deleteDocument = async (req,res)=>{
    try {
        logger.info("In delete document")
        const id = req.params.id;
        logger.info("Id: "+id)
        await Document.destroy({
            where: {id}
        })
        logger.info("Completed delete document")
        res.status(200).json({message:"Deleted"})
    } catch (error) {
        logger.error("Error in delete: "+error.toString())
        res.status(400).json({error:"Unable to delete"})
    }
}

module.exports={upload,getHome,uploadDocuments,documentUploadErrorCallback,getAllDocuments,deleteDocument}


