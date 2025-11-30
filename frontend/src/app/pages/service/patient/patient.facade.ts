import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { PatientDto } from '@/pages/service/patient/patient.model';
import { PatientService } from '@/pages/service/patient/patient.service';
import { Patients } from '@/pages/menu/patients/patients';

@Injectable({
  providedIn: 'root'
})
export class PatientFacade {
    patientState$ = new BehaviorSubject<PatientDto[]>([])
    patientByIdState$ = new BehaviorSubject<PatientDto | null>(null)

    constructor(private patientService: PatientService) {
    }

    fetchAllPatients(): void {
        this.patientService.getAll()
            .pipe(
                take(1),
                tap(x => {
                    this.patientState$.next(x)
                })
            )
            .subscribe()
    }

    // return the HTTP observable and update the BehaviorSubject
    fetchById(id: string): Observable<PatientDto> {
        // clear any previous value so UI doesn't show stale patient
        this.patientByIdState$.next(null);

        return this.patientService.getById(id).pipe(
            take(1),
            tap(x => this.patientByIdState$.next(x))
        );
    }

    updatePatient(id: string, patient: PatientDto): Observable<PatientDto> {
        return this.patientService.update(id, patient).pipe(
            take(1),
            tap(updatedPatient => {
                // update the patient in patientByIdState$
                this.patientByIdState$.next(updatedPatient);

                // update the patient in patientState$
                const currentPatients = this.patientState$.getValue();
                const index = currentPatients.findIndex(p => p.id === updatedPatient.id);
                if (index !== -1) {
                    currentPatients[index] = updatedPatient;
                    this.patientState$.next([...currentPatients]);
                }
            })
        );
    }
}
