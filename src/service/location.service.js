const axios = require('axios');

const getUserLocation = async (ipAddress) => {
    try {
        const response = await axios.get(`http://ip-api.com/json/${ipAddress}`);


        if (response.status === 200 && response.data.status === 'success') {

            const { city, country, countryCode, zip, lat, lon } = response.data;
            return { city, country, countryCode, zip, lat, lon }
        }
        else {
            return null
        }

    } catch (error) {
        console.error('Error fetching location', error.message);
        return null;
    }
}

module.exports = { getUserLocation };