export type OpenAIResponse = {
  object: string;
  data: Data[];
  model: string;
  usage: Usage;
};

export type Data = {
  object: string;
  index: number;
  embedding: number[];
};

export type Usage = {
  prompt_tokens: number;
  total_tokens: number;
};
