const DATA_TYPE = {
    household: 'HouseholdData',
    area: 'AreaData',
    anomaly: 'AnomalyData'
}

const DATA_TYPE_API = {
    household: 'household',
    area: 'area',
    anomaly: 'anomaly'
}

const ALLOWED_DEVICE_ID = {
    START: 0,
    END: 1000,
    PREFIX: 'id'
}

module.exports = {
    DATA_TYPE,
    DATA_TYPE_API,
    ALLOWED_DEVICE_ID
}