import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { State, City } from 'country-state-city';

const LocationForm = ({ formData, setFormData }) => {
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  // Fetch state options when the component mounts
  useEffect(() => {
    const states = State.getStatesOfCountry("US"); // Use your country code
    const stateOptions = states.map((state) => ({
      value: state.isoCode,
      label: state.name,
    }));
    setStateOptions(stateOptions);
  }, []);

  // Update city options when a state is selected
  const handleStateChange = (selectedOption) => {
    setFormData({ ...formData, state: selectedOption.label });
    const cities = City.getCitiesOfState("US", selectedOption.value); // Country code and state ISO
    const cityOptions = cities.map((city) => ({
      value: city.name,
      label: city.name,
    }));
    setCityOptions(cityOptions);
  };

  const handleCityChange = (selectedOption) => {
    setFormData({ ...formData, city: selectedOption.label });
  };

  return (
    <div>
      <Select
        options={stateOptions}
        onChange={handleStateChange}
        placeholder="Select State"
      />
      <Select
        options={cityOptions}
        onChange={handleCityChange}
        placeholder="Select City"
      />
    </div>
  );
};

export default LocationForm;
