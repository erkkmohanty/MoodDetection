import AzureService from '../services/azureService';

class AppInitialization {
    constructor(containerName) {
        this.containerName = containerName;
        this.azureService = new AzureService();
    }

    async init() {
        console.log(this.containerName);
       let response = await this.azureService.listContainers();
        const containerDoesNotExist = response.containers.findIndex((container) => container.name === this.containerName) === -1;
        if (containerDoesNotExist) {
            await this.azureService.createContainer(this.containerName);
            console.log(`Container "${this.containerName}" is created`);
        }
    }

}

module.exports=AppInitialization;