import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { PatientDto } from '@/pages/service/patients/patients.model';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {

    private readonly apiUrl = 'http://localhost:8080/patients'; // backend url

    constructor(private http: HttpClient) {}

    getAll(): Observable<PatientDto[]> {
        //return this.http.get<PatientDto[]>(this.apiUrl);

        return of([
            { id: 1, name: 'John', surname: 'Doe', address: '123 Main St', notes: 'Allergic to penicillin' },
            { id: 2, name: 'Jane', surname: 'Smith', address: '456 Oak Ave', notes: 'Diabetic' },
            { id: 3, name: 'Michael', surname: 'Johnson', address: '789 Pine Rd', notes: 'Asthmatic' }
        ])
    }

    getById(id: number): Observable<PatientDto> {
        return this.http.get<PatientDto>('${this.apiUrl}/${id}');
    }

    create(patient: Omit<PatientDto, 'id'>): Observable<PatientDto> {
        return this.http.post<PatientDto>(this.apiUrl, patient);
    }

    update(id: number, patient: PatientDto): Observable<PatientDto> {
        return this.http.put<PatientDto>('${this.apiUrl}/${id}', patient);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>('${this.apiUrl}/${id}');
    }
}
