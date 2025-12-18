import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { PatientSymptomDto } from '@/pages/service/patient-symptom/patient-symptom.model';
import { PatientSymptomService } from '@/pages/service/patient-symptom/patient-symptom.service';

@Injectable({
    providedIn: 'root'
})
export class PatientSymptomFacade {

    patientSymptomState$ = new BehaviorSubject<PatientSymptomDto[]>([]);
    patientSymptomByIdState$ = new BehaviorSubject<PatientSymptomDto | null>(null);

    constructor(private patientSymptomService: PatientSymptomService) {}

    /* ===================== FETCH ===================== */

    fetchAll(): void {
        this.patientSymptomService.getAll()
            .pipe(
                take(1),
                tap(x => this.patientSymptomState$.next(x))
            )
            .subscribe();
    }

    fetchById(id: string): Observable<PatientSymptomDto> {
        this.patientSymptomByIdState$.next(null);

        return this.patientSymptomService.getById(id).pipe(
            take(1),
            tap(x => this.patientSymptomByIdState$.next(x))
        );
    }

    fetchByPatientId(patientId: string) {
        this.patientSymptomService.getByPatientId(patientId)
            .pipe(
                take(1),
                tap(x => this.patientSymptomState$.next(x))
            )
            .subscribe();
    }

    /* ===================== CREATE ===================== */

    createPatientSymptom(patientSymptom: PatientSymptomDto): Observable<PatientSymptomDto> {
        return this.patientSymptomService.create(patientSymptom).pipe(
            take(1),
            tap(created => {
                this.patientSymptomState$.next([
                    ...this.patientSymptomState$.getValue(),
                    created
                ]);
                this.patientSymptomByIdState$.next(created);
            })
        );
    }

    /* ===================== UPDATE ===================== */

    updatePatientSymptom(id: string, patientSymptom: PatientSymptomDto): Observable<PatientSymptomDto> {
        return this.patientSymptomService.update(id, patientSymptom).pipe(
            take(1),
            tap(updated => {
                this.patientSymptomByIdState$.next(updated);

                const updatedList = this.patientSymptomState$
                    .getValue()
                    .map(ps => ps.id === updated.id ? updated : ps);

                this.patientSymptomState$.next(updatedList);
            })
        );
    }

    /* ===================== DELETE ===================== */

    deletePatientSymptom(id: string): Observable<void> {
        return this.patientSymptomService.delete(id).pipe(
            take(1),
            tap(() => {
                this.patientSymptomState$.next(
                    this.patientSymptomState$
                        .getValue()
                        .filter(ps => ps.id !== id)
                );

                const current = this.patientSymptomByIdState$.getValue();
                if (current && current.id === id) {
                    this.patientSymptomByIdState$.next(null);
                }
            })
        );
    }


}
