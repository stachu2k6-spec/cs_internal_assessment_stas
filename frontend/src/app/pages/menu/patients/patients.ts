import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Button, ButtonDirective, ButtonModule } from 'primeng/button';
import { CommonModule, CurrencyPipe, DatePipe, NgForOf } from '@angular/common';
import { Tag, TagModule } from 'primeng/tag';
import { Product, ProductService } from '../../service/product.service';
import { FormsModule } from '@angular/forms';
import { DataView, DataViewModule } from 'primeng/dataview';
import { SelectButton, SelectButtonModule } from 'primeng/selectbutton';
import { PickListModule } from 'primeng/picklist';
import { OrderListModule } from 'primeng/orderlist';
import { Toolbar } from 'primeng/toolbar';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { RouterLink } from '@angular/router';
import { PatientDto } from '@/pages/service/patient/patient.model';
import { PatientFacade } from '@/pages/service/patient/patient.facade';
import { Subject, takeUntil, tap } from 'rxjs';
import { MeetingDto } from '@/pages/service/meeting/meeting.model';
import { MeetingFacade } from '@/pages/service/meeting/meeting.facade';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-patients',
    standalone: true,
    imports: [
        CommonModule,
        DataViewModule,
        FormsModule,
        SelectButtonModule,
        PickListModule,
        OrderListModule,
        TagModule,
        ButtonModule,
        Toolbar,
        IconField,
        InputIcon,
        InputText,
        RouterLink
    ],
    templateUrl: './patients.html',
    styleUrl: './patients.scss',
})
export class Patients implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    layout: 'grid' | 'list' = 'grid';
    options = ['grid', 'list'];

    patients: PatientDto[] = [];
    meetings: MeetingDto[] = [];

    constructor(
        private patientFacade: PatientFacade,
        private meetingFacade: MeetingFacade
    ) {}

    ngOnInit() {
        this.patientFacade.fetchAllPatients();
        this.patientFacade.patientState$
            .pipe(
                tap(x => (this.patients = x)),
                takeUntil(this.destroy$)
            )
            .subscribe();

        this.meetingFacade.fetchAllMeetings();
        this.meetingFacade.meetingState$
            .pipe(
                tap(x => (this.meetings = x)),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    getNextMeetingDate(id: string) {
        const patientsMeetings = this.meetings.filter(
            m => m.patient.id === id && new Date(m.date) > new Date()
        );
        return patientsMeetings.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )[0]?.date ?? null;
    }

    getPreviousMeetingDate(id: string) {
        const patientsMeetings = this.meetings.filter(
            m => m.patient.id === id && new Date(m.date) < new Date()
        );
        return patientsMeetings.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0]?.date ?? null;
    }

    formatDuration(isoDuration: string): string {
        const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
        const hours = match?.[1] ? Number(match[1]) : 0;
        const minutes = match?.[2] ? Number(match[2]) : 0;

        if (hours && minutes) return `${hours}h ${minutes}m`;
        if (hours) return `${hours}h`;
        return `${minutes}m`;
    }

    // getSeverity(product: Product) {
    //     switch (product.inventoryStatus) {
    //         case 'INSTOCK':
    //             return 'success';
    //
    //         case 'LOWSTOCK':
    //             return 'warn';
    //
    //         case 'OUTOFSTOCK':
    //             return 'danger';
    //
    //         default:
    //             return 'info';
    //     }
    // }
}

