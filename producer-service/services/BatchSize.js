class BatchSizeManager {

    constructor() {
        this.currentSlot = 0
        this.batchSizes = []
        this.distribution = ''
    }

    initTimeSlot = (TAG, generateBatchSizes, args = [], distribution = '') => {
        this.currentSlot = 0
        this.batchSizes = generateBatchSizes(...args)
        this.distribution = distribution
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

    getDistribution = () => {
        return `${this.distribution} Distribution` || 'Unknown Distribution'
    }

    resetIfEndofTimeSlot = async (TAG, generateBatchSizes, args = [], distribution = '') => {
        if (this.currentSlot >= this.batchSizes.length) {
            console.log(`${TAG} Finished sending all batches`)
    
            this.initTimeSlot(TAG, generateBatchSizes, args = [], distribution = '')
        }
    }
}

module.exports = {
    BatchSizeManager
}
