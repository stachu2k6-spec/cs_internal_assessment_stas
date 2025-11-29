import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { MeetingDto } from '@/pages/service/meeting/meeting.model';

@Injectable({
    providedIn: 'root'
})
export class MeetingService {

    private readonly apiUrl = 'http://localhost:8080/meetings'; // backend url

    constructor(private http: HttpClient) {}

    getAll(): Observable<MeetingDto[]> {
        return this.http.get<MeetingDto[]>(this.apiUrl);
        // TODO: CUT SECONDS WHEN SAVING TO DB!!!
        // return of([
        //     {
        //         id: '550e8400-e29b-41d4-a716-446655440000',
        //         date: '2025-11-24',
        //         startTime: '09:00:00',
        //         duration: 'PT60M',
        //         notes: 'Initial consultation.'
        //     },
        //     {
        //         id: '6fa459ea-ee8a-3ca4-894e-db77e160355e',
        //         date: '2025-11-25',
        //         startTime: '14:30:00',
        //         duration: 'PT45M',
        //         notes: 'Follow-up meeting.'
        //     },
        //     {
        //         id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
        //         date: '2025-11-26',
        //         startTime: '11:15:00',
        //         duration: 'PT30M',
        //         notes: 'Short check-in.'
        //     },
        //     {
        //         id: '16fd2706-8baf-433b-82eb-8c7fada847da',
        //         date: '2025-11-27',
        //         startTime: '16:00:00',
        //         duration: 'PT90M',
        //         notes: 'Long session with detailed examination.'
        //     }
        // ]);


    }

    getById(id: string): Observable<MeetingDto> {
        return this.http.get<MeetingDto>(this.apiUrl + '/' + id);
    }

    create(meeting: Omit<MeetingDto, 'id'>): Observable<MeetingDto> {
        return this.http.post<MeetingDto>(this.apiUrl, meeting);
    }

    update(id: number, meeting: MeetingDto): Observable<MeetingDto> {
        return this.http.put<MeetingDto>('${this.apiUrl}/${id}', meeting);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>('${this.apiUrl}/${id}');
    }
}
