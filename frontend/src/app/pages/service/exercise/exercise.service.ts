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

    delete(id: string): Observable<ExerciseDto> {
        return this.http.delete<ExerciseDto>(this.apiUrl + '/' + id);
    }
}
