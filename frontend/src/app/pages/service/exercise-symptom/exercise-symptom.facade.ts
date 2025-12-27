import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { ExerciseSymptomDto } from '@/pages/service/exercise-symptom/exercise-symptom.model';
import { ExerciseSymptomService } from '@/pages/service/exercise-symptom/exercise-symptom.service';

@Injectable({
    providedIn: 'root'
})
export class ExerciseSymptomFacade {

    exerciseSymptomState$ = new BehaviorSubject<ExerciseSymptomDto[]>([]);
    exerciseSymptomByIdState$ = new BehaviorSubject<ExerciseSymptomDto | null>(null);

    constructor(private exerciseSymptomService: ExerciseSymptomService) {}

    /* ===================== FETCH ===================== */

    fetchAll(): void {
        this.exerciseSymptomService.getAll()
            .pipe(
                take(1),
                tap(x => this.exerciseSymptomState$.next(x))
            )
            .subscribe();
    }

    fetchById(id: string): Observable<ExerciseSymptomDto> {
        this.exerciseSymptomByIdState$.next(null);

        return this.exerciseSymptomService.getById(id).pipe(
            take(1),
            tap(x => this.exerciseSymptomByIdState$.next(x))
        );
    }

    fetchByExerciseId(exerciseId: string) {
        this.exerciseSymptomService.getByExerciseId(exerciseId)
            .pipe(
                take(1),
                tap(x => this.exerciseSymptomState$.next(x))
            )
            .subscribe();
    }

    fetchBySymptomId(symptomId: string) {
        this.exerciseSymptomService.getBySymptomId(symptomId)
            .pipe(
                take(1),
                tap(x => this.exerciseSymptomState$.next(x))
            )
            .subscribe();
    }

    fetchBySymptomIdList(symptomIds: string[]) {
        this.exerciseSymptomService.getBySymptomIdList(symptomIds)
            .pipe(
                take(1),
                tap(x => this.exerciseSymptomState$.next(x))
            )
            .subscribe();
    }

    /* ===================== CREATE ===================== */

    createExerciseSymptom(exerciseSymptom: ExerciseSymptomDto): Observable<ExerciseSymptomDto> {
        return this.exerciseSymptomService.create(exerciseSymptom).pipe(
            take(1),
            tap(created => {
                this.exerciseSymptomState$.next([
                    ...this.exerciseSymptomState$.getValue(),
                    created
                ]);
                this.exerciseSymptomByIdState$.next(created);
            })
        );
    }

    /* ===================== UPDATE ===================== */

    updateExerciseSymptom(id: string, exerciseSymptom: ExerciseSymptomDto): Observable<ExerciseSymptomDto> {
        return this.exerciseSymptomService.update(id, exerciseSymptom).pipe(
            take(1),
            tap(updated => {
                this.exerciseSymptomByIdState$.next(updated);

                const updatedList = this.exerciseSymptomState$
                    .getValue()
                    .map(ps => ps.id === updated.id ? updated : ps);

                this.exerciseSymptomState$.next(updatedList);
            })
        );
    }

    updateExerciseSymptoms(exerciseSymptoms: ExerciseSymptomDto[]) {
        this.exerciseSymptomService.updateMany(exerciseSymptoms)
            .pipe(
                take(1),
                tap(x => this.exerciseSymptomState$.next(x))
            )
            .subscribe();
    }

    /* ===================== DELETE ===================== */

    deleteExerciseSymptom(id: string): Observable<void> {
        return this.exerciseSymptomService.delete(id).pipe(
            take(1),
            tap(() => {
                this.exerciseSymptomState$.next(
                    this.exerciseSymptomState$
                        .getValue()
                        .filter(ps => ps.id !== id)
                );

                const current = this.exerciseSymptomByIdState$.getValue();
                if (current && current.id === id) {
                    this.exerciseSymptomByIdState$.next(null);
                }
            })
        );
    }



}
