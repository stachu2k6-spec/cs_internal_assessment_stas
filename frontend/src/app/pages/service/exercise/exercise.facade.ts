import { Injectable } from '@angular/core';
import { BehaviorSubject, take, tap } from 'rxjs';

import { ExerciseDto } from '@/pages/service/exercise/exercise.model';
import { ExerciseService } from '@/pages/service/exercise/exercise.service';

@Injectable({
    providedIn: 'root'
})
export class ExerciseFacade {
    exerciseState$ = new BehaviorSubject<ExerciseDto[]>([])

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
}
