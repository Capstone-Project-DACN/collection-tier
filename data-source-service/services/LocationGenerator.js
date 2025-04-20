const { ALLOWED_LOCATIONS } = require('../configs/DataConfig')
const { getRandomInt } = require('../utils/RandomUtils')

const debugTag = 'LocationGenerator'

function generateRandomLocation(cityId, districtId) {

    if (!ALLOWED_LOCATIONS || ALLOWED_LOCATIONS.length === 0) {
        console.error(`[${debugTag}] generateRandomLocation: No allowed locations defined in the config`)
        return {
            city_id: null,
            city: undefined,
            district_id: null,
            district: undefined,
            ward: undefined
        }
    }

    let selectedCity
    if (cityId) {
        selectedCity = ALLOWED_LOCATIONS.find((city) => city.city_id === cityId)
        if (!selectedCity) {
            console.error(`[${debugTag}] generateRandomLocation: City with ID ${cityId} not found.`)
            return {
                city_id: null,
                city: undefined,
                district_id: null,
                district: undefined,
                ward: undefined
            }
        }
    } else {
        selectedCity = ALLOWED_LOCATIONS[Math.floor(Math.random() * ALLOWED_LOCATIONS.length)]
    }

    let selectedDistrict
    if (districtId) {
        selectedDistrict = selectedCity.districts.find((district) => district.district_id === districtId)
        if (!selectedDistrict) {
            console.error(`[${debugTag}] generateRandomLocation: District with ID ${districtId} not found in city ${selectedCity.city}.`)
            return {
                city_id: selectedCity.city_id,
                city: selectedCity.city,
                district_id: null,
                district: undefined,
                ward: undefined
            }
        }
    } else {
        selectedDistrict = selectedCity.districts[Math.floor(Math.random() * selectedCity.districts.length)]
    }

    const randomWard = generateWard()

    return {
        city_id: selectedCity.city_id,
        city: selectedCity.city,
        district_id: selectedDistrict.district_id,
        district: selectedDistrict.district,
        ward: randomWard,
    }
}

function generateWard() {
    return `Phuong ${getRandomInt(1, 15)}`
}

module.exports = {
    generateRandomLocation
}
