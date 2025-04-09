type TripDetail = {
  transports: any[];
  logements: any[];
  activites: any[];
};

export const tripDetails: { [key: number]: TripDetail } = {
  1: {
    transports: [
      {
        type: 'Train',
        from: 'Montpellier',
        to: 'Paris',
        date: '2025-03-05T09:00',
        duration: '3h30',
        file: 'billet-train-sncf.pdf'
      },
      {
        type: 'Metro',
        from: 'Gare de Lyon',
        to: 'Châtelet',
        date: '2025-03-05T13:00',
        duration: '15min',
        file: 'ticket-metro-paris.pdf'
      }
    ],
    logements: [
      {
        name: 'Hôtel Le Marais',
        address: '15 Rue de Bretagne, 75003 Paris',
        startDate: '2025-03-05',
        endDate: '2025-03-15',
        file: 'confirmation-hotel-paris.pdf'
      }
    ],
    activites: [
      {
        name: 'Tour Eiffel',
        date: '2025-03-06',
        hour: '14:00',
        location: 'Champ de Mars, Paris',
        file: 'eiffel-ticket.pdf'
      },
      {
        name: 'Croisière sur la Seine',
        date: '2025-03-07',
        hour: '18:00',
        location: 'Port de la Bourdonnais',
        file: 'croisiere-seine.pdf'
      }
    ]
  },
  2: {
    transports: [],
    logements: [
      {
        name: 'Airbnb Gangnam',
        address: '112 Teheran-ro, Seoul',
        startDate: '2025-05-02',
        endDate: '2025-05-10',
        file: 'reservation-airbnb-seoul.pdf'
      }
    ],
    activites: [
      {
        name: 'Palais Gyeongbokgung',
        date: '2025-05-03',
        hour: '10:00',
        location: '161 Sajik-ro, Seoul',
        file: 'entree-palais.pdf'
      },
      {
        name: 'Quartier Hongdae',
        date: '2025-05-04',
        hour: '16:00',
        location: 'Hongdae, Mapo-gu',
        file: 'plan-hongdae.pdf'
      }
    ]
  },
  3: {
    transports: [
      {
        type: 'Avion',
        from: 'Paris',
        to: 'New York',
        date: '2025-07-10T15:45',
        duration: '8h15',
        file: 'billet-avion-delta.pdf'
      }
    ],
    logements: [],
    activites: [
      {
        name: 'Empire State Building',
        date: '2025-07-11',
        hour: '11:00',
        location: '20 W 34th St, New York',
        file: 'empire-entry.pdf'
      },
      {
        name: 'Central Park',
        date: '2025-07-12',
        hour: '14:30',
        location: 'Manhattan, New York',
        file: 'map-central-park.pdf'
      }
    ]
  },
  4: {
    transports: [
      {
        type: 'Avion',
        from: 'Paris',
        to: 'Tokyo',
        date: '2025-09-15T13:20',
        duration: '11h25',
        file: 'billet-avion-ana.pdf'
      },
      {
        type: 'Train',
        from: 'Narita Airport',
        to: 'Tokyo Station',
        date: '2025-09-16T09:00',
        duration: '1h00',
        file: 'ticket-narita-express.pdf'
      }
    ],
    logements: [
      {
        name: 'Capsule Hotel Shinjuku',
        address: 'Shinjuku-ku, Tokyo',
        startDate: '2025-09-15',
        endDate: '2025-09-25',
        file: 'confirmation-capsule.pdf'
      }
    ],
    activites: []
  },
  5: {
    transports: [],
    logements: [],
    activites: []
  }
};
