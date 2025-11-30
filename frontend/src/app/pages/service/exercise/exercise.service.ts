import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ExerciseDto } from '@/pages/service/exercise/exercise.model';

@Injectable({
    providedIn: 'root'
})
export class ExerciseService {

    private readonly apiUrl = 'http://localhost:8080/exercises'; // backend url

    constructor(private http: HttpClient) {}

    getAll(): Observable<ExerciseDto[]> {
        return this.http.get<ExerciseDto[]>(this.apiUrl);
        // return of([
        //     {
        //         id: 'e1c2a8a1-2b6f-4f6d-a9f2-17b243c1d512',
        //         name: 'Shoulder Mobility',
        //         notes: 'Gentle circular movements to increase joint range.'
        //     },
        //     {
        //         id: '4a39d9a2-3c3d-4a4f-a17e-b7d12d7bc9af',
        //         name: 'Squat',
        //         notes: 'Bodyweight squats focusing on proper knee alignment.'
        //     },
        //     {
        //         id: 'c97f7d91-67fb-4e9a-8a1e-25e62b2a98b4',
        //         name: 'Plank',
        //         notes: 'Core stabilization exercise; hold for 30–60 seconds.'
        //     },
        //     {
        //         id: '9e4b2c54-bc78-4fc9-b0ce-3f0fbcd78fe5',
        //         name: 'Hamstring Stretch',
        //         notes: 'Static stretch held for 20–30 seconds per leg.'
        //     }
        // ]);
    }

    getById(id: string): Observable<ExerciseDto> {
        return this.http.get<ExerciseDto>(this.apiUrl + '/' + id);
    }

    create(exercise: Omit<ExerciseDto, 'id'>): Observable<ExerciseDto> {
        return this.http.post<ExerciseDto>(this.apiUrl, exercise);
    }

    update(id: string, exercise: ExerciseDto): Observable<ExerciseDto> {
        return this.http.put<ExerciseDto>(this.apiUrl + '/' + id, exercise);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(this.apiUrl + '/' + id);
    }
}
