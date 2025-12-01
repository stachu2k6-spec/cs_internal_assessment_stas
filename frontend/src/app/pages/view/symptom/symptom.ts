import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { take } from 'rxjs';
import { MeetingDto } from '@/pages/service/meeting/meeting.model';
import { SymptomDto } from '@/pages/service/symptom/symptom.model';
import { Toast } from 'primeng/toast';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-symptom',
    imports: [Button, InputText, Splitter, TableModule, Textarea, NgIf, ReactiveFormsModule, FormsModule, RouterLink, Toast],
    templateUrl: './symptom.html',
    styleUrl: './symptom.scss',
    providers: [ConfirmationService, MessageService, CustomerService, ProductService]
})
export class Symptom implements OnInit {
    tempData: any[] = [];

    isEditMode: boolean = false;

    // local model for editing
    symptom: SymptomDto = this.createEmptySymptom();

    private _symptomBackup: any = null;

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

        // clear stale symptom before loading
        this.symptom = this.createEmptySymptom();

        // subscribe to actual HTTP request
        this.symptomFacade
            .fetchById(id)
            .pipe(take(1))
            .subscribe({
                next: (dto: SymptomDto) => {
                    this.symptom = dto ? dto : this.createEmptySymptom();
                },
                error: (err: any) => {
                    console.error('Failed loading symptom', err);
                    this.messageService.add({ severity: 'error', summary: 'Load failed', detail: 'Symptom could not be loaded.' });
                    this.router.navigate(['/notfound']);
                }
            });
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
        this.isEditMode = false;
    }

    save() {
        // basic validation
        if (!this.symptom) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No symptom loaded.' });
            return;
        }

        if (!this.symptom.name || !this.symptom.name.trim()) {
            this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Symptom name is required.' });
            return;
        }

        // optimistic UI: exit edit mode while saving
        const prevEditState = this.isEditMode;
        this.isEditMode = false;

        this.symptomFacade.updateSymptom(this.symptom.id, this.symptom).pipe(take(1)).subscribe({
            next: (saved: SymptomDto) => {
                this.symptom = saved ? saved : this.symptom;
                this._symptomBackup = null;
                this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Symptom saved successfully.' });
            },
            error: (err: any) => {
                console.error('Failed to save symptom', err);
                this.isEditMode = prevEditState;
                this.messageService.add({ severity: 'error', summary: 'Save failed', detail: err?.message ?? 'Unknown error' });
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
