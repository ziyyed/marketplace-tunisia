// List of Tunisian governorates and major cities
export const tunisianLocations = [
  'Tunis',
  'Ariana',
  'Ben Arous',
  'Manouba',
  'Nabeul',
  'Zaghouan',
  'Bizerte',
  'Béja',
  'Jendouba',
  'Kef',
  'Siliana',
  'Sousse',
  'Monastir',
  'Mahdia',
  'Sfax',
  'Kairouan',
  'Kasserine',
  'Sidi Bouzid',
  'Gabès',
  'Medenine',
  'Tataouine',
  'Gafsa',
  'Tozeur',
  'Kebili'
];

// Function to get locations for dropdown menus
export const getLocationOptions = () => {
  return tunisianLocations.map(location => ({
    value: location,
    label: location
  }));
};

export default tunisianLocations;
