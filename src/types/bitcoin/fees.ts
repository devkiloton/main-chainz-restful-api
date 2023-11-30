export type Fees = {
  regular: number;
  priority: number;
  limits: {
    min: number;
    max: number;
  };
};
