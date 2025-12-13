import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CalendarResizeService {
    private calendarApi: any = null;

    // Register the FullCalendar API instance (from HomePage)
    register(api: any) {
        this.calendarApi = api;
        try {
            console.log('[calendar] CalendarResizeService.register - api set:', !!api, new Date().toISOString());
        } catch (e) {}
    }

    unregister() {
        this.calendarApi = null;
        try { console.log('[calendar] CalendarResizeService.unregister - api cleared', new Date().toISOString()); } catch (e) {}
    }

    // Trigger a robust resize: render + updateSize, with RAF and short retries
    triggerResize() {
        try {
            console.log('[calendar] triggerResize called - api registered?', !!this.calendarApi, new Date().toISOString());
            if (!this.calendarApi) {
                // fallback: dispatch a window resize so other libs still react
                try { window.dispatchEvent(new Event('resize')); } catch (e) {}
                return;
            }

            const call = () => {
                try {
                    if (typeof this.calendarApi.render === 'function') {
                        try { this.calendarApi.render(); console.log('[calendar] API.render() called'); } catch (e) { console.error('[calendar] API.render() error', e); }
                    }
                } catch (e) { console.error('[calendar] render check error', e); }

                try {
                    if (typeof this.calendarApi.updateSize === 'function') {
                        try { this.calendarApi.updateSize(); console.log('[calendar] API.updateSize() called'); } catch (e) { console.error('[calendar] API.updateSize() error', e); }
                    }
                } catch (e) { console.error('[calendar] updateSize check error', e); }
            };

            // immediate attempt
            call();

            // RAF-based
            if (typeof requestAnimationFrame !== 'undefined') {
                requestAnimationFrame(() => {
                    try { call(); } catch (e) { console.error('[calendar] RAF call error', e); }
                });
            }

            // short retries
            setTimeout(() => { try { call(); } catch (e) { console.error('[calendar] retry150 error', e); } }, 150);
            setTimeout(() => { try { call(); } catch (e) { console.error('[calendar] retry500 error', e); } }, 500);
        } catch (e) {
            // swallow errors
            console.error('[calendar] triggerResize fatal error', e);
        }
    }
}
