const { Sequelize, DataTypes,Op } = require('sequelize');
const db = require('../../db')
const logger = require('../../logger').documentModelLogger;
var moment = require('moment');
// moment().format("YYYY-MM-DD HH:mm:ss")

const Document = db.define('Document', {
    fileName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {

        }
    },
    type: {
        type: Sequelize.STRING(100),
        validate: {

        }
    },
    expiresOn: {
        type: Sequelize.DATE,
        validate: {

        }
    },

    fileData: {
        type: DataTypes.BLOB("long"),
        

    }

}, {
    timestamps: true,
    createdAt: 'createdOn',
    updatedAt: 'updatedOn',
    hooks: {
        beforeCreate: async function(document){
            try {
                logger.info("In beforeCreate")
                if(!document.expiresOn){
                    const expiresOn =  await new Date()
                    await expiresOn.setDate(expiresOn.getDate() + 30);
                    document.expiresOn=expiresOn
                }
            } catch (error) {
                logger.error("Error in beforeCreate: "+error.toString())
            }
        }
    }
})

Document.prototype.findById=async function(id){
    try {
        const document=Document.findOne({id})
        if(!document){
            logger.error("Unable to find document with Id: "+id)
            return 
        }
        return document;
    } catch (error) {
        logger.error(error.toString())
    }
}

Document.getAllDocuments=async function (){
    try {
        const documents= Document.findAll({attributes:['id','fileName','type','expiresOn','createdOn','updatedOn']},{
            where: {
                1: 1
                ,
                expiresOn:{
                    [Op.gte]: moment().toDate()
                    // .subtract(7, 'days').toDate()
                }
              }
        }
        );
        if(!documents){
            logger.error("Unable to find documents")
            return 
        }
        return documents;
        
    } catch (error) {
        logger.error(error.toString())
        return;
    }
}



try {
    Document.sync()
} catch (error) {
    logger.error(error)
}
module.exports = Document;