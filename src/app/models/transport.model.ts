export interface Transport {
  id?: number;
  type: string;
  numero: string;
  compagnie: string;
  depart: string;
  arrivee: string;
  dateDepart: Date;  // Format ISO, ex: "2025-05-22T12:00:00Z"
  dateArrivee: Date;
  voyageId?: number;
}

export type CreateTransportDto = Omit<Transport, 'id'>;

export type UpdateTransportDto = Partial<Omit<Transport, 'id' | 'voyageId'>>;
