import storage from 'azure-storage';
import config from '../../config';
import multer from 'multer';
import intoStream from 'into-stream';

class AzureService {

    constructor() {
        this.blobService = storage.createBlobService(config.AZURE_STORAGE_CONNECTION_STRING);

    }

    async listContainers() {
        return new Promise((resolve, reject) => {
            this.blobService.listContainersSegmented(null, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ message: `${data.entries.length} containers`, containers: data.entries });
                }
            })
        })
    }

    async createContainer(containerName) {
        return new Promise((resolve, reject) => {
            this.blobService.createContainerIfNotExists(containerName, { publicAccessLevel: 'blob' }, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ message: `Container '${containerName}' created` });
                }
            });
        })
    }

    async uploadString(containerName, blobName, text) {
        return new Promise((resolve, reject) => {
            this.blobService.createBlockBlobFromText(containerName, blobName, text, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ message: `Text "${text}" is written to blob storage` });
                }
            });
        });
    }


    async uploadLocalFile(containerName, filePath) {
        return new Promise((resolve, reject) => {
            const fullPath = path.resolve(filePath);
            const blobName = path.basename(filePath);
            this.blobService.createBlockBlobFromLocalFile(containerName, blobName, fullPath, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ message: `Local file "${filePath}" is uploaded` });
                }
            });
        });
    }

    async uploadStream(containerName, req, res) {
        return new Promise((resolve, reject) => {
            const memoryStorage = multer.memoryStorage();
            const upload = multer({ storage: memoryStorage }).single('content');

            const obj=this;
            upload(req, res, function (err) {
                console.log(req);
                const blobName =obj._getBlobName(req.file.originalname);
                const stream = intoStream(req.file.buffer);
                const streamLength = req.file.buffer.length;
                console.log('containerName'+containerName);
                obj.blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, err => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve({ message: `File "${blobName}" is uploaded` });
                    }
                })
            });
        })
    }

    async listBlobs(containerName) {
        return new Promise((resolve, reject) => {
            this.blobService.listBlobsSegmented(containerName, null, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ message: `${data.entries.length} blobs in '${containerName}'`, blobs: data.entries });
                }
            });
        });
    }

    async downloadBlob(containerName, blobName) {
        return new Promise((resolve, reject) => {
            this.blobService.getBlobToText(containerName, blobName, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ message: `Blob downloaded "${data}"`, text: data });
                }
            });
        });
    }

    async deleteBlob(containerName, blobName) {
        return new Promise((resolve, reject) => {
            this.blobService.deleteBlobIfExists(containerName, blobName, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ message: `Block blob '${blobName}' deleted` });
                }
            });
        });
    }

    async deleteContainer(containerName) {
        return new Promise((resolve, reject) => {
            this.blobService.deleteContainer(containerName, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ message: `Container '${containerName}' deleted` });
                }
            });
        });
    }


    _getBlobName(originalName) {
        const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
        return `${identifier}-${originalName}`;
    }
}


module.exports = AzureService;