import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PatientDto } from '@/pages/service/patients/patients.model';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {

    private readonly apiUrl = 'http://localhost:8080/patients'; // backend url

    constructor(private http: HttpClient) {}

    getAll(): Observable<PatientDto[]> {
        return this.http.get<PatientDto[]>(this.apiUrl);
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
