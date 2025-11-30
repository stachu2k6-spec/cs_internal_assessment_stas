import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { take } from 'rxjs';
import { PatientDto } from '@/pages/service/patient/patient.model';
import { PatientFacade } from '@/pages/service/patient/patient.facade';
import { MessageService } from 'primeng/api';

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
        RouterLink
    ],
    templateUrl: './meeting.html',
    styleUrl: './meeting.scss',
    providers: [MessageService] // <--- provide MessageService here (or provide it app-wide)
})
export class Meeting implements OnInit {
    customers2: any[] = [];

    statuses: any[] = [];

    isEditMode: boolean = false;

    meeting: MeetingDto = this.createEmptyMeeting(); // Meeting data to be displayed and edited, initialized to empty

    patient: PatientDto = this.createEmptyPatient(); // Associated patient data, initialized to empty

    private _meetingBackup: any = null;

    @ViewChild('filter') filter!: ElementRef;

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

        // clear stale meeting before loading
        this.meeting = this.createEmptyMeeting();

        // subscribe to actual HTTP request
        this.meetingFacade
            .fetchById(id)
            .pipe(take(1))
            .subscribe({
                next: (dto: MeetingDto) => {
                    this.meeting = dto ? dto : this.createEmptyMeeting();
                    if (this.meeting?.patient?.id) {
                        this.patientFacade.fetchById(this.meeting.patient.id)
                            .pipe(take(1))
                            .subscribe({
                                next: (dto: PatientDto) => {
                                    this.patient = dto ? dto : this.createEmptyPatient();
                                },
                                error: (err: any) => {
                                    console.error('Failed loading patient', err);
                                    // keep page visible even if patient loading fails
                                    this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Could not load associated patient.' });
                                }
                            });
                    } else {
                        this.patient = this.createEmptyPatient();
                    }
                },
                error: (err: any) => {
                    console.error('Failed loading meeting', err);
                    this.messageService.add({ severity: 'error', summary: 'Load failed', detail: 'Meeting could not be loaded.' });
                    this.router.navigate(['/notfound']);
                }
            });
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
        this.isEditMode = false;
    }

    /**
     * Save meeting edits. Uses MeetingFacade.updateMeeting(meetingId, meetingDto)
     * If your facade exposes a different method name, replace it accordingly.
     */
    save() {
        // basic validation example: ensure date & startTime present
        if (!this.meeting) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No meeting loaded.' });
            return;
        }

        if (!this.meeting.date || !this.meeting.startTime) {
            this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Date and start time are required.' });
            return;
        }

        // optimistic UI: disable edit mode while saving
        const previousEditState = this.isEditMode;
        this.isEditMode = false;

        // guard with take(1) to auto-unsubscribe
        try {
            (this.meetingFacade as any).updateMeeting(this.meeting.id, this.meeting)
                .pipe(take(1))
                .subscribe({
                    next: (saved: MeetingDto) => {
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

    private createEmptyMeeting(): MeetingDto {
        return {
            id: '-EMPTY-',
            patient: this.createEmptyPatient(),
            date: '-EMPTY-',
            startTime: '-EMPTY-',
            duration: '-EMPTY-',
            notes: '-EMPTY-'
        } as MeetingDto;
    }

    /** Format ISO 8601 duration to readable format */
    formatDuration(isoDuration: string): string {
        const match = isoDuration?.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);

        const hours = match?.[1] ? Number(match[1]) : 0;
        const minutes = match?.[2] ? Number(match[2]) : 0;

        if (hours && minutes) return `${hours}h ${minutes}m`;
        if (hours) return `${hours}h`;
        return `${minutes}m`;
    }

    get formattedDuration(): string {
        return this.formatDuration(this.meeting.duration);
    }

    createEmptyPatient(): PatientDto {
        return {
            id: '-EMPTY-',
            name: '-EMPTY-',
            surname: '-EMPTY-',
            birthDate: new Date(),
            gender: '-EMPTY-',
            address: '-EMPTY-',
            phoneNumber: '-EMPTY-',
            email: '-EMPTY-',
            notes: '-EMPTY-',
            activityLevel: '-EMPTY-',
            photoUrl: '-EMPTY-'
        };
    }
}
