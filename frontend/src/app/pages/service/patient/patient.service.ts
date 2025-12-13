import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { PatientDto } from '@/pages/service/patient/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

    private readonly apiUrl = 'http://localhost:8080/patients'; // backend url

    constructor(private http: HttpClient) {}

    getAll(): Observable<PatientDto[]> {
        return this.http.get<PatientDto[]>(this.apiUrl);
    }

    getById(id: String): Observable<PatientDto> {
        return this.http.get<PatientDto>(this.apiUrl + '/' + id);
    }

    create(patient: Omit<PatientDto, 'id'>): Observable<PatientDto> {
        return this.http.post<PatientDto>(this.apiUrl, patient);
    }

    update(id: string, patient: PatientDto): Observable<PatientDto> {
        return this.http.put<PatientDto>(this.apiUrl + '/' + id, patient);
    }

    delete(id: string): Observable<PatientDto> {
        return this.http.delete<PatientDto>(this.apiUrl + '/' + id);
    }
}
