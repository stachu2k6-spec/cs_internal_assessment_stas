import { Component, ViewChild, AfterViewInit, OnDestroy, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, DatesSetArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Panel } from 'primeng/panel';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Toolbar } from 'primeng/toolbar';
import { Subject, takeUntil, tap } from 'rxjs';
import { List } from 'postcss/lib/list';
import { MeetingDto } from '@/pages/service/meeting/meeting.model';
import { MeetingService } from '@/pages/service/meeting/meeting.service';
import { MeetingFacade } from '@/pages/service/meeting/meeting.facade';
import { Router } from '@angular/router';
import { Dialog } from 'primeng/dialog';
import { DatePicker } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { PatientDto } from '@/pages/service/patient/patient.model';
import { PatientFacade } from '@/pages/service/patient/patient.facade';
import { FormsModule } from '@angular/forms';
import { Textarea } from 'primeng/textarea';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AutoComplete } from 'primeng/autocomplete';

@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [CommonModule, FullCalendarModule, Panel, Button, Dialog, DatePicker, InputNumber, FormsModule, Textarea, AutoComplete],
    templateUrl: './home-page.html',
    styleUrl: './home-page.scss',
    providers: [MessageService]
})
export class HomePage implements OnInit, OnDestroy {
    @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
    @ViewChild('calendar', { read: ElementRef }) calendarEl!: ElementRef;

    showCalendar: boolean = true;

    events: EventInput[] = [];

    nextMeeting: MeetingDto = this.createEmptyMeeting();

    isQuickScheduleVisible: boolean = false;

    meeting: MeetingDto = this.createEmptyMeeting(); // Meeting data to be displayed and edited, initialized to empty

    patient: PatientDto = this.createEmptyPatient(); // Associated patient data, initialized to empty

    allPatients: PatientDto[] = [];

    patientNames: string[] = [];

    patientSurnames: string[] = [];


    filteredPatientNames: string[] = [];

    filteredPatientSurnames: string[] = [];


    destroy$: Subject<void> = new Subject<void>();

    constructor(
        private meetingFacade: MeetingFacade,
        private patientFacade: PatientFacade,
        private messageService: MessageService,
        private router: Router
    ) {}

    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        dayMaxEvents: 5,
        eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        },
        expandRows: true,
        fixedWeekCount: true,
        selectable: true,
        eventClick: this.handleEventClick.bind(this),
        dateClick: this.handleDateClick.bind(this),
        datesSet: this.handleDatesSet.bind(this)
    };

    ngOnInit() {
        this.meetingFacade.meetingState$.pipe(takeUntil(this.destroy$)).subscribe((meetings) => {
            this.events = this.meetingsToEvents(meetings);
            this.nextMeeting = this.getNextMeeting(meetings);
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    handleDateClick(arg: any) {
        this.quickScheduleMeeting(arg.date);
    }

    handleEventClick(arg: any) {
        this.router.navigate(['/view/meeting', arg.event.id]);
    }

    handleDatesSet(arg: DatesSetArg) {
        const d = arg.view.currentStart;
        const year = d.getFullYear();
        const month = d.getMonth() + 1;

        this.loadSurroundingMeetings(year, month);
    }

    loadSurroundingMeetings(year: number, month: number) {
        const { prev, current, next } = this.getSurroundingMonths(year, month);

        this.meetingFacade.fetchMultipleMonths([prev, current, next]);
    }

    meetingsToEvents(meetings: MeetingDto[]): EventInput[] {
        return meetings.map((meeting) => {
            const start = meeting.dateTime;

            return {
                id: meeting.id,
                title: `${meeting.patient.surname}`,
                start,
                extendedProps: {
                    notes: meeting.notes,
                    patient: meeting.patient
                }
            };
        });
    }

    private getSurroundingMonths(year: number, month: number) {
        const current = { year, month };

        const prevDate = new Date(year, month - 2, 1); // month is 1-based
        const nextDate = new Date(year, month, 1);

        return {
            prev: { year: prevDate.getFullYear(), month: prevDate.getMonth() + 1 },
            current,
            next: { year: nextDate.getFullYear(), month: nextDate.getMonth() + 1 }
        };
    }

    private quickScheduleMeeting(date: any) {
        this.isQuickScheduleVisible = true;
        this.meeting = this.createEmptyMeeting();
        this.meeting.id = 'newMeeting'; // assign temporary id
        this.meeting.dateTime = date;
        this.patient = this.createEmptyPatient();

        // fetch all patients for selection
        this.patientFacade.fetchAllPatients();
        this.patientFacade.patientState$
            .pipe(
                tap((patients) => {
                    this.allPatients = patients;
                    this.getNames(patients);
                    this.getSurnames(patients);
                }),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    saveMeeting() {
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
                        this.isQuickScheduleVisible = false;
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

    cancelScheduling() {
        this.isQuickScheduleVisible = false;
    }


    getNames(patients: PatientDto[]) {
        this.patientNames = patients.map((p) => p.name);
    }

    getSurnames(patients: PatientDto[]) {
        this.patientSurnames = patients.map((p) => p.surname);
    }

    createEmptyMeeting() {
        return {
            id: '',
            patient: this.createEmptyPatient(),
            dateTime: new Date(),
            duration: 0,
            notes: '',
            rating: 0,
            exercises: []
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

    patientsId(name: string, surname: string): string | null {
        return this.allPatients.find((p) => p.name.toLowerCase() === name.toLowerCase() && p.surname.toLowerCase() === surname.toLowerCase())?.id ?? null;
    }


    getNextMeeting(meetings: MeetingDto[]): MeetingDto {
        const now = new Date();

        const upcoming = meetings
            .map(m => ({
                meeting: m,
                date: new Date(m.dateTime)
            }))
            .filter(m => m.date > now)
            .sort((a, b) => a.date.getTime() - b.date.getTime());

        return upcoming[0].meeting;
    }

    private tweakHours(date: Date): Date {
        const copy = new Date(date);
        copy.setHours(copy.getHours() + 1);
        return copy;
    }

    filterNames(event: { query: string }) {
        const q = event.query.toLowerCase().trim();
        this.filteredPatientNames = this.patientNames.filter(name =>
            name.toLowerCase().includes(q)
        );
    }

    onNameSelected() {
        // Reset surname when name changes
        this.patient.surname = '';

        this.patientSurnames = this.allPatients
            .filter(p => p.name === this.patient.name)
            .map(p => p.surname);
    }

    filterSurnames(event: { query: string }) {
        const q = event.query.toLowerCase().trim();
        this.filteredPatientSurnames = this.patientSurnames.filter(surname =>
            surname.toLowerCase().includes(q)
        );
    }
}


