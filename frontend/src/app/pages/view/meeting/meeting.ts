import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { Splitter } from 'primeng/splitter';
import { Textarea } from 'primeng/textarea';
import { Image } from 'primeng/image';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MeetingFacade } from '@/pages/service/meeting/meeting.facade';
import { MeetingDto } from '@/pages/service/meeting/meeting.model';
import { PatientDto } from '@/pages/service/patient/patient.model';
import { PatientFacade } from '@/pages/service/patient/patient.facade';
import { MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';

// rxjs
import { Subject, of, pipe, take } from 'rxjs';
import { takeUntil, switchMap, tap, catchError } from 'rxjs/operators';
import { InputNumber } from 'primeng/inputnumber';
import { Dialog } from 'primeng/dialog';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { CountryService } from '@/pages/service/country.service';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-meeting',
    imports: [
        TableModule,
        MultiSelectModule,
        SelectModule,
        InputIconModule,
        TagModule,
        InputTextModule,
        SliderModule,
        ProgressBarModule,
        ToggleButtonModule,
        ToastModule,
        CommonModule,
        FormsModule,
        ButtonModule,
        RatingModule,
        RippleModule,
        IconFieldModule,
        Splitter,
        Textarea,
        Image,
        RouterLink,
        DatePickerModule,
        InputNumber,
        Dialog
    ],
    templateUrl: './meeting.html',
    styleUrl: './meeting.scss',
    standalone: true,
    providers: [MessageService, CountryService]
})
export class Meeting implements OnInit, OnDestroy {
    customers2: any[] = [];

    statuses: any[] = [];

    isEditMode: boolean = false;

    isNewMeetingMode: boolean = false;

    displayConfirmDialog: boolean = false;

    meeting: MeetingDto = this.createEmptyMeeting(); // Meeting data to be displayed and edited, initialized to empty

    patient: PatientDto = this.createEmptyPatient(); // Associated patient data, initialized to empty

    patients: PatientDto[] = [];

    patientsNames: string[] = [];

    patientsSurnames: string[] = [];

    private _meetingBackup: any = null;

    // destroy notifier for takeUntil
    private destroy$ = new Subject<void>();

    constructor(
        private meetingFacade: MeetingFacade,
        private patientFacade: PatientFacade,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');

        if (!id) {
            console.warn('No meeting id found in route.');
            this.router.navigate(['/notfound']);
            return;
        }

        if (id === 'newMeeting') {
            // new meeting mode
            this.isEditMode = true;
            this.isNewMeetingMode = true;
            this.meeting = this.createEmptyMeeting();
            this.meeting.id = 'newMeeting'; // assign temporary id
            this.patient = this.createEmptyPatient();

            // fetch all patients for selection
            this.patientFacade.fetchAllPatients();
            this.patientFacade.patientState$
                .pipe(
                    tap((x) => {
                        this.patients = x;
                        this.getNames(x);
                        this.getSurnames(x);
                    }),
                    takeUntil(this.destroy$)
                )
                .subscribe();
            return;
        }

        // clear stale meeting before loading
        this.meeting = this.createEmptyMeeting();

        // fetch meeting, when loaded fetch patient
        this.meetingFacade
            .fetchById(id)
            .pipe(
                takeUntil(this.destroy$),
                tap((x) => {
                    this.meeting = {
                        ...x,
                        dateTime: new Date(x.dateTime)
                    };

                    this.patientFacade
                        .fetchById(this.meeting.patient.id)
                        .pipe(
                            takeUntil(this.destroy$),
                            tap((p) => {
                                this.patient = p;
                            })
                        )
                        .subscribe();
                })
            )
            .subscribe();
    }

    ngOnDestroy(): void {
        // notify all subscribers to complete and free resources
        this.destroy$.next();
        this.destroy$.complete();
    }

    enterEdit() {
        // create a shallow clone backup so cancel can restore previous state
        this._meetingBackup = { ...this.meeting };
        this.isEditMode = true;
    }

    cancelEdit() {
        if (this._meetingBackup) {
            this.meeting = { ...this._meetingBackup };
            this._meetingBackup = null;
        }

        if (this.isNewMeetingMode) {
            this.router.navigate(['/menu', 'meetings']); // navigate back to meeting list
            return;
        }

        this.isEditMode = false;
    }

    /**
     * Save meeting edits. Uses MeetingFacade.updateMeeting(meetingId, meetingDto)
     */
    saveMeeting() {
        if (!this.meeting) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No meeting loaded.' });
            return;
        }

        if (!this.meeting.dateTime) {
            this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Date and start time are required.' });
            return;
        }

        if (this.isNewMeetingMode) {
            const patientId = this.patientsId(this.patient.name, this.patient.surname);
            if (patientId) {
                // create new meeting
                const createdMeeting = {
                    patientId: patientId,
                    dateTime: this.tweakHours(this.meeting.dateTime),
                    duration: this.meeting.duration,
                    notes: this.meeting.notes,
                    rating: this.meeting.rating
                };
                this.meetingFacade
                    .createMeeting(createdMeeting)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (created: MeetingDto) => {
                            this.meeting = created;
                            created.dateTime = new Date(created.dateTime);
                            this._meetingBackup = null;
                            this.isEditMode = false;
                            this.isNewMeetingMode = false;
                            this.messageService.add({ severity: 'success', summary: 'Created', detail: 'Meeting created successfully.' });
                            this.router.navigate(['/view', 'meeting', created.id]); // navigate to newly created meeting
                        },
                        error: (err: any) => {
                            console.error('Failed to create meeting', err);
                            this.messageService.add({ severity: 'error', summary: 'Creation failed', detail: err?.message ?? 'Unknown error' });
                        }
                    });
                return;
            } else {
                console.error('Save exception', 'Patient does not exist');
                this.messageService.add({ severity: 'error', summary: 'Save failed', detail: 'Patient does not exist' });
                return;
            }
        }

        const previousEditState = this.isEditMode;
        this.isEditMode = false;

        const updatedMeeting = {
            id: this.meeting.id,
            patient: this.meeting.patient,
            dateTime: this.tweakHours(this.meeting.dateTime),
            duration: this.meeting.duration,
            notes: this.meeting.notes,
            rating: this.meeting.rating
        };
        this.meetingFacade
            .updateMeeting(this.meeting.id, updatedMeeting)
            .pipe(takeUntil(this.destroy$)) // ensure unsubscribe on destroy
            .subscribe({
                next: (saved: MeetingDto) => {
                    this.meeting = saved;
                    saved.dateTime = new Date(saved.dateTime);
                    this._meetingBackup = null;
                    this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Meeting saved successfully.' });
                },
                error: (err: any) => {
                    console.error('Failed to save meeting', err);
                    this.isEditMode = previousEditState;
                    this.messageService.add({ severity: 'error', summary: 'Save failed', detail: err?.message ?? 'Unknown error' });
                }
            });
    }

    openConfirmDialog() {
        this.displayConfirmDialog = true;
    }

    closeConfirmDialog() {
        this.displayConfirmDialog = false;
    }

    deleteMeeting() {
        if (!this.meeting || !this.meeting.id) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No meeting loaded.' });
            return;
        }

        this.meetingFacade
            .deleteMeeting(this.meeting.id)
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Meeting profile deleted.' });
                    this.router.navigate(['/menu', 'meetings']); // navigate back to meeting list
                },
                error: (err) => {
                    console.error('Failed to delete meeting', err);
                    this.messageService.add({ severity: 'error', summary: 'Delete failed', detail: err?.message ?? 'Unknown error' });
                }
            });
    }

    getNames(patients: PatientDto[]) {
        this.patientsNames = patients.map((p) => p.name);
    }

    getSurnames(patients: PatientDto[]) {
        this.patientsSurnames = patients.map((p) => p.surname);
    }

    patientsId(name: string, surname: string): string | null {
        return this.patients.find((p) => p.name.toLowerCase() === name.toLowerCase() && p.surname.toLowerCase() === surname.toLowerCase())?.id ?? null;
    }

    onDateTimeChange(newDate: Date) {
        if (!this.meeting.dateTime) {
            this.meeting.dateTime = newDate;
            return;
        }

        const old = this.meeting.dateTime;

        newDate.setHours(
            old.getHours(),
            old.getMinutes(),
            0,
            0
        );

        this.meeting.dateTime = newDate;
    }

    private tweakHours(date: Date): Date {
        const copy = new Date(date);
        copy.setHours(copy.getHours() + 1);
        return copy;
    }


    createEmptyMeeting() {
        return {
            id: '',
            patient: this.createEmptyPatient(),
            dateTime: new Date(),
            duration: 0,
            notes: '',
            rating: 0
        };
    }

    createEmptyPatient(): PatientDto {
        return {
            id: '',
            name: '',
            surname: '',
            birthDate: new Date(),
            gender: '',
            address: '',
            phoneNumber: '',
            email: '',
            notes: '',
            activityLevel: '',
            photoUrl: 'https://primefaces.org/cdn/primeng/images/galleria/galleria10.jpg'
        };
    }


}
