import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
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
import { Customer, CustomerService, Representative } from '../../service/customer.service';
import { Product, ProductService } from '../../service/product.service';
import {ObjectUtils} from "primeng/utils";
import { Splitter } from 'primeng/splitter';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { CdkTreeNodePadding } from '@angular/cdk/tree';
import { Textarea } from 'primeng/textarea';
import { AutoComplete } from 'primeng/autocomplete';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumber } from 'primeng/inputnumber';
import { Image } from 'primeng/image';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContextMenu } from 'primeng/contextmenu';
import { PatientDto } from '@/pages/service/patient/patient.model';
import { PatientFacade } from '@/pages/service/patient/patient.facade';
import { Subject, take, takeUntil, tap } from 'rxjs';
import { MeetingDto } from '@/pages/service/meeting/meeting.model';
import { MeetingFacade } from '@/pages/service/meeting/meeting.facade';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-patient',
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
        Tabs,
        TabList,
        Tab,
        TabPanel,
        TabPanels,
        Textarea,
        Image,
        RouterLink,
        ContextMenu
    ],
    templateUrl: './patient.html',
    styleUrl: './patient.scss',
    providers: [ConfirmationService, MessageService, CustomerService, ProductService]
})
export class Patient implements OnInit, OnDestroy{

    selectedSymptom: Customer | null = null;

    selectedMeeting: Customer | null = null;

    symptomsCMItems: any[] = [];

    meetingsCMItems: any[] = [];


    // inside Patient class (add these properties)
    isEditMode: boolean = false;

    patient: PatientDto = this.createEmptyPatient();  // Patient data to be displayed and edited, initialized to empty

    meetings: MeetingDto[] = [];

    upcomingMeetings: MeetingDto[] = [];

    pastMeetings: MeetingDto[] = [];

    private _patientBackup: any = null;

    private destroy$ = new Subject<void>();


    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private patientFacade: PatientFacade,
        private meetingFacade: MeetingFacade,
        private route: ActivatedRoute,
        private router: Router
) {}


    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');

        if (!id) {
            console.warn('No patient id found in route.');
            this.router.navigate(['/notfound']);
            return;
        }

        // clear stale patient before loading
        this.patient = this.createEmptyPatient();

        // subscribe to actual HTTP request
        this.patientFacade
            .fetchById(id)
            .pipe(
                takeUntil(this.destroy$), // keep receiving until component destroyed
                tap(x => {
                    this.patient = x;
                })
            )
            .subscribe();

        // load meetings for this patient

        this.meetingFacade.fetchAllMeetings();

        this.meetingFacade.meetingState$
            .pipe(
                takeUntil(this.destroy$),     // keep receiving until component destroyed
                tap(list => {
                    this.meetings = list;
                    this.removeMeetingsOfOtherPatients(id);
                    this.splitMeetings();
                })
            )
            .subscribe();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }


    deleteSymptom(symptom: Customer | null) {
        //remove symptom logic here
    }

    editMeeting(customer: Customer | null) {
        //edit meeting logic here
    }

    deleteMeeting(customer: Customer | null) {
        //delete meeting logic here
    }

    enterEdit() {
        // create a shallow clone backup so cancel can restore previous state
        this._patientBackup = { ...this.patient };
        this.isEditMode = true;
    }

    cancelEdit() {
        if (this._patientBackup) {
            this.patient = { ...this._patientBackup };
            this._patientBackup = null;
        }
        this.isEditMode = false;
    }

    save() {
        // TODO: call your API to persist patient changes
        // For now, we mock save with a message and toggle mode off
        this.isEditMode = false;
        this._patientBackup = null;

        // show a toast (you already have MessageService provider)
        // this.messageService.add({
        //     severity: 'success',
        //     summary: 'Saved',
        //     detail: 'Patient data saved.'
        // });

        // If you have a real backend: call service then handle response
        // this.patientService.updatePatient(this.patient).then(...).catch(...)
    }

    removeMeetingsOfOtherPatients(patientId: string) {
        this.meetings = this.meetings.filter(m => m.patient.id === patientId);
    }

    // method to split and sort meetings into upcoming and past based on current date
    private splitMeetings() {
        const now = new Date();

        this.upcomingMeetings = this.meetings
            .filter(m => new Date(m.date + 'T' + m.startTime) >= now)
            .sort((a, b) => new Date(a.date + 'T' + a.startTime).getTime() - new Date(b.date + 'T' + b.startTime).getTime());

        this.pastMeetings = this.meetings
            .filter(m => new Date(m.date + 'T' + m.startTime) < now)
            .sort((a, b) => new Date(b.date + 'T' + b.startTime).getTime() - new Date(a.date + 'T' + a.startTime).getTime());
    }

    getNextMeetingDate(id: string){
        // find the next meeting for a patient
        const nextMeeting = this.upcomingMeetings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
        return nextMeeting ? nextMeeting.date : null;
    }

    getPreviousMeetingDate(id: string){
        // find the previous meeting for a patient
        const previousMeeting = this.pastMeetings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        return previousMeeting ? previousMeeting.date : null;
    }

    createEmptyPatient(): PatientDto {
        return {
            id: '-EMPTY-',
            name: '-EMPTY-',
            surname: '-EMPTY-',
            birthDate: '-EMPTY-',
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
