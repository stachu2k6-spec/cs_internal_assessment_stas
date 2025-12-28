import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { PatientDto } from '@/pages/service/patient/patient.model';
import { ExerciseDto } from '@/pages/service/exercise/exercise.model';
import { PatientFacade } from '@/pages/service/patient/patient.facade';
import { ExerciseFacade } from '@/pages/service/exercise/exercise.facade';
import { MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { Subject, of, pipe, take } from 'rxjs';
import { takeUntil, switchMap, tap, catchError } from 'rxjs/operators';
import { InputNumber } from 'primeng/inputnumber';
import { Dialog } from 'primeng/dialog';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { CountryService } from '@/pages/service/country.service';
import { SymptomDto } from '@/pages/service/symptom/symptom.model';
import { PatientSymptomFacade } from '@/pages/service/patient-symptom/patient-symptom.facade';
import { PatientSymptomDto } from '@/pages/service/patient-symptom/patient-symptom.model';
import { ExerciseSymptomFacade } from '@/pages/service/exercise-symptom/exercise-symptom.facade';
import { ExerciseSymptomDto } from '@/pages/service/exercise-symptom/exercise-symptom.model';

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
        RouterLink,
        DatePickerModule,
        InputNumber,
        Dialog
    ],
    templateUrl: './meeting.html',
    styleUrl: './meeting.scss',
    standalone: true,
    providers: [MessageService, CountryService]
})
export class Meeting implements OnInit, OnDestroy {

    isEditMode: boolean = false;

    isNewMeetingMode: boolean = false;

    displayDeleteMeetingDialog: boolean = false;

    displayAddExerciseDialog: boolean = false;

    displayDeleteExerciseDialog: boolean = false;

    meeting: MeetingDto = this.createEmptyMeeting(); // Meeting data to be displayed and edited, initialized to empty

    patient: PatientDto = this.createEmptyPatient(); // Associated patient data, initialized to empty

    patients: PatientDto[] = [];

    suggestedExercises: ExerciseDto[] = [];

    scores: number[] = [];

    exercises: ExerciseDto[] = [];

    exerciseNames: string[] = [];

    exerciseToAdd: ExerciseDto = this.createEmptyExercise();

    patientsNames: string[] = [];

    patientsSurnames: string[] = [];

    private _meetingBackup: any = null;

    // destroy notifier for takeUntil
    private destroy$ = new Subject<void>();



    constructor(
        private meetingFacade: MeetingFacade,
        private patientFacade: PatientFacade,
        private exerciseFacade: ExerciseFacade,
        private patientSymptomFacade: PatientSymptomFacade,
        private exerciseSymptomFacade: ExerciseSymptomFacade,
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

        if (id === 'newMeeting') {
            // new meeting mode
            this.isEditMode = true;
            this.isNewMeetingMode = true;
            this.meeting = this.createEmptyMeeting();
            this.meeting.id = 'newMeeting'; // assign temporary id
            this.patient = this.createEmptyPatient();

            // fetch all patients for selection
            this.patientFacade.fetchAllPatients();
            this.patientFacade.patientState$
                .pipe(
                    tap((x) => {
                        this.patients = x;
                        this.getNames(x);
                        this.getSurnames(x);
                    }),
                    takeUntil(this.destroy$)
                )
                .subscribe();
            return;
        }

        // clear stale meeting before loading
        this.meeting = this.createEmptyMeeting();

        // fetch meeting, when loaded fetch patient
        this.meetingFacade
            .fetchById(id)
            .pipe(
                takeUntil(this.destroy$),
                tap((x) => {
                    this.meeting = {
                        ...x,
                        dateTime: new Date(x.dateTime)
                    };

                    this.patientFacade
                        .fetchById(this.meeting.patient.id)
                        .pipe(
                            takeUntil(this.destroy$),
                            tap((p) => {
                                this.patient = p;
                                this.generateSuggestedExercises();
                            })
                        )
                        .subscribe();
                })
            )
            .subscribe();
    }

    ngOnDestroy(): void {
        // notify all subscribers to complete and free resources
        this.destroy$.next();
        this.destroy$.complete();
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

        if (this.isNewMeetingMode) {
            this.router.navigate(['/menu', 'meetings']); // navigate back to meeting list
            return;
        }

        this.isEditMode = false;
    }

    /**
     * Save meeting edits. Uses MeetingFacade.updateMeeting(meetingId, meetingDto)
     */
    saveMeeting() {
        if (!this.meeting) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No meeting loaded.' });
            return;
        }

        if (!this.meeting.dateTime) {
            this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Date and start time are required.' });
            return;
        }

        if (this.isNewMeetingMode) {
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
                            created.dateTime = new Date(created.dateTime);
                            this._meetingBackup = null;
                            this.isEditMode = false;
                            this.isNewMeetingMode = false;
                            this.messageService.add({ severity: 'success', summary: 'Created', detail: 'Meeting created successfully.' });
                            this.router.navigate(['/view', 'meeting', created.id]); // navigate to newly created meeting
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

        this.updateMeeting();
        this.generateSuggestedExercises();

    }

    updateMeeting() {
        const previousEditState = this.isEditMode;
        this.isEditMode = false;

        const updatedMeeting = {
            id: this.meeting.id,
            patient: this.meeting.patient,
            dateTime: this.tweakHours(this.meeting.dateTime),
            duration: this.meeting.duration,
            notes: this.meeting.notes,
            rating: this.meeting.rating,
            exercises: this.meeting.exercises
        };
        this.meetingFacade
            .updateMeeting(this.meeting.id, updatedMeeting)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (saved: MeetingDto) => {
                    this.meeting = saved;
                    saved.dateTime = new Date(saved.dateTime);
                    this._meetingBackup = null;
                    this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Meeting saved successfully.' });
                },
                error: (err: any) => {
                    console.error('Failed to save meeting', err);
                    this.isEditMode = previousEditState;
                    this.messageService.add({ severity: 'error', summary: 'Save failed', detail: err?.message ?? 'Unknown error' });
                }
            });
    }

    openDeleteMeetingDialog() {
        this.displayDeleteMeetingDialog = true;
    }

    openAddExerciseDialog() {
        this.displayAddExerciseDialog = true;

        // fetch all exercises for selection
        this.exerciseFacade.fetchAllExercises();
        this.exerciseFacade.exerciseState$
            .pipe(
                tap((x) => {
                    this.exercises = this.filterAvailableExercises(x);
                    this.exerciseNames = this.exercises.map((e) => e.name);
                }),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    openDeleteExerciseDialog(event: Event) {
        event.stopPropagation();
        this.displayDeleteExerciseDialog = true;
    }

    addExercise() {
        this.exerciseToAdd = this.findExerciseByName(this.exerciseToAdd.name) || this.exerciseToAdd;
        this.meeting.exercises = [
            ...this.meeting.exercises,
            this.exerciseToAdd
        ];
        this.exerciseToAdd = this.createEmptyExercise();
        this.displayAddExerciseDialog = false;

        this.updateMeeting();
        this.generateSuggestedExercises()
    }

    protected addSuggestedExercise(exercise: ExerciseDto) {
        this.meeting.exercises = [
            ...this.meeting.exercises,
            exercise
        ];
        this.updateMeeting();
        this.generateSuggestedExercises();
    }

    protected removeExercise(exerciseId: string) {
        this.meeting.exercises = this.meeting.exercises.filter(e => e.id !== exerciseId);
        this.updateMeeting();
        this.generateSuggestedExercises();
    }



    protected closeDialog(type: string) {
        switch (type) {
            case 'deleteMeeting':
                this.displayDeleteMeetingDialog = false;
                break;
            case 'addExercise':
                this.displayAddExerciseDialog = false;
                break;

            case 'deleteExercise':
                this.displayDeleteExerciseDialog = false;
                break;

            default:
                break;
        }
    }

    deleteMeeting() {
        if (!this.meeting || !this.meeting.id) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No meeting loaded.' });
            return;
        }

        this.meetingFacade
            .deleteMeeting(this.meeting.id)
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Meeting profile deleted.' });
                    this.router.navigate(['/menu', 'meetings']); // navigate back to meeting list
                },
                error: (err) => {
                    console.error('Failed to delete meeting', err);
                    this.messageService.add({ severity: 'error', summary: 'Delete failed', detail: err?.message ?? 'Unknown error' });
                }
            });
    }

    getNames(patients: PatientDto[]) {
        this.patientsNames = patients.map((p) => p.name);
    }

    getSurnames(patients: PatientDto[]) {
        this.patientsSurnames = patients.map((p) => p.surname);
    }

    patientsId(name: string, surname: string): string | null {
        return this.patients.find((p) => p.name.toLowerCase() === name.toLowerCase() && p.surname.toLowerCase() === surname.toLowerCase())?.id ?? null;
    }

    onDateTimeChange(newDate: Date) {
        if (!this.meeting.dateTime) {
            this.meeting.dateTime = newDate;
            return;
        }

        const old = this.meeting.dateTime;

        newDate.setHours(
            old.getHours(),
            old.getMinutes(),
            0,
            0
        );

        this.meeting.dateTime = newDate;
    }

    private tweakHours(date: Date): Date {
        const copy = new Date(date);
        copy.setHours(copy.getHours() + 1);
        return copy;
    }

    filterAvailableExercises(allExercises: ExerciseDto[]): ExerciseDto[] {
        const selectedIds = new Set(
            this.meeting.exercises.map(e => e.id)
        );

        return allExercises.filter(e => !selectedIds.has(e.id));
    }

    findExerciseByName(name: string): ExerciseDto | undefined {
        return this.exercises.find((e) => e.name === name);
    }

    generateSuggestedExercises() {
        const suggestedExercises: ExerciseDto[] = [];

        let patientSymptoms: PatientSymptomDto[] = [];
        let relatedExercises: ExerciseSymptomDto[] = [];

        this.patientSymptomFacade.fetchByPatientId(this.patient.id);
        this.patientSymptomFacade.patientSymptomState$
            .pipe(
                takeUntil(this.destroy$),
                tap((list) => {
                    patientSymptoms = list;
                    // after fetching patient symptoms, fetch exercises which address these symptoms
                    this.exerciseSymptomFacade.fetchBySymptomIdList(
                        patientSymptoms.map(ps => ps.symptom.id)
                    );
                    this.exerciseSymptomFacade.exerciseSymptomState$
                        .pipe(
                            takeUntil(this.destroy$),
                            tap((exSymptoms) => {
                                relatedExercises = exSymptoms;
                                this.suggestExercises(patientSymptoms, relatedExercises);
                            })
                        ).subscribe()
                })
            )
            .subscribe();
    }

    suggestExercises(
        patientSymptoms: PatientSymptomDto[],
        relatedExercises: ExerciseSymptomDto[]
    ) {
        // --- 1. Build lookup maps ---

        // symptomId -> severity
        const symptomSeverityMap = new Map<string, number>();
        for (const patientSymptom of patientSymptoms) {
            symptomSeverityMap.set(
                patientSymptom.symptom.id,
                patientSymptom.severity
            );
        }

        // exerciseIds that are already planned (must be excluded)
        const plannedExerciseIds = new Set(
            this.meeting.exercises.map(exercise => exercise.id)
        );

        // exerciseId -> accumulated score
        const exerciseScoreMap = new Map<string, number>();

        // --- 2. Calculate scores ---
        for (const exerciseSymptom of relatedExercises) {
            const exerciseId = exerciseSymptom.exercise.id;

            // Skip exercises already planned
            if (plannedExerciseIds.has(exerciseId)) continue;

            const symptomId = exerciseSymptom.symptom.id;
            const symptomSeverity = symptomSeverityMap.get(symptomId);

            // Skip if symptom severity is undefined (should not happen)
            if (symptomSeverity === undefined) continue;

            const effectiveness = exerciseSymptom.effectiveness;

            let scoreIncrease = 0;

            // +2 for each effectiveness point up to symptom severity
            const matchedPoints = Math.min(effectiveness, symptomSeverity);
            scoreIncrease += matchedPoints * 2;

            // +1 for each effectiveness point exceeding symptom severity
            const excessPoints = Math.max(0, effectiveness - symptomSeverity);
            scoreIncrease += excessPoints;

            // Accumulate score per exercise
            exerciseScoreMap.set(
                exerciseId,
                (exerciseScoreMap.get(exerciseId) ?? 0) + scoreIncrease
            );
        }

        // --- 3. Pick top 5 exercises and save corresponding scores ---
        const topScored = [...exerciseScoreMap.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        this.suggestedExercises = topScored.map(([exerciseId]) =>
            relatedExercises.find(es => es.exercise.id === exerciseId)!.exercise
        );

        this.scores = topScored.map(([, score]) => score);
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


    private createEmptyExercise(): ExerciseDto {
        return {
            id: '',
            name: '',
            notes: ''
        }
    }


}
