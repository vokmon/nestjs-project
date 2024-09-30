export type JwtValidationResultPayload = {
  user: {
    role: {
      id: string;
      name: string;
      description: string | null;
      actionsIds: string[];
    };
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    roleId: string;
  };
  actions: string[];
};
