import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';

import { SymptomDto } from '@/pages/service/symptom/symptom.model';
import { SymptomService } from '@/pages/service/symptom/symptom.service';

@Injectable({
    providedIn: 'root'
})
export class SymptomFacade {
    symptomState$ = new BehaviorSubject<SymptomDto[]>([])
    symptomByIdState$ = new BehaviorSubject<SymptomDto | null>(null)

    constructor(private symptomService: SymptomService) {
    }

    fetchAllSymptoms(): void {
        this.symptomService.getAll()
            .pipe(
                take(1),
                tap(x => {
                    this.symptomState$.next(x)
                })
            )
            .subscribe()
    }

    // return the HTTP observable and update the BehaviorSubject
    fetchById(id: string): Observable<SymptomDto> {
        // clear any previous value so UI doesn't show stale patient
        this.symptomByIdState$.next(null);

        return this.symptomService.getById(id).pipe(
            take(1),
            tap(x => this.symptomByIdState$.next(x))
        );
    }
}
