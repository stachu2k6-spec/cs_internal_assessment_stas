import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CreateMeetingDto, MeetingDto } from '@/pages/service/meeting/meeting.model';

@Injectable({
    providedIn: 'root'
})
export class MeetingService {

    private readonly apiUrl = 'http://localhost:8080/meetings'; // backend url

    constructor(private http: HttpClient) {}

    getAll(): Observable<MeetingDto[]> {
        return this.http.get<MeetingDto[]>(this.apiUrl);
        // TODO: CUT SECONDS WHEN SAVING TO DB!!!
    }

    getById(id: string): Observable<MeetingDto> {
        return this.http.get<MeetingDto>(this.apiUrl + '/' + id);
    }

    getByPatientId(patientId: string): Observable<MeetingDto[]> {
        return this.http.get<MeetingDto[]>(this.apiUrl + '/patients/' + patientId);
    }

    getMonthMeetings(year: number, month: number): Observable<MeetingDto[]> {
        return this.http.get<MeetingDto[]>(this.apiUrl + '/' + year + '/' + month);
    }

    create(meeting: CreateMeetingDto): Observable<MeetingDto> {
        return this.http.post<MeetingDto>(this.apiUrl, meeting);
    }

    update(id: string, meeting: MeetingDto): Observable<MeetingDto> {
        return this.http.put<MeetingDto>(this.apiUrl + '/' + id, meeting);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(this.apiUrl + '/' + id);
    }
}
