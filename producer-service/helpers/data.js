const axios = require('axios')
const DATA_SOURCE_SERVICE_URL = process.env.DATA_SOURCE_SERVICE_URL
const PULL_DATA_URL = `${DATA_SOURCE_SERVICE_URL}/data`

const getData = async (type, batch_size) => {
    try {
        const queryParams = {
            batch_size
        }

        const pathParam = type ? type : 'random'

        const response = await axios.get(`${PULL_DATA_URL}/${pathParam}`, { params: queryParams })
        const data = response.data

        return data
    } catch (error) {
        const status = error.response ? error.response.status : 'Network Error'
        const message = error.response ? error.response.data.message || error.message : error.message

        return Promise.reject(`getData - Error fetching data from source: ${message}. Status: ${status}`)
    }
}

module.exports = {
    getData
}
