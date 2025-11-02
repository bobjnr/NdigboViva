// Database schema matching the Anambra State Database CSV structure
export interface GenealogyRecord {
  // Basic Classification
  specie: string; // "HUMANITY"
  race: string; // "NEGRO"
  continent: string; // "AFRICA"
  subContinent: string; // "SUB-SAHARA"
  subRegion: string; // "WEST AFRICA"
  nationality: string; // "NIGERIA"
  ethnicity: string; // "UMU - IGBO"
  region: string; // "SOUTH EAST"
  
  // Political Divisions
  state: string; // "ANAMBRA"
  senatorialDistrict: string; // "ANAMBRA SOUTH"
  federalConstituency: string; // "AGUATA"
  localGovernmentArea: string; // "AGUATA"
  stateConstituency: string; // "AGUATA I"
  
  // Geographic Divisions
  town: string; // "ACHINA", "AGULUEZECHUKWU", etc.
  townQuarter: string; // "EZI"
  obiAreas: string; // "AMAMU"
  clan: string; // "DIOHA"
  village: string; // "ELEKECHEM"
  
  // Family Structure
  kindredHamlet: string; // "UMUNNEBOGBU", "UMUOKPARAUGHANZE"
  umunna: string; // Extended family groups
  
  // Individual Family Members
  extendedFamily: {
    familyName: string; // "OKAFOR"
    individualNames: string[]; // ["EMMANUEL NONYE", "GINIKACHUKWU NELSON", etc.]
  }[];
  
  // Additional Metadata
  recordId: string;
  createdAt: Date;
  updatedAt: Date;
  source: string; // "FORM_SUBMISSION" | "MANUAL_ENTRY" | "IMPORTED"
  verified: boolean;
  notes?: string;
}

// Form submission interface that maps to the database structure
export interface GenealogyFormSubmission {
  // Current Location
  currentContinent: string;
  currentCountry: string;
  currentState: string;
  currentLGA: string;
  currentTown: string;
  currentVillage: string;
  
  // Origin Location (Ancestral)
  originState: string;
  originLGA: string;
  originTown: string;
  originVillage: string;
  originTownQuarter?: string;
  originObiAreas?: string;
  originClan?: string;
  
  // Family Information
  kindred: string;
  familyName: string;
  personalName: string;
  umunna?: string;
  
  // Contact Information
  email: string;
  phone?: string;
  
  // Additional Information
  additionalInfo?: string;
  
  // Extended Family Members
  extendedFamilyMembers?: {
    name: string;
    relationship: string; // "Father", "Mother", "Sibling", "Cousin", etc.
  }[];
}

// Database operations
export class GenealogyDatabase {
  private records: GenealogyRecord[] = [];
  
  // Convert form submission to database record
  convertFormToRecord(formData: GenealogyFormSubmission): GenealogyRecord {
    return {
      // Basic Classification (Standard for all Igbo records)
      specie: "HUMANITY",
      race: "NEGRO",
      continent: "AFRICA",
      subContinent: "SUB-SAHARA",
      subRegion: "WEST AFRICA",
      nationality: "NIGERIA",
      ethnicity: "UMU - IGBO",
      region: "SOUTH EAST",
      
      // Political Divisions (from form)
      state: formData.originState.toUpperCase(),
      senatorialDistrict: this.getSenatorialDistrict(formData.originState, formData.originLGA),
      federalConstituency: formData.originLGA.toUpperCase(),
      localGovernmentArea: formData.originLGA.toUpperCase(),
      stateConstituency: this.getStateConstituency(formData.originLGA),
      
      // Geographic Divisions
      town: formData.originTown.toUpperCase(),
      townQuarter: formData.originTownQuarter?.toUpperCase() || "",
      obiAreas: formData.originObiAreas?.toUpperCase() || "",
      clan: formData.originClan?.toUpperCase() || "",
      village: formData.originVillage.toUpperCase(),
      
      // Family Structure
      kindredHamlet: formData.kindred.toUpperCase(),
      umunna: formData.umunna?.toUpperCase() || "",
      
      // Individual Family Members
      extendedFamily: [{
        familyName: formData.familyName.toUpperCase(),
        individualNames: [formData.personalName.toUpperCase()]
      }],
      
      // Metadata
      recordId: this.generateRecordId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      source: "FORM_SUBMISSION",
      verified: false,
      notes: formData.additionalInfo
    };
  }
  
  // Get senatorial district based on state and LGA
  private getSenatorialDistrict(state: string, lga: string): string {
    // This would be mapped based on your actual data
    const senatorialDistricts: { [key: string]: { [key: string]: string } } = {
      "ANAMBRA": {
        "AGUATA": "ANAMBRA SOUTH",
        "IHIALA": "ANAMBRA SOUTH",
        "AWKA NORTH": "ANAMBRA CENTRAL",
        "AWKA SOUTH": "ANAMBRA CENTRAL",
        "ONITSHA NORTH": "ANAMBRA NORTH",
        "ONITSHA SOUTH": "ANAMBRA NORTH"
      }
    };
    
    return senatorialDistricts[state.toUpperCase()]?.[lga.toUpperCase()] || `${state.toUpperCase()} CENTRAL`;
  }
  
  // Get state constituency based on LGA
  private getStateConstituency(lga: string): string {
    // This would be mapped based on your actual data
    const constituencies: { [key: string]: string } = {
      "AGUATA": "AGUATA I",
      "IHIALA": "IHIALA I",
      "AWKA NORTH": "AWKA NORTH I",
      "AWKA SOUTH": "AWKA SOUTH I"
    };
    
    return constituencies[lga.toUpperCase()] || `${lga.toUpperCase()} I`;
  }
  
  // Generate unique record ID
  private generateRecordId(): string {
    return `GENEALOGY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Add new record
  addRecord(record: GenealogyRecord): void {
    this.records.push(record);
  }
  
  // Get all records
  getAllRecords(): GenealogyRecord[] {
    return this.records;
  }
  
  // Search records by criteria
  searchRecords(criteria: Partial<GenealogyRecord>): GenealogyRecord[] {
    return this.records.filter(record => {
      return Object.entries(criteria).every(([key, value]) => {
        if (value === undefined || value === "") return true;
        return record[key as keyof GenealogyRecord] === value;
      });
    });
  }
  
  // Get records by state
  getRecordsByState(state: string): GenealogyRecord[] {
    return this.records.filter(record => record.state === state.toUpperCase());
  }
  
  // Get records by LGA
  getRecordsByLGA(lga: string): GenealogyRecord[] {
    return this.records.filter(record => record.localGovernmentArea === lga.toUpperCase());
  }
  
  // Get records by town
  getRecordsByTown(town: string): GenealogyRecord[] {
    return this.records.filter(record => record.town === town.toUpperCase());
  }
  
  // Get records by village
  getRecordsByVillage(village: string): GenealogyRecord[] {
    return this.records.filter(record => record.village === village.toUpperCase());
  }
  
  // Get records by family name
  getRecordsByFamilyName(familyName: string): GenealogyRecord[] {
    return this.records.filter(record => 
      record.extendedFamily.some(family => 
        family.familyName === familyName.toUpperCase()
      )
    );
  }
  
  // Get records by kindred
  getRecordsByKindred(kindred: string): GenealogyRecord[] {
    return this.records.filter(record => record.kindredHamlet === kindred.toUpperCase());
  }
  
  // Export to CSV format (matching your database structure)
  exportToCSV(): string {
    const headers = [
      "THE SPECIE", "RACE", "CONTINENT", "SUB-CONTINENT", "SUB-REGION", "NATIONALITY", 
      "ETHNICITY", "REGION", "STATE", "SENATORIAL DISTRICT", "FEDERAL CONSTITUENCY", 
      "LOCAL GOVERNMENT AREA", "STATE CONSTITUENCY", "TOWN", "TOWN QUARTER", "OBI AREAS", 
      "CLAN", "VILLAGE", "KINDRED/HAMLET", "UMUNNA", "EXT. FAMILY"
    ];
    
    const csvRows = [headers.join(",")];
    
    this.records.forEach(record => {
      record.extendedFamily.forEach(family => {
        family.individualNames.forEach(name => {
          const row = [
            record.specie,
            record.race,
            record.continent,
            record.subContinent,
            record.subRegion,
            record.nationality,
            record.ethnicity,
            record.region,
            record.state,
            record.senatorialDistrict,
            record.federalConstituency,
            record.localGovernmentArea,
            record.stateConstituency,
            record.town,
            record.townQuarter,
            record.obiAreas,
            record.clan,
            record.village,
            record.kindredHamlet,
            record.umunna,
            family.familyName,
            name
          ];
          csvRows.push(row.join(","));
        });
      });
    });
    
    return csvRows.join("\n");
  }
}

// Create a singleton instance
export const genealogyDB = new GenealogyDatabase();
