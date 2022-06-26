export interface IServerDetails {
  location: string;
  cpu: string;
  ram: string;
  networkBandwidth: string;
  storage: string;
  noOfNodes: number;
}

export interface IOperatorDetails {
  type: string;
  name: string;
  yearsOfExperience: number;
  email: string;
  website: string;
  socialMediaUrl: string;
  description: string;
}
export interface IBecomeANodeOperator {
  serverDetails: IServerDetails;
  operatorDetails: IOperatorDetails;
}
export interface INodeOperator extends IBecomeANodeOperator {
  name?: string;
  icon?: string;
  isVerified?: boolean;
}
