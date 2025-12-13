import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { Image } from 'primeng/image';
import { InputText } from 'primeng/inputtext';
import { Rating } from 'primeng/rating';
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
import { MeetingFacade } from '@/pages/service/meeting/meeting.facade';
import { SymptomFacade } from '@/pages/service/symptom/symptom.facade';
import { Subject, take, takeUntil, tap } from 'rxjs';
import { MeetingDto } from '@/pages/service/meeting/meeting.model';
import { SymptomDto } from '@/pages/service/symptom/symptom.model';
import { Toast } from 'primeng/toast';
import { PatientDto } from '@/pages/service/patient/patient.model';
import { Dialog } from 'primeng/dialog';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-symptom',
    imports: [Button, InputText, Splitter, TableModule, Textarea, NgIf, ReactiveFormsModule, FormsModule, RouterLink, Toast, Dialog],
    templateUrl: './symptom.html',
    styleUrl: './symptom.scss',
    providers: [ConfirmationService, MessageService, CustomerService, ProductService]
})
export class Symptom implements OnInit, OnDestroy {
    tempData: any[] = [];

    isEditMode: boolean = false;

    isNewSymptomMode: boolean = false;

    displayConfirmDialog: boolean = false;

    // local model for editing
    symptom: SymptomDto = this.createEmptySymptom();

    private _symptomBackup: any = null;

    private destroy$ = new Subject<void>();

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private symptomFacade: SymptomFacade,
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
                        //this.router.navigate(['/view/symptom', created.id]);
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

    closeConfirmDialog() {
        this.displayConfirmDialog = false;
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
                    this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Symptom profile deleted.' });
                    this.router.navigate(['/menu', 'symptoms']); // navigate back to symptom list
                },
                error: (err) => {
                    console.error('Failed to delete symptom', err);
                    this.messageService.add({ severity: 'error', summary: 'Delete failed', detail: err?.message ?? 'Unknown error' });
                }
            });
    }

    private createEmptySymptom(): SymptomDto {
        return {
            id: '',
            name: '',
            notes: ''
        } as SymptomDto;
    }
}
