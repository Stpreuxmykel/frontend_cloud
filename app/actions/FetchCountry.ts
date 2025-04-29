// fetchCountries.ts
import axios from 'axios';

export type Country = {
  id: string;
  name: string;
  isoCode: string;
  states: {
    name: string;
    cities: string[];
  }[];
};

export async function fetchCountries(api_url: string): Promise<Country[]> {
  try {
    const response = await axios.get(`${api_url}/country_city_region/`);
    const countries = response.data.map((country: any) => ({
      id: country.id,
      name: country.name,
      isoCode: country.iso2,
      states: country.states?.map((state: any) => ({
        ...state,
        cities: state.cities || [],
      })) || [],
    }));
    return countries;
  } catch (error) {
    console.error("Error fetching countries data:", error);
    throw error; // Rethrow the error so it can be handled by the calling function
  }
}
