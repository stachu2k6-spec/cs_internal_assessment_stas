import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PatientSymptomDto } from '@/pages/service/patient-symptom/patient-symptom.model';

@Injectable({
    providedIn: 'root'
})
export class PatientSymptomService {

    private readonly apiUrl = 'http://localhost:8080/patient-symptoms';

    constructor(private http: HttpClient) {}

    getAll(): Observable<PatientSymptomDto[]> {
        return this.http.get<PatientSymptomDto[]>(this.apiUrl);
    }

    getByPatientId(patientId: string) {
        return this.http.get<PatientSymptomDto[]>(this.apiUrl + '/patient/' + patientId);
    }

    getById(id: string): Observable<PatientSymptomDto> {
        return this.http.get<PatientSymptomDto>(this.apiUrl + '/' + id);
    }

    create(payload: PatientSymptomDto): Observable<PatientSymptomDto> {
        return this.http.post<PatientSymptomDto>(this.apiUrl, payload);
    }

    update(id: string, payload: PatientSymptomDto): Observable<PatientSymptomDto> {
        return this.http.put<PatientSymptomDto>(
            this.apiUrl + '/' + id,
            payload
        );
    }

    updateMany(patientSymptoms: PatientSymptomDto[]) {
        return this.http.put<PatientSymptomDto[]>(this.apiUrl + '/many',
            patientSymptoms
        );
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(this.apiUrl + '/' + id);
    }



}
