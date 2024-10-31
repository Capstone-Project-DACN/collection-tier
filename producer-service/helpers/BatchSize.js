class BatchSizeManager {

    constructor() {
        this.currentSlot = 0
        this.batchSizes = []
    }

    initTimeSlot = (TAG, generateBatchSizes, args = []) => {
        this.currentSlot = 0
        this.batchSizes = generateBatchSizes(...args)
        console.log(`${TAG} Start sending all batches`)
    }

    updateTimeSlot = () => {
        this.currentSlot = this.currentSlot + 1
    }

    getCurrentSlot = () => {
        return this.currentSlot
    }

    getBatchSizes = () => {
        return this.batchSizes
    }

    getCurrentBatchSize = () => {
        return this.batchSizes[this.currentSlot]
    }

    resetIfEndofTimeSlot = async (TAG, generateBatchSizes, args = []) => {
        if (this.currentSlot >= this.batchSizes.length) {
            console.log(`${TAG} Finished sending all batches`)
    
            this.initTimeSlot(TAG, generateBatchSizes, args = [])
        }
    }
}

module.exports = {
    BatchSizeManager
}
