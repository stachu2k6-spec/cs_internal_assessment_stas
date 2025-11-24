import { Injectable } from '@angular/core';
import { BehaviorSubject, take, tap } from 'rxjs';
import { PatientDto } from '@/pages/service/patient/patient.model';
import { PatientService } from '@/pages/service/patient/patient.service';

@Injectable({
  providedIn: 'root'
})
export class PatientFacade {
    patientState$ = new BehaviorSubject<PatientDto[]>([])

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
}
