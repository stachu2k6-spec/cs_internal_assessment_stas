import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { PatientSymptomDto } from '@/pages/service/patient-symptom/patient-symptom.model';
import { PatientSymptomService } from '@/pages/service/patient-symptom/patient-symptom.service';

@Injectable({
    providedIn: 'root'
})
export class PatientSymptomFacade {

    patientSymptomState$ = new BehaviorSubject<PatientSymptomDto[]>([]);
    patientSymptomByKeyState$ = new BehaviorSubject<PatientSymptomDto | null>(null);

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

    fetchByKey(patientId: string, symptomId: string): Observable<PatientSymptomDto> {
        this.patientSymptomByKeyState$.next(null);

        return this.patientSymptomService.getByKey(patientId, symptomId).pipe(
            take(1),
            tap(x => this.patientSymptomByKeyState$.next(x))
        );
    }

    /* ===================== CREATE ===================== */

    create(patientSymptom: PatientSymptomDto): Observable<PatientSymptomDto> {
        return this.patientSymptomService.create(patientSymptom).pipe(
            take(1),
            tap(created => {
                this.patientSymptomState$.next([
                    ...this.patientSymptomState$.getValue(),
                    created
                ]);
                this.patientSymptomByKeyState$.next(created);
            })
        );
    }

    /* ===================== UPDATE ===================== */

    update(patientSymptom: PatientSymptomDto): Observable<PatientSymptomDto> {
        const { patientId, symptomId } = patientSymptom;

        return this.patientSymptomService
            .update(patientId, symptomId, patientSymptom)
            .pipe(
                take(1),
                tap(updated => {
                    this.patientSymptomByKeyState$.next(updated);

                    const updatedList = this.patientSymptomState$.getValue().map(ps =>
                        ps.patientId === updated.patientId &&
                        ps.symptomId === updated.symptomId
                            ? updated
                            : ps
                    );

                    this.patientSymptomState$.next(updatedList);
                })
            );
    }

    /* ===================== DELETE ===================== */

    delete(patientId: string, symptomId: string): Observable<void> {
        return this.patientSymptomService.delete(patientId, symptomId).pipe(
            take(1),
            tap(() => {
                this.patientSymptomState$.next(
                    this.patientSymptomState$.getValue().filter(ps =>
                        !(ps.patientId === patientId && ps.symptomId === symptomId)
                    )
                );

                const current = this.patientSymptomByKeyState$.getValue();
                if (
                    current &&
                    current.patientId === patientId &&
                    current.symptomId === symptomId
                ) {
                    this.patientSymptomByKeyState$.next(null);
                }
            })
        );
    }
}
