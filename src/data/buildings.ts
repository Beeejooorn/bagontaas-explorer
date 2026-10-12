export interface BuildingData {
  id: string;
  name: string;
  type: string;
  tagline: string;
  trivia: string;
  gridX: number;
  gridY: number;
}

export const BAGONTAAS_BUILDINGS: BuildingData[] = [
  {
    id: 'bgy_hall',
    name: 'Bagontaas Barangay Hall',
    type: 'Government / Civic',
    tagline: 'Center of community governance and services.',
    trivia: 'Home of the Barangay Council, local security (Tanod), and civil registry.',
    gridX: 20,
    gridY: 20
  },
  {
    id: 'public_market',
    name: 'Bagontaas Public Market',
    type: 'Market / Commercial',
    tagline: 'Fresh fruit, fish, and morning kakanin hub.',
    trivia: 'Busiest during the morning hours with vendors from neighboring Bukidnon farms.',
    gridX: 25,
    gridY: 22
  },
  {
    id: 'central_elem',
    name: 'Bagontaas Central Elementary School',
    type: 'Education',
    tagline: 'Shaping the youth of Bagontaas for generations.',
    trivia: 'One of the prominent educational institutions in Valencia City.',
    gridX: 18,
    gridY: 28
  },
  {
    id: 'parish_church',
    name: 'San Isidro Labrador Parish Church',
    type: 'Religious / Heritage',
    tagline: 'Patron saint of farmers and laborers.',
    trivia: 'A focal point of the annual barangay fiesta celebration.',
    gridX: 28,
    gridY: 18
  },
  {
    id: 'plaza_court',
    name: 'Bagontaas Covered Court & Plaza',
    type: 'Recreation / Sports',
    tagline: 'Town basketball tournaments and festivities.',
    trivia: 'The community gathering place for sports events, assemblies, and town fiestas.',
    gridX: 22,
    gridY: 24
  }
];
