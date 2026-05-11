export interface NetflixData {
  show_id: string;
  type: string;
  title: string;
  director?: string;
  cast?: string[];
  country?: string[];
  date_added?: string;
  release_year?: number;
  rating?: string;
  duration?: string;
  listed_in?: string[];
  description?: string;
  year_added: number;
  month_added: number;
}
