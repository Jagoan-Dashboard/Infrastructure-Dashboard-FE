export interface User {
  id: number;
  email: string;
  no_wa: string;
  nama: string;
  password: string;
  pekerjaan: string;
  peran: string;
  foto: string;
  accountID: string;
  isVerified: boolean;
  role_id: number;
  createdAt: Date;
  updatedAt: Date;
  role: Role;
}
