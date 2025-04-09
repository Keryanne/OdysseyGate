export const tripDetails = {
  1: { // Paris
    transports: [
      { type: 'Train', company: 'SNCF', departure: '2025-03-05T09:00', arrival: '2025-03-05T12:30' },
      { type: 'Metro', line: 'M4', from: 'Gare de Lyon', to: 'Châtelet' }
    ],
    logements: [
      { name: 'Hôtel Le Marais', address: '15 Rue de Bretagne, 75003 Paris', nights: 10 }
    ],
    activites: [
      { name: 'Tour Eiffel', date: '2025-03-06', hour: '14:00' },
      { name: 'Croisière sur la Seine', date: '2025-03-07', hour: '18:00' }
    ]
  },

  2: { // Seoul
    transports: [],
    logements: [
      { name: 'Airbnb Gangnam', address: '112 Teheran-ro, Seoul', nights: 8 }
    ],
    activites: [
      { name: 'Palais Gyeongbokgung', date: '2025-05-03', hour: '10:00' },
      { name: 'Quartier Hongdae', date: '2025-05-04', hour: '16:00' }
    ]
  },

  3: { // New York
    transports: [
      { type: 'Avion', company: 'Delta Airlines', departure: '2025-07-10T15:45', arrival: '2025-07-10T23:00' }
    ],
    logements: [],
    activites: [
      { name: 'Empire State Building', date: '2025-07-11', hour: '11:00' },
      { name: 'Central Park', date: '2025-07-12', hour: '14:30' }
    ]
  },

  4: { // Tokyo
    transports: [
      { type: 'Avion', company: 'ANA', departure: '2025-09-15T13:20', arrival: '2025-09-16T07:45' },
      { type: 'Train', company: 'JR', from: 'Narita Airport', to: 'Tokyo Station' }
    ],
    logements: [
      { name: 'Capsule Hotel Shinjuku', address: 'Shinjuku-ku, Tokyo', nights: 9 }
    ],
    activites: []
  },

  5: { // Rome
    transports: [],
    logements: [],
    activites: []
  }
};
