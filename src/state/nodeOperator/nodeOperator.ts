import { INodeOperator } from './NodeOperator.interface';

export const swellDefaultNode: INodeOperator = {
  name: 'Swell Network',
  icon: '',
  isVerified: true,
  serverDetails: {
    location: 'CHD',
    cpu: 'Intel Xeon',
    ram: '4GB',
    networkBandwidth: '1TB',
    storage: '80GB',
    noOfNodes: 1,
  },
  operatorDetails: {
    name: 'Swell',
    type: 'node',
    yearsOfExperience: 5,
    email: 'paramjot.saini@block8.com',
    website: 'block8.com',
    socialMediaUrl: 'facebook.com',
    description: 'Description',
  },
};
const nodeOperatorsList: INodeOperator[] = [
  {
    name: 'node operator 1',
    icon: '',
    isVerified: true,
    serverDetails: {
      location: 'CHD',
      cpu: 'Intel Xeon',
      ram: '4GB',
      networkBandwidth: '1TB',
      storage: '80GB',
      noOfNodes: 1,
    },
    operatorDetails: {
      name: 'Block8',
      type: 'node',
      yearsOfExperience: 5,
      email: 'paramjot.saini@block8.com',
      website: 'block8.com',
      socialMediaUrl: 'facebook.com',
      description: 'Description',
    },
  },
  {
    name: 'node operator 2',
    icon: '',
    isVerified: true,
    serverDetails: {
      location: 'CHD 2',
      cpu: 'Intel Xeon 2',
      ram: '4GB',
      networkBandwidth: '1TB',
      storage: '80GB',
      noOfNodes: 1,
    },
    operatorDetails: {
      name: 'Block8',
      type: 'node',
      yearsOfExperience: 2,
      email: 'paramjot.saini@block8.com',
      website: 'block8.com',
      socialMediaUrl: 'facebook.com',
      description: 'Description',
    },
  },
];
export default nodeOperatorsList;
