import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
    providers: [MessageService]
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

    private _meetingBackup: any = null;

    @ViewChild('filter') filter!: ElementRef;

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
                    tap((x) => (this.patients = x)),
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
                    x.date = this.toLocalDate(x.date);
                    x.startTime = this.toDateFromTimestamp(x.startTime);
                    x.duration = this.getMinutesFromIsoDuration(x.duration);
                    this.meeting = x;
                    this.patientFacade
                        .fetchById(this.meeting.patient.id)
                        .pipe(
                            takeUntil(this.destroy$),
                            tap((x) => {
                                this.patient = x;
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

        if (!this.meeting.date || !this.meeting.startTime) {
            this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Date and start time are required.' });
            return;
        }

        if (this.isNewMeetingMode) {
            const patientId = this.patientsId(this.patient.name, this.patient.surname);
            if (patientId) {
                // create new meeting
                const createdMeeting = {
                    patientId: patientId,
                    date: this.meeting.date,
                    startTime: this.getTimeHHMM(this.meeting.startTime),
                    duration: this.minutesToIsoDuration(this.meeting.duration),
                    notes: this.meeting.notes
                };
                this.meetingFacade
                    .createMeeting(createdMeeting)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (created: MeetingDto) => {
                            created.date = this.toLocalDate(created.date);
                            created.startTime = this.toDateFromTimestamp(created.startTime);
                            created.duration = this.getMinutesFromIsoDuration(created.duration);
                            this.meeting = created;
                            this._meetingBackup = null;
                            this.isEditMode = false;
                            this.isNewMeetingMode = false;
                            this.messageService.add({ severity: 'success', summary: 'Created', detail: 'Meeting created successfully.' });
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

        try {
            const updatedMeeting = {
                id: this.meeting.id,
                patient: this.patient,
                date: this.meeting.date,
                startTime: this.getTimeHHMM(this.meeting.startTime),
                duration: this.minutesToIsoDuration(this.meeting.duration),
                notes: this.meeting.notes
            };
            this.meetingFacade
                .updateMeeting(this.meeting.id, updatedMeeting)
                .pipe(takeUntil(this.destroy$)) // ensure unsubscribe on destroy
                .subscribe({
                    next: (saved: MeetingDto) => {
                        saved.date = this.toLocalDate(this.meeting.date);
                        saved.startTime = this.toDateFromTimestamp(saved.startTime);
                        saved.duration = this.getMinutesFromIsoDuration(this.meeting.duration);
                        this.meeting = saved;
                        this._meetingBackup = null;
                        this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Meeting saved successfully.' });
                    },
                    error: (err: any) => {
                        console.error('Failed to save meeting', err);
                        this.isEditMode = previousEditState;
                        this.messageService.add({ severity: 'error', summary: 'Save failed', detail: err?.message ?? 'Unknown error' });
                    }
                });
        } catch (err: any) {
            console.error('Save exception', err);
            this.isEditMode = previousEditState;
            this.messageService.add({ severity: 'error', summary: 'Save failed', detail: err?.message ?? 'Unknown error' });
        }
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


    // Return id of patient if exists, else null
    patientsId(name: string, surname: string): string | null {
        return this.patients.find((p) => p.name.toLowerCase() === name.toLowerCase() && p.surname.toLowerCase() === surname.toLowerCase())?.id ?? null;
    }

    /** Format ISO 8601 duration to number format */
    getMinutesFromIsoDuration(iso: string | number): number {
        if (typeof iso === 'number') return iso;

        const regex = /PT(?:(\d+)H)?(?:(\d+)M)?/;

        const match = iso.match(regex);

        if (!match) return 0;

        const hours = match[1] ? parseInt(match[1], 10) : 0;
        const minutes = match[2] ? parseInt(match[2], 10) : 0;

        return hours * 60 + minutes;
    }

    minutesToIsoDuration(minutes: number | string): string {
        if (typeof minutes === 'string') {
            minutes = parseInt(minutes, 10);
        }
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        let iso = 'PT';

        if (hours > 0) iso += `${hours}H`;
        if (mins > 0) iso += `${mins}M`;

        // ISO requires at least one field
        if (iso === 'PT') iso = 'PT0M';

        return iso;
    }

    toDateFromTimestamp(timestamp: any): Date {
        const [hours, minutes, seconds] = timestamp.split(':').map(Number);

        const date = new Date();
        date.setHours(hours, minutes, seconds, 0);

        return date;
    }

    toLocalDate(value: string | Date | null): Date {
        if (!value) return new Date();

        if (value instanceof Date) return value;

        const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (match) {
            const year = +match[1];
            const month = +match[2] - 1;
            const day = +match[3];
            return new Date(year, month, day);
        }

        return new Date(value);
    }

    getTimeHHMM(date: Date | string): string {
        if (typeof date === 'string') {
            return date;
        }
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    private createEmptyMeeting() {
        return {
            id: '',
            patient: this.createEmptyPatient(),
            date: new Date(),
            startTime: new Date(),
            duration: '0',
            notes: ''
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
