import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { Splitter } from 'primeng/splitter';
import { Table, TableModule } from 'primeng/table';
import { Textarea } from 'primeng/textarea';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, take, takeUntil, tap } from 'rxjs';
import { SymptomDto } from '@/pages/service/symptom/symptom.model';
import { SymptomFacade } from '@/pages/service/symptom/symptom.facade';
import { ExerciseDto } from '@/pages/service/exercise/exercise.model';
import { ExerciseFacade } from '@/pages/service/exercise/exercise.facade';
import { Toast } from 'primeng/toast';
import { Dialog } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { ExerciseSymptomDto } from '@/pages/service/exercise-symptom/exercise-symptom.model';
import { ExerciseSymptomFacade } from '@/pages/service/exercise-symptom/exercise-symptom.facade';
import { InputNumber } from 'primeng/inputnumber';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-exercise',
    imports: [Button, InputText, Splitter, TableModule, Textarea, NgIf, ReactiveFormsModule, FormsModule, RouterLink, Toast, Dialog, Select, InputNumber],
    templateUrl: './exercise.html',
    styleUrl: './exercise.scss',
    providers: [ConfirmationService, MessageService ]
})
export class Exercise implements OnInit, OnDestroy {
    isEditMode: boolean = false;

    isNewExerciseMode: boolean = false;

    displayExerciseConfirmDialog: boolean = false;

    displayExerciseSymptomConfirmDialog: boolean = false;

    displayAddExerciseSymptomDialog: boolean = false;

    exercise: ExerciseDto = this.createEmptyExercise();

    exerciseSymptoms: ExerciseSymptomDto[] = [];

    symptoms: SymptomDto[] = [];

    symptomNames: string[] = [];

    effectivenesses: number[] = [1, 2, 3];

    symptomToAdd: SymptomDto = this.createEmptySymptom();

    exerciseSymptomToAdd: ExerciseSymptomDto = this.createEmptyExerciseSymptom();

    private _exerciseBackup: any = null;

    private _exerciseSymptomsBackup: any[] = [];

    private destroy$ = new Subject<void>();

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private exerciseFacade: ExerciseFacade,
        private symptomFacade: SymptomFacade,
        private exerciseSymptomFacade: ExerciseSymptomFacade,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');

        if (!id) {
            console.warn('No exercise id found in route.');
            this.router.navigate(['/notfound']);
            return;
        }

        if (id === 'newExercise') {
            // new exercise mode
            this.isEditMode = true;
            this.isNewExerciseMode = true;
            this.exercise = this.createEmptyExercise();
            this.exercise.id = 'newExercise'; // temporary id to indicate new exercise
            return;
        }

        // clear stale exercise before loading
        this.exercise = this.createEmptyExercise();

        // subscribe to actual HTTP request
        this.exerciseFacade
            .fetchById(id)
            .pipe(
                takeUntil(this.destroy$),
                tap((x) => {
                    this.exercise = x;
                })
            )
            .subscribe();

        this.exerciseSymptomFacade.fetchByExerciseId(id);
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
        this._exerciseBackup = { ...this.exercise };
        this._exerciseSymptomsBackup = [...this.exerciseSymptoms];
        this.isEditMode = true;
    }

    cancelEdit() {
        if (this._exerciseBackup) {
            this.exercise = { ...this._exerciseBackup };
            this._exerciseBackup = null;
        }

        if (this.isNewExerciseMode) {
            this.router.navigate(['/menu', 'exercises']);
            return;
        }

        this.isEditMode = false;
    }

    saveExercise() {
        // basic validation
        if (!this.exercise) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No exercise loaded.' });
            return;
        }

        if (!this.exercise.name || !this.exercise.name.trim()) {
            this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Exercise name is required.' });
            return;
        }

        if (this.isNewExerciseMode) {
            this.createExercise();
            return;
        }

        this.updateExerciseSymptoms();

        this.updateExercise();
    }

    updateExerciseSymptoms() {
        this.exerciseSymptomFacade.updateExerciseSymptoms(this.exerciseSymptoms);
        this.exerciseSymptomFacade.exerciseSymptomState$
            .pipe(
                tap((updated) => ((this.exerciseSymptoms = updated), (this._exerciseBackup = null))),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    createExercise(): void {
        // create new exercise
        this.exercise.id = ''; // clear temporary id before sending to server
        this.exerciseFacade
            .createExercise(this.exercise)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (created: ExerciseDto) => {
                    // update local model with server response (in case server modifies the entity)
                    this.exercise = created;
                    this.isEditMode = false;
                    this.isNewExerciseMode = false;
                    this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Exercise saved.' });
                    this.router.navigate(['/view/exercise', created.id]);
                },
                error: (err) => {
                    console.error('Failed to save exercise', err);
                    const detail = err?.message ?? 'Unknown error';
                    this.messageService.add({ severity: 'error', summary: 'Save failed', detail });
                }
            });
    }

    updateExercise(): void {
        this.exerciseFacade
            .updateExercise(this.exercise.id, this.exercise)
            .pipe(take(1))
            .subscribe({
                next: (saved: ExerciseDto) => {
                    this.exercise = saved;
                    this.isEditMode = false;
                    this._exerciseBackup = null;
                    this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Exercise saved successfully.' });
                },
                error: (err: any) => {
                    console.error('Failed to save exercise', err);
                    this.messageService.add({ severity: 'error', summary: 'Save failed', detail: err?.message ?? 'Unknown error' });
                }
            });
    }

    deleteExercise() {
        if (!this.exercise || !this.exercise.id) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No exercise loaded.' });
            return;
        }

        this.exerciseFacade
            .deleteExercise(this.exercise.id)
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Exercise profile deleted.' });
                    this.router.navigate(['/menu', 'exercises']); // navigate back to exercise list
                },
                error: (err) => {
                    console.error('Failed to delete exercise', err);
                    this.messageService.add({ severity: 'error', summary: 'Delete failed', detail: err?.message ?? 'Unknown error' });
                }
            });
    }

    saveAddedSymptom() {
        const createdExerciseSymptom = this.exerciseSymptomToAdd;
        const selectedSymptom = this.findSymptomByName(this.symptomToAdd.name);

        if (selectedSymptom) {
            createdExerciseSymptom.symptom = selectedSymptom;
        } else {
            console.error('Failed to add symptom');
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

    addExerciseSymptom() {
        this.displayAddExerciseSymptomDialog = true;

        this.exerciseSymptomToAdd = this.createEmptyExerciseSymptom();

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

    deleteExerciseSymptom(exerciseSymptomId: string) {
        this.exerciseSymptomFacade
            .deleteExerciseSymptom(exerciseSymptomId)
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'ExerciseSymptom deleted.' });
                    this.closeDialog('deleteExerciseSymptom');
                },
                error: (err) => {
                    console.error('Failed to delete exerciseSymptom', err);
                    this.messageService.add({ severity: 'error', summary: 'Delete failed', detail: err?.message ?? 'Unknown error' });
                    this.closeDialog('deleteExerciseSymptom');
                }
            });
    }

    openExerciseConfirmDialog() {
        this.displayExerciseConfirmDialog = true;
    }

    openExerciseSymptomConfirmDialog() {
        this.displayExerciseSymptomConfirmDialog = true;
    }

    closeDialog(type: string) {
        switch (type) {
            case 'deleteExercise':
                this.displayExerciseConfirmDialog = false;
                break;

            case 'deleteExerciseSymptom':
                this.displayExerciseSymptomConfirmDialog = false;
                break;

            case 'addExerciseSymptom':
                this.displayAddExerciseSymptomDialog = false;
                break;

            default:
                break;
        }
    }

    getSymptomNames(symptoms: SymptomDto[]) {
        this.symptomNames = symptoms.map((s) => s.name).filter((name) => !this.exerciseSymptoms.some((es) => es.symptom.name === name));
    }

    findSymptomByName(name: string): SymptomDto | undefined {
        return this.symptoms.find((s) => s.name === name);
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
            exercise: this.exercise,
            symptom: this.symptomToAdd,
            effectiveness: 0
        };
    }
}
