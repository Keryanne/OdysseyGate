export interface Activity {
  id?: number;
  description: string;
  lieu: string;
  voyageId: number;
}

export type CreateActivityDto = Omit<Activity, 'id'>;

export type UpdateActivityDto = Partial<Omit<Activity, 'id' | 'voyageId'>>;
