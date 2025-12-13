import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SymptomDto } from '@/pages/service/symptom/symptom.model';
import { SymptomFacade } from '@/pages/service/symptom/symptom.facade';

@Injectable({
    providedIn: 'root'
})
export class SymptomService {

    private readonly apiUrl = 'http://localhost:8080/symptoms'; // backend url

    constructor(private http: HttpClient) {}

    getAll(): Observable<SymptomDto[]> {
        return this.http.get<SymptomDto[]>(this.apiUrl);
        // return of([
        //     {
        //         id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        //         name: 'Headache',
        //         notes: 'Mild, recurring in the afternoon.'
        //     },
        //     {
        //         id: '7d9c2ec3-2a7e-4f8f-9be6-21c8d2ed2b9d',
        //         name: 'Nausea',
        //         notes: 'Occurs after eating heavy meals.'
        //     },
        //     {
        //         id: '0b9d1a35-83a1-4c3d-9c25-830a48ceadf5',
        //         name: 'Fatigue',
        //         notes: 'Patient reports low energy throughout the day.'
        //     },
        //     {
        //         id: 'd1a75c63-f3e4-4c88-90f5-8b9a4fbc60ca',
        //         name: 'Dizziness',
        //         notes: 'Short episodes lasting 1–2 minutes.'
        //     }
        // ]);



    }

    getById(id: string): Observable<SymptomDto> {
        return this.http.get<SymptomDto>(this.apiUrl + '/' + id);
    }

    create(symptom: Omit<SymptomDto, 'id'>): Observable<SymptomDto> {
        return this.http.post<SymptomDto>(this.apiUrl, symptom);
    }

    update(id: string, symptom: SymptomDto): Observable<SymptomDto> {
        return this.http.put<SymptomDto>(this.apiUrl + '/' + id, symptom);
    }

    delete(id: string): Observable<SymptomDto> {
        return this.http.delete<SymptomDto>(this.apiUrl + '/' + id);
    }
}
