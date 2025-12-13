import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';

import { SymptomDto } from '@/pages/service/symptom/symptom.model';
import { SymptomService } from '@/pages/service/symptom/symptom.service';
import { PatientDto } from '@/pages/service/patient/patient.model';

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

    createSymptom(symptom: SymptomDto): Observable<SymptomDto> {
        return this.symptomService.create(symptom).pipe(
            take(1),
            tap(newSymptom => {
                // add the new symptom to symptomState$
                const currentSymptoms = this.symptomState$.getValue();
                this.symptomState$.next([...currentSymptoms, newSymptom]);

                // set the new symptom in symptomByIdState$
                this.symptomByIdState$.next(newSymptom);
            })
        );
    }

    updateSymptom(id: string, symptom: SymptomDto): Observable<SymptomDto> {
        return this.symptomService.update(id, symptom).pipe(
            take(1),
            tap(updatedSymptom => {
                // update the symptom in symptomByIdState$
                this.symptomByIdState$.next(updatedSymptom);

                // update the symptom in symptomState$
                const currentSymptoms = this.symptomState$.getValue();
                const index = currentSymptoms.findIndex(s => s.id === updatedSymptom.id);
                if (index !== -1) {
                    currentSymptoms[index] = updatedSymptom;
                    this.symptomState$.next([...currentSymptoms]);
                }
            })
        );
    }

    deleteSymptom(id: string): Observable<SymptomDto> {
        return this.symptomService.delete(id).pipe(
            take(1),
            tap(() => {
                // remove the symptom from symptomState$
                const currentSymptoms = this.symptomState$.getValue();
                const updatedSymptoms = currentSymptoms.filter(p => p.id !== id);
                this.symptomState$.next(updatedSymptoms);

                // clear symptomByIdState$ if it matches the deleted symptom
                const currentSymptomById = this.symptomByIdState$.getValue();
                if (currentSymptomById && currentSymptomById.id === id) {
                    this.symptomByIdState$.next(null);
                }
            })
        );
    }
}
