// src/utils/env.ts

const LOCAL = "http://192.168.1.116:8080";
// ↑ Android emulator uses 10.0.2.2 for the host machine

export const ENV = {
  USE_MOCKS: false,              // <- turn off
  API_BASE_URL: LOCAL
};