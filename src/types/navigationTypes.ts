// navigationTypes.ts
export type RootStackParamList = {
    home: {
      screen: string;
      params ?: {
        userId?: string;
        userName?: string;
      };
    };
    chat: {
      userId?: string;
      userName?: string;
    };
    // Add other screens here
    splash: undefined;
    register: undefined;
    login: undefined;
  };
  
  export type RootTabParamList = {
    home: undefined;
    request: undefined;
    profile: undefined;
  };