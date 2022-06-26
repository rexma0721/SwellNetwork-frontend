import * as yup from 'yup';

const ServerDetailsSchema = yup.object().shape({
  location: yup.string().required().label('Location'),
  cpu: yup.string().required().label('CPU'),
  ram: yup.string().required().label('RAM'),
  networkBandwidth: yup.string().required().label('Network bandwidth'),
  storage: yup.string().required().label('Storage'),
  noOfNodes: yup.number().min(1).required().label('Number of nodes'),
});

const OperatorDetailsSchema = yup.object().shape({
  type: yup.string().required().label('Type').oneOf(['INDIVIDUAL', 'INSTITUTIONAL']),
  name: yup.string().required().label('Name'),
  yearsOfExperience: yup.number().required().label('Years of experience'),
  email: yup.string().label('Email').email('Invalid Email Address'),
  website: yup.string().label('Website'),
  socialMediaUrl: yup.string().label('Socials'),
  description: yup.string().required().label('Description'),
});

// eslint-disable-next-line import/prefer-default-export
export const BecomeANodeOperatorSchema = yup.object().shape({
  serverDetails: ServerDetailsSchema,
  operatorDetails: OperatorDetailsSchema,
});
