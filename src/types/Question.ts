export interface Option {
  id: number;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
}