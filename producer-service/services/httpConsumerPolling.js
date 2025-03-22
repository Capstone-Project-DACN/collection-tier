const axios = require('axios')
const DATA_SOURCE_SERVICE_URL = process.env.DATA_SOURCE_SERVICE_URL
const PULL_DATA_URL = `${DATA_SOURCE_SERVICE_URL}/data`
const { DATA_TYPE_API } = require('../configs/dataConfig')

const getData = async (type, batch_size) => {
    try {
        const queryParams = {
            batch_size
        }

        const pathParam = type

        const response = await axios.get(`${PULL_DATA_URL}/${pathParam}`, { params: queryParams })
        const data = response.data

        return data
    } catch (error) {
        const status = error.response ? error.response.status : 'Network Error'
        const message = error.response ? error.response.data.message || error.message : error.message

        return Promise.reject(`[getData - ${pathParam}] - Error fetching data from source: ${message}. Status: ${status}`)
    }
}

const pollHouseholdData = async (batch_size) => {
    return getData(DATA_TYPE_API.household, batch_size)
}

const pollAreaData = async (batch_size) => {
    return getData(DATA_TYPE_API.area, batch_size)
}

const pollAnomalyData = async (batch_size) => {
    return getData(DATA_TYPE_API.anomaly, batch_size)
}

module.exports = {
    pollHouseholdData,
    pollAreaData,
    pollAnomalyData
}
