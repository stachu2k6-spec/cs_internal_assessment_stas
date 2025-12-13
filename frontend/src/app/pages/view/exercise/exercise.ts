import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { Splitter } from 'primeng/splitter';
import { Table, TableModule } from 'primeng/table';
import { Textarea } from 'primeng/textarea';
import { Customer, CustomerService, Representative } from '@/pages/service/customer.service';
import { Product, ProductService } from '@/pages/service/product.service';
import { ObjectUtils } from 'primeng/utils';
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

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-exercise',
    imports: [Button, InputText, Splitter, TableModule, Textarea, NgIf, ReactiveFormsModule, FormsModule, RouterLink, Toast, Dialog],
    templateUrl: './exercise.html',
    styleUrl: './exercise.scss',
    providers: [ConfirmationService, MessageService, CustomerService, ProductService]
})
export class Exercise implements OnInit, OnDestroy {
    customers2: Customer[] = [];

    isEditMode: boolean = false;

    isNewExerciseMode: boolean = false;

    displayConfirmDialog: boolean = false;

    // local model for editing
    exercise: ExerciseDto = this.createEmptyExercise();

    private _exerciseBackup: any = null;

    private destroy$ = new Subject<void>();

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private exerciseFacade: ExerciseFacade,
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
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    enterEdit() {
        // create a shallow clone backup so cancel can restore previous state
        this._exerciseBackup = { ...this.exercise };
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
                        this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Exercise saved.' });
                        //this.router.navigate(['/view/exercise', created.id]);
                    },
                    error: (err) => {
                        console.error('Failed to save exercise', err);
                        const detail = err?.message ?? 'Unknown error';
                        this.messageService.add({ severity: 'error', summary: 'Save failed', detail });
                    }
                });
            return;
        }

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

    openConfirmDialog() {
        this.displayConfirmDialog = true;
    }

    closeConfirmDialog() {
        this.displayConfirmDialog = false;
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

    private createEmptyExercise(): ExerciseDto {
        return {
            id: '',
            name: '',
            notes: ''
        } as ExerciseDto;
    }
}
