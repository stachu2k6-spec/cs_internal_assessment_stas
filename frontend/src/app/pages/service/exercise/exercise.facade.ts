import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';

import { ExerciseDto } from '@/pages/service/exercise/exercise.model';
import { ExerciseService } from '@/pages/service/exercise/exercise.service';

@Injectable({
    providedIn: 'root'
})
export class ExerciseFacade {
    exerciseState$ = new BehaviorSubject<ExerciseDto[]>([])
    exerciseByIdState$ = new BehaviorSubject<ExerciseDto | null>(null)

    constructor(private exerciseService: ExerciseService) {
    }

    fetchAllExercises(): void {
        this.exerciseService.getAll()
            .pipe(
                take(1),
                tap(x => {
                    this.exerciseState$.next(x)
                })
            )
            .subscribe()
    }

    // return the HTTP observable and update the BehaviorSubject
    fetchById(id: string): Observable<ExerciseDto> {
        // clear any previous value so UI doesn't show stale patient
        this.exerciseByIdState$.next(null);

        return this.exerciseService.getById(id).pipe(
            take(1),
            tap(x => this.exerciseByIdState$.next(x))
        );
    }

    updateExercise(id: string, exercise: ExerciseDto): Observable<ExerciseDto> {
        return this.exerciseService.update(id, exercise).pipe(
            take(1),
            tap(updatedExercise => {
                // Update the exerciseByIdState$ if it matches the updated exercise
                const currentExercise = this.exerciseByIdState$.getValue();
                if (currentExercise && currentExercise.id === updatedExercise.id) {
                    this.exerciseByIdState$.next(updatedExercise);
                }
                // Optionally, refresh the full list of exercises
                this.fetchAllExercises();
            })
        );
    }


}
