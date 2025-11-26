import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { take, tap } from 'rxjs';

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
export class Patient implements OnInit {

    selectedSymptom: Customer | null = null;

    selectedMeeting: Customer | null = null;

    symptomsCMItems: any[] = [];

    meetingsCMItems: any[] = [];


    // inside Patient class (add these properties)
    isEditMode: boolean = false;

    patient: PatientDto = this.createEmptyPatient();  // Patient data to be displayed and edited, initialized to empty

    meetings: any[] = [];

    private _patientBackup: any = null;


    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private patientFacade: PatientFacade,
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
            .pipe(take(1))
            .subscribe({
                next: (dto: PatientDto) => {
                    this.patient = dto ? dto : this.createEmptyPatient();
                },
                error: (err: any) => {
                    console.error('Failed loading patient', err);
                    this.router.navigate(['/notfound']);
                }
            });
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
