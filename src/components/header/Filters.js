import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Button, Input, Select } from '../common';
import { useData } from '../providers';

const API_URL = 'https://rickandmortyapi.com/api/character';
const STATUS_OPTIONS = ['Alive', 'Dead', 'unknown'];
const GENDER_OPTIONS = ['Female', 'Male', 'Genderless', 'unknown'];

const DEFAULT_FILTERS = {
  status: '',
  gender: '',
  species: '',
  name: '',
  type: ''
};

const FILTER_KEYS = Object.keys(DEFAULT_FILTERS);

const parseFiltersFromURL = (search) => {
  const params = new URLSearchParams(search);

  return FILTER_KEYS.reduce((acc, key) => {
    acc[key] = params.get(key) || '';

    return acc;
  }, {});
};

const getPageFromURL = (search) => {
  const page = Number(new URLSearchParams(search).get('page'));

  if (!Number.isInteger(page) || page < 1) {
    return 1;
  }

  return page;
};

const buildApiURL = (filters, page = 1) => {
  const url = new URL(API_URL);

  FILTER_KEYS.forEach((key) => {
    if (filters[key]) {
      url.searchParams.set(key, filters[key]);
    }
  });

  if (page > 1) {
    url.searchParams.set('page', String(page));
  }

  return url.toString();
};

const updateBrowserURL = (filters, page = 1) => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams();

  FILTER_KEYS.forEach((key) => {
    if (filters[key]) {
      params.set(key, filters[key]);
    }
  });

  if (page > 1) {
    params.set('page', String(page));
  }

  const query = params.toString();

  window.history.pushState(
    {},
    '',
    `${url.pathname}${query ? `?${query}` : ''}`
  );
};

const sortSpecies = (values) =>
  [...values].sort((a, b) => {
    if (a === 'unknown') return 1;
    if (b === 'unknown') return -1;

    return a.localeCompare(b);
  });

export function Filters() {
  const { setApiURL, setActivePage } = useData();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [speciesOptions, setSpeciesOptions] = useState([]);

  useEffect(() => {
    let ignore = false;

    async function loadSpeciesOptions() {
      try {
        let nextURL = API_URL;
        const uniqueSpecies = new Set();

        while (nextURL) {
          const { data } = await axios.get(nextURL);

          data.results.forEach(({ species }) => {
            uniqueSpecies.add(species);
          });

          nextURL = data.info?.next || null;
        }

        if (!ignore) {
          setSpeciesOptions(sortSpecies(uniqueSpecies));
        }
      } catch (e) {
        console.error(e);
      }
    }

    loadSpeciesOptions();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const fromURL = parseFiltersFromURL(window.location.search);
    const page = getPageFromURL(window.location.search);

    setFilters(fromURL);
    setActivePage(page - 1);
    setApiURL(buildApiURL(fromURL, page));
  }, [setActivePage, setApiURL]);

  const handleChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const onStatusChange = useCallback(
    (val) => {
      handleChange('status', val);
    },
    [handleChange]
  );

  const onGenderChange = useCallback(
    (val) => {
      handleChange('gender', val);
    },
    [handleChange]
  );

  const onSpeciesChange = useCallback(
    (val) => {
      handleChange('species', val);
    },
    [handleChange]
  );

  const onNameChange = useCallback(
    (e) => {
      handleChange('name', e.target.value);
    },
    [handleChange]
  );

  const onTypeChange = useCallback(
    (e) => {
      handleChange('type', e.target.value);
    },
    [handleChange]
  );

  const handleApply = useCallback(() => {
    setActivePage(0);
    setApiURL(buildApiURL(filters, 1));
    updateBrowserURL(filters, 1);
  }, [filters, setActivePage, setApiURL]);

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setActivePage(0);
    setApiURL(API_URL);
    updateBrowserURL(DEFAULT_FILTERS, 1);
  }, [setActivePage, setApiURL]);

  return (
    <FiltersContainer>
      <Select
        placeholder="Status"
        options={STATUS_OPTIONS}
        value={filters.status}
        onChange={onStatusChange}
      />
      <Select
        placeholder="Gender"
        options={GENDER_OPTIONS}
        value={filters.gender}
        onChange={onGenderChange}
      />
      <Select
        placeholder="Species"
        options={speciesOptions}
        value={filters.species}
        onChange={onSpeciesChange}
      />

      <Input placeholder="Name" value={filters.name} onChange={onNameChange} />
      <Input placeholder="Type" value={filters.type} onChange={onTypeChange} />

      <ButtonsContainer>
        <Button onClick={handleApply}>Apply</Button>
        <Button color="#e23636" onClick={handleReset}>
          Reset
        </Button>
      </ButtonsContainer>
    </FiltersContainer>
  );
}

const FiltersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-areas:
    'status gender species'
    'name type buttons';
  gap: 15px;
  width: 100%;
  max-width: 700px;
  margin-left: auto;

  & > div:nth-child(1) {
    grid-area: status;
  }
  & > div:nth-child(2) {
    grid-area: gender;
  }
  & > div:nth-child(3) {
    grid-area: species;
  }
  & > input:nth-child(4) {
    grid-area: name;
  }
  & > input:nth-child(5) {
    grid-area: type;
  }

  @media (max-width: 950px) {
    grid-template-columns: repeat(3, 1fr);
    grid-template-areas:
      'status gender species'
      'name type buttons';
    margin: 20px auto 0;
    width: auto;
  }

  @media (max-width: 530px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      'status'
      'gender'
      'species'
      'name'
      'type'
      'buttons';
  }
`;

const ButtonsContainer = styled.div`
  grid-area: buttons;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (max-width: 530px) {
    grid-template-columns: 1fr;
  }
`;
