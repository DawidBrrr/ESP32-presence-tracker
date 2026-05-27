export type AuthResponse = {
  id: number;
  username: string;
  email: string;
  token: string;
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  usernameOrEmail: string;
  password: string;
};

export type DeviceRegistrationRequest = {
  id: string;
  token: string;
};

export type Device = {
  id: string;
  name: string;
};

export type UserDeviceCreateRequest = {
  id: string;
};

export type UserDeviceCreateResponse = {
  id: string;
  created: boolean;
};

export type Telemetry = {
  id: string;
  count: number;
  timestamp: string;
};
