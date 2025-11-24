import { Injectable } from '@angular/core';
import { BehaviorSubject, take, tap } from 'rxjs';

import { SymptomDto } from '@/pages/service/symptom/symptom.model';
import { SymptomService } from '@/pages/service/symptom/symptom.service';

@Injectable({
    providedIn: 'root'
})
export class SymptomFacade {
    symptomState$ = new BehaviorSubject<SymptomDto[]>([])

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
}
