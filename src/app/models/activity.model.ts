export interface Activity {
  id?: number;
  description: string;
  lieu: string;
  voyageId: string;
}

export type CreateActivityDto = Omit<Activity, 'id'>;

export type UpdateActivityDto = Partial<Omit<Activity, 'id' | 'voyageId'>>;
