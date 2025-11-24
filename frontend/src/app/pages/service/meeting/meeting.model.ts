export interface MeetingDto {
    id: string;              // UUID
    date: string;            // ISO date: '2025-11-24'
    startTime: string;       // ISO time: '14:30:00'
    duration: string;        // ISO-8601 duration: 'PT60M' (1 hour)
    notes: string;
}
