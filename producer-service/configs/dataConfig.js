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

const ALLOWED_LOCATIONS = [
    {
      city_id: 'HCMC',
      city: 'Ho Chi Minh City',
      districts: [
        { district_id: 'Q1', district: 'Quan 1' },
        { district_id: 'Q3', district: 'Quan 3' },
        { district_id: 'Q4', district: 'Quan 4' },
        { district_id: 'Q5', district: 'Quan 5' },
        { district_id: 'Q6', district: 'Quan 6' },
        { district_id: 'Q7', district: 'Quan 7' },
        { district_id: 'Q8', district: 'Quan 8' },
        { district_id: 'Q10', district: 'Quan 10' },
        { district_id: 'Q11', district: 'Quan 11' },
        { district_id: 'Q12', district: 'Quan 12' },
        { district_id: 'QGV', district: 'Quan Go Vap' },
        { district_id: 'QTB', district: 'Quan Tan Binh' },
        { district_id: 'QBTAN', district: 'Quan Binh Tan' },
        { district_id: 'QBTHANH', district: 'Quan Binh Thanh' },
        { district_id: 'QTP', district: 'Quan Tan Phu' },
        { district_id: 'QPN', district: 'Quan Phu Nhuan' },
      ],
    },
    {
      city_id: 'TDUC',
      city: 'Thu Duc City',
      districts: [
        { district_id: 'Q2', district: 'Quan 2' },
        { district_id: 'Q9', district: 'Quan 9' },
      ],
    },
]

const ALLOWED_DEVICE_ID = {
    START: 0,
    END: 1000
}

module.exports = {
    DATA_TYPE,
    DATA_TYPE_API,
    ALLOWED_LOCATIONS,
    ALLOWED_DEVICE_ID
}