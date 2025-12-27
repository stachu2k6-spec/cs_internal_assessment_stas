import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExerciseSymptomDto } from '@/pages/service/exercise-symptom/exercise-symptom.model';

@Injectable({
    providedIn: 'root'
})
export class ExerciseSymptomService {

    private readonly apiUrl = 'http://localhost:8080/exercise-symptoms';

    constructor(private http: HttpClient) {}

    getAll(): Observable<ExerciseSymptomDto[]> {
        return this.http.get<ExerciseSymptomDto[]>(this.apiUrl);
    }

    getById(id: string): Observable<ExerciseSymptomDto> {
        return this.http.get<ExerciseSymptomDto>(this.apiUrl + '/' + id);
    }


    getByExerciseId(exerciseId: string) {
        return this.http.get<ExerciseSymptomDto[]>(this.apiUrl + '/exercise/' + exerciseId);
    }

    getBySymptomId(symptomId: string) {
        return this.http.get<ExerciseSymptomDto[]>(this.apiUrl + '/symptom/' + symptomId);
    }

    getBySymptomIdList(symptomIdList: string[]) {
        return this.http.post<ExerciseSymptomDto[]>(this.apiUrl + '/symptom/list', symptomIdList);
    }

    create(payload: ExerciseSymptomDto): Observable<ExerciseSymptomDto> {
        return this.http.post<ExerciseSymptomDto>(this.apiUrl, payload);
    }

    update(id: string, exerciseSymptomDto: ExerciseSymptomDto): Observable<ExerciseSymptomDto> {
        return this.http.put<ExerciseSymptomDto>(
            this.apiUrl + '/' + id,
            exerciseSymptomDto
        );
    }

    updateMany(exerciseSymptoms: ExerciseSymptomDto[]) {
        return this.http.put<ExerciseSymptomDto[]>(this.apiUrl + '/many',
            exerciseSymptoms
        );
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(this.apiUrl + '/' + id);
    }



}
