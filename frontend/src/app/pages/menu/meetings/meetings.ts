import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { tap } from 'rxjs';
import { MeetingFacade } from '@/pages/service/meeting/meeting.facade';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-meeting-database',
    imports: [Button, IconField, InputIcon, InputText, Toolbar, Tab, TabList, TabPanel, TabPanels, Tabs, ButtonDirective, CurrencyPipe, DatePipe, MultiSelect, ProgressBar, Select, Slider, TableModule, Tag, FormsModule, RouterLink],
    templateUrl: './meetings.html',
    styleUrl: './meetings.scss',
    providers: []
})
export class Meetings implements OnInit {

    //statuses: any[] = [];

    /** List of meetings */
    meetings: MeetingDto[] =[]

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private meetingFacade: MeetingFacade
    ) {}

    ngOnInit() {
        this.meetingFacade.fetchAllMeetings()
        this.meetingFacade.meetingState$
            .pipe(
                tap(x=> {
                    this.meetings = x;
                })
            )
            .subscribe()

    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    /** For future activity stuff??? */
    /**
    getSeverity(status: string) {
        switch (status) {
            case 'qualified':
            case 'instock':
            case 'INSTOCK':
            case 'DELIVERED':
            case 'delivered':
                return 'success';

            case 'negotiation':
            case 'lowstock':
            case 'LOWSTOCK':
            case 'PENDING':
            case 'pending':
                return 'warn';

            case 'unqualified':
            case 'outofstock':
            case 'OUTOFSTOCK':
            case 'CANCELLED':
            case 'cancelled':
                return 'danger';

            default:
                return 'info';
        }
    }
     */

    /** Format ISO 8601 duration to readable format */
     formatDuration(isoDuration: string): string {
        const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);

        const hours = match?.[1] ? Number(match[1]) : 0;
        const minutes = match?.[2] ? Number(match[2]) : 0;

        if (hours && minutes) return `${hours}h ${minutes}m`;
        if (hours) return `${hours}h`;
        return `${minutes}m`;
    }
}
