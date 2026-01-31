import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { Image } from 'primeng/image';
import { InputText } from 'primeng/inputtext';
import { Rating } from 'primeng/rating';
import { Splitter } from 'primeng/splitter';
import { Table, TableModule } from 'primeng/table';
import { Textarea } from 'primeng/textarea';
import { ObjectUtils } from 'primeng/utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MeetingFacade } from '@/pages/service/meeting/meeting.facade';
import { SymptomFacade } from '@/pages/service/symptom/symptom.facade';
import { Subject, take, takeUntil, tap } from 'rxjs';
import { MeetingDto } from '@/pages/service/meeting/meeting.model';
import { SymptomDto } from '@/pages/service/symptom/symptom.model';
import { Toast } from 'primeng/toast';
import { PatientDto } from '@/pages/service/patient/patient.model';
import { Dialog } from 'primeng/dialog';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { ExerciseSymptomFacade } from '@/pages/service/exercise-symptom/exercise-symptom.facade';
import { ExerciseSymptomDto } from '@/pages/service/exercise-symptom/exercise-symptom.model';
import { ExerciseDto } from '@/pages/service/exercise/exercise.model';
import { Exercise } from '@/pages/view/exercise/exercise';
import { ExerciseFacade } from '@/pages/service/exercise/exercise.facade';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-symptom',
    imports: [Button, InputText, Splitter, TableModule, Textarea, NgIf, ReactiveFormsModule, FormsModule, RouterLink, Toast, Dialog, InputNumber, Select],
    templateUrl: './symptom.html',
    styleUrl: './symptom.scss',
    providers: [ConfirmationService, MessageService]
})
export class Symptom implements OnInit, OnDestroy {
    tempData: any[] = [];

    isEditMode: boolean = false;

    isNewSymptomMode: boolean = false;

    displayConfirmDialog: boolean = false;

    displayExerciseSymptomConfirmDialog: boolean = false;

    displayAddExerciseSymptomDialog: boolean = false;

    exerciseSymptoms: ExerciseSymptomDto[] = [];

    exercises: ExerciseDto[] = [];

    exerciseNames: string[] = [];

    effectivenesses: number[] = [1, 2, 3];

    exerciseToAdd: ExerciseDto = this.createEmptyExercise();

    exerciseSymptomToAdd: ExerciseSymptomDto = this.createEmptyExerciseSymptom();

    // local model for editing
    symptom: SymptomDto = this.createEmptySymptom();

    private _symptomBackup: any = null;

    private destroy$ = new Subject<void>();

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private symptomFacade: SymptomFacade,
        private exerciseFacade: ExerciseFacade,
        private exerciseSymptomFacade: ExerciseSymptomFacade,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');

        if (!id) {
            console.warn('No symptom id found in route.');
            this.router.navigate(['/notfound']);
            return;
        }

        if (id === 'newSymptom') {
            // new symptom mode
            this.isEditMode = true;
            this.isNewSymptomMode = true;
            this.symptom = this.createEmptySymptom();
            this.symptom.id = 'newSymptom'; // temporary id to indicate new symptom
            return;
        }

        // clear stale symptom before loading
        this.symptom = this.createEmptySymptom();

        // subscribe to actual HTTP request
        this.symptomFacade
            .fetchById(id)
            .pipe(
                takeUntil(this.destroy$),
                tap((x) => {
                    this.symptom = x;
                })
            )
            .subscribe();

        this.exerciseSymptomFacade.fetchBySymptomId(id);
        this.exerciseSymptomFacade.exerciseSymptomState$
            .pipe(
                takeUntil(this.destroy$),
                tap((list) => {
                    this.exerciseSymptoms = list;
                })
            )
            .subscribe();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    enterEdit() {
        // create a shallow clone backup so cancel can restore previous state
        this._symptomBackup = { ...this.symptom };
        this.isEditMode = true;
    }

    cancelEdit() {
        if (this._symptomBackup) {
            this.symptom = { ...this._symptomBackup };
            this._symptomBackup = null;
        }

        if (this.isNewSymptomMode) {
            this.router.navigate(['/menu', 'symptoms']);
            return;
        }

        this.isEditMode = false;
    }

    saveSymptom() {
        // basic validation
        if (!this.symptom) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No symptom loaded.' });
            return;
        }

        if (!this.symptom.name || !this.symptom.name.trim()) {
            this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Symptom name is required.' });
            return;
        }

        if (this.isNewSymptomMode) {
            // create new symptom
            this.symptom.id = ''; // clear temporary id before sending to server
            this.symptomFacade
                .createSymptom(this.symptom)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (created: SymptomDto) => {
                        // update local model with server response
                        this.symptom = created;
                        this.isNewSymptomMode = false;
                        this.isEditMode = false;
                        this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Symptom profile saved.' });
                        this.router.navigate(['/view/symptom', created.id]);
                    },
                    error: (err) => {
                        console.error('Failed to save symptom', err);
                        const detail = err?.message ?? 'Unknown error';
                        this.messageService.add({ severity: 'error', summary: 'Save failed', detail });
                    }
                });
            return;
        }

        this.symptomFacade
            .updateSymptom(this.symptom.id, this.symptom)
            .pipe(take(1))
            .subscribe({
                next: (saved: SymptomDto) => {
                    this.symptom = saved;
                    this.isEditMode = false;
                    this._symptomBackup = null;
                    this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Symptom saved successfully.' });
                },
                error: (err: any) => {
                    console.error('Failed to save symptom', err);
                    this.messageService.add({ severity: 'error', summary: 'Save failed', detail: err?.message ?? 'Unknown error' });
                }
            });
    }

    openConfirmDialog() {
        this.displayConfirmDialog = true;
    }

    closeDialog(type: string) {
        switch (type) {
            case 'deleteSymptom':
                this.displayConfirmDialog = false;
                break;

            case 'deleteExerciseSymptom':
                this.displayExerciseSymptomConfirmDialog = false;
                break;

            case 'addExerciseSymptom':
                this.displayExerciseSymptomConfirmDialog = false;
                break;

            default:
                break;
        }
    }

    deleteSymptom() {
        if (!this.symptom || !this.symptom.id) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No symptom loaded.' });
            return;
        }

        this.symptomFacade
            .deleteSymptom(this.symptom.id)
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Symptom deleted.' });
                    this.router.navigate(['/menu', 'symptoms']); // navigate back to symptom list
                },
                error: (err) => {
                    console.error('Failed to delete symptom', err);
                    this.messageService.add({ severity: 'error', summary: 'Delete failed', detail: err?.message ?? 'Unknown error' });
                }
            });
    }

    private createEmptyExercise(): ExerciseDto {
        return {
            id: '',
            name: '',
            notes: ''
        } as ExerciseDto;
    }

    private createEmptySymptom(): SymptomDto {
        return {
            id: '',
            name: '',
            notes: ''
        } as SymptomDto;
    }

    private createEmptyExerciseSymptom() {
        return {
            id: '',
            exercise: this.exerciseToAdd,
            symptom: this.symptom,
            effectiveness: 0
        };
    }

    openExerciseSymptomConfirmDialog() {
        this.displayExerciseSymptomConfirmDialog = true;
    }

    deleteExerciseSymptom(exerciseSymptomId: string) {
        this.exerciseSymptomFacade
            .deleteExerciseSymptom(exerciseSymptomId)
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'ExerciseSymptom  deleted.' });
                    this.closeDialog('deleteExerciseSymptom');
                },
                error: (err) => {
                    console.error('Failed to delete exerciseSymptom', err);
                    this.messageService.add({ severity: 'error', summary: 'Delete failed', detail: err?.message ?? 'Unknown error' });
                    this.closeDialog('deleteExerciseSymptom');
                }
            });
    }

    addExerciseSymptom() {
        this.displayAddExerciseSymptomDialog = true;

        this.exerciseSymptomToAdd = this.createEmptyExerciseSymptom();

        // fetch all exercises for selection
        this.exerciseFacade.fetchAllExercises();
        this.exerciseFacade.exerciseState$
            .pipe(
                tap((x) => {
                    this.exercises = x;
                    this.getExerciseNames(x);
                }),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    getExerciseNames(exercises: ExerciseDto[]) {
        this.exerciseNames = exercises.map((e) => e.name).filter((name) => !this.exerciseSymptoms.some((es) => es.exercise.name === name));
    }

    findExerciseByName(name: string): ExerciseDto | undefined {
        return this.exercises.find((e) => e.name === name);
    }

    saveAddedExercise() {
        const createdExerciseSymptom = this.exerciseSymptomToAdd;
        const selectedExercise = this.findExerciseByName(this.exerciseToAdd.name);

        if (selectedExercise) {
            createdExerciseSymptom.exercise = selectedExercise;
        } else {
            console.error('Failed to add exercise');
            this.messageService.add({ severity: 'error', summary: 'Creation failed' });
            return;
        }

        this.exerciseSymptomFacade
            .createExerciseSymptom(createdExerciseSymptom)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (created: ExerciseSymptomDto) => {
                    this.displayAddExerciseSymptomDialog = false;
                    this.messageService.add({ severity: 'success', summary: 'Added', detail: 'Symptom added successfully.' });
                },
                error: (err: any) => {
                    console.error('Failed to add symptom', err);
                    this.messageService.add({ severity: 'error', summary: 'Adding failed', detail: err?.message ?? 'Unknown error' });
                }
            });
    }
}
