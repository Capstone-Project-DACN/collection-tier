class BatchSizeManager {

    constructor(minDeviceIndex = 0, maxDeviceIndex = 1000) {
        this.currentSlot = 0
        this.batchSizes = []
        this.distribution = ''

        // Device tracking for each topic
        this.minDeviceIndex = minDeviceIndex
        this.maxDeviceIndex = maxDeviceIndex
        this.currentDeviceIndex = minDeviceIndex

        // Other attributes
        this.TAG = ''
        this.generateBatchSizes = null
        this.args = []

        // Chart data
        this.chartData = []
    }

    initTimeSlot = (TAG, generateBatchSizes, args = [], distribution = '') => {
        this.currentSlot = 0
        this.batchSizes = generateBatchSizes(...args)
        this.distribution = distribution
        this.currentDeviceIndex = this.minDeviceIndex

        this.TAG = TAG
        this.generateBatchSizes = generateBatchSizes
        this.args = args

        this.chartData = Array(this.batchSizes.length).fill(0)

        console.log(`${TAG} Start sending all batches`)
    }

    updateTimeSlot = () => {
        this.chartData[this.currentSlot] = this.getCurrentBatchSize()
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

    getCurrentIndex = () => {
        return this.currentDeviceIndex
    }

    updateCurrentIndex = () => {
        this.currentDeviceIndex = this.currentDeviceIndex + 1
        if (this.currentDeviceIndex > this.maxDeviceIndex) {
            this.currentDeviceIndex = this.minDeviceIndex // Restart cycle
        }
    }

    resetIfEndofTimeSlot = () => {
        if (this.currentSlot >= this.batchSizes.length) {
            console.log(`${TAG} Finished sending all batches`)
    
            this.initTimeSlot(this.TAG, this.generateBatchSizes, this.args, this.distribution)
        }
    }

    getChartData = () => {
        return this.chartData
    }
}

module.exports = {
    BatchSizeManager
}
