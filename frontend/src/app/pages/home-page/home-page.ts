import { Component, ViewChild, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Panel } from 'primeng/panel';
import { CalendarResizeService } from '../../layout/service/calendar-resize.service';

@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [CommonModule, FullCalendarModule, Panel],
    templateUrl: './home-page.html',
    styleUrl: './home-page.scss'
})
export class HomePage implements AfterViewInit, OnDestroy {
    @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
    @ViewChild('calendar', { read: ElementRef }) calendarEl!: ElementRef;

    // Keeps the calendar mounted for API-driven resizing; template uses this in *ngIf
    showCalendar = true;

    private layoutListener: any;
    private resizeObserver?: ResizeObserver;
    private sidebarTransitionListener?: (ev: TransitionEvent) => void;

    constructor(private calendarResizeService: CalendarResizeService) {}

    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        selectable: true,
        events: [
            { title: 'Today', start: new Date().toISOString().slice(0, 10) },
            { title: 'Demo Event', start: '2025-11-07', end: '2025-11-10' }
        ],
        dateClick: this.handleDateClick.bind(this)
    };

    // Attach ResizeObserver to the current calendar host element (disconnects previous observer)
    private attachResizeObserver() {
        try {
            if (this.resizeObserver) {
                try {
                    this.resizeObserver.disconnect();
                } catch (e) {}
                this.resizeObserver = undefined;
            }

            if (typeof ResizeObserver === 'undefined') return;
            const target = this.calendarEl?.nativeElement || null;
            if (!target) return;

            this.resizeObserver = new ResizeObserver(() => {
                try {
                    try { console.log('[home] ResizeObserver fired', new Date().toISOString()); } catch (e) {}
                    this.calendarComponent?.getApi()?.updateSize();
                } catch (e) {}
            });

            this.resizeObserver.observe(target);
        } catch (e) {
            // ignore
        }
    }

    ngAfterViewInit() {
        // Register API with the CalendarResizeService and listen for the layoutMenuToggled event
        try {
            const api = this.calendarComponent?.getApi();
            if (api) this.calendarResizeService.register(api);
            try { console.log('[home] registered calendar api with service:', !!api, new Date().toISOString()); } catch (e) {}
        } catch (e) {}

        this.layoutListener = () => {
            try {
                try { console.log('[home] layoutMenuToggled received - calling service', new Date().toISOString()); } catch (e) {}
                this.calendarResizeService.triggerResize();
            } catch (e) {}
        };

        window.addEventListener('layoutMenuToggled', this.layoutListener);

        // initial attach observer after view init
        setTimeout(() => this.attachResizeObserver(), 0);
    }

    ngOnDestroy() {
        try { window.removeEventListener('layoutMenuToggled', this.layoutListener); } catch (e) {}
        this.layoutListener = null;

        // unregister API and cleanup observers/listeners
        try { this.calendarResizeService.unregister(); } catch (e) {}

        if (this.resizeObserver) {
            try { this.resizeObserver.disconnect(); } catch (e) {}
            this.resizeObserver = undefined;
        }
    }

    handleDateClick(arg: any) {
        alert('Date clicked: ' + arg.dateStr);
    }
}

// add debug to the ResizeObserver attachment
// (we already log when updateSize is called in the service, but also log when observer fires)
