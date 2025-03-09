const DATA_TYPE = {
    household: 'HouseholdData',
    area: 'AreaData',
    anomaly: 'AnomalyData'
}

const ALLOWED_LOCATIONS = [
    {
        city: 'Ho Chi Minh City',
        districts:[
            'Quan 1',  'Quan 3', 'Quan 4', 'Quan 5', 'Quan 6',
            'Quan 7', 'Quan 8', 'Quan 10', 'Quan 11', 'Quan 12',
            'Quan Go Vap', 'Quan Tan Binh', 'Quan Binh Tan', 'Quan Binh Thanh',
            'Quan Tan Phu', 'Quan Phu Nhuan'
        ]
    },
    {
        city: 'Thu Duc City',
        districts:[
            'Quan 2', 'Quan 9'
        ]
    }
]

module.exports = {
    DATA_TYPE,
    ALLOWED_LOCATIONS
}