import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
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
import { Customer } from '../../service/customer.service';
import { Splitter } from 'primeng/splitter';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { Textarea } from 'primeng/textarea';
import { DatePicker } from 'primeng/datepicker';
import { Image } from 'primeng/image';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContextMenu } from 'primeng/contextmenu';
import { PatientDto } from '@/pages/service/patient/patient.model';
import { PatientFacade } from '@/pages/service/patient/patient.facade';
import { pipe, Subject, take, takeUntil, tap } from 'rxjs';
import { MeetingDto } from '@/pages/service/meeting/meeting.model';
import { MeetingFacade } from '@/pages/service/meeting/meeting.facade';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { Dialog } from 'primeng/dialog';
import { SymptomDto } from '@/pages/service/symptom/symptom.model';
import { PatientSymptomDto } from '@/pages/service/patient-symptom/patient-symptom.model';
import { PatientSymptomFacade } from '@/pages/service/patient-symptom/patient-symptom.facade';
import { SymptomFacade } from '@/pages/service/symptom/symptom.facade';
import { InputNumber } from 'primeng/inputnumber';

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
        ContextMenu,
        DatePicker,
        Dialog,
        InputNumber
    ],
    templateUrl: './patient.html',
    styleUrl: './patient.scss',
    providers: [MessageService, ConfirmationService]
})
export class Patient implements OnInit, OnDestroy {


    selectedSymptom: Customer | null = null;

    selectedMeeting: Customer | null = null;

    symptomsCMItems: any[] = [];

    meetingsCMItems: any[] = [];


    isEditMode: boolean = false;

    isNewPatientMode: boolean = false;

    displayPatientConfirmDialog: boolean = false;

    displayPatientSymptomConfirmDialog: boolean = false;

    displayAddPatientSymptomDialog: boolean = false;



    patient: PatientDto = this.createEmptyPatient(); // Patient data to be displayed and edited, initialized to empty



    patientSymptoms: PatientSymptomDto[] = [];

    symptoms: SymptomDto[] = [];

    symptomNames: string[] = [];

    severities: number[] = [1, 2, 3];

    symptomToAdd: SymptomDto = this.createEmptySymptom();

    patientSymptomToAdd : PatientSymptomDto = this.createEmptyPatientSymptom();


    meetings: MeetingDto[] = [];

    upcomingMeetings: MeetingDto[] = [];

    pastMeetings: MeetingDto[] = [];


    private _patientBackup: any = null;

    private _patientSymptomsBackup: any[] = [];


    private destroy$ = new Subject<void>();


    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private patientFacade: PatientFacade,
        private meetingFacade: MeetingFacade,
        private symptomFacade: SymptomFacade,
        private patientSymptomFacade: PatientSymptomFacade,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');

        if (!id) {
            console.warn('No patient id found in route.');
            this.router.navigate(['/notfound']);
            return;
        }

        if (id === 'newPatient') {
            // new patient mode
            this.isEditMode = true;
            this.isNewPatientMode = true;
            this.patient = this.createEmptyPatient();
            this.patient.id = 'newPatient'; // temporary id to indicate new patient
            return;
        }

        // clear stale patient before loading
        this.patient = this.createEmptyPatient();

        // subscribe to actual HTTP request
        this.patientFacade
            .fetchById(id)
            .pipe(
                takeUntil(this.destroy$), // keep receiving until component destroyed
                tap((x) => {
                    x.birthDate = this.toLocalDate(x.birthDate);
                    this.patient = x;
                })
            )
            .subscribe();

        // load meetings for this patient
        this.meetingFacade.fetchByPatientId(id);
        this.meetingFacade.meetingState$
            .pipe(
                takeUntil(this.destroy$), // keep receiving until component destroyed
                tap((list) => {
                    this.meetings = list;
                    this.splitMeetings();
                })
            )
            .subscribe();

        this.patientSymptomFacade.fetchByPatientId(id);
        this.patientSymptomFacade.patientSymptomState$
            .pipe(
                takeUntil(this.destroy$),
                tap((list) => {
                    this.patientSymptoms = list;
                })
            )
            .subscribe();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
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
        this._patientSymptomsBackup = [ ...this.patientSymptoms ];
        this.isEditMode = true;
    }

    cancelEdit() {
        if (this._patientBackup) {
            this.patient = { ...this._patientBackup };
            this._patientBackup = null;
        }

        if (this.isNewPatientMode) {
            this.router.navigate(['/menu', 'patients']); // navigate back to patient list
            return;
        }

        this.isEditMode = false;
    }

    savePatient(): void {
        // basic client-side validation
        if (!this.patient) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No patient loaded.' });
            return;
        }

        if (!this.patient.name?.trim() || !this.patient.surname?.trim()) {
            this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Name and surname are required.' });
            return;
        }

        if (this.isNewPatientMode) {
            this.createPatient();
            return;
        }

        this.updatePatientSymptoms();

        this.updatePatient();
    }

    updatePatientSymptoms(): void {
        this.patientSymptomFacade.updatePatientSymptoms(this.patientSymptoms);
        this.patientSymptomFacade.patientSymptomState$
            .pipe(
                tap(updated => (
                    this.patientSymptoms = updated,
                        this._patientBackup = null
                )),
                takeUntil(this.destroy$)
            )
            .subscribe()
    }

    createPatient(): void {
        // create new patient
        this.patient.id = ''; // clear temporary id before sending to server
        this.patientFacade
            .createPatient(this.patient)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (created: PatientDto) => {
                    // update local model with server response
                    created.birthDate = this.toLocalDate(this.patient.birthDate);
                    this.patient = created;
                    this.isNewPatientMode = false;
                    this.isEditMode = false;
                    this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Patient profile saved.' });
                    this.router.navigate(['/view/patient', created.id]); // navigate to newly created patient's page
                },
                error: (err) => {
                    console.error('Failed to save patient', err);
                    const detail = err?.message ?? 'Unknown error';
                    this.messageService.add({ severity: 'error', summary: 'Save failed', detail });
                }
            });
    }

    updatePatient(): void {
        this.patientFacade
            .updatePatient(this.patient.id, this.patient)
            .pipe(take(1))
            .subscribe({
                next: (saved: PatientDto) => {
                    // update local model with server response (in case server modifies the entity)
                    saved.birthDate = this.toLocalDate(this.patient.birthDate);
                    this.patient = saved;
                    this.isEditMode = false;
                    this._patientBackup = null;
                    this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Patient profile saved.' });
                },
                error: (err) => {
                    console.error('Failed to save patient', err);
                    this.messageService.add({ severity: 'error', summary: 'Save failed', detail: err?.message ?? 'Unknown error' });
                }
            });
    }

    deletePatient() {
        if (!this.patient || !this.patient.id) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No patient loaded.' });
            return;
        }

        this.patientFacade
            .deletePatient(this.patient.id)
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Patient profile deleted.' });
                    this.router.navigate(['/view', 'patients']); // navigate back to patient list
                },
                error: (err) => {
                    console.error('Failed to delete patient', err);
                    this.messageService.add({ severity: 'error', summary: 'Delete failed', detail: err?.message ?? 'Unknown error' });
                    this.closeDialog('deletePatient')
                }
            });
    }


    saveAddedSymptom() {
        const createdPatientSymptom = this.patientSymptomToAdd;
        const selectedSymptom = this.findSymptomByName(this.symptomToAdd.name);

        if (selectedSymptom) {
            createdPatientSymptom.symptom = selectedSymptom;
        } else {
            console.error('Failed to add symptom');
            this.messageService.add({ severity: 'error', summary: 'Creation failed' });
            return;
        }

        this.patientSymptomFacade
            .createPatientSymptom(createdPatientSymptom)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (created: PatientSymptomDto) => {
                    this.patientSymptomToAdd = created;
                    this.displayAddPatientSymptomDialog = false;
                    this.messageService.add({ severity: 'success', summary: 'Added', detail: 'Symptom added successfully.' });
                },
                error: (err: any) => {
                    console.error('Failed to add symptom', err);
                    this.messageService.add({ severity: 'error', summary: 'Adding failed', detail: err?.message ?? 'Unknown error' });
                }
            });
    }

    addPatientSymptom() {
        this.displayAddPatientSymptomDialog = true;

        this.patientSymptomToAdd = this.createEmptyPatientSymptom();

        // fetch all symptoms for selection
        this.symptomFacade.fetchAllSymptoms();
        this.symptomFacade.symptomState$
            .pipe(
                tap((x) => {
                    this.symptoms = x;
                    this.getSymptomNames(x);
                }),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    deletePatientSymptom(patientSymptomId: string) {
        this.patientSymptomFacade
            .deletePatientSymptom(patientSymptomId)
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'PatientSymptom profile deleted.' });
                    this.closeDialog('deletePatientSymptom')
                },
                error: (err) => {
                    console.error('Failed to delete patientSymptom', err);
                    this.messageService.add({ severity: 'error', summary: 'Delete failed', detail: err?.message ?? 'Unknown error' });
                    this.closeDialog('deletePatientSymptom')
                }
            });
    }


    openPatientConfirmDialog() {
        this.displayPatientConfirmDialog = true;
    }

    openPatientSymptomConfirmDialog() {
        this.displayPatientSymptomConfirmDialog = true;
    }

    closeDialog(type: string) {
        switch (type) {
            case 'deletePatient':
                this.displayPatientConfirmDialog = false;
                break;

            case 'deletePatientSymptom':
                this.displayPatientSymptomConfirmDialog = false;
                break;

            case 'addPatientSymptom':
                this.displayAddPatientSymptomDialog = false;
                break;

            default:
                break;
        }
    }



    // method to split and sort meetings into upcoming and past based on current date
    splitMeetings() {
        const now = new Date();

        this.upcomingMeetings = this.meetings.filter((m) => new Date(m.dateTime) >= now).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

        this.pastMeetings = this.meetings.filter((m) => new Date(m.dateTime) < now).sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
    }

    getNextMeetingDate(id: string) {
        // find the next meeting for a patient
        const nextMeeting = this.upcomingMeetings.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())[0];
        return nextMeeting ? nextMeeting.dateTime : null;
    }

    getPreviousMeetingDate(id: string) {
        // find the previous meeting for a patient
        const previousMeeting = this.pastMeetings.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())[0];
        return previousMeeting ? previousMeeting.dateTime : null;
    }

    toLocalDate(value: string | Date | null): Date {
        if (!value) return new Date();

        // Already a JS Date → return as-is
        if (value instanceof Date) return value;

        // Expecting "yyyy-mm-dd"
        const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (match) {
            const year = +match[1];
            const month = +match[2] - 1; // JS months start at 0
            const day = +match[3];
            return new Date(year, month, day);
        }

        // Fallback: attempt normal parsing (not used for your format, but safe to keep)
        return new Date(value);
    }


    getSymptomNames(symptoms: SymptomDto[]) {
        this.symptomNames = symptoms.map((s) => s.name).filter((name) => !this.patientSymptoms.some((ps) => ps.symptom.name === name));
    }

    findSymptomByName(name: string): SymptomDto | undefined {
        return this.symptoms.find((s) => s.name === name);
    }


    private createEmptyPatient(): PatientDto {
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

    private createEmptySymptom(): SymptomDto {
        return {
            id: '',
            name: '',
            notes: ''
        };
    }

    private createEmptyPatientSymptom(): PatientSymptomDto {
        return {
            id: '',
            patient: this.patient,
            symptom: this.symptomToAdd,
            severity: 0
        };
    }


}
