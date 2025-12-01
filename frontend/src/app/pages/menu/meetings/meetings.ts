import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Button, ButtonDirective } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { SplitButton } from 'primeng/splitbutton';
import { Toolbar } from 'primeng/toolbar';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MultiSelect } from 'primeng/multiselect';
import { ProgressBar } from 'primeng/progressbar';
import { Select } from 'primeng/select';
import { Slider } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Customer, CustomerService, Representative } from '@/pages/service/customer.service';
import { Product, ProductService } from '@/pages/service/product.service';
import { ObjectUtils } from 'primeng/utils';
import { RouterLink } from '@angular/router';
import { MeetingDto } from '@/pages/service/meeting/meeting.model';
import { PatientFacade } from '@/pages/service/patient/patient.facade';
import { takeUntil, tap } from 'rxjs/operators';
import { MeetingFacade } from '@/pages/service/meeting/meeting.facade';
import { PatientDto } from '@/pages/service/patient/patient.model';
import { Subject } from 'rxjs';
import { DatePicker } from 'primeng/datepicker';

@Component({
    selector: 'app-meeting-database',
    imports: [Button, IconField, InputIcon, InputText, Toolbar, Tab, TabList, TabPanel, TabPanels, Tabs, ButtonDirective, TableModule, FormsModule, RouterLink, DatePicker],
    templateUrl: './meetings.html',
    styleUrl: './meetings.scss',
    providers: []
})
export class Meetings implements OnInit, OnDestroy {
    //statuses: any[] = [];

    /** List of meetings */
    meetings: MeetingDto[] = [];

    upcomingMeetings: MeetingDto[] = [];

    pastMeetings: MeetingDto[] = [];

    patients: PatientDto[] = [];

    @ViewChild('filter') filter!: ElementRef;

    private destroy$ = new Subject<void>();

    constructor(
        private meetingFacade: MeetingFacade,
        private patientFacade: PatientFacade
    ) {}

    ngOnInit() {
        // load meetings
        this.meetingFacade.fetchAllMeetings();
        this.meetingFacade.meetingState$
            .pipe(
                takeUntil(this.destroy$),
                tap((list) => {
                    this.meetings = list;
                    this.splitMeetings();
                })
            )
            .subscribe();

        // load patients so getPatientNameById works
        this.patientFacade.fetchAllPatients?.(); // optional call if facade exposes it
        // if fetchAllPatients is not present, you can remove the line above

        this.patientFacade.patientState$
            .pipe(
                tap((p) => (this.patients = p)),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
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

    // method to split and sort meetings into upcoming and past based on current date
    private splitMeetings() {
        const now = new Date();

        this.upcomingMeetings = this.meetings.filter((m) => new Date(m.date + 'T' + m.startTime) >= now).sort((a, b) => new Date(a.date + 'T' + a.startTime).getTime() - new Date(b.date + 'T' + b.startTime).getTime());

        this.pastMeetings = this.meetings.filter((m) => new Date(m.date + 'T' + m.startTime) < now).sort((a, b) => new Date(b.date + 'T' + b.startTime).getTime() - new Date(a.date + 'T' + a.startTime).getTime());
    }
}
