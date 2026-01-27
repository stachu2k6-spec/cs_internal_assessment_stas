import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },


            {
                label: 'Menu',
                items: [
                    { label: 'Patients', icon: 'pi pi-fw pi-user', routerLink: ['/menu/patients'] },
                    { label: 'Meetings', icon: 'pi pi-fw pi-calendar', routerLink: ['/menu/meetings'] },
                    { label: 'Symptoms', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/menu/symptoms'] },
                    { label: 'Exercises', icon: 'pi pi-fw pi-comment', routerLink: ['/menu/exercises'] },
                ]
            }
        ];
    }
}
