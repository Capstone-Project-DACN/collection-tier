const { ALLOWED_LOCATIONS } = require('./config')

function generateRandomCityAndDistrict() {

  if (!ALLOWED_LOCATIONS || ALLOWED_LOCATIONS.length === 0) {
    console.error('No allowed locations defined in the config')
    return { city: undefined, district: undefined }
  }

  const randomCityIndex = Math.floor(Math.random() * ALLOWED_LOCATIONS.length)
  const randomCity = ALLOWED_LOCATIONS[randomCityIndex].city
  const allowedDistrictsForCity = ALLOWED_LOCATIONS[randomCityIndex].districts

  const randomDistrictIndex = Math.floor(Math.random() * allowedDistrictsForCity.length)
  const randomDistrict = allowedDistrictsForCity[randomDistrictIndex]

  return { city: randomCity, district: randomDistrict }
}

module.exports = {
  generateRandomCityAndDistrict
}
