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
    providers: []
})
export class Meeting implements OnInit {

    statuses: any[] = [];

    isEditMode: boolean = false;

    meeting: MeetingDto = this.createEmptyMeeting(); // Meeting data to be displayed and edited, initialized to empty

    private _meetingBackup: any = null;

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private meetingFacade: MeetingFacade,
        private route: ActivatedRoute,
        private router: Router
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
                },
                error: (err: any) => {
                    console.error('Failed loading meeting', err);
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

    save() {
        // TODO: call your API to persist patient changes
        // For now, we mock save with a message and toggle mode off
        this.isEditMode = false;
        this._meetingBackup = null;

        // show a toast (you already have MessageService provider)
        // this.messageService.add({
        //     severity: 'success',
        //     summary: 'Saved',
        //     detail: 'Patient data saved.'
        // });

        // If you have a real backend: call service then handle response
        // this.patientService.updatePatient(this.patient).then(...).catch(...)
    }



    private createEmptyMeeting() {
        return {
            id: '-EMPTY-',
            date: '-EMPTY-',
            startTime: '-EMPTY-',
            duration: '-EMPTY-',
            notes: '-EMPTY-'
        }
    }

    /** Format ISO 8601 duration to readable format */
    formatDuration(isoDuration: string): string {
        const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);

        const hours = match?.[1] ? Number(match[1]) : 0;
        const minutes = match?.[2] ? Number(match[2]) : 0;

        if (hours && minutes) return `${hours}h ${minutes}m`;
        if (hours) return `${hours}h`;
        return `${minutes}m`;
    }

    get formattedDuration(): string {
        return this.formatDuration(this.meeting.duration);
    }
}
