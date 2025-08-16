export const DEPARTMENTS = [
  {
    id: 'immigration',
    name: 'Department of Immigration & Emigration',
    description: 'Handles passports, visas, residence permits and related services in Sri Lanka.',
    services: [
      { id: 'working-visa-extension', name: 'Working Visa Extension', short: 'Extend your work visa with document submission, appointment & online payment.' },
      { id: 'tourist-visa-extension', name: 'Tourist Visa Extension', short: 'Extend tourist visa (not implemented in demo).' },
    ],
  },
  {
    id: 'motor-traffic',
    name: 'Department of Motor Traffic',
    description: 'Licensing, vehicle registration, and testing services.',
    services: [
      { id: 'driving-license-renewal', name: 'Driving License Renewal', short: 'Renew your driving license (placeholder).' },
    ],
  },
]

export const SEARCH_ITEMS = DEPARTMENTS.flatMap(dep => [
  { type: 'department', id: dep.id, name: dep.name, description: dep.description },
  ...dep.services.map(s => ({ type: 'service', id: s.id, depId: dep.id, name: s.name, description: s.short }))
])
