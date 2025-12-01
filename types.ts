export interface GroundingSource {
  uri: string;
  title: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  sources?: GroundingSource[];
}
