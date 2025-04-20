const { TOPIC } = require('../configs/KafkaConfig')
const { DATA_TYPE } = require('../configs/DataConfig')

function destinationTopic(cityId, districtId, type = DATA_TYPE.household) {
    if (type === DATA_TYPE.household && cityId && districtId) {
        return TOPIC[`HOUSEHOLD_${cityId.toUpperCase()}_${districtId.toUpperCase()}`]
    } else if (type === DATA_TYPE.area && cityId && districtId) {
        return TOPIC[`AREA_${cityId.toUpperCase()}_${districtId.toUpperCase()}`]
    } else if (type === DATA_TYPE.household) {
        return TOPIC.HOUSEHOLD
    }  else if (type === DATA_TYPE.area) {
        return TOPIC.AREA
    } else {
        return TOPIC.ANOMALY
    }
}

function topicExists(topicName) {
    return Object.values(TOPIC).includes(topicName)
}

module.exports = {
    destinationTopic,
    topicExists
}
