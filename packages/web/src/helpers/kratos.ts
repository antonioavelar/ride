import { V0alpha1Api, Configuration } from "@ory/kratos-client";

// Uses the ORY Kratos NodeJS SDK:
const kratos = new V0alpha1Api(
  new Configuration({ basePath: process.env.REACT_APP_KRATOS_PUBLIC }),
);

export default kratos;
