      // const countryResponse = await axios.get(

      //   `${api_url}/country_city_region/`
      // );

      // console.log("checking countries data inside : ", countryResponse.data)

      // setCountries(
      //   countryResponse.data.map((country: any) => ({
      //     id: country.id,
      //     name: country.name,
      //     isoCode: country.iso2, // Example: You can choose which property to use as value
      //     // states: country.states || [], // Default to an empty array if states are undefined
      //     states: country.states.map((state) => ({
      //       ...state,
      //       cities: state.cities || [] // Include cities in the state object
      //     })) || [], // Default to an empty array if states are undefined
      //   }))
      // );