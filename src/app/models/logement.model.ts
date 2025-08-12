export interface Logement {
  id?: number;
  nom: string;
  adress: string;
  voyageId: string;
}

export type CreateLogementDto = Omit<Logement, 'id'>;

export type UpdateLogementDto = Partial<Omit<Logement, 'id' | 'voyageId'>>;
