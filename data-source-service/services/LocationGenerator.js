const { ALLOWED_LOCATIONS } = require('../configs/DataConfig')
const { getRandomInt } = require('../utils/RandomUtils')

function generateRandomLocation() {

  if (!ALLOWED_LOCATIONS || ALLOWED_LOCATIONS.length === 0) {
    console.error('No allowed locations defined in the config')
    return { city: undefined, district: undefined, ward: undefined }
  }

  const randomCityIndex = Math.floor(Math.random() * ALLOWED_LOCATIONS.length)
  const randomCity = ALLOWED_LOCATIONS[randomCityIndex].city
  const allowedDistrictsForCity = ALLOWED_LOCATIONS[randomCityIndex].districts

  const randomDistrictIndex = Math.floor(Math.random() * allowedDistrictsForCity.length)
  const randomDistrict = allowedDistrictsForCity[randomDistrictIndex]
  const randomWard = generateWard()

  return { city: randomCity, district: randomDistrict, ward: randomWard }
}

function generateWard() {
  return `Phuong ${getRandomInt(1, 15)}`
}

module.exports = {
  generateRandomLocation
}
