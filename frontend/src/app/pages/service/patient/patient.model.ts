export interface PatientDto {
    id: string;             // UUID
    name: string;
    surname: string;
    birthDate: Date;      // ISO date: '2025-11-24'
    gender: string;
    address: string;
    phoneNumber: string;
    email: string;
    notes: string;
    activityLevel: string;
    photoUrl: string;
}
