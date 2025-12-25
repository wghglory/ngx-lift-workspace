export type Deployment = {
  operator: {
    name: string;
    namespace: string;
  };
  service: {
    cpu: number;
    replicas: number;
    url: string;
  };
  appProperties: Record<string, string>;
};
