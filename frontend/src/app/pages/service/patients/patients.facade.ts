import { Injectable } from '@angular/core';
import { BehaviorSubject, take, tap } from 'rxjs';
import { PatientDto } from '@/pages/service/patients/patients.model';
import { PatientsService } from '@/pages/service/patients/patients.service';

@Injectable({
  providedIn: 'root'
})
export class PatientsFacade {
    patientsState$ = new BehaviorSubject<PatientDto[]>([])

    constructor(private patientsService: PatientsService) {
    }

    fetchAllPatients(): void {
        this.patientsService.getAll()
            .pipe(
                take(1),
                tap(x => {
                    this.patientsState$.next(x)
                })
            )
            .subscribe()
    }
}
