// Nigerian States and their LGAs data structure
export interface LocationData {
  state: string;
  lgas: string[];
}

export interface TownData {
  lga: string;
  towns: string[];
}

export interface VillageData {
  town: string;
  villages: string[];
}

// Nigerian States with their LGAs (focusing on Igbo states)
export const nigerianStates: LocationData[] = [
  {
    state: "Abia",
    lgas: [
      "Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North", 
      "Isiala Ngwa South", "Isuikwuato", "Obi Ngwa", "Ohafia", "Osisioma", "Ugwunagbo", 
      "Ukwa East", "Ukwa West", "Umuahia North", "Umuahia South", "Umu Nneochi"
    ]
  },
  {
    state: "Anambra",
    lgas: [
      "Aguata", "Anambra East", "Anambra West", "Anaocha", "Awka North", "Awka South", 
      "Dunukofia", "Ekwusigo", "Idemili North", "Idemili South", "Ihiala", "Njikoka", 
      "Nnewi North", "Nnewi South", "Ogbaru", "Onitsha North", "Onitsha South", "Orumba North", 
      "Orumba South", "Oyi"
    ]
  },
  {
    state: "Ebonyi",
    lgas: [
      "Abakaliki", "Afikpo North", "Afikpo South", "Ebonyi", "Ezza North", "Ezza South", 
      "Ikwo", "Ishielu", "Ivo", "Izzi", "Ohaozara", "Ohaukwu", "Onicha"
    ]
  },
  {
    state: "Enugu",
    lgas: [
      "Aninri", "Awgu", "Enugu East", "Enugu North", "Enugu South", "Ezeagu", "Igbo Etiti", 
      "Igbo Eze North", "Igbo Eze South", "Isi Uzo", "Nkanu East", "Nkanu West", "Nsukka", 
      "Oji River", "Udi", "Uzo Uwani"
    ]
  },
  {
    state: "Imo",
    lgas: [
      "Aboh Mbaise", "Ahiazu Mbaise", "Ehime Mbano", "Ezinihitte", "Ideato North", "Ideato South", 
      "Ihitte/Uboma", "Ikeduru", "Isiala Mbano", "Isu", "Mbaitoli", "Ngor Okpala", "Njaba", 
      "Nkwerre", "Nwangele", "Obowo", "Oguta", "Ohaji/Egbema", "Okigwe", "Onuimo", "Orlu", 
      "Orsu", "Oru East", "Oru West", "Owerri Municipal", "Owerri North", "Owerri West", "Unuimo"
    ]
  },
  {
    state: "Delta",
    lgas: [
      "Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Ethiope East", "Ethiope West", 
      "Ika North East", "Ika South", "Isoko North", "Isoko South", "Ndokwa East", "Ndokwa West", 
      "Okpe", "Oshimili North", "Oshimili South", "Patani", "Sapele", "Udu", "Ughelli North", 
      "Ughelli South", "Ukwuani", "Uvwie", "Warri North", "Warri South", "Warri South West"
    ]
  },
  {
    state: "Rivers",
    lgas: [
      "Abua/Odual", "Ahoada East", "Ahoada West", "Akuku-Toru", "Andoni", "Asari-Toru", 
      "Bonny", "Degema", "Eleme", "Emuoha", "Etche", "Gokana", "Ikwerre", "Khana", "Obio/Akpor", 
      "Ogba/Egbema/Ndoni", "Ogu/Bolo", "Okrika", "Omuma", "Opobo/Nkoro", "Oyigbo", "Port Harcourt", "Tai"
    ]
  }
];

// Sample towns data (this would be much more comprehensive in a real implementation)
export const townsData: { [lga: string]: string[] } = {
  "Aba North": ["Aba", "Eziukwu", "Umuokpoji"],
  "Aba South": ["Aba", "Eziukwu", "Umuokpoji"],
  "Arochukwu": ["Arochukwu", "Abam", "Ihechiowa", "Ututu"],
  "Bende": ["Bende", "Amaokwe", "Nkpa", "Uzuakoli"],
  "Ikwuano": ["Ikwuano", "Ariam", "Oboro", "Umuahia"],
  "Isiala Ngwa North": ["Isiala Ngwa", "Amaise", "Ntigha", "Umuokoro"],
  "Isiala Ngwa South": ["Isiala Ngwa", "Amaise", "Ntigha", "Umuokoro"],
  "Isuikwuato": ["Isuikwuato", "Amaokwe", "Nkpa", "Uzuakoli"],
  "Obi Ngwa": ["Obi Ngwa", "Amaise", "Ntigha", "Umuokoro"],
  "Ohafia": ["Ohafia", "Abam", "Ihechiowa", "Ututu"],
  "Osisioma": ["Osisioma", "Aba", "Eziukwu", "Umuokpoji"],
  "Ugwunagbo": ["Ugwunagbo", "Aba", "Eziukwu", "Umuokpoji"],
  "Ukwa East": ["Ukwa East", "Aba", "Eziukwu", "Umuokpoji"],
  "Ukwa West": ["Ukwa West", "Aba", "Eziukwu", "Umuokpoji"],
  "Umuahia North": ["Umuahia", "Ariam", "Oboro", "Umuahia"],
  "Umuahia South": ["Umuahia", "Ariam", "Oboro", "Umuahia"],
  "Umu Nneochi": ["Umu Nneochi", "Ariam", "Oboro", "Umuahia"],
  
  // Anambra
  "Aguata": ["Aguata", "Akwukwu", "Ekwulobia", "Oko"],
  "Anambra East": ["Anambra East", "Aguleri", "Enugwu-Agidi", "Nkpor"],
  "Anambra West": ["Anambra West", "Aguleri", "Enugwu-Agidi", "Nkpor"],
  "Anaocha": ["Anaocha", "Adazi", "Agulu", "Neni"],
  "Awka North": ["Awka North", "Amansea", "Ebenebe", "Ugbene"],
  "Awka South": ["Awka", "Amawbia", "Nibo", "Okpuno"],
  "Dunukofia": ["Dunukofia", "Amansea", "Ebenebe", "Ugbene"],
  "Ekwusigo": ["Ekwusigo", "Ozubulu", "Ihiala", "Oraifite"],
  "Idemili North": ["Idemili North", "Abatete", "Nkpor", "Ogidi"],
  "Idemili South": ["Idemili South", "Abatete", "Nkpor", "Ogidi"],
  "Ihiala": ["Ihiala", "Ozubulu", "Ihiala", "Oraifite"],
  "Njikoka": ["Njikoka", "Abagana", "Enugwu-Agidi", "Nimo"],
  "Nnewi North": ["Nnewi", "Nnewi", "Oraifite", "Ihiala"],
  "Nnewi South": ["Nnewi", "Nnewi", "Oraifite", "Ihiala"],
  "Ogbaru": ["Ogbaru", "Atani", "Ossomala", "Ogbakuba"],
  "Onitsha North": ["Onitsha", "Onitsha", "Fegge", "Woliwo"],
  "Onitsha South": ["Onitsha", "Onitsha", "Fegge", "Woliwo"],
  "Orumba North": ["Orumba North", "Awa", "Nanka", "Oko"],
  "Orumba South": ["Orumba South", "Awa", "Nanka", "Oko"],
  "Oyi": ["Oyi", "Nteje", "Awkuzu", "Nkwelle-Ezunaka"],
  
  // Ebonyi
  "Abakaliki": ["Abakaliki", "Nkalagu", "Ezza", "Ikwo"],
  "Afikpo North": ["Afikpo", "Amasiri", "Edda", "Nguzu"],
  "Afikpo South": ["Afikpo", "Amasiri", "Edda", "Nguzu"],
  "Ebonyi": ["Ebonyi", "Nkalagu", "Ezza", "Ikwo"],
  "Ezza North": ["Ezza North", "Ezza", "Ikwo", "Nkalagu"],
  "Ezza South": ["Ezza South", "Ezza", "Ikwo", "Nkalagu"],
  "Ikwo": ["Ikwo", "Ezza", "Nkalagu", "Abakaliki"],
  "Ishielu": ["Ishielu", "Ezza", "Ikwo", "Nkalagu"],
  "Ivo": ["Ivo", "Ezza", "Ikwo", "Nkalagu"],
  "Izzi": ["Izzi", "Ezza", "Ikwo", "Nkalagu"],
  "Ohaozara": ["Ohaozara", "Ezza", "Ikwo", "Nkalagu"],
  "Ohaukwu": ["Ohaukwu", "Ezza", "Ikwo", "Nkalagu"],
  "Onicha": ["Onicha", "Ezza", "Ikwo", "Nkalagu"],
  
  // Enugu
  "Aninri": ["Aninri", "Ndeaboh", "Mgbowo", "Oji River"],
  "Awgu": ["Awgu", "Mgbowo", "Ndeaboh", "Oji River"],
  "Enugu East": ["Enugu East", "Enugu", "Nsukka", "Oji River"],
  "Enugu North": ["Enugu North", "Enugu", "Nsukka", "Oji River"],
  "Enugu South": ["Enugu South", "Enugu", "Nsukka", "Oji River"],
  "Ezeagu": ["Ezeagu", "Awgu", "Mgbowo", "Ndeaboh"],
  "Igbo Etiti": ["Igbo Etiti", "Nsukka", "Enugu", "Oji River"],
  "Igbo Eze North": ["Igbo Eze North", "Nsukka", "Enugu", "Oji River"],
  "Igbo Eze South": ["Igbo Eze South", "Nsukka", "Enugu", "Oji River"],
  "Isi Uzo": ["Isi Uzo", "Nsukka", "Enugu", "Oji River"],
  "Nkanu East": ["Nkanu East", "Enugu", "Nsukka", "Oji River"],
  "Nkanu West": ["Nkanu West", "Enugu", "Nsukka", "Oji River"],
  "Nsukka": ["Nsukka", "Enugu", "Oji River", "Awgu"],
  "Oji River": ["Oji River", "Awgu", "Mgbowo", "Ndeaboh"],
  "Udi": ["Udi", "Enugu", "Nsukka", "Oji River"],
  "Uzo Uwani": ["Uzo Uwani", "Nsukka", "Enugu", "Oji River"],
  
  // Imo
  "Aboh Mbaise": ["Aboh Mbaise", "Ahiara", "Ezinihitte", "Owerri"],
  "Ahiazu Mbaise": ["Ahiazu Mbaise", "Ahiara", "Ezinihitte", "Owerri"],
  "Ehime Mbano": ["Ehime Mbano", "Ahiara", "Ezinihitte", "Owerri"],
  "Ezinihitte": ["Ezinihitte", "Ahiara", "Owerri", "Mbaise"],
  "Ideato North": ["Ideato North", "Ahiara", "Ezinihitte", "Owerri"],
  "Ideato South": ["Ideato South", "Ahiara", "Ezinihitte", "Owerri"],
  "Ihitte/Uboma": ["Ihitte/Uboma", "Ahiara", "Ezinihitte", "Owerri"],
  "Ikeduru": ["Ikeduru", "Ahiara", "Ezinihitte", "Owerri"],
  "Isiala Mbano": ["Isiala Mbano", "Ahiara", "Ezinihitte", "Owerri"],
  "Isu": ["Isu", "Ahiara", "Ezinihitte", "Owerri"],
  "Mbaitoli": ["Mbaitoli", "Ahiara", "Ezinihitte", "Owerri"],
  "Ngor Okpala": ["Ngor Okpala", "Ahiara", "Ezinihitte", "Owerri"],
  "Njaba": ["Njaba", "Ahiara", "Ezinihitte", "Owerri"],
  "Nkwerre": ["Nkwerre", "Ahiara", "Ezinihitte", "Owerri"],
  "Nwangele": ["Nwangele", "Ahiara", "Ezinihitte", "Owerri"],
  "Obowo": ["Obowo", "Ahiara", "Ezinihitte", "Owerri"],
  "Oguta": ["Oguta", "Ahiara", "Ezinihitte", "Owerri"],
  "Ohaji/Egbema": ["Ohaji/Egbema", "Ahiara", "Ezinihitte", "Owerri"],
  "Okigwe": ["Okigwe", "Ahiara", "Ezinihitte", "Owerri"],
  "Onuimo": ["Onuimo", "Ahiara", "Ezinihitte", "Owerri"],
  "Orlu": ["Orlu", "Ahiara", "Ezinihitte", "Owerri"],
  "Orsu": ["Orsu", "Ahiara", "Ezinihitte", "Owerri"],
  "Oru East": ["Oru East", "Ahiara", "Ezinihitte", "Owerri"],
  "Oru West": ["Oru West", "Ahiara", "Ezinihitte", "Owerri"],
  "Owerri Municipal": ["Owerri", "Ahiara", "Ezinihitte", "Owerri"],
  "Owerri North": ["Owerri North", "Ahiara", "Ezinihitte", "Owerri"],
  "Owerri West": ["Owerri West", "Ahiara", "Ezinihitte", "Owerri"],
  "Unuimo": ["Unuimo", "Ahiara", "Ezinihitte", "Owerri"]
};

// Sample villages data (this would be much more comprehensive in a real implementation)
export const villagesData: { [town: string]: string[] } = {
  "Aba": ["Aba", "Eziukwu", "Umuokpoji", "Ogbor Hill", "Ariaria"],
  "Eziukwu": ["Eziukwu", "Umuokpoji", "Ogbor Hill", "Ariaria", "Aba"],
  "Umuokpoji": ["Umuokpoji", "Ogbor Hill", "Ariaria", "Aba", "Eziukwu"],
  "Arochukwu": ["Arochukwu", "Abam", "Ihechiowa", "Ututu", "Aro"],
  "Abam": ["Abam", "Ihechiowa", "Ututu", "Aro", "Arochukwu"],
  "Ihechiowa": ["Ihechiowa", "Ututu", "Aro", "Arochukwu", "Abam"],
  "Ututu": ["Ututu", "Aro", "Arochukwu", "Abam", "Ihechiowa"],
  "Bende": ["Bende", "Amaokwe", "Nkpa", "Uzuakoli", "Bende"],
  "Amaokwe": ["Amaokwe", "Nkpa", "Uzuakoli", "Bende", "Bende"],
  "Nkpa": ["Nkpa", "Uzuakoli", "Bende", "Bende", "Amaokwe"],
  "Uzuakoli": ["Uzuakoli", "Bende", "Bende", "Amaokwe", "Nkpa"],
  "Ikwuano": ["Ikwuano", "Ariam", "Oboro", "Umuahia", "Ikwuano"],
  "Ariam": ["Ariam", "Oboro", "Umuahia", "Ikwuano", "Ikwuano"],
  "Oboro": ["Oboro", "Umuahia", "Ikwuano", "Ikwuano", "Ariam"],
  "Umuahia": ["Umuahia", "Ikwuano", "Ikwuano", "Ariam", "Oboro"],
  "Isiala Ngwa": ["Isiala Ngwa", "Amaise", "Ntigha", "Umuokoro", "Isiala Ngwa"],
  "Amaise": ["Amaise", "Ntigha", "Umuokoro", "Isiala Ngwa", "Isiala Ngwa"],
  "Ntigha": ["Ntigha", "Umuokoro", "Isiala Ngwa", "Isiala Ngwa", "Amaise"],
  "Umuokoro": ["Umuokoro", "Isiala Ngwa", "Isiala Ngwa", "Amaise", "Ntigha"],
  "Isuikwuato": ["Isuikwuato", "Amaokwe", "Nkpa", "Uzuakoli", "Isuikwuato"],
  "Obi Ngwa": ["Obi Ngwa", "Amaise", "Ntigha", "Umuokoro", "Obi Ngwa"],
  "Ohafia": ["Ohafia", "Abam", "Ihechiowa", "Ututu", "Ohafia"],
  "Osisioma": ["Osisioma", "Aba", "Eziukwu", "Umuokpoji", "Osisioma"],
  "Ugwunagbo": ["Ugwunagbo", "Aba", "Eziukwu", "Umuokpoji", "Ugwunagbo"],
  "Ukwa East": ["Ukwa East", "Aba", "Eziukwu", "Umuokpoji", "Ukwa East"],
  "Ukwa West": ["Ukwa West", "Aba", "Eziukwu", "Umuokpoji", "Ukwa West"],
  "Umuahia North": ["Umuahia North", "Ariam", "Oboro", "Umuahia", "Umuahia North"],
  "Umuahia South": ["Umuahia South", "Ariam", "Oboro", "Umuahia", "Umuahia South"],
  "Umu Nneochi": ["Umu Nneochi", "Ariam", "Oboro", "Umuahia", "Umu Nneochi"]
};

// Countries where Igbo people are found
export const continents = [
  "Africa", "Asia", "Europe", "North America", "South America", "Oceania", "Antarctica"
];

export const countries = [
  "Nigeria", "United States", "United Kingdom", "Canada", "Germany", "Italy", 
  "France", "Spain", "Netherlands", "Belgium", "Switzerland", "Austria", 
  "Ireland", "Portugal", "Sweden", "Norway", "Denmark", "Finland", 
  "Australia", "New Zealand", "South Africa", "Ghana", "Kenya", "Uganda", 
  "Tanzania", "Zambia", "Zimbabwe", "Botswana", "Namibia", "Lesotho", 
  "Swaziland", "Malawi", "Mozambique", "Angola", "Congo", "Cameroon", 
  "Equatorial Guinea", "Gabon", "Central African Republic", "Chad", 
  "Niger", "Benin", "Togo", "Burkina Faso", "Mali", "Senegal", 
  "Gambia", "Guinea", "Sierra Leone", "Liberia", "Ivory Coast", 
  "Brazil", "Argentina", "Chile", "Colombia", "Venezuela", "Peru", 
  "Ecuador", "Bolivia", "Paraguay", "Uruguay", "Guyana", "Suriname", 
  "Trinidad and Tobago", "Jamaica", "Barbados", "Grenada", "Saint Lucia", 
  "Saint Vincent and the Grenadines", "Antigua and Barbuda", "Dominica", 
  "Saint Kitts and Nevis", "Bahamas", "Belize", "Costa Rica", "Panama", 
  "Honduras", "Nicaragua", "El Salvador", "Guatemala", "Mexico", 
  "Cuba", "Dominican Republic", "Haiti", "Puerto Rico", "Virgin Islands", 
  "Cayman Islands", "Bermuda", "Turks and Caicos Islands", "Aruba", 
  "Curacao", "Bonaire", "Sint Maarten", "Saba", "Sint Eustatius", 
  "Other"
];

export interface GenealogyFormData {
  currentCountry: string;
  currentState: string;
  currentLGA: string;
  currentTown: string;
  currentVillage: string;
  originState: string;
  originLGA: string;
  originTown: string;
  originVillage: string;
  kindred: string;
  familyName: string;
  personalName: string;
  email: string;
  phone: string;
  additionalInfo: string;
}
