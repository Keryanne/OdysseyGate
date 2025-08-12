import { Transport } from "./transport.model";
import { Logement } from "./logement.model";
import { Activity } from "./activity.model";

export interface Voyage {
  id: number;
  destination: string;
  dateDepart: string;
  dateArrivee: string;
  nombreVoyageurs: number;
  villeDepart: string;
  imageUrl: string;
  user: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
  transport: Transport[];
  logement: Logement[];
  activite: Activity[];
}