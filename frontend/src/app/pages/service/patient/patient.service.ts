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

        // return of([
        //     {
        //         id: "1abc",
        //         name: 'John',
        //         surname: 'Doe',
        //         birthDate: new Date('1990-05-14'),
        //         gender: 'male',
        //         address: '123 Main St, Berlin',
        //         phoneNumber: '+49 123 456 789',
        //         email: 'john.doe@example.com',
        //         notes: 'No allergies.',
        //         activityLevel: 'medium',
        //         photoUrl: 'https://primefaces.org/cdn/primeng/images/galleria/galleria10.jpg'
        //     },
        //     {
        //         id: "2abc",
        //         name: 'Anna',
        //         surname: 'Kowalski',
        //         birthDate: new Date('1985-11-02'),
        //         gender: 'female',
        //         address: '45 Park Avenue, Warsaw',
        //         phoneNumber: '+48 500 100 200',
        //         email: 'anna.k@example.com',
        //         notes: 'Diabetic.',
        //         activityLevel: 'high',
        //         photoUrl: 'https://primefaces.org/cdn/primeng/images/galleria/galleria10.jpg'
        //     },
        //     {
        //         id: "3abc",
        //         name: 'Lukas',
        //         surname: 'Schmidt',
        //         birthDate: new Date('2000-01-20'),
        //         gender: 'male',
        //         address: '78 Sonnenallee, Munich',
        //         phoneNumber: '+49 987 654 321',
        //         email: 'lukas.schmidt@example.com',
        //         notes: 'Smoker.',
        //         activityLevel: 'low',
        //         photoUrl: 'https://primefaces.org/cdn/primeng/images/galleria/galleria10.jpg'
        //     }
        // ]);

    }

    getById(id: String): Observable<PatientDto> {
        return this.http.get<PatientDto>(this.apiUrl + '/' + id);
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
