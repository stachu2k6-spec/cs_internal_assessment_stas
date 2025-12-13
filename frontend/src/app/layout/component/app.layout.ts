import { Component, Renderer2, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AppTopbar } from './app.topbar';
import { AppSidebar } from './app.sidebar';
import { AppFooter } from './app.footer';
import { LayoutService } from '../service/layout.service';
import { CalendarResizeService } from '../service/calendar-resize.service';
import { Toast } from 'primeng/toast';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, AppTopbar, AppSidebar, RouterModule, AppFooter, Toast],
    template: `<div class="layout-wrapper" [ngClass]="containerClass">
        <app-topbar></app-topbar>
        <app-sidebar></app-sidebar>
        <div class="layout-main-container">
            <div class="layout-main">
                <router-outlet></router-outlet>
            </div>
            <app-footer></app-footer>
        </div>
        <div class="layout-mask animate-fadein"></div>
    </div> `
})
export class AppLayout implements AfterViewInit, OnDestroy {
    overlayMenuOpenSubscription: Subscription;

    menuOutsideClickListener: any;

    @ViewChild(AppSidebar) appSidebar!: AppSidebar;

    @ViewChild(AppTopbar) appTopBar!: AppTopbar;

    // MutationObserver to detect class changes on layout wrapper
    private layoutMutationObserver?: MutationObserver;
    private sidebarTransitionListener?: (ev: TransitionEvent) => void;
    private transitionFallbackTimer?: any;

    constructor(
        public layoutService: LayoutService,
        public renderer: Renderer2,
        public router: Router,
        private calendarResizeService: CalendarResizeService
    ) {
        this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
            if (!this.menuOutsideClickListener) {
                this.menuOutsideClickListener = this.renderer.listen('document', 'click', (event) => {
                    if (this.isOutsideClicked(event)) {
                        this.hideMenu();
                    }
                });
            }

            if (this.layoutService.layoutState().staticMenuMobileActive) {
                this.blockBodyScroll();
            }

            // give layout transition a moment, then trigger a resize so components like FullCalendar adjust
            setTimeout(() => {
                try {
                    // trigger the calendar resize via the shared service
                    this.calendarResizeService.triggerResize();
                } catch (e) {
                    // ignore in non-browser environments
                }
            }, 800);
        });

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
            this.hideMenu();
        });
    }

    isOutsideClicked(event: MouseEvent) {
        const sidebarEl = document.querySelector('.layout-sidebar');
        const topbarEl = document.querySelector('.layout-menu-button');
        const eventTarget = event.target as Node;

        return !(sidebarEl?.isSameNode(eventTarget) || sidebarEl?.contains(eventTarget) || topbarEl?.isSameNode(eventTarget) || topbarEl?.contains(eventTarget));
    }

    hideMenu() {
        this.layoutService.layoutState.update((prev) => ({ ...prev, overlayMenuActive: false, staticMenuMobileActive: false, menuHoverActive: false }));
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }
        this.unblockBodyScroll();

        // trigger resize after menu closes so components like FullCalendar recalculate layout
        setTimeout(() => {
            try {
                // trigger calendar resize via service as well as a window resize fallback
                try {
                    this.calendarResizeService.triggerResize();
                } catch (e) {}
                try {
                    window.dispatchEvent(new Event('resize'));
                } catch (e) {}
            } catch (e) {
                // ignore in non-browser environments
            }
        }, 300);
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\b)' + 'blocked-scroll'.split(' ').join('|') + '(\b|$)', 'gi'), ' ');
        }
    }

    get containerClass() {
        return {
            'layout-overlay': this.layoutService.layoutConfig().menuMode === 'overlay',
            'layout-static': this.layoutService.layoutConfig().menuMode === 'static',
            'layout-static-inactive': this.layoutService.layoutState().staticMenuDesktopInactive && this.layoutService.layoutConfig().menuMode === 'static',
            'layout-overlay-active': this.layoutService.layoutState().overlayMenuActive,
            'layout-mobile-active': this.layoutService.layoutState().staticMenuMobileActive
        };
    }

    ngAfterViewInit() {
        // Attach a transitionend listener directly to the sidebar element so we can react
        // exactly when its CSS transition finishes. If the sidebar isn't present yet, wait
        // for it to appear using a MutationObserver.
        try {
            const attachToSidebar = (sidebar: Element) => {
                if (!sidebar) return;

                // remove previous listener if any
                if (this.sidebarTransitionListener) {
                    try {
                        sidebar.removeEventListener('transitionend', this.sidebarTransitionListener as any);
                    } catch (e) {}
                }

                this.sidebarTransitionListener = (ev: TransitionEvent) => {
                    try {
                        const prop = (ev.propertyName || '').toLowerCase();
                        // Only react to size/position-related transitions
                        if (prop && !/transform|left|right|width|margin|padding/.test(prop)) return;

                        // Call the calendar resize API directly (no timeouts)
                        try {
                            console.log('[layout] sidebar transitionend', prop, new Date().toISOString());
                            this.calendarResizeService.triggerResize();
                        } catch (e) {
                            console.error('[layout] triggerResize error', e);
                        }
                    } catch (e) {
                        // ignore
                    }
                };

                sidebar.addEventListener('transitionend', this.sidebarTransitionListener as any);
            };

            const sidebar = document.querySelector('.layout-sidebar');
            if (sidebar) {
                attachToSidebar(sidebar);
            } else if (typeof MutationObserver !== 'undefined') {
                // wait for the sidebar element to be added to the DOM
                this.layoutMutationObserver = new MutationObserver((mutations, observer) => {
                    const found = document.querySelector('.layout-sidebar');
                    if (found) {
                        attachToSidebar(found);
                        try {
                            observer.disconnect();
                        } catch (e) {}
                        this.layoutMutationObserver = undefined;
                    }
                });

                this.layoutMutationObserver.observe(document.body, { childList: true, subtree: true });
            }
        } catch (e) {
            // ignore in non-browser env
        }
    }

    ngOnDestroy() {
        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe();
        }

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }

        if (this.layoutMutationObserver) {
            try {
                this.layoutMutationObserver.disconnect();
            } catch (e) {}
            this.layoutMutationObserver = undefined;
        }

        if (this.sidebarTransitionListener) {
            const sidebar = document.querySelector('.layout-sidebar');
            if (sidebar) {
                try {
                    sidebar.removeEventListener('transitionend', this.sidebarTransitionListener as any);
                } catch (e) {}
            }
            this.sidebarTransitionListener = undefined;
        }

        if (this.transitionFallbackTimer) {
            clearTimeout(this.transitionFallbackTimer);
            this.transitionFallbackTimer = undefined;
        }
    }
}
