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

@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [CommonModule, FullCalendarModule, Panel, Button, IconField, InputIcon, InputText, Toolbar],
    templateUrl: './home-page.html',
    styleUrl: './home-page.scss'
})
export class HomePage implements OnInit, OnDestroy {
    @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
    @ViewChild('calendar', { read: ElementRef }) calendarEl!: ElementRef;

    showCalendar: boolean = true;

    prevMonthMeetings: MeetingDto[] = [];

    thisMonthMeetings: MeetingDto[] = [];

    nextMonthMeetings: MeetingDto[] = [];

    events: EventInput[] = [];

    destroy$ = new Subject<void>();

    constructor(
        private meetingFacade: MeetingFacade,
        private router: Router
    ) {}

    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        selectable: true,
        eventClick: this.handleEventClick.bind(this),
        dateClick: this.handleDateClick.bind(this),
        datesSet: this.handleDatesSet.bind(this)
    };

    ngOnInit() {
        this.meetingFacade.meetingState$
            .pipe(takeUntil(this.destroy$))
            .subscribe(meetings => {
                this.events = this.meetingsToEvents(meetings);
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    handleDateClick(arg: any) {
        alert('Date clicked: ' + arg.dateStr);
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

        this.meetingFacade.fetchMultipleMonths([
            prev,
            current,
            next
        ]);
    }
    meetingsToEvents(meetings: MeetingDto[]): EventInput[] {
        return meetings.map(meeting => {
            const start = this.buildStartDate(meeting.date, meeting.startTime);

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

    buildStartDate(date: Date, startTime: string | Date): Date {
        const baseDate = new Date(date);

        if (typeof startTime === 'string') {
            const [h, m, s = '0'] = startTime.split(':');
            baseDate.setHours(+h, +m, +s, 0);
        } else {
            baseDate.setHours(
                startTime.getHours(),
                startTime.getMinutes(),
                startTime.getSeconds(),
                0
            );
        }
        return baseDate;
    }

}


